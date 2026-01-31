"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    BookOpen,
    Bookmark,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Users,
    Settings,
    Bell,
    Search,
    Filter,
    MoreVertical,
    ExternalLink,
    GraduationCap,
    Building2,
    Calendar,
    Eye,
    User,
    Loader2,
    Star,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth, User as AuthUser } from "@/hooks/use-auth";
import { useApplications } from "@/hooks/useApplications";
import { useScholarships, useScholarship } from "@/hooks/useScholarships";
import { ScholarshipForm } from "@/components/scholarships/scholarship-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Roles constant
const ROLES = {
    STUDENT: "STUDENT",
    PROFESSOR: "PROFESSOR",
    ADMIN: "ADMIN"
};

export default function DashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Determine context for scholarship hooks
    const role = user?.role?.toUpperCase() || ROLES.STUDENT;

    const { myApplications } = useApplications();

    // Professional data fetching based on role
    const {
        professorList,
        adminPendingList,
        approve,
        reject,
        remove,
        toggleFeatured
    } = useScholarships();

    const professorScholarships = Array.isArray(professorList.data)
        ? professorList.data
        : professorList.data?.scholarships || professorList.data?.data || [];

    const pendingScholarships = Array.isArray(adminPendingList.data)
        ? adminPendingList.data
        : adminPendingList.data?.scholarships || adminPendingList.data?.data || [];

    const isDataLoading = isAuthLoading || professorList.isLoading || adminPendingList.isLoading || myApplications.isLoading;

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="container px-4 py-8 md:py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-xs">
                            <LayoutDashboard className="h-4 w-4" />
                            {role} Portal
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight gradient-text">
                            {user?.name || user?.email?.split('@')[0] || "User"}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            {role === ROLES.STUDENT
                                ? "Manage your applications and find new opportunities."
                                : role === ROLES.PROFESSOR
                                    ? "Oversee your scholarship listings and evaluate student potential."
                                    : "Platform administration and system oversight."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {role === ROLES.PROFESSOR && (
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="gradient" className="gap-2 shadow-lg shadow-primary/20">
                                        <Plus className="h-4 w-4" />
                                        New Scholarship
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Post New Scholarship</DialogTitle>
                                    </DialogHeader>
                                    <ScholarshipForm
                                        onSuccess={() => {
                                            toast({ title: "Success", description: "Scholarship posted successfully!" });
                                            setIsCreateDialogOpen(false);
                                            professorList.refetch();
                                        }}
                                        onCancel={() => setIsCreateDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button variant="outline" className="bg-white gap-2 relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            Notifications
                        </Button>
                    </div>
                </div>

                {/* Role-Specific Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {role === ROLES.STUDENT ? (
                        <>
                            <StatCard label="My Applications" value={myApplications.data?.length || "0"} icon={BookOpen} color="primary" />
                            <StatCard label="In Review" value={myApplications.data?.filter((a: any) => a.status === 'PENDING').length || "0"} icon={Clock} color="warning" />
                            <StatCard label="Accepted" value={myApplications.data?.filter((a: any) => a.status === 'ACCEPTED').length || "0"} icon={CheckCircle2} color="success" />
                            <StatCard label="Recommendations" value="15" icon={Star} color="info" />
                        </>
                    ) : role === ROLES.PROFESSOR ? (
                        <>
                            <StatCard label="My Posted Hubs" value={professorScholarships.length} icon={BookOpen} color="primary" />
                            <StatCard label="Live/Active" value={professorScholarships.filter((s: any) => s.status === 'APPROVED').length} icon={CheckCircle2} color="success" />
                            <StatCard label="Under Review" value={professorScholarships.filter((s: any) => s.status === 'PENDING').length} icon={Clock} color="warning" />
                            <StatCard label="Total Reach" value={professorScholarships.reduce((acc: number, s: any) => acc + (s.views || 0), 0)} icon={Eye} color="info" />
                        </>
                    ) : (
                        <>
                            <StatCard label="Pending Approval" value={pendingScholarships.length} icon={AlertCircle} color="warning" />
                            <StatCard label="Total Listings" value="45" icon={GraduationCap} color="success" />
                            <StatCard label="Verification Queue" value="8" icon={CheckCircle2} color="info" />
                            <StatCard label="System Reports" value="2" icon={AlertCircle} color="destructive" />
                        </>
                    )}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="main" className="w-full">
                            <TabsList className="bg-white border rounded-xl p-1 h-12 mb-6">
                                <TabsTrigger value="main" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                    {role === ROLES.STUDENT ? "My Applications" : role === ROLES.PROFESSOR ? "Manage My Posts" : "Approvals Needed"}
                                </TabsTrigger>
                                {role === ROLES.STUDENT && (
                                    <TabsTrigger value="external" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                        External Scholarships
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6 font-bold">
                                    Activity
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="main" className="space-y-4 outline-none">
                                {isDataLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    </div>
                                ) : role === ROLES.STUDENT ? (
                                    <div className="space-y-4">
                                        {myApplications.data?.length ? (
                                            myApplications.data.map((app: any) => (
                                                <ApplicationRow
                                                    key={app.id}
                                                    title={app.scholarship?.title || "Scholarship"}
                                                    status={app.status}
                                                    date={new Date(app.updatedAt).toLocaleDateString()}
                                                    institution={app.scholarship?.organization || "N/A"}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-white/50">
                                                <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                                <p className="text-muted-foreground font-medium">You haven&apos;t applied for any scholarships yet.</p>
                                                <Link href="/scholarships" className="mt-4 inline-block">
                                                    <Button variant="outline" size="sm" className="font-bold">Browse Opportunities</Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : role === ROLES.PROFESSOR ? (
                                    <div className="space-y-4">
                                        {professorScholarships.length > 0 ? (
                                            professorScholarships.map((s: any) => (
                                                <ScholarshipManageRow
                                                    key={s.id}
                                                    scholarship={s}
                                                    onDelete={() => remove.mutate(s.id)}
                                                    isDeleting={remove.isPending}
                                                    onRefresh={() => professorList.refetch()}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-white/50">
                                                <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                                <p className="text-muted-foreground font-medium">You haven&apos;t posted any scholarships yet.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingScholarships.length > 0 ? (
                                            pendingScholarships.map((s: any) => (
                                                <ApprovalRequestRow
                                                    key={s.id}
                                                    scholarship={s}
                                                    onApprove={() => approve.mutate(s.id)}
                                                    onReject={() => reject.mutate(s.id)}
                                                    isProcessing={approve.isPending || reject.isPending}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-white/50">
                                                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500 mb-3" />
                                                <p className="text-muted-foreground font-medium">All caught up! No pending approvals.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="external" className="space-y-4 outline-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ExternalScholarshipCard title="GitHub Global Campus" provider="GitHub" amount="$2,000" />
                                    <ExternalScholarshipCard title="Google Generation Scholarship" provider="Google" amount="$10,000" />
                                    <ExternalScholarshipCard title="Adobe Women in Tech" provider="Adobe" amount="$25,000" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-8">
                        {/* Profile Quick Access - From Diagram */}
                        <Card className="glass border-primary/10 overflow-hidden">
                            <CardHeader className="bg-primary/5 pb-4 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Account Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary border-2 border-primary/20">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="font-bold">{user?.name || "User"}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px]">{user?.role}</Badge>
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Verified
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Link href="/profile">
                                        <Button variant="outline" className="w-full text-xs justify-start gap-2 h-9 bg-white">
                                            <Settings className="h-3.5 w-3.5" /> View Profile Details
                                        </Button>
                                    </Link>
                                    <Link href="/profile">
                                        <Button variant="outline" className="w-full text-xs justify-start gap-2 h-9 bg-white">
                                            <Eye className="h-3.5 w-3.5" /> Edit Profile Settings
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informational Card */}
                        <Card className="bg-zinc-900 text-white overflow-hidden relative group border-none shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent opacity-50" />
                            <CardHeader className="relative z-10">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Bookmark className="h-5 w-5 text-primary" />
                                    Academic Hub
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    {role === ROLES.STUDENT
                                        ? "Get professional guidance on applications."
                                        : "Tools to streamline your scholarship management."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 shadow-lg shadow-primary/20">
                                    Access Resources
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: any) {
    const colorMap: any = {
        primary: "text-primary bg-primary/10 border-primary/20",
        success: "text-emerald-600 bg-emerald-100 border-emerald-200",
        warning: "text-amber-600 bg-amber-100 border-amber-200",
        destructive: "text-rose-600 bg-rose-100 border-rose-200",
        info: "text-blue-600 bg-blue-100 border-blue-200",
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ApplicationRow({ title, status, date, institution }: any) {
    return (
        <Card className="hover:border-primary/50 transition-colors bg-white shadow-none border">
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center border shrink-0">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm line-clamp-1">{title}</h4>
                        <div className="flex items-center gap-4 mt-0.5">
                            <span className="text-xs text-muted-foreground">{institution}</span>
                            <span className="text-xs text-muted-foreground">• {date}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant={status === "Accepted" ? "success" : status === "In Review" ? "warning" : "default"}>
                        {status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ScholarshipManageRow({ scholarship, onDelete, isDeleting, onRefresh }: any) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const status = scholarship.status;

    return (
        <Card className="hover:border-primary/50 transition-colors bg-white shadow-none border group">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center border shrink-0">
                        <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {scholarship.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Updated: {new Date(scholarship.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {scholarship.views || 0} Views
                            </span>
                            <Badge
                                variant={status === "APPROVED" ? "success" : status === "PENDING" ? "warning" : "destructive"}
                                className="h-4 text-[8px] px-1"
                            >
                                {status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-bold flex-1 sm:flex-none">
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Scholarship: {scholarship.title}</DialogTitle>
                            </DialogHeader>
                            <ScholarshipForm
                                initialData={scholarship}
                                onSuccess={() => {
                                    setIsEditDialogOpen(false);
                                    if (onRefresh) onRefresh();
                                }}
                                onCancel={() => setIsEditDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 text-xs font-bold flex-1 sm:flex-none"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this scholarship?")) {
                                onDelete();
                            }
                        }}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ApprovalRequestRow({ scholarship, onApprove, onReject, isProcessing }: any) {
    return (
        <Card className="bg-white shadow-none border hover:border-primary/30 transition-all group">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{scholarship.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            By {scholarship.organization || "Private Donor"} • {scholarship.fundingType}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs font-bold text-rose-600 hover:bg-rose-50 flex-1 sm:flex-none"
                        onClick={onReject}
                        disabled={isProcessing}
                    >
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        variant="gradient"
                        className="h-8 text-xs font-bold flex-1 sm:flex-none shadow-sm"
                        onClick={onApprove}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        Approve
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function RecommendedItem({ title, type }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer p-1 rounded-lg transition-all hover:bg-muted/50">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold group-hover:text-primary transition-colors">{title}</span>
            </div>
            <Badge variant="outline" className="text-[9px] h-4 px-1">{type}</Badge>
        </div>
    );
}

function ActivityItem({ user, action, target, time }: any) {
    return (
        <div className="text-[11px] text-muted-foreground flex gap-2">
            <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-muted-foreground/30 shrink-0" />
            <span>
                <strong className="text-foreground">{user}</strong> {action} <strong className="text-primary">{target}</strong> • {time}
            </span>
        </div>
    );
}

function ArrowRight({ className }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

function ExternalScholarshipCard({ title, provider, amount }: any) {
    return (
        <Card className="bg-white border-primary/10 hover:shadow-md transition-all group">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold truncate pr-2">{title}</CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{provider}</span>
                    <span className="text-xs font-bold text-emerald-600">{amount}</span>
                </div>
            </CardContent>
        </Card>
    );
}
