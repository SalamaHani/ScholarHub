"use client";

import Link from "next/link";
import { Calendar, Clock, AlertCircle, ArrowRight, CheckCircle, XCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useScholarships } from "@/hooks/useScholarships";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(deadline: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(deadline);
    due.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDeadline(deadline: string): string {
    return new Date(deadline).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
}

function getDaysConfig(days: number, closesToday: string, daysLeft: string, expiredDaysAgo: string) {
    if (days < 0)   return { label: `${Math.abs(days)}${expiredDaysAgo}`, color: "text-slate-500 bg-slate-50 border-slate-200",       border: "border-l-slate-300"    };
    if (days === 0) return { label: closesToday,                           color: "text-red-600 bg-red-50 border-red-300",             border: "border-l-red-500"      };
    if (days <= 7)  return { label: `${days}${daysLeft}`,                  color: "text-red-600 bg-red-50 border-red-200",             border: "border-l-red-400"      };
    if (days <= 14) return { label: `${days}${daysLeft}`,                  color: "text-amber-600 bg-amber-50 border-amber-200",       border: "border-l-amber-400"    };
    if (days <= 30) return { label: `${days}${daysLeft}`,                  color: "text-orange-600 bg-orange-50 border-orange-200",    border: "border-l-orange-400"   };
    return          { label: `${days}${daysLeft}`,                         color: "text-emerald-600 bg-emerald-50 border-emerald-200", border: "border-l-emerald-400"  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DeadlineSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function DeadlineCard({ scholarship }: { scholarship: any }) {
    const { t } = useTranslation();
    const days = getDaysLeft(scholarship.deadline);
    const cfg = getDaysConfig(days, t.deadlines.closesToday, t.deadlines.daysLeft, t.deadlines.expiredDaysAgo);
    const isExpired = days < 0;

    return (
        <Card className={cn("border-l-4 hover:shadow-md transition-all group", cfg.border, isExpired && "opacity-70")}>
            <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                                {scholarship.title}
                            </h3>
                            {!isExpired && days <= 7 && (
                                <Badge variant="destructive" className="text-[10px] h-4 px-1.5">{t.deadlines.urgent}</Badge>
                            )}
                            {isExpired && (
                                <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-slate-500">{t.deadlines.expired}</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{scholarship.organization}</p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {formatDeadline(scholarship.deadline)}
                            </span>
                            {scholarship.fundingType && (
                                <Badge variant="outline" className="text-[10px] h-5">{scholarship.fundingType}</Badge>
                            )}
                            {scholarship.country && (
                                <Badge variant="outline" className="text-[10px] h-5">{scholarship.country}</Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={cn("text-xs font-bold px-3 py-1 border flex items-center gap-1", cfg.color)}>
                            {isExpired
                                ? <XCircle className="h-3 w-3" />
                                : <Clock className="h-3 w-3" />}
                            {cfg.label}
                        </Badge>
                        <Link href={`/scholarships/${scholarship.id}`}>
                            <Button size="sm" variant={isExpired ? "ghost" : "outline"} className="gap-1">
                                {isExpired ? t.deadlines.view : t.deadlines.apply}
                                <ArrowRight className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <Card>
            <CardContent className="py-16 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-bold mb-1">Nothing here</h3>
                <p className="text-sm text-muted-foreground">{message}</p>
            </CardContent>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeadlinesPage() {
    const { t } = useTranslation();
    const { list } = useScholarships();
    const [search, setSearch] = useState("");
    const [tab, setTab] = useState("upcoming");

    const allScholarships: any[] = useMemo(() => {
        const raw = list.data;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw.scholarships)) return raw.scholarships;
        if (Array.isArray(raw.data)) return raw.data;
        return [];
    }, [list.data]);

    const withDeadline = useMemo(
        () => allScholarships.filter((s) => !!s.deadline),
        [allScholarships]
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return withDeadline.filter(
            (s) =>
                s.title?.toLowerCase().includes(q) ||
                s.organization?.toLowerCase().includes(q)
        );
    }, [withDeadline, search]);

    // Upcoming: sorted soonest first
    const upcoming = useMemo(
        () => filtered
            .filter((s) => getDaysLeft(s.deadline) >= 0)
            .sort((a, b) => getDaysLeft(a.deadline) - getDaysLeft(b.deadline)),
        [filtered]
    );

    // Expired: sorted most-recently-expired first
    const expired = useMemo(
        () => filtered
            .filter((s) => getDaysLeft(s.deadline) < 0)
            .sort((a, b) => getDaysLeft(b.deadline) - getDaysLeft(a.deadline)),
        [filtered]
    );

    const urgentCount = upcoming.filter((s) => getDaysLeft(s.deadline) <= 14).length;

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">

                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider">
                        <Calendar className="h-4 w-4" />
                        {t.deadlines.tag}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.deadlines.title}</h1>
                    <p className="text-muted-foreground max-w-xl">
                        {t.deadlines.desc}
                    </p>
                </div>

                {/* Urgent banner */}
                {!list.isLoading && urgentCount > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-sm font-medium">
                            <strong>{urgentCount}</strong> {t.deadlines.closingSoon}
                        </p>
                    </div>
                )}

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t.deadlines.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>

                {/* Tabs */}
                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="w-full bg-white border rounded-xl p-1 mb-6 shadow-sm">
                        <TabsTrigger value="upcoming" className="flex-1 gap-2 rounded-lg">
                            <Clock className="h-4 w-4 text-emerald-500" />
                            {t.deadlines.upcoming}
                            <Badge
                                variant={tab === "upcoming" ? "default" : "secondary"}
                                className="h-5 min-w-[20px] text-[11px] px-1.5 rounded-full"
                            >
                                {upcoming.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="expired" className="flex-1 gap-2 rounded-lg">
                            <XCircle className="h-4 w-4 text-slate-400" />
                            {t.deadlines.expired}
                            <Badge
                                variant={tab === "expired" ? "default" : "secondary"}
                                className="h-5 min-w-[20px] text-[11px] px-1.5 rounded-full"
                            >
                                {expired.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-0">
                        {list.isLoading ? (
                            <DeadlineSkeleton />
                        ) : list.isError ? (
                            <Card>
                                <CardContent className="py-16 text-center">
                                    <AlertCircle className="h-12 w-12 mx-auto text-destructive/30 mb-4" />
                                    <h3 className="text-lg font-bold mb-1">{t.deadlines.errorTitle}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        {t.deadlines.errorDesc}
                                    </p>
                                    <Button variant="outline" onClick={() => list.refetch()}>{t.deadlines.retry}</Button>
                                </CardContent>
                            </Card>
                        ) : upcoming.length === 0 ? (
                            <EmptyState
                                message={
                                    search
                                        ? t.deadlines.noUpcomingSearch
                                        : t.deadlines.noUpcoming
                                }
                            />
                        ) : (
                            <div className="space-y-3">
                                {upcoming.map((s) => <DeadlineCard key={s.id} scholarship={s} />)}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="expired" className="mt-0">
                        {list.isLoading ? (
                            <DeadlineSkeleton />
                        ) : expired.length === 0 ? (
                            <EmptyState
                                message={
                                    search
                                        ? t.deadlines.noExpiredSearch
                                        : t.deadlines.noExpired
                                }
                            />
                        ) : (
                            <div className="space-y-3">
                                {expired.map((s) => <DeadlineCard key={s.id} scholarship={s} />)}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                    <Link href="/scholarships">
                        <Button variant="outline" className="gap-2">
                            {t.deadlines.browseAll}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
