"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const useSavedScholarships = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // GET all saved scholarships
    const list = useQuery({
        queryKey: ["saved-scholarships"],
        queryFn: async () => {
            const { data } = await api.get<any>("/saved");

            if (data.success === false) {
                throw new Error(data.message || "Failed to load saved scholarships");
            }

            // Extract the list from various possible response shapes
            const rawItems = data.data?.saved || data.saved || data.data || data;

            // If it's an array, let's make sure we flatten it if items are { id, scholarship: {...} }
            if (Array.isArray(rawItems)) {
                return rawItems.map(item => {
                    if (item.scholarship) {
                        return {
                            ...item.scholarship,
                            savedId: item.id // Keep the relationship ID if needed
                        };
                    }
                    return item;
                });
            }

            return rawItems;
        },
        enabled: !!user,
        retry: 1,
    });

    // POST to save a scholarship
    const save = useMutation({
        mutationFn: async (scholarshipId: string) => {
            const { data } = await api.post("/saved", { scholarshipId });
            return data;
        },
        onSuccess: (_, scholarshipId) => {
            // Refetch saved list and check status for this specific scholarship
            queryClient.invalidateQueries({ queryKey: ["saved-scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["saved-check", scholarshipId] });

            toast({
                title: "Added to Bookmarks",
                description: "You can find this in your saved scholarships."
            });
        },
        onError: (error: any) => {
            toast({
                title: "Action Failed",
                description: getErrorMessage(error, "Could not save scholarship. Please try again."),
                variant: "destructive",
            });
        },
    });

    // DELETE to remove a saved scholarship
    const remove = useMutation({
        mutationFn: async (scholarshipId: string) => {
            await api.delete(`/saved/${scholarshipId}`);
        },
        onSuccess: (_, scholarshipId) => {
            queryClient.invalidateQueries({ queryKey: ["saved-scholarships"] });
            queryClient.invalidateQueries({ queryKey: ["saved-check", scholarshipId] });

            toast({
                title: "Removed",
                description: "Scholarship removed from your bookmarks."
            });
        },
        onError: (error: any) => {
            toast({
                title: "Action Failed",
                description: getErrorMessage(error, "Could not remove scholarship."),
                variant: "destructive",
            });
        }
    });

    return {
        list,
        save,
        remove,
    };
};

// Separate hook for checking if a scholarship is saved
export const useCheckSaved = (scholarshipId: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ["saved-check", scholarshipId],
        queryFn: async () => {
            // Guard against malformed IDs
            if (!scholarshipId || scholarshipId === "undefined" || scholarshipId.includes("[")) {
                return false;
            }

            try {
                const { data } = await api.get<any>(`/saved/check/${scholarshipId}`);

                if (data.success === false) return false;

                // Handle various potential API return shapes professionally
                if (data.data?.isSaved !== undefined) return data.data.isSaved;
                if (data.isSaved !== undefined) return data.isSaved;
                return !!(data.data || data);
            } catch (error) {
                console.warn("Check saved status silent fail:", error);
                return false;
            }
        },
        enabled: !!scholarshipId && scholarshipId !== "undefined" && !scholarshipId.includes("[") && !!user,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

