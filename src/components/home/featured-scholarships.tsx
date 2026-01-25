"use client";

import { useScholarships } from "@/hooks/useScholarships";
import { ScholarshipCard } from "@/components/scholarships";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeaturedScholarships() {
    const { list } = useScholarships({
        featured: true,
        limit: 3,
    });
    const rawData = list.data;
    const scholarships = Array.isArray(rawData)
        ? rawData
        : (rawData?.scholarships || rawData?.data || []);

    if (list.isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[300px] bg-white/50 border rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (scholarships.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-white/50">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No featured scholarships available at the moment.</p>
                <Link href="/scholarships" className="inline-block mt-4">
                    <Button variant="outline" size="sm">Browse all scholarships</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship: any, index: number) => (
                <ScholarshipCard
                    key={scholarship.id}
                    scholarship={{
                        ...scholarship,
                        isFeatured: true, // Force star icon visibility
                    }}
                    index={index}
                />
            ))}
        </div>
    );
}
