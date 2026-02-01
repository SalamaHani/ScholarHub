"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

// --- Types ---

export interface Application {
    id: string;
    studentId: string;
    scholarshipId: string;
    status: "DRAFT" | "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    answers?: string;
    documents?: string;
    evaluation?: string;
    createdAt: string;
    updatedAt: string;
    scholarship?: any;
    student?: any;
}

export interface ApplicationFilters {
    page?: number;
    limit?: number;
    status?: string;
    scholarshipId?: string;
    studentId?: string;
}

// --- Hooks ---

export const useApplications = (filters?: ApplicationFilters) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // 1. My Applications (Student) - Guarded by role and user presence
    const myApplications = useQuery({
        queryKey: ["applications", "my"],
        queryFn: async () => {
            const { data } = await api.get<any>("/applications");
            return data.data || data;
        },
        enabled: !!user && (user.role === "STUDENT" || user.role === "PROFESSOR"),
    });

    // 2. All Applications (Admin) - Full list with filters
    const allApplications = useQuery({
        queryKey: ["applications", "all", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/applications", { params: filters });
            return data.data || data;
        },
        enabled: !!user && user.role === "ADMIN",
    });

    // 3. Submit Application
    const submit = useMutation({
        mutationFn: async (applicationData: any) => {
            const { data } = await api.post<any>("/applications", applicationData);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            toast({ title: "Applied", description: "Your application has been submitted successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Application failed",
                description: getErrorMessage(error, "Failed to submit application"),
                variant: "destructive",
            });
        },
    });

    // 4. Evaluate Application (Professor/Admin)
    const evaluate = useMutation({
        mutationFn: async ({ id, status, evaluation }: { id: string; status: string; evaluation?: string }) => {
            const { data } = await api.put<any>(`/applications/${id}/evaluate`, { status, evaluation });
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            toast({ title: "Updated", description: "Application status has been updated." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to evaluate application"),
                variant: "destructive",
            });
        },
    });

    // 5. Get application statistics (Admin)
    const stats = useQuery({
        queryKey: ["applications", "stats"],
        queryFn: async () => {
            const { data } = await api.get<any>("/admin/applications/stats");
            return data.data || data;
        },
        enabled: !!user && user.role === "ADMIN",
    });

    return {
        myApplications,
        allApplications,
        submit,
        evaluate,
        stats,
    };
};

// Separate hook for single application details
export const useApplication = (id: string) => {
    return useQuery({
        queryKey: ["application", id],
        queryFn: async () => {
            const { data } = await api.get<any>(`/applications/${id}`);
            return data.data || data;
        },
        enabled: !!id,
    });
};

