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
    sendPush?: boolean; // Enable push notification via Pusher Beams
    interests?: string[]; // Pusher Beams interests to target
}

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // 1. List my notifications
    const list = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await api.get<any>("/notifications");
            return data.data || data;
        },
    });

    // 2. Mark single as read
    const markRead = useMutation({
        mutationFn: async (id: string) => {
            await api.put(`/notifications/${id}/read`);
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    // 4. Send notification to users (Admin)
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

    // 6. Get Beams auth token (for client-side Pusher Beams)
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
