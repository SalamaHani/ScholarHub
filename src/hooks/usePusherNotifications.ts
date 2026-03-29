"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getPusherClient, disconnectPusher, PusherConnectionState } from "@/lib/pusher-channels";
import { toast } from "@/hooks/use-toast";
import type { Channel } from "pusher-js";
import type { Notification } from "@/hooks/useNotifications";

interface UsePusherNotificationsReturn {
    pusherStatus: PusherConnectionState | "unavailable";
    isConnected: boolean;
    isPusherConfigured: boolean;
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
// Notification list is stored either as `{ notifications: [...], unreadCount }` or `[...]`

function patchCache(
    old: any,
    fn: (list: Notification[]) => Notification[],
): any {
    if (!old) return old;
    if (Array.isArray(old.notifications)) {
        const next = fn(old.notifications);
        return {
            ...old,
            notifications: next,
            unreadCount: next.filter((n) => !n.isRead).length,
        };
    }
    if (Array.isArray(old)) return fn(old);
    return old;
}

/**
 * Subscribes to `private-user-{userId}` on Pusher Channels.
 *
 * Events handled:
 *  - new-notification      → prepend to cache + show toast
 *  - notification-read     → mark data.id as read in cache
 *  - all-notifications-read → mark every notification as read in cache
 *  - notification-deleted  → remove data.id from cache
 *
 * Falls back to 30-second polling (refetchInterval on useNotifications)
 * when NEXT_PUBLIC_PUSHER_KEY is not set.
 */
export const usePusherNotifications = (
    userId: string | undefined,
): UsePusherNotificationsReturn => {
    const queryClient = useQueryClient();
    const channelRef = useRef<Channel | null>(null);
    const [pusherStatus, setPusherStatus] = useState<PusherConnectionState | "unavailable">(
        "disconnected",
    );

    useEffect(() => {
        if (!userId) return;

        const pusher = getPusherClient();

        // Pusher not configured → fall back to polling silently
        if (!pusher) {
            setPusherStatus("unavailable");
            return;
        }

        // Track connection state
        pusher.connection.bind("state_change", ({ current }: { current: PusherConnectionState }) => {
            setPusherStatus(current);
        });

        pusher.connection.bind("error", () => {
            setPusherStatus("failed");
        });

        // Subscribe to user's private channel
        const channelName = `private-user-${userId}`;
        const channel = pusher.subscribe(channelName);
        channelRef.current = channel;

        // ── 1. New notification ──────────────────────────────────────────────
        channel.bind("new-notification", (data: Notification) => {
            queryClient.setQueryData(["notifications"], (old: any) =>
                patchCache(old, (list) => [data, ...list]),
            );
            toast({
                title: data.title || "New notification",
                description: data.message,
            });
        });

        // ── 2. Single notification marked as read ────────────────────────────
        channel.bind("notification-read", (data: { id: string }) => {
            queryClient.setQueryData(["notifications"], (old: any) =>
                patchCache(old, (list) =>
                    list.map((n) => (n.id === data.id ? { ...n, isRead: true } : n)),
                ),
            );
        });

        // ── 3. All notifications marked as read ──────────────────────────────
        channel.bind("all-notifications-read", () => {
            queryClient.setQueryData(["notifications"], (old: any) =>
                patchCache(old, (list) => list.map((n) => ({ ...n, isRead: true }))),
            );
        });

        // ── 4. Notification deleted ──────────────────────────────────────────
        channel.bind("notification-deleted", (data: { id: string }) => {
            queryClient.setQueryData(["notifications"], (old: any) =>
                patchCache(old, (list) => list.filter((n) => n.id !== data.id)),
            );
        });

        // ── Subscription error ───────────────────────────────────────────────
        channel.bind("pusher:subscription_error", () => {
            setPusherStatus("failed");
        });

        setPusherStatus("connecting");

        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusher.unsubscribe(channelName);
                channelRef.current = null;
            }
        };
    }, [userId, queryClient]);

    // Cleanup on logout
    useEffect(() => {
        return () => {
            if (!userId) {
                disconnectPusher();
            }
        };
    }, [userId]);

    return {
        pusherStatus,
        isConnected: pusherStatus === "connected",
        isPusherConfigured: pusherStatus !== "unavailable",
    };
};
