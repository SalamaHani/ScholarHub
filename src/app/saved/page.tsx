"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Bookmark, GraduationCap, ArrowRight, Loader2, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSavedScholarships } from "@/hooks/useSavedScholarships";
import { SavedScholarshipListSkeleton } from "@/components/skeletons";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function SavedPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { list, remove } = useSavedScholarships();

    // Student-only: redirect non-students and unauthenticated users
    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.replace("/auth/login");
        } else if (user.role !== "STUDENT") {
            router.replace("/dashboard");
        }
    }, [user, isAuthLoading, router]);

    // Show spinner while loading auth or while redirect is pending
    if (isAuthLoading || !user || user.role !== "STUDENT") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const savedScholarships = Array.isArray(list.data) ? list.data : [];

    return (
        <div className="py-8 md:py-12">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-[10px]">
                        <Bookmark className="h-4 w-4" />
                        My Bookmarks
                    </div>
                    <h1 className="text-4xl font-black tracking-tight gradient-text">
                        Saved Scholarships
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Keep track of scholarships you&apos;re interested in. Save them here
                        and never miss an application deadline.
                    </p>
                </div>

                {/* List */}
                {list.isLoading ? (
                    <SavedScholarshipListSkeleton count={5} />
                ) : savedScholarships.length > 0 ? (
                    <div className="grid gap-4">
                        {savedScholarships.map((scholarship: any) => (
                            <Card
                                key={scholarship.id}
                                className="hover:border-primary/50 transition-all bg-white group shadow-sm"
                            >
                                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center border shrink-0">
                                            <Building2 className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                                {scholarship.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                <span className="font-medium">
                                                    {scholarship.organization || "Academic Institution"}
                                                </span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-[10px] h-5 bg-muted/50">
                                                    {scholarship.type || "Full Funding"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Link
                                            href={`/scholarships/${scholarship.id}`}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full h-10 font-bold border-muted-foreground/20"
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 text-destructive hover:bg-destructive/5"
                                            onClick={() => remove.mutate(scholarship.id)}
                                            disabled={remove.isPending}
                                            title="Remove from saved"
                                        >
                                            {remove.isPending ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 border-2 border-dashed rounded-3xl">
                        <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                            <GraduationCap className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tight">
                            Your bookmark list is empty
                        </h2>
                        <p className="text-muted-foreground max-w-md mb-8 px-4">
                            You haven&apos;t saved any scholarships yet. Browse available
                            opportunities and click the bookmark icon to save them for later.
                        </p>
                        <Link href="/scholarships">
                            <Button
                                variant="gradient"
                                size="lg"
                                className="gap-2 font-bold px-8 shadow-xl shadow-primary/20"
                            >
                                Browse Scholarships
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
