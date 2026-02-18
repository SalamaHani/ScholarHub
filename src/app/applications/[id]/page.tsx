"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplication } from "@/hooks/useApplications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PageProps {
    params: { id: string };
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function ApplicationDetailSkeleton() {
    return (
        <div className="min-h-screen bg-muted/20 py-8 md:py-12">
            <div className="container max-w-3xl space-y-6">
                {/* Back button */}
                <Skeleton className="h-8 w-36" />

                {/* Header card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <div className="flex gap-2 pt-1">
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline card */}
                <Card>
                    <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-20" />
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4">
                            {[0, 1].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Status card */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-36 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ApplicationDetailPage({ params }: PageProps) {
    const { id } = params;
    const { data: application, isLoading, isFetching, isError, error } = useApplication(id);

    // Show skeleton while loading (first fetch or refetch with no cached data)
    if (isLoading || (isFetching && !application)) {
        return <ApplicationDetailSkeleton />;
    }

    // Error or truly not found
    if (isError || !application || !application.id) {
        const httpStatus = (error as any)?.response?.status;
        const is403 = httpStatus === 403;
        const is404 = httpStatus === 404 || !application || !application?.id;

        const errorTitle = is403
            ? "Access Denied"
            : "Application Not Found";

        const errorDescription = is403
            ? "You don't have permission to view this application. It may belong to another user."
            : "This application doesn't exist or may have been removed. Double-check the link and try again.";

        const errorCode = is403 ? "403" : "404";

        return (
            <div className="min-h-screen bg-muted/20 py-8 md:py-12">
                <div className="container max-w-3xl">
                    {/* Back */}
                    <div className="mb-6">
                        <Link href="/applications">
                            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="h-4 w-4" />
                                My Applications
                            </Button>
                        </Link>
                    </div>

                    <Card className="border-none shadow-md overflow-hidden">
                        {/* Colored top bar */}
                        <div className={cn("h-1.5 w-full", is403 ? "bg-amber-400" : "bg-rose-400")} />

                        <CardContent className="py-16 px-8 flex flex-col items-center text-center gap-6">
                            {/* Error code badge */}
                            <div className={cn(
                                "h-20 w-20 rounded-2xl flex items-center justify-center border-2",
                                is403
                                    ? "bg-amber-50 border-amber-200"
                                    : "bg-rose-50 border-rose-200"
                            )}>
                                <span className={cn(
                                    "text-2xl font-black tracking-tight",
                                    is403 ? "text-amber-500" : "text-rose-500"
                                )}>
                                    {errorCode}
                                </span>
                            </div>

                            {/* Text */}
                            <div className="space-y-2 max-w-sm">
                                <h2 className="text-2xl font-extrabold tracking-tight">
                                    {errorTitle}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {errorDescription}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="w-full max-w-xs border-t border-dashed" />

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                                <Link href="/applications" className="flex-1">
                                    <Button variant="default" className="w-full gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        My Applications
                                    </Button>
                                </Link>
                                <Link href="/scholarships" className="flex-1">
                                    <Button variant="outline" className="w-full gap-2">
                                        <FileText className="h-4 w-4" />
                                        Browse Scholarships
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // ─── Status config ──────────────────────────────────────────────────────
    const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
        PENDING: {
            label: "Pending",
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-200",
        },
        UNDER_REVIEW: {
            label: "Under Review",
            icon: AlertCircle,
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-200",
        },
        ACCEPTED: {
            label: "Accepted",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-200",
        },
        REJECTED: {
            label: "Rejected",
            icon: XCircle,
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-200",
        },
        DRAFT: {
            label: "Draft",
            icon: FileText,
            color: "text-slate-600",
            bg: "bg-slate-50 border-slate-200",
        },
        WITHDRAWN: {
            label: "Withdrawn",
            icon: XCircle,
            color: "text-slate-600",
            bg: "bg-slate-50 border-slate-200",
        },
    };

    const status = statusConfig[application.status] ?? statusConfig.PENDING;

    // Safe date helpers — return fallback string if value is missing or invalid
    const safeDate = (value: any, fallback = "—"): string => {
        if (!value) return fallback;
        const d = new Date(value);
        return isNaN(d.getTime()) ? fallback : d.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
        });
    };

    const safeDistance = (value: any, fallback = "—"): string => {
        if (!value) return fallback;
        const d = new Date(value);
        return isNaN(d.getTime()) ? fallback : formatDistanceToNow(d, { addSuffix: true });
    };
    const StatusIcon = status.icon;

    const statusMessage: Record<string, string> = {
        PENDING:      "Your application has been submitted and is waiting to be reviewed.",
        UNDER_REVIEW: "Your application is currently being reviewed by the scholarship committee.",
        ACCEPTED:     "Congratulations! Your application has been accepted.",
        REJECTED:     "Unfortunately your application was not selected this time. Keep applying!",
        DRAFT:        "This application is saved as a draft and has not been submitted yet.",
        WITHDRAWN:    "This application has been withdrawn.",
    };

    return (
        <div className="min-h-screen bg-muted/20 py-8 md:py-12">
            <div className="container max-w-3xl">

                {/* Back */}
                <div className="mb-6">
                    <Link href="/applications">
                        <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            My Applications
                        </Button>
                    </Link>
                </div>

                {/* Header card */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                                <Building2 className="h-7 w-7 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold leading-snug mb-1">
                                    {application.scholarship?.title ?? "Scholarship"}
                                </h1>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {application.scholarship?.organization ?? "Organization"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn("gap-1.5 text-xs font-semibold border", status.bg, status.color)}
                                    >
                                        <StatusIcon className="h-3.5 w-3.5" />
                                        {status.label}
                                    </Badge>
                                    {application.scholarship?.type && (
                                        <Badge variant="secondary" className="text-xs">
                                            {application.scholarship.type}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted shrink-0">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Submitted</p>
                                    <p className="text-sm font-semibold">{safeDate(application.createdAt)}</p>
                                    <p className="text-xs text-muted-foreground">{safeDistance(application.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted shrink-0">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="text-sm font-semibold">{safeDate(application.updatedAt)}</p>
                                    <p className="text-xs text-muted-foreground">{safeDistance(application.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status card */}
                <Card className={cn("mb-6 border-l-4", {
                    "border-l-amber-400":   application.status === "PENDING",
                    "border-l-blue-500":    application.status === "UNDER_REVIEW",
                    "border-l-emerald-500": application.status === "ACCEPTED",
                    "border-l-rose-500":    application.status === "REJECTED",
                    "border-l-slate-400":
                        application.status === "DRAFT" || application.status === "WITHDRAWN",
                })}>
                    <CardContent className="p-5">
                        <div className={cn("flex items-start gap-3", status.color)}>
                            <StatusIcon className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{status.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {statusMessage[application.status] ?? ""}
                                </p>
                                {application.evaluation && (
                                    <>
                                        <Separator className="my-3" />
                                        <p className="text-xs font-semibold text-foreground">Reviewer Notes</p>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {application.evaluation}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    {application.scholarship?.id && (
                        <Link href={`/scholarships/${application.scholarship.id}`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                View Scholarship
                            </Button>
                        </Link>
                    )}
                    <Link href="/applications">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            All Applications
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
