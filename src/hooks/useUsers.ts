"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface User {
    id: string;
    email: string;
    name: string;
    role: "STUDENT" | "PROFESSOR" | "ADMIN";
    avatar?: string;
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    profile?: {
        bio?: string;
        university?: string;
        department?: string;
        phone?: string;
    };
}

export interface UserFilters {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isBlocked?: boolean;
    isVerified?: boolean;
}

// --- Hook ---

export const useUsers = (filters?: UserFilters) => {
    const queryClient = useQueryClient();

    // 1. List all users (Admin only)
    const list = useQuery({
        queryKey: ["users", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/users", { params: filters });
            return data.data || data;
        },
    });

    // 2. Update user role
    const updateRole = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            const { data } = await api.put<any>(`/users/${id}/change-role`, { role });
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "Success", description: "User role has been updated." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update user role"),
                variant: "destructive",
            });
        },
    });

    // 3. Block user
    const blockUser = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put<any>(`/users/${id}/block`);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "User Blocked", description: "User has been blocked from the platform." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to block user"),
                variant: "destructive",
            });
        },
    });

    // 4. Unblock user
    const unblockUser = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put<any>(`/users/${id}/unblock`);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "User Unblocked", description: "User has been unblocked." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to unblock user"),
                variant: "destructive",
            });
        },
    });

    // 5. Delete user
    const deleteUser = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "User Deleted", description: "User has been permanently deleted." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to delete user"),
                variant: "destructive",
            });
        },
    });

    // 6. Verify user (for professors)
    const verifyUser = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put<any>(`/users/${id}/verify-professor`);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "User Verified", description: "User has been verified." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to verify user"),
                variant: "destructive",
            });
        },
    });

    // 7. Update user profile (Admin)
    const updateProfile = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(`/users/${id}/profile`, data);
            return response.data.data || response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast({ title: "Profile Updated", description: "User profile has been updated successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update user profile"),
                variant: "destructive",
            });
        },
    });

    return {
        list,
        updateRole,
        blockUser,
        unblockUser,
        deleteUser,
        verifyUser,
        updateProfile,
    };
};

// Separate hook for single user details
export const useUser = (id: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const { data } = await api.get<any>(`/users/${id}`);
            return data.data || data;
        },
        enabled: !!id,
    });
};

