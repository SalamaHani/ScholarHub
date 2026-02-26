"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface FaqItem {
    id: string;
    pageKey: string;
    question_en: string;
    question_ar: string;
    answer_en: string;
    answer_ar: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FaqItemFilters {
    pageKey?: string;
}

export interface FaqItemInput {
    pageKey: string;
    question_en: string;
    question_ar: string;
    answer_en: string;
    answer_ar: string;
    order?: number;
    isActive?: boolean;
}

// Helper: extract FaqItem[] from various API response shapes
function extractFaqItems(raw: any): FaqItem[] {
    // { data: { faqItems: [...] } }
    if (Array.isArray(raw?.data?.faqItems)) return raw.data.faqItems;
    // { data: { items: [...] } }
    if (Array.isArray(raw?.data?.items)) return raw.data.items;
    // { data: [...] }
    if (Array.isArray(raw?.data)) return raw.data;
    // { faqItems: [...] }
    if (Array.isArray(raw?.faqItems)) return raw.faqItems;
    // { items: [...] }
    if (Array.isArray(raw?.items)) return raw.items;
    // direct array
    if (Array.isArray(raw)) return raw;
    return [];
}

// --- Hook ---

export const useFaqItems = (filters?: FaqItemFilters) => {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["faq-items", filters],
        queryFn: async () => {
            const { data } = await api.get("/faq-items", { params: filters });
            return extractFaqItems(data);
        },
    });

    const create = useMutation({
        mutationFn: async (input: FaqItemInput) => {
            const { data } = await api.post("/faq-items", input);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faq-items"] });
            toast({ title: "Success", description: "FAQ item created successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to create FAQ item"), variant: "destructive" });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<FaqItemInput> }) => {
            const response = await api.put(`/faq-items/${id}`, data);
            return response.data.data || response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faq-items"] });
            toast({ title: "Success", description: "FAQ item updated successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to update FAQ item"), variant: "destructive" });
        },
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/faq-items/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["faq-items"] });
            toast({ title: "Success", description: "FAQ item deleted successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to delete FAQ item"), variant: "destructive" });
        },
    });

    return { list, create, update, remove };
};
