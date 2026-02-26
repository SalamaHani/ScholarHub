"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Clock,
    Tag,
    User,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePublicBlogPost, usePublicBlogPosts } from "@/hooks/useBlogPosts";
import { useTranslation } from "@/hooks/useTranslation";

// Simple paragraph renderer — splits content on double newlines
function BlogContent({ content }: { content: string }) {
    const paragraphs = content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <div className="space-y-4 text-base text-foreground/90 leading-relaxed">
            {paragraphs.map((para, i) => {
                // Bullet list (lines starting with • or -)
                if (/^[•\-]\s/.test(para)) {
                    const items = para
                        .split(/\n/)
                        .map((l) => l.replace(/^[•\-]\s*/, "").trim())
                        .filter(Boolean);
                    return (
                        <ul key={i} className="list-disc list-inside space-y-1 pl-2">
                            {items.map((item, j) => (
                                <li key={j} className="text-foreground/85">{item}</li>
                            ))}
                        </ul>
                    );
                }
                // Heading lines (start with #)
                if (/^#{1,3}\s/.test(para)) {
                    const text = para.replace(/^#{1,3}\s/, "");
                    return <h3 key={i} className="text-lg font-bold text-foreground mt-6">{text}</h3>;
                }
                return <p key={i}>{para}</p>;
            })}
        </div>
    );
}

const TAG_COLORS: Record<string, string> = {
    default: "text-blue-600 bg-blue-50 border-blue-200",
};
const TAG_PALETTE = [
    "text-blue-600 bg-blue-50 border-blue-200",
    "text-emerald-600 bg-emerald-50 border-emerald-200",
    "text-violet-600 bg-violet-50 border-violet-200",
    "text-amber-600 bg-amber-50 border-amber-200",
    "text-rose-600 bg-rose-50 border-rose-200",
    "text-cyan-600 bg-cyan-50 border-cyan-200",
];

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { t } = useTranslation();

    const { data: post, isLoading, isError } = usePublicBlogPost(slug);

    // Fetch other posts for "Related" sidebar
    const { data: allData } = usePublicBlogPosts({ limit: 6 });
    const allPosts = Array.isArray(allData) ? allData : [];
    const related = allPosts.filter((p: any) => p.slug !== slug).slice(0, 3);

    // ── Loading ──────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading post…</p>
                </div>
            </div>
        );
    }

    // ── Not found / error ────────────────────────────────────────
    if (isError || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-4 max-w-sm">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold">Post Not Found</h2>
                    <p className="text-muted-foreground text-sm">
                        This blog post doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.push("/blog")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Button>
                </div>
            </div>
        );
    }

    const tagColor = TAG_PALETTE[
        Math.abs((post.tag || "").split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % TAG_PALETTE.length
    ];

    return (
        <div className="min-h-screen bg-muted/20 py-10 md:py-14">
            <div className="container max-w-5xl">

                {/* Back link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    {t.blog.tag}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* ── Main content ─────────────────────────────── */}
                    <article className="lg:col-span-2 space-y-6">

                        {/* Cover image */}
                        {post.coverImage && (
                            <div className="rounded-2xl overflow-hidden aspect-video bg-muted">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Tag */}
                        {post.tag && (
                            <Badge variant="outline" className={`text-xs ${tagColor}`}>
                                <Tag className="h-2.5 w-2.5 mr-1" />
                                {post.tag}
                            </Badge>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {post.authorName && (
                                <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    {post.authorName}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {new Date(post.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric", month: "long", day: "numeric",
                                })}
                            </span>
                            {post.updatedAt !== post.createdAt && (
                                <span className="flex items-center gap-1.5 text-xs">
                                    <Clock className="h-3.5 w-3.5" />
                                    Updated {new Date(post.updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/40 pl-4 italic">
                                {post.excerpt}
                            </p>
                        )}

                        <Separator />

                        {/* Body content */}
                        <BlogContent content={post.content} />
                    </article>

                    {/* ── Sidebar ──────────────────────────────────── */}
                    <aside className="space-y-6">

                        {/* About this post */}
                        <div className="rounded-2xl border bg-white p-5 space-y-4 shadow-sm">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                About this post
                            </h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                {post.tag && (
                                    <div className="flex justify-between">
                                        <span>Category</span>
                                        <span className="font-medium text-foreground">{post.tag}</span>
                                    </div>
                                )}
                                {post.authorName && (
                                    <div className="flex justify-between">
                                        <span>Author</span>
                                        <span className="font-medium text-foreground">{post.authorName}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Published</span>
                                    <span className="font-medium text-foreground">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related posts */}
                        {related.length > 0 && (
                            <div className="rounded-2xl border bg-white p-5 space-y-4 shadow-sm">
                                <h3 className="font-bold text-sm">More Articles</h3>
                                <div className="space-y-3">
                                    {related.map((r: any, i: number) => (
                                        <Link
                                            key={r.id}
                                            href={`/blog/${r.slug}`}
                                            className="block group"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {r.title}
                                                </p>
                                                {r.tag && (
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TAG_PALETTE[i % TAG_PALETTE.length]}`}>
                                                        {r.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back to blog */}
                        <Link href="/blog">
                            <Button variant="outline" className="w-full gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                All Posts
                            </Button>
                        </Link>
                    </aside>

                </div>
            </div>
        </div>
    );
}
