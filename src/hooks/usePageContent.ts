"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface PageContent {
    id: string;
    pageKey: string;
    section?: string;
    title_en: string;
    title_ar: string;
    link?: string;
    description_en?: string;
    description_ar?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageContentFilters {
    section?: string;
}

export interface PageContentInput {
    pageKey: string;
    section?: string;
    title_en: string;
    title_ar: string;
    link?: string;
    description_en?: string;
    description_ar?: string;
    isActive?: boolean;
}

// --- Hook ---

export const usePageContent = (filters?: PageContentFilters) => {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["page-content", filters],
        queryFn: async () => {
            const { data } = await api.get("/page-content", { params: filters });
            return data.data || data;
        },
    });

    const create = useMutation({
        mutationFn: async (input: PageContentInput) => {
            const { data } = await api.post("/page-content", input);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["page-content"] });
            toast({ title: "Success", description: "Page content created successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to create page content"), variant: "destructive" });
        },
    });

    const update = useMutation({
        mutationFn: async ({ pageKey, data }: { pageKey: string; data: Partial<PageContentInput> }) => {
            const response = await api.put(`/page-content/${pageKey}`, data);
            return response.data.data || response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["page-content"] });
            toast({ title: "Success", description: "Page content updated successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to update page content"), variant: "destructive" });
        },
    });

    const remove = useMutation({
        mutationFn: async (pageKey: string) => {
            await api.delete(`/page-content/${pageKey}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["page-content"] });
            toast({ title: "Success", description: "Page content deleted successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to delete page content"), variant: "destructive" });
        },
    });

    return { list, create, update, remove };
};
