"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    repliedAt: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface ContactMessageInput {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// --- Public submit hook ---

export const useSendContactMessage = () => {
    return useMutation({
        mutationFn: async (input: ContactMessageInput) => {
            const { data } = await api.post("/contact-messages", input);
            return data.data || data;
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to send message. Please try again."),
                variant: "destructive",
            });
        },
    });
};

// --- Admin hook (list + mark-read + delete) ---

export const useContactMessages = () => {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["contact-messages"],
        queryFn: async () => {
            const { data } = await api.get("/contact-messages");
            // Handle all common API response shapes
            if (Array.isArray(data?.data?.messages))        return data.data.messages;
            if (Array.isArray(data?.data?.contactMessages)) return data.data.contactMessages;
            if (Array.isArray(data?.data?.items))           return data.data.items;
            if (Array.isArray(data?.data))                  return data.data;
            if (Array.isArray(data?.messages))              return data.messages;
            if (Array.isArray(data))                        return data;
            return [];
        },
    });

    const markRead = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/contact-messages/${id}/read`);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to mark as read"), variant: "destructive" });
        },
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/contact-messages/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
            toast({ title: "Deleted", description: "Message deleted successfully." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to delete message"), variant: "destructive" });
        },
    });

    return { list, markRead, remove };
};
