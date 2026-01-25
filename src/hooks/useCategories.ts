"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive: boolean;
}

export interface CategoryInput {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    isActive?: boolean;
}

export const useCategories = () => {
    const queryClient = useQueryClient();

    // 1. List all categories
    const list = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await api.get<any>("/categories");
            return data.data || data;
        },
    });

    // 2. Create category (Admin)
    const create = useMutation({
        mutationFn: async (categoryData: CategoryInput) => {
            const { data } = await api.post<any>("/admin/categories", categoryData);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Success", description: "Category created successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to create category"),
                variant: "destructive",
            });
        },
    });

    // 3. Update category (Admin)
    const update = useMutation({
        mutationFn: async ({ id, data: categoryData }: { id: string; data: CategoryInput }) => {
            const { data } = await api.put<any>(`/admin/categories/${id}`, categoryData);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Success", description: "Category updated successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update category"),
                variant: "destructive",
            });
        },
    });

    // 4. Delete category (Admin)
    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Success", description: "Category deleted successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to delete category"),
                variant: "destructive",
            });
        },
    });

    return {
        list,
        create,
        update,
        remove,
    };
};

// Separate hook for single category details
export const useCategory = (slug: string) => {
    return useQuery({
        queryKey: ["category", slug],
        queryFn: async () => {
            const { data } = await api.get<any>(`/categories/${slug}`);
            return data.data || data;
        },
        enabled: !!slug,
    });
};

