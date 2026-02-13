"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

// --- Types ---

export interface Document {
    id: string;
    title: string;
    description?: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    category?: string;
    isPublic: boolean;
    uploadedById: string;
    uploadedBy?: {
        id: string;
        name: string;
        email: string;
    };
    downloads: number;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isPublic?: boolean;
}

export interface CreateDocumentInput {
    title: string;
    description?: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    category?: string;
    isPublic: boolean;
}

// --- Hooks ---

export const useDocuments = (filters?: DocumentFilters) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // 1. List Documents
    const list = useQuery({
        queryKey: ["documents", filters],
        queryFn: async () => {
            const { data } = await api.get<any>("/documents", {
                params: filters,
            });

            if (data.success === false) {
                throw new Error(data.message || "Failed to fetch documents");
            }

            return data.data || data;
        },
    });

    // 2. Get Single Document
    const getById = (id: string) => {
        return useQuery({
            queryKey: ["document", id],
            queryFn: async () => {
                const { data } = await api.get<any>(`/documents/${id}`);

                if (data.success === false) {
                    throw new Error(data.message || "Failed to fetch document");
                }

                return data.data?.document || data.document || data.data || data;
            },
            enabled: !!id,
        });
    };

    // 3. Create Document (Admin only)
    const create = useMutation({
        mutationFn: async (documentData: CreateDocumentInput) => {
            if (!user || user.role !== "ADMIN") {
                throw new Error("Only admins can create documents");
            }
            const { data } = await api.post<any>("/documents", documentData);
            return data.data?.document || data.document || data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Success",
                description: "Document created successfully"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to create document"),
                variant: "destructive",
            });
        },
    });

    // 4. Update Document (Admin only)
    const update = useMutation({
        mutationFn: async ({
            id,
            data: documentData
        }: {
            id: string;
            data: Partial<CreateDocumentInput>
        }) => {
            if (!user || user.role !== "ADMIN") {
                throw new Error("Only admins can update documents");
            }
            const { data } = await api.put<any>(`/documents/${id}`, documentData);
            return data.data?.document || data.document || data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Success",
                description: "Document updated successfully"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to update document"),
                variant: "destructive",
            });
        },
    });

    // 5. Delete Document (Admin only)
    const remove = useMutation({
        mutationFn: async (id: string) => {
            if (!user || user.role !== "ADMIN") {
                throw new Error("Only admins can delete documents");
            }
            const { data } = await api.delete<any>(`/documents/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Success",
                description: "Document deleted successfully"
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to delete document"),
                variant: "destructive",
            });
        },
    });

    // 6. Download Document (increments download count)
    const download = useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post<any>(`/documents/${id}/download`);
            return data.data || data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            // Open the file URL in a new tab or trigger download
            if (data.fileUrl) {
                window.open(data.fileUrl, '_blank');
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to download document"),
                variant: "destructive",
            });
        },
    });

    // 7. Upload Document File
    const upload = useMutation({
        mutationFn: async (file: File) => {
            if (!user || user.role !== "ADMIN") {
                throw new Error("Only admins can upload documents");
            }

            const formData = new FormData();
            formData.append('file', file);

            const { data } = await api.post<any>("/documents/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return data.data || data;
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: getErrorMessage(error, "Failed to upload file"),
                variant: "destructive",
            });
        },
    });

    return {
        documents: list.data?.documents || list.data || [],
        pagination: list.data?.pagination,
        isLoading: list.isLoading,
        error: list.error,
        create,
        update,
        remove,
        download,
        upload,
        getById,
    };
};

// Hook for single document
export const useDocument = (id: string) => {
    return useQuery({
        queryKey: ["document", id],
        queryFn: async () => {
            const { data } = await api.get<any>(`/documents/${id}`);

            if (data.success === false) {
                throw new Error(data.message || "Failed to fetch document");
            }

            return data.data?.document || data.document || data.data || data;
        },
        enabled: !!id,
    });
};
