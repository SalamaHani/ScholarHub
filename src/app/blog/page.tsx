"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { usePublicBlogPosts } from "@/hooks/useBlogPosts";
import { usePageContentEntry } from "@/hooks/usePageContent";

// Cycle through tag colors for variety
const TAG_COLORS = [
    "text-blue-600 bg-blue-50 border-blue-200",
    "text-emerald-600 bg-emerald-50 border-emerald-200",
    "text-violet-600 bg-violet-50 border-violet-200",
    "text-amber-600 bg-amber-50 border-amber-200",
    "text-rose-600 bg-rose-50 border-rose-200",
    "text-cyan-600 bg-cyan-50 border-cyan-200",
];

export default function BlogPage() {
    const { t } = useTranslation();
    const { data, isLoading } = usePublicBlogPosts();
    const { data: pageEntry } = usePageContentEntry("blog");

    // Static i18n fallback posts
    const staticPosts = [
        { slug: "how-to-write-winning-personal-statement", title: t.blog.post1Title, excerpt: t.blog.post1Desc, category: t.blog.post1Tag, date: t.blog.post1Date, readTime: t.blog.post1Read },
        { slug: "top-fully-funded-scholarships-2026",      title: t.blog.post2Title, excerpt: t.blog.post2Desc, category: t.blog.post2Tag, date: t.blog.post2Date, readTime: t.blog.post2Read },
        { slug: "ielts-preparation-guide",                 title: t.blog.post3Title, excerpt: t.blog.post3Desc, category: t.blog.post3Tag, date: t.blog.post3Date, readTime: t.blog.post3Read },
        { slug: "recommendation-letter-tips",              title: t.blog.post4Title, excerpt: t.blog.post4Desc, category: t.blog.post4Tag, date: t.blog.post4Date, readTime: t.blog.post4Read },
        { slug: "scholarship-interview-preparation",       title: t.blog.post5Title, excerpt: t.blog.post5Desc, category: t.blog.post5Tag, date: t.blog.post5Date, readTime: t.blog.post5Read },
        { slug: "managing-multiple-applications",          title: t.blog.post6Title, excerpt: t.blog.post6Desc, category: t.blog.post6Tag, date: t.blog.post6Date, readTime: t.blog.post6Read },
    ];

    // Use API posts if loaded and non-empty, else fall back to static
    const apiPosts = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : [];
    const posts = apiPosts.length > 0
        ? apiPosts.map((post: any, i: number) => ({
            slug:     post.slug,
            title:    post.title,
            excerpt:  post.excerpt || "",
            category: post.tag || "",
            date:     new Date(post.createdAt).toLocaleDateString(),
            readTime: "",
            color:    TAG_COLORS[i % TAG_COLORS.length],
          }))
        : staticPosts.map((p, i) => ({ ...p, color: TAG_COLORS[i % TAG_COLORS.length] }));

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

                {/* Loading */}
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}>
                                <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                                    <CardContent className="p-6 flex flex-col gap-3 h-full">
                                        {post.category && (
                                            <Badge
                                                variant="outline"
                                                className={`self-start text-xs ${post.color}`}
                                            >
                                                <Tag className="h-2.5 w-2.5 mr-1" />
                                                {post.category}
                                            </Badge>
                                        )}

                                        <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                            {post.readTime && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {post.readTime}
                                                </span>
                                            )}
                                            <span>{post.date}</span>
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
