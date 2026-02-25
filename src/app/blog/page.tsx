"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag, AlertCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { usePublicBlogPosts, type BlogPost } from "@/hooks/useBlogPosts";
import { usePageContentEntry } from "@/hooks/usePageContent";

const TAG_COLORS = [
    "text-blue-600 bg-blue-50 border-blue-200",
    "text-emerald-600 bg-emerald-50 border-emerald-200",
    "text-violet-600 bg-violet-50 border-violet-200",
    "text-amber-600 bg-amber-50 border-amber-200",
    "text-rose-600 bg-rose-50 border-rose-200",
    "text-cyan-600 bg-cyan-50 border-cyan-200",
];

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric", month: "short", day: "numeric",
        });
    } catch {
        return iso;
    }
}

export default function BlogPage() {
    const { t } = useTranslation();
    const { data, isLoading, isError } = usePublicBlogPosts();
    const { data: pageEntry } = usePageContentEntry("blog");

    // Normalise API response — may be array or { posts: [...] }
    const rawPosts: BlogPost[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.posts)
            ? (data as any).posts
            : [];

    const publishedPosts = rawPosts.filter((p) => p.status === "published" || !p.status);

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">

                {/* Header */}
                <div className="mb-12 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider">
                        <BookOpen className="h-4 w-4" />
                        {pageEntry?.heroText || t.blog.tag}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        {pageEntry?.title || t.blog.title}
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        {pageEntry?.description || pageEntry?.subtitle || t.blog.desc}
                    </p>
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-xl bg-muted animate-pulse h-56" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <AlertCircle className="h-10 w-10 text-destructive/60" />
                        <p className="text-muted-foreground text-sm">Failed to load blog posts. Please try again.</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && publishedPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">No blog posts yet. Check back soon!</p>
                    </div>
                )}

                {/* Grid */}
                {!isLoading && !isError && publishedPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {publishedPosts.map((post, i) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                                <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group overflow-hidden">

                                    {/* Cover image */}
                                    {post.coverImage && (
                                        <div className="h-44 w-full overflow-hidden bg-muted">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                            />
                                        </div>
                                    )}

                                    <CardContent className="p-6 flex flex-col gap-3">
                                        {/* Tag */}
                                        {post.tag && (
                                            <Badge
                                                variant="outline"
                                                className={`self-start text-xs ${TAG_COLORS[i % TAG_COLORS.length]}`}
                                            >
                                                <Tag className="h-2.5 w-2.5 mr-1" />
                                                {post.tag}
                                            </Badge>
                                        )}

                                        {/* Title */}
                                        <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Author + date */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 gap-2">
                                            {post.authorName && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <User className="h-3 w-3 shrink-0" />
                                                    {post.authorName}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 ml-auto shrink-0">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                            {t.blog.readMore} <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
