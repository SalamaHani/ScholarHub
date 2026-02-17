"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export interface SendNotificationInput {
    title: string;
    message: string;
    type?: "INFO" | "SUCCESS" | "WARNING" | "SCHOLARSHIP" | "APPLICATION";
    link?: string;
    targetRole?: "STUDENT" | "PROFESSOR" | "ALL";
    targetUserIds?: string[];
    sendPush?: boolean;
    interests?: string[];
}

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // 1. List my notifications (poll every 30s as fallback when Pusher is unavailable)
    const list = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get<any>("/notifications");

            if (!data || Object.keys(data).length === 0) {
                return {
                    notifications: [],
                    unreadCount: 0,
                    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
                };
            }

            return data.data || data;
        },
        // Polling fallback — Pusher will invalidate faster when connected
        refetchInterval: 30_000,
        refetchIntervalInBackground: false,
    });

    // 2. Mark single as read
    const markRead = useMutation({
        mutationFn: async (id: string) => {
            await api.put(`/notifications/${id}/read`);
        },
        // Optimistic update: instantly flip isRead in the cache
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previous = queryClient.getQueryData(["notifications"]);

            queryClient.setQueryData(["notifications"], (old: any) => {
                if (!old) return old;
                const update = (list: any[]) =>
                    list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
                if (Array.isArray(old.notifications)) {
                    return { ...old, notifications: update(old.notifications) };
                }
                if (Array.isArray(old)) return update(old);
                return old;
            });

            return { previous };
        },
        onError: (error: any, _id, context: any) => {
            // Roll back optimistic update on error
            if (context?.previous) {
                queryClient.setQueryData(["notifications"], context.previous);
            }
            toast({
                title: "Failed to mark as read",
                description: getErrorMessage(error, "Please try again."),
                variant: "destructive",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    // 3. Mark all as read
    const markAllRead = useMutation({
        mutationFn: async () => {
            await api.put("/notifications/read-all");
        },
        // Optimistic update: mark everything read immediately
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications"] });
            const previous = queryClient.getQueryData(["notifications"]);

            queryClient.setQueryData(["notifications"], (old: any) => {
                if (!old) return old;
                const markAll = (list: any[]) => list.map((n) => ({ ...n, isRead: true }));
                if (Array.isArray(old.notifications)) {
                    return { ...old, notifications: markAll(old.notifications) };
                }
                if (Array.isArray(old)) return markAll(old);
                return old;
            });

            return { previous };
        },
        onError: (error: any, _vars, context: any) => {
            if (context?.previous) {
                queryClient.setQueryData(["notifications"], context.previous);
            }
            toast({
                title: "Failed to mark all as read",
                description: getErrorMessage(error, "Please try again."),
                variant: "destructive",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    // 4. Send notification (Admin)
    const sendNotification = useMutation({
        mutationFn: async (notificationData: SendNotificationInput) => {
            const { data } = await api.post<any>("/admin/notifications/send", notificationData);
            return data.data || data;
        },
        onSuccess: () => {
            toast({ title: "Notification Sent", description: "Notification has been sent to users." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to send notification"),
                variant: "destructive",
            });
        },
    });

    // 5. Send email notification (Admin)
    const sendEmail = useMutation({
        mutationFn: async (emailData: {
            to: string | string[];
            subject: string;
            body: string;
            template?: string;
        }) => {
            const { data } = await api.post<any>("/admin/notifications/email", emailData);
            return data.data || data;
        },
        onSuccess: () => {
            toast({ title: "Email Sent", description: "Email notification has been sent." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to send email"),
                variant: "destructive",
            });
        },
    });

    // 6. Get Beams auth token
    const getBeamsAuthToken = useMutation({
        mutationFn: async (userId: string) => {
            const { data } = await api.post<any>("/notifications/beams-auth", { userId });
            return data;
        },
        onError: (error: any) => {
            console.error("Failed to get Beams auth token:", error);
        },
    });

    return {
        list,
        markRead,
        markAllRead,
        sendNotification,
        sendEmail,
        getBeamsAuthToken,
    };
};
