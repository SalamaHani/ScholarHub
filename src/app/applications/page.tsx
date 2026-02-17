"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useApplications } from "@/hooks/useApplications";

export default function ApplicationsPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { myApplications } = useApplications();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Student-only: redirect non-students and unauthenticated users
    React.useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            router.replace("/auth/login");
        } else if (user.role !== "STUDENT") {
            router.replace("/dashboard");
        }
    }, [user, isAuthLoading, router]);

    const applications = Array.isArray(myApplications.data) ? myApplications.data : [];
    const isLoading = isAuthLoading || myApplications.isLoading;

    // Filter applications
    const filteredApplications = applications.filter((app: any) => {
        const matchesSearch =
            app.scholarship?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.scholarship?.organization?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || app.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const stats = {
        total: applications.length,
        pending: applications.filter((a: any) => a.status === "PENDING").length,
        underReview: applications.filter((a: any) => a.status === "UNDER_REVIEW").length,
        accepted: applications.filter((a: any) => a.status === "ACCEPTED").length,
        rejected: applications.filter((a: any) => a.status === "REJECTED").length,
    };

    // Show spinner while loading or while redirect is pending
    if (isAuthLoading || !user || user.role !== "STUDENT") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="container px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs mb-2">
                        <BookOpen className="h-4 w-4" />
                        MY APPLICATIONS
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight gradient-text mb-2">
                        Application Tracker
                    </h1>
                    <p className="text-muted-foreground">
                        Track the status of all your scholarship applications in one place.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <StatCard label="Total"       value={stats.total}       icon={BookOpen}     color="primary"     />
                    <StatCard label="Pending"     value={stats.pending}     icon={Clock}        color="warning"     />
                    <StatCard label="Under Review" value={stats.underReview} icon={AlertCircle}  color="info"        />
                    <StatCard label="Accepted"    value={stats.accepted}    icon={CheckCircle2} color="success"     />
                    <StatCard label="Rejected"    value={stats.rejected}    icon={XCircle}      color="destructive" />
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by scholarship name or organization..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {(["all", "PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"] as const).map((s) => (
                                    <Button
                                        key={s}
                                        variant={filterStatus === s ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setFilterStatus(s)}
                                    >
                                        {s === "all" ? "All" : s === "UNDER_REVIEW" ? "Review" : s.charAt(0) + s.slice(1).toLowerCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications List */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-bold mb-2">No Applications Found</h3>
                            <p className="text-muted-foreground mb-6">
                                {applications.length === 0
                                    ? "You haven't applied to any scholarships yet."
                                    : "No applications match your search criteria."}
                            </p>
                            {applications.length === 0 && (
                                <Link href="/scholarships">
                                    <Button>Browse Scholarships</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app: any) => (
                            <ApplicationCard key={app.id} application={app} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    const colorMap: any = {
        primary:     "text-primary bg-primary/10 border-primary/20",
        success:     "text-emerald-600 bg-emerald-100 border-emerald-200",
        warning:     "text-amber-600 bg-amber-100 border-amber-200",
        destructive: "text-rose-600 bg-rose-100 border-rose-200",
        info:        "text-blue-600 bg-blue-100 border-blue-200",
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ApplicationCard({ application }: { application: any }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACCEPTED":    return "success";
            case "REJECTED":    return "destructive";
            case "UNDER_REVIEW": return "warning";
            case "PENDING":     return "secondary";
            default:            return "default";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACCEPTED":    return <CheckCircle2 className="h-4 w-4" />;
            case "REJECTED":    return <XCircle className="h-4 w-4" />;
            case "UNDER_REVIEW": return <AlertCircle className="h-4 w-4" />;
            case "PENDING":     return <Clock className="h-4 w-4" />;
            default:            return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Building2 className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                {application.scholarship?.title || "Scholarship"}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                {application.scholarship?.organization || "Organization"}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Updated: {new Date(application.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <Badge variant={getStatusColor(application.status)} className="gap-1">
                            {getStatusIcon(application.status)}
                            {application.status.replace(/_/g, " ")}
                        </Badge>
                        <Link href={`/applications/${application.id}`}>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Eye className="h-3 w-3" />
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
