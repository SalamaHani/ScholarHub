import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
    {
        slug: "how-to-write-winning-personal-statement",
        title: "How to Write a Winning Personal Statement",
        excerpt:
            "Your personal statement is your chance to shine beyond grades and test scores. Learn the key elements that scholarship committees look for and how to tell your unique story.",
        category: "Application Tips",
        date: "January 15, 2026",
        readTime: "6 min read",
        color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
        slug: "top-fully-funded-scholarships-2026",
        title: "Top 10 Fully Funded Scholarships for Gaza Students in 2026",
        excerpt:
            "A curated list of the best fully funded scholarship opportunities available to students from Gaza this year, with deadlines, eligibility, and application tips.",
        category: "Scholarship Lists",
        date: "January 8, 2026",
        readTime: "8 min read",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
        slug: "ielts-preparation-guide",
        title: "IELTS Preparation Guide for Scholarship Applicants",
        excerpt:
            "Many international scholarships require English proficiency. This guide covers proven study strategies, free resources, and tips to achieve your target IELTS score.",
        category: "Language Prep",
        date: "December 28, 2025",
        readTime: "5 min read",
        color: "text-violet-600 bg-violet-50 border-violet-200",
    },
    {
        slug: "recommendation-letter-tips",
        title: "How to Get Outstanding Recommendation Letters",
        excerpt:
            "A strong recommendation letter can be the difference between acceptance and rejection. Learn how to choose the right recommenders and help them write compelling letters.",
        category: "Application Tips",
        date: "December 20, 2025",
        readTime: "4 min read",
        color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
        slug: "scholarship-interview-preparation",
        title: "Scholarship Interview: How to Prepare and Impress",
        excerpt:
            "Receiving an interview invitation is a great sign. This guide walks you through common questions, preparation techniques, and how to present yourself confidently.",
        category: "Interview Prep",
        date: "December 10, 2025",
        readTime: "7 min read",
        color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
        slug: "managing-multiple-applications",
        title: "How to Manage Multiple Scholarship Applications",
        excerpt:
            "Applying to multiple scholarships can be overwhelming. Discover organizational strategies, tools, and a timeline approach to keep everything on track.",
        category: "Strategy",
        date: "November 30, 2025",
        readTime: "5 min read",
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="mb-12 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider">
                        <BookOpen className="h-4 w-4" />
                        SCHOLARHUB BLOG
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Insights & Resources
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Guides, scholarship lists, and expert advice to help you succeed in your
                        scholarship journey.
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
                                        Read more <ArrowRight className="h-3 w-3 ml-1" />
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
