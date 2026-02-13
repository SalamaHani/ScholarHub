"use client";

import { useState } from "react";
import { ScholarshipCard, SearchFilters } from "@/components/scholarships";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useScholarships } from "@/hooks/useScholarships";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScholarshipForm } from "@/components/scholarships";
import { Plus } from "lucide-react";

export default function ScholarshipsClient() {
    const [page, setPage] = useState(1);
    const initialFilters = {
        search: "",
        country: "",
        degreeLevel: "",
        fundingType: "",
        fieldOfStudy: "",
    };
    const [filters, setFilters] = useState(initialFilters);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

    const { list } = useScholarships({
        page,
        limit: 9,
        search: filters.search,
        country: filters.country || undefined,
        degreeLevel: filters.degreeLevel || undefined,
        fundingType: filters.fundingType || undefined,
        category: filters.fieldOfStudy || undefined,
    });

    const handleSearch = (query: string) => {
        setFilters((prev) => ({ ...prev, search: query }));
        setPage(1);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setPage(1);
    };

    const rawData = list.data;
    const scholarships = Array.isArray(rawData)
        ? rawData
        : (rawData?.scholarships || rawData?.data || []);
    const pagination = list.data?.pagination || { totalPages: 1, currentPage: 1, totalItems: scholarships.length };

    return (
        <div className="py-8 md:py-12">
            <div className="container space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <BookOpen className="h-3 w-3" />
                                Scholarships
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Browse Scholarships
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Discover {pagination.totalItems || "..."} scholarship opportunities from prestigious
                            institutions around the world. Use the filters below to find scholarships
                            that match your profile.
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <SearchFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

                {/* Results */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <p className="text-sm text-muted-foreground font-medium">
                            {list.isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading scholarships...
                                </span>
                            ) : (
                                <>
                                    Showing <span className="font-semibold text-foreground">{scholarships.length}</span> of <span className="font-semibold text-foreground">{pagination.totalItems}</span> scholarships
                                </>
                            )}
                        </p>
                    </div>

                    {/* Scholarships Grid */}
                    {list.isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[300px] bg-zinc-100 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : scholarships.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {scholarships.map((scholarship: any, index: number) => (
                                <ScholarshipCard
                                    key={scholarship.id}
                                    scholarship={scholarship}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4 border-2 border-dashed rounded-2xl">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
                                <BookOpen className="h-6 w-6 text-zinc-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">No scholarships found</h3>
                                <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                    Try adjusting your search or filters to find what you&apos;re looking for.
                                </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => {
                                setFilters(initialFilters);
                                setPage(1);
                            }}>
                                Reset all filters
                            </Button>
                        </div>
                    )}

                    {/* Professional Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-8 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || list.isLoading}
                                className="h-9 px-3"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <div className="hidden sm:flex items-center gap-1">
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Logic to show limited page numbers if there are too many
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.totalPages ||
                                        (pageNum >= page - 1 && pageNum <= page + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? "default" : "ghost"}
                                                size="sm"
                                                onClick={() => setPage(pageNum)}
                                                disabled={list.isLoading}
                                                className="h-9 w-9 p-0 font-bold"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    } else if (
                                        pageNum === page - 2 ||
                                        pageNum === page + 2
                                    ) {
                                        return <span key={pageNum} className="px-1 text-muted-foreground">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages || list.isLoading}
                                className="h-9 px-3"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
