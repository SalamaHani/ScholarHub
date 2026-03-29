"use client";

import React, { useState, useEffect } from "react";
import {
    Video,
    Phone,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Loader2,
    Building2,
    Calendar,
    GraduationCap,
    Bookmark,
    Bell,
    User,
    BookOpen,
    ChevronRight,
    ExternalLink,
    Timer,
    MessageSquare,
    CalendarClock,
    Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useMyInterviews, type Interview, type InterviewStatus } from "@/hooks/useInterviews";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

// ─────────────────────────────────────────────────────────────────────────────
// Platform config
// ─────────────────────────────────────────────────────────────────────────────

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
    const cls = cn("h-4 w-4 shrink-0", className);
    if (platform === "PHONE")     return <Phone     className={cls} />;
    if (platform === "IN_PERSON") return <MapPin    className={cls} />;
    return <Video className={cls} />;
}

function platformLabel(platform: string, t: any): string {
    const map: Record<string, string> = {
        ZOOM:              t.interviews.zoom,
        GOOGLE_MEET:       t.interviews.googleMeet,
        MICROSOFT_TEAMS:   t.interviews.teams,
        PHONE:             t.interviews.phone,
        IN_PERSON:         t.interviews.inPerson,
    };
    return map[platform] ?? platform;
}

function platformColor(platform: string): string {
    const map: Record<string, string> = {
        ZOOM:            "text-blue-600 bg-blue-50 border-blue-200",
        GOOGLE_MEET:     "text-green-600 bg-green-50 border-green-200",
        MICROSOFT_TEAMS: "text-violet-600 bg-violet-50 border-violet-200",
        PHONE:           "text-amber-600 bg-amber-50 border-amber-200",
        IN_PERSON:       "text-rose-600 bg-rose-50 border-rose-200",
    };
    return map[platform] ?? "text-muted-foreground bg-muted border-border";
}

// ─────────────────────────────────────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────────────────────────────────────

function statusConfig(status: InterviewStatus, t: any) {
    const map: Record<InterviewStatus, { label: string; icon: any; border: string; badge: string }> = {
        SCHEDULED:  { label: t.interviews.scheduled,  icon: CalendarClock, border: "border-l-blue-500",    badge: "bg-blue-100 text-blue-700 border-blue-200"    },
        COMPLETED:  { label: t.interviews.completed,  icon: CheckCircle2,  border: "border-l-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        CANCELLED:  { label: t.interviews.cancelled,  icon: XCircle,       border: "border-l-rose-500",    badge: "bg-rose-100 text-rose-700 border-rose-200"    },
        NO_SHOW:    { label: t.interviews.noShow,      icon: AlertCircle,   border: "border-l-amber-500",   badge: "bg-amber-100 text-amber-700 border-amber-200"  },
    };
    return map[status] ?? map.SCHEDULED;
}

function formatDateTime(iso: string) {
    try {
        const d = new Date(iso);
        return {
            date: d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" }),
            time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
        };
    } catch {
        return { date: iso, time: "" };
    }
}

function isUpcoming(interview: Interview) {
    return interview.status === "SCHEDULED" && new Date(interview.scheduledAt) > new Date();
}

// ─────────────────────────────────────────────────────────────────────────────
// Student Sidebar — matches the applications page pattern
// ─────────────────────────────────────────────────────────────────────────────

function StudentSidebar({ interviewCount }: { interviewCount: number }) {
    const { t } = useTranslation();
    const pathname = usePathname();

    const STUDENT_MENU = [
        { href: "/applications", label: t.applications.title,              icon: BookOpen      },
        { href: "/interviews",   label: t.interviews.title,                icon: CalendarClock },
        { href: "/scholarships", label: t.applications.browseScholarships, icon: GraduationCap },
        { href: "/saved",        label: t.applications.savedScholarships,  icon: Bookmark      },
        { href: "/notifications",label: t.applications.notifications,      icon: Bell          },
        { href: "/deadlines",    label: t.applications.deadlines,          icon: Clock         },
        { href: "/profile",      label: t.applications.myProfile,          icon: User          },
    ];

    return (
        <aside className="w-64 shrink-0 hidden lg:block">
            <Card className="sticky top-24 border-none shadow-sm overflow-hidden">
                <div className="bg-primary/5 border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs font-bold tracking-wider text-primary uppercase">
                            {t.applications.menuTitle}
                        </span>
                    </div>
                </div>
                <nav className="p-2">
                    {STUDENT_MENU.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link key={href} href={href}>
                                <div className={cn(
                                    "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}>
                                    <div className="flex items-center gap-2.5">
                                        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                                        <span>{label}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {href === "/interviews" && interviewCount > 0 && (
                                            <Badge className={cn("h-5 min-w-[20px] text-[10px] px-1.5 rounded-full", isActive ? "bg-white/20 text-white" : "")}>
                                                {interviewCount}
                                            </Badge>
                                        )}
                                        <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </Card>
        </aside>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

type TabValue = "all" | "upcoming" | "COMPLETED" | "CANCELLED";

export default function InterviewsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data, isLoading: isInterviewsLoading, isError } = useMyInterviews();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabValue>("all");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted || isAuthLoading) return;
        if (!user) {
            router.replace("/auth/login");
        } else if (user.role !== "STUDENT") {
            router.replace("/dashboard");
        }
    }, [mounted, user, isAuthLoading, router]);

    const interviews: Interview[] = Array.isArray(data) ? data : [];
    const isLoading = isAuthLoading || isInterviewsLoading;

    const TABS: { value: TabValue; label: string; icon: any; color: string }[] = [
        { value: "all",       label: t.interviews.all,       icon: CalendarClock, color: "text-primary"     },
        { value: "upcoming",  label: t.interviews.upcoming,  icon: Clock,         color: "text-blue-500"    },
        { value: "COMPLETED", label: t.interviews.completed, icon: CheckCircle2,  color: "text-emerald-500" },
        { value: "CANCELLED", label: t.interviews.cancelled, icon: XCircle,       color: "text-rose-500"    },
    ];

    function filterByTab(tab: TabValue): Interview[] {
        if (tab === "all")      return interviews;
        if (tab === "upcoming") return interviews.filter(isUpcoming);
        return interviews.filter((i) => i.status === tab);
    }

    function applySearch(list: Interview[]): Interview[] {
        const q = searchQuery.toLowerCase();
        if (!q) return list;
        return list.filter((i) =>
            i.application?.scholarship?.title?.toLowerCase().includes(q) ||
            i.application?.scholarship?.organization?.toLowerCase().includes(q)
        );
    }

    const counts: Record<TabValue, number> = {
        all:       interviews.length,
        upcoming:  interviews.filter(isUpcoming).length,
        COMPLETED: interviews.filter((i) => i.status === "COMPLETED").length,
        CANCELLED: interviews.filter((i) => i.status === "CANCELLED").length,
    };

    if (!mounted || isAuthLoading || !user || user.role !== "STUDENT") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="container px-4 py-8 md:py-12">
                <div className="flex gap-8 items-start">

                    {/* Sidebar */}
                    <StudentSidebar interviewCount={counts.upcoming} />

                    {/* Main */}
                    <div className="flex-1 min-w-0">

                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs mb-1">
                                <CalendarClock className="h-4 w-4" />
                                {t.interviews.sectionTag}
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                                {t.interviews.title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t.interviews.desc}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative mb-5">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t.interviews.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>

                        {/* Error */}
                        {isError && (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <AlertCircle className="h-10 w-10 mx-auto text-destructive/50 mb-3" />
                                    <p className="font-semibold">{t.interviews.errorTitle}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{t.interviews.errorDesc}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tabs */}
                        {!isError && (
                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                                <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-white border rounded-xl p-1 mb-5 shadow-sm">
                                    {TABS.map(({ value, label, icon: Icon, color }) => (
                                        <TabsTrigger
                                            key={value}
                                            value={value}
                                            className={cn(
                                                "flex-1 min-w-[70px] gap-1.5 rounded-lg text-sm font-medium py-2",
                                                "data-[state=active]:shadow-sm",
                                                activeTab === value && color
                                            )}
                                        >
                                            <Icon className={cn("h-4 w-4", color)} />
                                            <span className="hidden sm:inline">{label}</span>
                                            <Badge
                                                variant={activeTab === value ? "default" : "secondary"}
                                                className="ml-0.5 h-5 min-w-[20px] text-[11px] rounded-full px-1.5"
                                            >
                                                {counts[value]}
                                            </Badge>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {TABS.map(({ value }) => (
                                    <TabsContent key={value} value={value} className="mt-0 focus-visible:ring-0">
                                        <InterviewList
                                            interviews={applySearch(filterByTab(value))}
                                            isLoading={isLoading}
                                            totalCount={interviews.length}
                                            searchQuery={searchQuery}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview List
// ─────────────────────────────────────────────────────────────────────────────

function InterviewList({
    interviews,
    isLoading,
    totalCount,
    searchQuery,
}: {
    interviews: Interview[];
    isLoading: boolean;
    totalCount: number;
    searchQuery: string;
}) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (interviews.length === 0) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{t.interviews.noInterviewsTitle}</h3>
                    <p className="text-muted-foreground text-sm">
                        {totalCount === 0
                            ? t.interviews.noInterviewsDesc
                            : searchQuery
                                ? t.interviews.noInterviewsFilter
                                : t.interviews.noInterviewsFilter}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {interviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview Card
// ─────────────────────────────────────────────────────────────────────────────

function InterviewCard({ interview }: { interview: Interview }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const cfg = statusConfig(interview.status, t);
    const StatusIcon = cfg.icon;
    const { date, time } = formatDateTime(interview.scheduledAt);
    const scholarship = interview.application?.scholarship;
    const studentEmail = interview.application?.user?.email ?? user?.email;
    const upcoming = isUpcoming(interview);

    return (
        <Card className={cn("border-l-4 hover:shadow-md transition-all group", cfg.border)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">

                    {/* Left: icon + info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center border-2 shrink-0 transition-colors",
                            upcoming
                                ? "bg-primary/10 border-primary/20 group-hover:bg-primary/20"
                                : "bg-muted/60 border-border"
                        )}>
                            <PlatformIcon
                                platform={interview.platform}
                                className={upcoming ? "text-primary" : "text-muted-foreground"}
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Scholarship name */}
                            <h3 className="font-bold text-base mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                                {scholarship?.title ?? "Interview"}
                            </h3>

                            {/* Organization */}
                            {scholarship?.organization && (
                                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                                    <Building2 className="h-3 w-3 shrink-0" />
                                    {scholarship.organization}
                                </p>
                            )}

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                {/* Date + time */}
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {date}
                                    {time && <span className="font-medium text-foreground">{time}</span>}
                                </span>

                                {/* Duration */}
                                {interview.duration && (
                                    <span className="flex items-center gap-1">
                                        <Timer className="h-3 w-3" />
                                        {interview.duration} {t.interviews.minutes}
                                    </span>
                                )}

                                {/* Platform badge */}
                                <span className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium",
                                    platformColor(interview.platform)
                                )}>
                                    <PlatformIcon platform={interview.platform} className="h-3 w-3" />
                                    {platformLabel(interview.platform, t)}
                                </span>
                            </div>

                            {/* Email */}
                            {studentEmail && (
                                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="h-3 w-3 shrink-0" />
                                    <span>{studentEmail}</span>
                                </p>
                            )}

                            {/* Notes */}
                            {interview.notes && (
                                <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1.5">
                                    <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">{interview.notes}</span>
                                </p>
                            )}

                            {/* Cancel reason */}
                            {interview.status === "CANCELLED" && interview.cancelReason && (
                                <p className="mt-2 text-xs text-rose-600 flex items-start gap-1.5">
                                    <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                    <span>{interview.cancelReason}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: status badge + join button */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={cn(
                            "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                            cfg.badge
                        )}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                        </span>

                        {upcoming && interview.meetingLink && (
                            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="gap-1.5 h-8 text-xs">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    {t.interviews.joinBtn}
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
