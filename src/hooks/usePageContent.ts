"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types (match actual API response) ---

export interface PageContent {
    id: string;
    pageKey: string;
    section?: string;
    title: string;
    subtitle?: string;
    description?: string;
    heroText?: string;
    ctaLabel?: string | null;
    ctaLink?: string | null;
    metaData?: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PageContentFilters {
    pageKey?: string;
    section?: string;
}

export interface PageContentInput {
    pageKey: string;
    section?: string;
    title: string;
    subtitle?: string;
    description?: string;
    heroText?: string;
    ctaLabel?: string;
    ctaLink?: string;
    isActive?: boolean;
}

// Helper: extract array from various response shapes
function extractList(raw: any): PageContent[] {
    // { data: { content: [...] } }
    if (Array.isArray(raw?.content)) return raw.content;
    // { data: [...] }
    if (Array.isArray(raw)) return raw;
    // fallback
    return [];
}

// --- Hook ---

export const usePageContent = (filters?: PageContentFilters) => {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["page-content", filters],
        queryFn: async () => {
            const { data } = await api.get("/page-content", { params: filters });
            // API returns { success, data: { content: [...] } }
            return extractList(data.data ?? data);
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
        mutationFn: async ({ id, data }: { id: string; data: Partial<PageContentInput> }) => {
            const response = await api.put(`/page-content/${id}`, data);
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
        mutationFn: async (id: string) => {
            await api.delete(`/page-content/${id}`);
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

// --- All sections for a page (for body content like Terms / Privacy sections) ---

export const usePageSections = (pageKey: string) => {
    return useQuery<PageContent[]>({
        queryKey: ["page-sections", pageKey],
        queryFn: async () => {
            const { data } = await api.get("/page-content", { params: { pageKey } });
            const items = extractList(data.data ?? data);
            return items
                .filter(c => c.pageKey === pageKey && c.section && c.isActive !== false)
                .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        },
        enabled: !!pageKey,
        staleTime: 1000 * 60 * 5,
    });
};

// --- Single page entry hook (for page-level hero/meta) ---

export const usePageContentEntry = (pageKey: string) => {
    return useQuery<PageContent | null>({
        queryKey: ["page-content-entry", pageKey],
        queryFn: async () => {
            const { data } = await api.get("/page-content", { params: { pageKey } });
            const items = extractList(data.data ?? data);
            return items.find(c => c.pageKey === pageKey && c.isActive !== false) ?? null;
        },
        enabled: !!pageKey,
        staleTime: 1000 * 60 * 5,
    });
};
