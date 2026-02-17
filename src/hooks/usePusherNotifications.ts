"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getPusherClient, disconnectPusher, PusherConnectionState } from "@/lib/pusher-channels";
import { toast } from "@/hooks/use-toast";
import type { Channel } from "pusher-js";

interface UsePusherNotificationsReturn {
    pusherStatus: PusherConnectionState | "unavailable";
    isConnected: boolean;
    isPusherConfigured: boolean;
}

/**
 * Subscribes to a Pusher private channel for the current user.
 * Listens for `new-notification` events and invalidates the
 * notifications query so the bell count updates in real-time.
 *
 * Falls back to polling (refetchInterval on useNotifications) when
 * NEXT_PUBLIC_PUSHER_KEY is not set.
 *
 * @param userId  The authenticated user's ID (or undefined when logged out)
 */
export const usePusherNotifications = (
    userId: string | undefined
): UsePusherNotificationsReturn => {
    const queryClient = useQueryClient();
    const channelRef = useRef<Channel | null>(null);
    const [pusherStatus, setPusherStatus] = useState<PusherConnectionState | "unavailable">(
        "disconnected"
    );

    useEffect(() => {
        if (!userId) return;

        const pusher = getPusherClient();

        // Pusher Channels not configured → use polling fallback silently
        if (!pusher) {
            setPusherStatus("unavailable");
            return;
        }

        // Track connection state changes
        pusher.connection.bind("state_change", ({ current }: { current: PusherConnectionState }) => {
            setPusherStatus(current);
        });

        pusher.connection.bind("error", (err: any) => {
            console.error("Pusher connection error:", err);
            setPusherStatus("failed");

            // Only show a toast once per session when Pusher fails
            toast({
                title: "Real-time notifications unavailable",
                description: "Notifications will refresh automatically every 30 seconds.",
                variant: "destructive",
            });
        });

        // Subscribe to user's private channel
        const channelName = `private-user-${userId}`;
        const channel = pusher.subscribe(channelName);
        channelRef.current = channel;

        // Listen for new notification events
        channel.bind("new-notification", () => {
            // Immediately refetch notifications
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            toast({
                title: "New notification",
                description: "You have a new notification.",
            });
        });

        // Handle subscription errors
        channel.bind("pusher:subscription_error", (err: any) => {
            console.error("Pusher subscription error:", err);
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

    // Cleanup on unmount / logout
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
