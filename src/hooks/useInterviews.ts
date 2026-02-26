"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type InterviewPlatform =
    | "ZOOM"
    | "GOOGLE_MEET"
    | "MICROSOFT_TEAMS"
    | "PHONE"
    | "IN_PERSON";

export type InterviewStatus =
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

export interface Interview {
    id: string;
    applicationId: string;
    scheduledAt: string;
    platform: InterviewPlatform;
    meetingLink?: string | null;
    duration?: number | null;       // minutes
    notes?: string | null;
    status: InterviewStatus;
    cancelReason?: string | null;
    createdAt: string;
    updatedAt: string;
    application?: {
        id: string;
        status: string;
        scholarship?: {
            id: string;
            title: string;
            organization?: string;
            logoUrl?: string | null;
        };
        student?: {
            id: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            avatar?: string | null;
        };
    };
}

export interface ScheduleInterviewInput {
    applicationId: string;
    scheduledAt: string;
    platform: InterviewPlatform;
    meetingLink?: string;
    duration?: number;
    notes?: string;
}

export interface UpdateInterviewInput {
    scheduledAt?: string;
    platform?: InterviewPlatform;
    meetingLink?: string;
    duration?: number;
    notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — extract Interview[] from various API response shapes
// ─────────────────────────────────────────────────────────────────────────────

function extractInterviews(raw: any): Interview[] {
    if (Array.isArray(raw?.data?.interviews)) return raw.data.interviews;
    if (Array.isArray(raw?.data?.items))       return raw.data.items;
    if (Array.isArray(raw?.data))              return raw.data;
    if (Array.isArray(raw?.interviews))        return raw.interviews;
    if (Array.isArray(raw?.items))             return raw.items;
    if (Array.isArray(raw))                    return raw;
    return [];
}

function extractInterview(raw: any): Interview {
    return raw?.data?.interview ?? raw?.data ?? raw;
}

// ─────────────────────────────────────────────────────────────────────────────
// Student hook — view my interviews
// ─────────────────────────────────────────────────────────────────────────────

export const useMyInterviews = () => {
    return useQuery<Interview[]>({
        queryKey: ["interviews", "my"],
        queryFn: async () => {
            const { data } = await api.get("/interviews/my");
            return extractInterviews(data);
        },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get interview for a specific application
// ─────────────────────────────────────────────────────────────────────────────

export const useInterviewByApplication = (applicationId: string) => {
    return useQuery<Interview | null>({
        queryKey: ["interviews", "application", applicationId],
        queryFn: async () => {
            const { data } = await api.get(`/interviews/application/${applicationId}`);
            return extractInterview(data) ?? null;
        },
        enabled: !!applicationId,
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin hook — list ALL interviews across all users
// ─────────────────────────────────────────────────────────────────────────────

export const useAllInterviews = () => {
    return useQuery<Interview[]>({
        queryKey: ["interviews", "all"],
        queryFn: async () => {
            // Try admin endpoint first, fall back to /interviews/my
            try {
                const { data } = await api.get("/interviews");
                return extractInterviews(data);
            } catch {
                const { data } = await api.get("/interviews/my");
                return extractInterviews(data);
            }
        },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin / Professor management hooks
// ─────────────────────────────────────────────────────────────────────────────

export const useInterviews = () => {
    const queryClient = useQueryClient();

    const schedule = useMutation({
        mutationFn: async (input: ScheduleInterviewInput) => {
            const { data } = await api.post("/interviews", input);
            return extractInterview(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            toast({ title: "Interview Scheduled", description: "The interview has been scheduled successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to schedule interview."),
                variant: "destructive",
            });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateInterviewInput }) => {
            const { data: res } = await api.put(`/interviews/${id}`, data);
            return extractInterview(res);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            toast({ title: "Updated", description: "Interview updated successfully." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update interview."),
                variant: "destructive",
            });
        },
    });

    const cancel = useMutation({
        mutationFn: async ({ id, cancelReason }: { id: string; cancelReason?: string }) => {
            const { data } = await api.put(`/interviews/${id}/cancel`, { cancelReason });
            return extractInterview(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            toast({ title: "Cancelled", description: "Interview has been cancelled." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to cancel interview."),
                variant: "destructive",
            });
        },
    });

    const complete = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put(`/interviews/${id}/complete`);
            return extractInterview(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            toast({ title: "Completed", description: "Interview marked as completed." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to mark interview as completed."),
                variant: "destructive",
            });
        },
    });

    const noShow = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.put(`/interviews/${id}/no-show`);
            return extractInterview(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            toast({ title: "No-Show Recorded", description: "Interview marked as no-show." });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to record no-show."),
                variant: "destructive",
            });
        },
    });

    return { schedule, update, cancel, complete, noShow };
};
