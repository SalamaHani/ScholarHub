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
  status:
    | "DRAFT"
    | "PENDING"
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
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

  // 1. My Applications - Role-based filtering handled by backend
  // Students: Returns applications THEY submitted
  // Professors: Returns applications for THEIR scholarships
  const myApplications = useQuery({
    queryKey: ["applications", "my", user?.role],
    queryFn: async () => {
      const { data } = await api.get<any>("/applications");
      console.log("🔍 Applications API Response:", data);
      console.log("🔍 User Role:", user?.role);

      // Extract applications from nested structure
      const applications = data.data?.applications || data.applications || data.data || data;
      console.log("🔍 Extracted Applications:", applications);

      return applications;
    },
    enabled: !!user && (user.role === "STUDENT" || user.role === "PROFESSOR"),
  });

  // 2. All Applications (Admin) - Full list with filters
  const allApplications = useQuery({
    queryKey: ["applications", "all", filters],
    queryFn: async () => {
      const { data } = await api.get<any>("/applications/admin/all", {
        params: filters,
      });
      return data.data || data;
    },
    enabled: !!user && user.role === "ADMIN",
  });

  // 3. Submit Application (Student/Professor only)
  const submit = useMutation({
    mutationFn: async (applicationData: any) => {
      if (!user || (user.role !== "STUDENT" && user.role !== "PROFESSOR")) {
        throw new Error("Only students and professors can submit applications");
      }
      const { data } = await api.post<any>("/applications", applicationData);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Applied",
        description: "Your application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: getErrorMessage(error, "Failed to submit application"),
        variant: "destructive",
      });
    },
  });

  // 4. Evaluate Application (Professor/Admin only)
  const evaluate = useMutation({
    mutationFn: async ({
      id,
      status,
      evaluation,
    }: {
      id: string;
      status: string;
      evaluation?: string;
    }) => {
      if (!user || (user.role !== "PROFESSOR" && user.role !== "ADMIN")) {
        throw new Error("Only professors and admins can evaluate applications");
      }
      const { data } = await api.put<any>(`/applications/${id}/evaluate`, {
        status,
        evaluation,
      });
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({
        title: "Updated",
        description: "Application status has been updated.",
      });
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
      const { data } = await api.get<any>("/applications/admin/stats");
      return data.data || data;
    },
    enabled: !!user && user.role === "ADMIN",
  });

  // 6. Update Application (Student/Admin only)
  const update = useMutation({
    mutationFn: async ({
      id,
      data: applicationData,
    }: {
      id: string;
      data: any;
    }) => {
      if (!user || (user.role !== "STUDENT" && user.role !== "ADMIN")) {
        throw new Error("Only students and admins can update applications");
      }
      const { data } = await api.put<any>(
        `/applications/${id}`,
        applicationData,
      );
      return data.data || data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
      toast({
        title: "Updated",
        description: "Application has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: getErrorMessage(error, "Failed to update application"),
        variant: "destructive",
      });
    },
  });

  // 7. Delete Application (Admin only)
  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Only admins can delete applications");
      }
      const { data } = await api.delete<any>(`/applications/${id}`);
      return data.data || data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      toast({ title: "Deleted", description: "Application has been deleted." });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: getErrorMessage(error, "Failed to delete application"),
        variant: "destructive",
      });
    },
  });

  return {
    myApplications,
    allApplications,
    submit,
    update,
    evaluate,
    remove,
    stats,
  };
};

// Separate hook for single application details
export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const { data } = await api.get<any>(`/applications/${id}`);

      // Guard: explicit failure envelope
      if (data?.success === false) {
        throw new Error(data.message || "Application not found");
      }

      // Normalise all common response shapes:
      //  { data: { application: {...} } }
      //  { data: { ...app } }
      //  { application: {...} }
      //  { ...app }
      const app =
        data?.data?.application ??
        data?.data ??
        data?.application ??
        data;

      if (!app || !app.id) {
        throw new Error("Application not found");
      }

      return app;
    },
    enabled: !!id && id !== "undefined",
    retry: 1,
    staleTime: 30_000,
  });
};
