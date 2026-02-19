"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Eye,
    Loader2,
    Building2,
    Calendar,
    FileText,
    GraduationCap,
    Bookmark,
    Bell,
    User,
    TrendingUp,
    ChevronRight,
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
import { useApplications } from "@/hooks/useApplications";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

function StudentSidebar({ counts }: { counts: Record<string, number> }) {
    const { t } = useTranslation();
    const pathname = usePathname();

    const STUDENT_MENU = [
        { href: "/applications", label: t.applications.title,            icon: BookOpen     },
        { href: "/scholarships",  label: t.applications.browseScholarships, icon: GraduationCap },
        { href: "/saved",         label: t.applications.savedScholarships,  icon: Bookmark     },
        { href: "/notifications", label: t.applications.notifications,    icon: Bell         },
        { href: "/deadlines",     label: t.applications.deadlines,        icon: Clock        },
        { href: "/profile",       label: t.applications.myProfile,        icon: User         },
    ];

    return (
        <aside className="w-64 shrink-0 hidden lg:block">
            <Card className="sticky top-24 border-none shadow-sm overflow-hidden">
                {/* Header */}
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

                {/* Nav links */}
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
                                        {href === "/applications" && counts.all > 0 && (
                                            <Badge className={cn("h-5 min-w-[20px] text-[10px] px-1.5 rounded-full", isActive ? "bg-white/20 text-white" : "")}>
                                                {counts.all}
                                            </Badge>
                                        )}
                                        <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity", isActive && "opacity-100")} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick stats */}
                <div className="border-t mx-2 mt-1 pt-3 pb-2 px-2">
                    <p className="text-[10px] font-bold tracking-widest text-muted-foreground mb-2 px-1">{t.applications.quickStats}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-center">
                            <p className="text-lg font-black text-amber-600">{counts.PENDING}</p>
                            <p className="text-[10px] text-amber-600/80 font-medium">{t.applications.pending}</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 text-center">
                            <p className="text-lg font-black text-emerald-600">{counts.ACCEPTED}</p>
                            <p className="text-[10px] text-emerald-600/80 font-medium">{t.applications.accepted}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
                            <p className="text-lg font-black text-blue-600">{counts.UNDER_REVIEW}</p>
                            <p className="text-[10px] text-blue-600/80 font-medium">{t.applications.inReview}</p>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 text-center">
                            <p className="text-lg font-black text-rose-600">{counts.REJECTED}</p>
                            <p className="text-[10px] text-rose-600/80 font-medium">{t.applications.rejected}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </aside>
    );
}

// ─── Tab value type ───────────────────────────────────────────────────────────
type TabValue = "all" | "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApplicationsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { myApplications } = useApplications();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [mounted, setMounted] = useState(false);

    const STATUS_TABS = [
        { value: "all" as TabValue,          label: t.applications.all,         icon: BookOpen,     color: "text-primary"     },
        { value: "PENDING" as TabValue,      label: t.applications.pending,     icon: Clock,        color: "text-amber-500"   },
        { value: "UNDER_REVIEW" as TabValue, label: t.applications.underReview, icon: AlertCircle,  color: "text-blue-500"    },
        { value: "ACCEPTED" as TabValue,     label: t.applications.accepted,    icon: CheckCircle2, color: "text-emerald-500" },
        { value: "REJECTED" as TabValue,     label: t.applications.rejected,    icon: XCircle,      color: "text-rose-500"    },
    ];

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted || isAuthLoading) return;
        if (!user) {
            router.replace("/auth/login");
        } else if (user.role !== "STUDENT") {
            router.replace("/dashboard");
        }
    }, [mounted, user, isAuthLoading, router]);

    const applications = Array.isArray(myApplications.data) ? myApplications.data : [];
    const isLoading = isAuthLoading || myApplications.isLoading;

    const byStatus = (status: string) =>
        applications.filter((a: any) => status === "all" ? true : a.status === status);

    const filtered = (status: string) =>
        byStatus(status).filter((app: any) => {
            const q = searchQuery.toLowerCase();
            return (
                app.scholarship?.title?.toLowerCase().includes(q) ||
                app.scholarship?.organization?.toLowerCase().includes(q)
            );
        });

    const counts: Record<string, number> = {
        all:          applications.length,
        PENDING:      byStatus("PENDING").length,
        UNDER_REVIEW: byStatus("UNDER_REVIEW").length,
        ACCEPTED:     byStatus("ACCEPTED").length,
        REJECTED:     byStatus("REJECTED").length,
    };

    // Show spinner until mounted (prevents SSR/client hydration mismatch)
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
                    <StudentSidebar counts={counts} />

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs mb-1">
                                <TrendingUp className="h-4 w-4" />
                                {t.applications.sectionTitle}
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
                                {t.applications.trackerTitle}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t.applications.trackerDesc}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative mb-5">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t.applications.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-white border rounded-xl p-1 mb-5 shadow-sm">
                                {STATUS_TABS.map(({ value, label, icon: Icon, color }) => (
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

                            {STATUS_TABS.map(({ value }) => (
                                <TabsContent key={value} value={value} className="mt-0 focus-visible:ring-0">
                                    <ApplicationList
                                        applications={filtered(value)}
                                        isLoading={isLoading}
                                        totalUnfiltered={applications.length}
                                        searchQuery={searchQuery}
                                    />
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Application List ─────────────────────────────────────────────────────────
function ApplicationList({
    applications,
    isLoading,
    totalUnfiltered,
    searchQuery,
}: {
    applications: any[];
    isLoading: boolean;
    totalUnfiltered: number;
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
                                    <Skeleton className="h-3 w-40" />
                                </div>
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <Card>
                <CardContent className="py-16 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold mb-2">{t.applications.noApplicationsTitle}</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                        {totalUnfiltered === 0
                            ? t.applications.noApplicationsYet
                            : searchQuery
                                ? t.applications.noApplicationsSearch
                                : t.applications.noApplicationsCategory}
                    </p>
                    {totalUnfiltered === 0 && (
                        <Link href="/scholarships">
                            <Button>{t.applications.browseScholarships}</Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {applications.map((app: any) => (
                <ApplicationCard key={app.id} application={app} />
            ))}
        </div>
    );
}

// ─── Application Card ─────────────────────────────────────────────────────────
function ApplicationCard({ application }: { application: any }) {
    const { t } = useTranslation();

    const STATUS_CONFIG: Record<string, { label: string; icon: any; badge: any; border: string }> = {
        PENDING:      { label: t.applications.pending,     icon: Clock,        badge: "secondary",   border: "border-l-amber-400"   },
        UNDER_REVIEW: { label: t.applications.underReview, icon: AlertCircle,  badge: "warning",     border: "border-l-blue-500"    },
        ACCEPTED:     { label: t.applications.accepted,    icon: CheckCircle2, badge: "success",     border: "border-l-emerald-500" },
        REJECTED:     { label: t.applications.rejected,    icon: XCircle,      badge: "destructive", border: "border-l-rose-500"    },
        DRAFT:        { label: t.applications.draft,       icon: FileText,     badge: "outline",     border: "border-l-slate-400"   },
        WITHDRAWN:    { label: t.applications.withdrawn,   icon: XCircle,      badge: "outline",     border: "border-l-slate-400"   },
    };

    const cfg = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.DRAFT;
    const StatusIcon = cfg.icon;

    return (
        <Card className={cn("border-l-4 hover:shadow-md transition-all group", cfg.border)}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                                {application.scholarship?.title || "Scholarship"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                {application.scholarship?.organization || "Organization"}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {t.applications.applied} {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {t.applications.updated} {new Date(application.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant={cfg.badge as any} className="gap-1 whitespace-nowrap">
                            <StatusIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                        </Badge>
                        <Link href={`/applications/${application.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                                <Eye className="h-3.5 w-3.5" />
                                {t.applications.viewDetails}
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
