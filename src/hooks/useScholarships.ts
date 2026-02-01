"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

// --- Types ---

export interface Scholarship {
    id: string;
    title: string;
    description: string;
    organization: string;
    country: string;
    region?: string;
    fieldOfStudy: string[];
    degreeLevel: string[];
    fundingType: string;
    amount?: string;
    currency?: string;
    deadline: string;
    applicationLink: string;
    requirements: string;
    eligibility: string;
    benefits?: string;
    documents?: string;
    isActive: boolean;
    isFeatured: boolean;
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason?: string;
    views: number;
    createdAt: string;
    updatedAt: string;
}

export interface ScholarshipFilters {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    degreeLevel?: string;
    fundingType?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    userId?: string;
}

// --- Hooks ---

export const useScholarships = (filters?: ScholarshipFilters) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    // 1. List Scholarships
    const list = useQuery({
        queryKey: ["scholarships", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/scholarships", {
                params: filters,
            });

            if (data.success === false) {
                throw new Error(data.message || "Failed to fetch scholarships");
            }

            return data.data || data;
        },
    });
    // 1. Admin List Scholarships

    // 2. Create Scholarship
    const create = useMutation({
        mutationFn: async (scholarshipData: Partial<Scholarship>) => {
            const { data } = await api.post<any>("/scholarships", scholarshipData);
            return data.data?.scholarship || data.scholarship || data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            toast({ title: "Success", description: "Scholarship created successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to create scholarship"),
                variant: "destructive",
            });
        },
    });

    // 3. Update Scholarship
    const update = useMutation({
        mutationFn: async ({ id, data: scholarshipData }: { id: string; data: Partial<Scholarship> }) => {
            const { data } = await api.put<any>(`/scholarships/${id}`, scholarshipData);
            return data.data?.scholarship || data.scholarship || data.data || data;
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["scholarship", id] });
            toast({ title: "Success", description: "Scholarship updated successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update scholarship"),
                variant: "destructive",
            });
        },
    });

    // 4. Delete Scholarship
    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/scholarships/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            toast({ title: "Success", description: "Scholarship deleted successfully" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to delete scholarship"),
                variant: "destructive",
            });
        },
    });

    // 5. Professor's own scholarships - Directly uses the dedicated endpoint
    const professorList = useQuery({
        queryKey: ["scholarships", "professor", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/professor", {
                params: filters,
            });
            return data.data || data;
        },
        enabled: !!user && (user.role === "PROFESSOR" || user.role === "ADMIN"),
    });

    // 6. Admin Pending List - Directly uses the dedicated endpoint
    const adminPendingList = useQuery({
        queryKey: ["scholarships", "admin", "pending"],
        queryFn: async () => {
            const { data } = await api.get<any>("/scholarships/admin/pending");
            // Professional data extraction supporting various API response patterns
            if (data.success === false) return [];
            return data.data?.scholarships || data.scholarships || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
        },
        enabled: !!user && user.role === "ADMIN",
    });

    const approve = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put<any>(`/scholarships/${id}/approve`);
            return data.data || data;
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["scholarship", id] });
            toast({ title: "Approved", description: "Scholarship has been approved." });
        },
        onError: (error: any) => {
            toast({
                title: "Approval Failed",
                description: getErrorMessage(error, "Failed to approve scholarship"),
                variant: "destructive",
            });
        },
    });

    const reject = useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
            const { data } = await api.put<any>(`/scholarships/${id}/reject`, { reason });
            return data.data || data;
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["scholarship", id] });
            toast({ title: "Rejected", description: "Scholarship has been rejected." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to reject scholarship"),
                variant: "destructive",
            });
        },
    });

    // 9. Toggle Featured (Admin)
    const toggleFeatured = useMutation({
        mutationFn: async (id: string) => {
            await api.put(`/scholarships/${id}/feature`);
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ["scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["scholarship", id] });
            toast({ title: "Featured Updated", description: "Featured status has been toggled." });
        },
        onError: (error: any) => {
            toast({
                title: "Feature Toggle Failed",
                description: getErrorMessage(error, "Failed to toggle featured status"),
                variant: "destructive",
            });
        },
    });

    return {
        list,
        create,
        update,
        remove,
        professorList,
        adminPendingList,
        approve,
        reject,
        toggleFeatured
    };
};

export const useScholarship = (id: string) => {
    return useQuery({
        queryKey: ["scholarship", id],
        queryFn: async () => {
            // Guard against malformed IDs or Next.js structural placeholders
            if (!id || id === "undefined" || id.includes("[") || id.includes("]")) {
                return null;
            }

            const { data } = await api.get<any>(`/scholarships/${id}`);

            // Check for explicit failure flag from backend
            if (data.success === false) {
                throw new Error(data.message || "Scholarship not found");
            }

            // Robust parsing for different API formats
            const result = data.data?.scholarship || data.scholarship || data.data || data;

            // Final check: if we got back an empty object or something without an id, it's a fail
            if (!result || (typeof result === 'object' && !result.id && !result._id)) {
                throw new Error("Invalid scholarship data received");
            }

            return result;
        },
        enabled: !!id && id !== "undefined" && !id.includes("["),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
