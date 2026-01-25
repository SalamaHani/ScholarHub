"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    professorId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    professor?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

export interface TestimonialFilters {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export interface TestimonialInput {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
    isActive?: boolean;
}

// --- Hook ---

export const useTestimonials = (filters?: TestimonialFilters) => {
    const queryClient = useQueryClient();

    // 1. List All Testimonials
    const list = useQuery({
        queryKey: ["testimonials", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/testimonials", { params: filters });
            return data.data || data;
        },
    });

    // 2. Create Testimonial (Professor/Admin)
    const create = useMutation({
        mutationFn: async (testimonialData: TestimonialInput) => {
            const { data } = await api.post<any>("/testimonials", testimonialData);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast({ title: "Success", description: "Testimonial created successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to create testimonial"),
                variant: "destructive",
            });
        },
    });

    // 3. Update Testimonial (Professor owner or Admin)
    const update = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<TestimonialInput> }) => {
            const response = await api.put<any>(`/testimonials/${id}`, data);
            return response.data.data || response.data;
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            queryClient.invalidateQueries({ queryKey: ["testimonial", id] });
            toast({ title: "Success", description: "Testimonial updated successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update testimonial"),
                variant: "destructive",
            });
        },
    });

    // 4. Delete Testimonial (Professor owner or Admin)
    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/testimonials/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            toast({ title: "Success", description: "Testimonial deleted successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to delete testimonial"),
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

// --- Single Testimonial Hook ---

export const useTestimonial = (id: string) => {
    return useQuery({
        queryKey: ["testimonial", id],
        queryFn: async () => {
            const { data } = await api.get<any>(`/testimonials/${id}`);
            return data.data || data;
        },
        enabled: !!id,
    });
};

// --- Professor Testimonials Hook ---

export const useProfessorTestimonials = (professorId: string) => {
    return useQuery({
        queryKey: ["testimonials", "professor", professorId],
        queryFn: async () => {
            const { data } = await api.get<any>(`/testimonials/professor/${professorId}`);
            return data.data || data;
        },
        enabled: !!professorId,
    });
};
