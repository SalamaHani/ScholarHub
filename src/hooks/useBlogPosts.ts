"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

// --- Types ---

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    tag?: string;           // legacy single-tag field (admin form)
    tags?: string[];        // API returns tags as array
    coverImage?: string | null;
    authorName?: string;
    status: "published" | "draft" | "PUBLISHED" | "DRAFT";
    publishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string | null;
    };
}

export interface BlogPostFilters {
    tag?: string;
    page?: number;
    limit?: number;
}

export interface BlogPostInput {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    tag?: string;
    coverImage?: string;
    authorName?: string;
    status?: "published" | "draft";
}

// --- Public hook (published posts only) ---

// Helper: extract BlogPost[] from various API response shapes
function extractBlogPosts(raw: any): BlogPost[] {
    // { data: { blogPosts: [...] } }
    if (Array.isArray(raw?.data?.blogPosts)) return raw.data.blogPosts;
    // { data: [...] }
    if (Array.isArray(raw?.data)) return raw.data;
    // { blogPosts: [...] }
    if (Array.isArray(raw?.blogPosts)) return raw.blogPosts;
    // { posts: [...] }
    if (Array.isArray(raw?.posts)) return raw.posts;
    // direct array
    if (Array.isArray(raw)) return raw;
    return [];
}

export const usePublicBlogPosts = (filters?: BlogPostFilters) => {
    return useQuery({
        queryKey: ["blog-posts-public", filters],
        queryFn: async () => {
            const { data } = await api.get("/blog-posts", { params: filters });
            return extractBlogPosts(data);
        },
    });
};

// --- Single post by slug (public) ---

export const usePublicBlogPost = (slug: string) => {
    return useQuery({
        queryKey: ["blog-post", slug],
        queryFn: async () => {
            const { data } = await api.get(`/blog-posts/${slug}`);
            return data.data || data;
        },
        enabled: !!slug,
    });
};

// --- Admin hook (all statuses) ---

export const useBlogPosts = (filters?: BlogPostFilters) => {
    const queryClient = useQueryClient();

    const list = useQuery({
        queryKey: ["blog-posts", filters],
        queryFn: async () => {
            const { data } = await api.get("/blog-posts/admin/all", { params: filters });
            return extractBlogPosts(data);
        },
    });

    const create = useMutation({
        mutationFn: async (input: BlogPostInput) => {
            const { data } = await api.post("/blog-posts", input);
            return data.data || data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({ title: "Success", description: "Blog post created successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to create blog post"), variant: "destructive" });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPostInput> }) => {
            const response = await api.put(`/blog-posts/${id}`, data);
            return response.data.data || response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({ title: "Success", description: "Blog post updated successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to update blog post"), variant: "destructive" });
        },
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/blog-posts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
            toast({ title: "Success", description: "Blog post deleted successfully" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: getErrorMessage(error, "Failed to delete blog post"), variant: "destructive" });
        },
    });

    return { list, create, update, remove };
};
