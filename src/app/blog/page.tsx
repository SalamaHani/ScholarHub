"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export default function BlogPage() {
    const { t } = useTranslation();

    const posts = [
        {
            slug: "how-to-write-winning-personal-statement",
            title: t.blog.post1Title,
            excerpt: t.blog.post1Desc,
            category: t.blog.post1Tag,
            date: t.blog.post1Date,
            readTime: t.blog.post1Read,
            color: "text-blue-600 bg-blue-50 border-blue-200",
        },
        {
            slug: "top-fully-funded-scholarships-2026",
            title: t.blog.post2Title,
            excerpt: t.blog.post2Desc,
            category: t.blog.post2Tag,
            date: t.blog.post2Date,
            readTime: t.blog.post2Read,
            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        },
        {
            slug: "ielts-preparation-guide",
            title: t.blog.post3Title,
            excerpt: t.blog.post3Desc,
            category: t.blog.post3Tag,
            date: t.blog.post3Date,
            readTime: t.blog.post3Read,
            color: "text-violet-600 bg-violet-50 border-violet-200",
        },
        {
            slug: "recommendation-letter-tips",
            title: t.blog.post4Title,
            excerpt: t.blog.post4Desc,
            category: t.blog.post4Tag,
            date: t.blog.post4Date,
            readTime: t.blog.post4Read,
            color: "text-amber-600 bg-amber-50 border-amber-200",
        },
        {
            slug: "scholarship-interview-preparation",
            title: t.blog.post5Title,
            excerpt: t.blog.post5Desc,
            category: t.blog.post5Tag,
            date: t.blog.post5Date,
            readTime: t.blog.post5Read,
            color: "text-rose-600 bg-rose-50 border-rose-200",
        },
        {
            slug: "managing-multiple-applications",
            title: t.blog.post6Title,
            excerpt: t.blog.post6Desc,
            category: t.blog.post6Tag,
            date: t.blog.post6Date,
            readTime: t.blog.post6Read,
            color: "text-cyan-600 bg-cyan-50 border-cyan-200",
        },
    ];

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="mb-12 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider">
                        <BookOpen className="h-4 w-4" />
                        {t.blog.tag}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        {t.blog.title}
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        {t.blog.desc}
                    </p>
                </div>

                {/* Posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`}>
                            <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                                <CardContent className="p-6 flex flex-col gap-3 h-full">
                                    <Badge
                                        variant="outline"
                                        className={`self-start text-xs ${post.color}`}
                                    >
                                        <Tag className="h-2.5 w-2.5 mr-1" />
                                        {post.category}
                                    </Badge>

                                    <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {post.readTime}
                                        </span>
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
            </div>
        </div>
    );
}
