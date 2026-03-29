"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
    Trash2,
    MessageSquare,
    CheckCircle,
    Pencil,
    Send,
    Download,
    FileText,
    Mail,
    Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, User as AuthUser } from "@/hooks/use-auth";
import { useApplications } from "@/hooks/useApplications";
import { useScholarships, useScholarship } from "@/hooks/useScholarships";
import { useTestimonials } from "@/hooks/useTestimonials";
import { ScholarshipForm } from "@/components/scholarships/scholarship-form";
import { TestimonialForm } from "@/components/testimonials/testimonial-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DashboardSkeleton, ApplicationTableSkeleton } from "@/components/skeletons";
import { useTranslation } from "@/hooks/useTranslation";
import { useInterviews, type InterviewPlatform } from "@/hooks/useInterviews";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Roles constant
const ROLES = {
    STUDENT: "STUDENT",
    PROFESSOR: "PROFESSOR",
    ADMIN: "ADMIN"
};

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreateTestimonialOpen, setIsCreateTestimonialOpen] = useState(false);
    const { t } = useTranslation();

    // Determine context for scholarship hooks
    const role = user?.role?.toUpperCase() || ROLES.STUDENT;

    const { myApplications, evaluate } = useApplications();
    const { list: testimonialsList, create: createTestimonial, update: updateTestimonial, remove: removeTestimonial } = useTestimonials();

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

    const professorTestimonials = Array.isArray(testimonialsList.data)
        ? testimonialsList.data
        : testimonialsList.data?.testimonials || testimonialsList.data?.data || [];

    const pendingScholarships = Array.isArray(adminPendingList.data)
        ? adminPendingList.data
        : adminPendingList.data?.scholarships || adminPendingList.data?.data || [];

    const isDataLoading = isAuthLoading || professorList.isLoading || adminPendingList.isLoading || myApplications.isLoading || testimonialsList.isLoading;

    if (isAuthLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="container px-4 py-8 md:py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs">
                            <LayoutDashboard className="h-4 w-4" />
                            {role} {t.dashboard.portal}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight gradient-text">
                            {user?.name || user?.email?.split('@')[0] || "User"}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            {role === ROLES.STUDENT
                                ? t.dashboard.studentDesc
                                : role === ROLES.PROFESSOR
                                    ? t.dashboard.professorDesc
                                    : t.dashboard.adminDesc}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {role === ROLES.PROFESSOR && (
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="gradient" className="gap-2 shadow-lg shadow-primary/20">
                                        <Plus className="h-4 w-4" />
                                        {t.dashboard.newScholarship}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{t.dashboard.postScholarship}</DialogTitle>
                                    </DialogHeader>
                                    <ScholarshipForm
                                        onSuccess={() => {
                                            toast({ title: t.dashboard.successTitle, description: t.dashboard.scholarshipPosted });
                                            setIsCreateDialogOpen(false);
                                            professorList.refetch();
                                        }}
                                        onCancel={() => setIsCreateDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        {role === ROLES.PROFESSOR && (
                            <Dialog open={isCreateTestimonialOpen} onOpenChange={setIsCreateTestimonialOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-white">
                                        <MessageSquare className="h-4 w-4" />
                                        {t.dashboard.newTestimonial}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>{t.dashboard.createTestimonial}</DialogTitle>
                                    </DialogHeader>
                                    <TestimonialForm
                                        onSubmit={async (data) => {
                                            await createTestimonial.mutateAsync(data);
                                        }}
                                        onSuccess={() => {
                                            setIsCreateTestimonialOpen(false);
                                        }}
                                        onCancel={() => setIsCreateTestimonialOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button variant="outline" className="bg-white gap-2 relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            {t.dashboard.notifications}
                        </Button>
                    </div>
                </div>

                {/* Role-Specific Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {role === ROLES.STUDENT ? (
                        <>
                            <StatCard label={t.dashboard.myApplications} value={Array.isArray(myApplications.data) ? myApplications.data.length : "0"} icon={BookOpen} color="primary" />
                            <StatCard label={t.dashboard.inReview} value={Array.isArray(myApplications.data) ? myApplications.data.filter((a: any) => a.status === 'PENDING').length : "0"} icon={Clock} color="warning" />
                            <StatCard label={t.dashboard.accepted} value={Array.isArray(myApplications.data) ? myApplications.data.filter((a: any) => a.status === 'ACCEPTED').length : "0"} icon={CheckCircle2} color="success" />
                            <StatCard label={t.dashboard.recommendations} value="15" icon={Star} color="info" />
                        </>
                    ) : role === ROLES.PROFESSOR ? (
                        <>
                            <StatCard label={t.dashboard.myPostedHubs} value={professorScholarships.length} icon={BookOpen} color="primary" />
                            <StatCard label={t.dashboard.liveActive} value={professorScholarships.filter((s: any) => s.status === 'APPROVED').length} icon={CheckCircle2} color="success" />
                            <StatCard label={t.dashboard.underReview} value={professorScholarships.filter((s: any) => s.status === 'PENDING').length} icon={Clock} color="warning" />
                            <StatCard label={t.dashboard.totalReach} value={professorScholarships.reduce((acc: number, s: any) => acc + (s.views || 0), 0)} icon={Eye} color="info" />
                        </>
                    ) : (
                        <>
                            <StatCard label={t.dashboard.pendingApproval} value={pendingScholarships.length} icon={AlertCircle} color="warning" />
                            <StatCard label={t.dashboard.totalListings} value="45" icon={GraduationCap} color="success" />
                            <StatCard label={t.dashboard.verificationQueue} value="8" icon={CheckCircle2} color="info" />
                            <StatCard label={t.dashboard.systemReports} value="2" icon={AlertCircle} color="destructive" />
                        </>
                    )}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="main" className="w-full">
                            <TabsList className="bg-white border rounded-xl p-1 h-12 mb-6">
                                <TabsTrigger value="main" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                    {role === ROLES.STUDENT ? t.dashboard.tabMyApplications : role === ROLES.PROFESSOR ? t.dashboard.tabScholarships : t.dashboard.tabApprovalsNeeded}
                                </TabsTrigger>
                                {role === ROLES.PROFESSOR && (
                                    <>
                                        <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                            {t.dashboard.tabApplications}
                                        </TabsTrigger>
                                        <TabsTrigger value="testimonials" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                            {t.dashboard.tabTestimonials}
                                        </TabsTrigger>
                                    </>
                                )}
                                {role === ROLES.STUDENT && (
                                    <TabsTrigger value="external" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6">
                                        {t.dashboard.tabExternal}
                                    </TabsTrigger>
                                )}
                                <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6 font-bold">
                                    {t.dashboard.tabActivity}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="main" className="space-y-4 outline-none">
                                {isDataLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                    </div>
                                ) : role === ROLES.STUDENT ? (
                                    <div className="space-y-4">
                                        {Array.isArray(myApplications.data) && myApplications.data.length > 0 ? (
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
                                                <p className="text-muted-foreground font-medium">{t.dashboard.noApplicationsYet}</p>
                                                <Link href="/scholarships" className="mt-4 inline-block">
                                                    <Button variant="outline" size="sm" className="font-bold">{t.dashboard.browseOpportunities}</Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : role === ROLES.PROFESSOR ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold">{t.dashboard.yourPostedHubs}</h3>
                                        </div>
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
                                                <p className="text-muted-foreground font-medium">{t.dashboard.noScholarshipsYet}</p>
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
                                                <p className="text-muted-foreground font-medium">{t.dashboard.allCaughtUpApprovals}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            {role === ROLES.PROFESSOR && (
                                <TabsContent value="applications" className="space-y-4 outline-none">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold">{t.dashboard.receivedApplications}</h3>
                                            <Badge variant="outline">{Array.isArray(myApplications.data) ? myApplications.data.length : 0} {t.dashboard.total}</Badge>
                                        </div>
                                        {Array.isArray(myApplications.data) && myApplications.data.length > 0 ? (
                                            <div className="bg-white rounded-xl border overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="bg-slate-50 border-b">
                                                            <tr>
                                                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{t.dashboard.colStudent}</th>
                                                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{t.dashboard.colScholarship}</th>
                                                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{t.dashboard.colStatus}</th>
                                                                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{t.dashboard.colApplied}</th>
                                                                <th className="text-right px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">{t.dashboard.colActions}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {myApplications.data.map((app: any) => (
                                                                <ApplicationTableRow
                                                                    key={app.id}
                                                                    application={app}
                                                                    onEvaluate={(status: string, evaluation: string) => evaluate.mutate({ id: app.id, status, evaluation })}
                                                                    isSubmitting={evaluate.isPending}
                                                                />
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                                                <Users className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-500 font-medium">{t.dashboard.noApplicationsReceived}</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            )}

                            {role === ROLES.PROFESSOR && (
                                <TabsContent value="testimonials" className="space-y-4 outline-none">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold">{t.dashboard.yourSuccessStories}</h3>
                                            <Button size="sm" variant="outline" className="gap-2" onClick={() => setIsCreateTestimonialOpen(true)}>
                                                <Plus className="h-3 w-3" /> {t.dashboard.addNew}
                                            </Button>
                                        </div>
                                        {professorTestimonials.length > 0 ? (
                                            professorTestimonials.map((t: any) => (
                                                <TestimonialManageRow
                                                    key={t.id}
                                                    testimonial={t}
                                                    onUpdate={(data: any) => updateTestimonial.mutate({ id: t.id, data })}
                                                    onDelete={() => removeTestimonial.mutate(t.id)}
                                                    isProcessing={updateTestimonial.isPending || removeTestimonial.isPending}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                                                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-500 font-medium">{t.dashboard.addTestimonialsPrompt}</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            )}

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
                                    {t.dashboard.accountProfile}
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
                                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold tracking-wider">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {t.dashboard.verified}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Link href="/profile">
                                        <Button variant="outline" className="w-full text-xs justify-start gap-2 h-9 bg-white">
                                            <Settings className="h-3.5 w-3.5" /> {t.dashboard.viewProfileDetails}
                                        </Button>
                                    </Link>
                                    <Link href="/profile">
                                        <Button variant="outline" className="w-full text-xs justify-start gap-2 h-9 bg-white">
                                            <Eye className="h-3.5 w-3.5" /> {t.dashboard.editProfileSettings}
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
                                    {t.dashboard.academicHub}
                                </CardTitle>
                                <CardDescription className="text-zinc-400">
                                    {role === ROLES.STUDENT
                                        ? t.dashboard.guidanceDesc
                                        : t.dashboard.streamlineDesc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 shadow-lg shadow-primary/20">
                                    {t.dashboard.accessResources}
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
    const { t } = useTranslation();

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
                                {t.dashboard.updated} {new Date(scholarship.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {scholarship.views || 0} {t.dashboard.views}
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
                                {t.dashboard.edit}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{t.dashboard.editScholarship} {scholarship.title}</DialogTitle>
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
                            if (window.confirm(t.dashboard.confirmDelete)) {
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
    const { t } = useTranslation();
    return (
        <Card className="bg-white shadow-none border hover:border-primary/30 transition-all group">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{scholarship.title}</h4>
                        <p className="text-[10px] text-muted-foreground font-medium tracking-wider">
                            {t.dashboard.by} {scholarship.organization || t.dashboard.privateDonor} • {scholarship.fundingType}
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
                        {t.dashboard.reject}
                    </Button>
                    <Button
                        size="sm"
                        variant="gradient"
                        className="h-8 text-xs font-bold flex-1 sm:flex-none shadow-sm"
                        onClick={onApprove}
                        disabled={isProcessing}
                    >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {t.dashboard.approve}
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

function ApplicationEvaluateRow({ application, onEvaluate, isSubmitting }: any) {
    const [isEvalOpen, setIsEvalOpen] = useState(false);
    const [evaluationText, setEvaluationText] = useState(application.evaluation || "");
    const { t } = useTranslation();

    return (
        <Card className="hover:border-primary/50 transition-all bg-white shadow-none border group overflow-hidden relative">
            {/* Status Stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${application.status === 'ACCEPTED' ? 'bg-emerald-500' :
                application.status === 'REJECTED' ? 'bg-rose-500' :
                    'bg-amber-500'
                }`} />

            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center border shrink-0 overflow-hidden shadow-sm">
                            {application.student?.avatar ? (
                                <Image src={application.student.avatar} alt={application.student.name} width={56} height={56} className="h-full w-full object-cover" unoptimized />
                            ) : (
                                <User className="h-7 w-7 text-slate-400" />
                            )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${application.student?.isVerified ? 'bg-blue-500' : 'bg-slate-300'
                            }`} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base tracking-tight">{application.student?.name || t.dashboard.anonymousStudent}</h4>
                            <Badge variant="secondary" className="text-[9px] font-black tracking-widest px-2 py-0 h-4">
                                {application.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {t.dashboard.target} <span className="text-primary font-bold">{application.scholarship?.title}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isEvalOpen} onOpenChange={setIsEvalOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="gradient" className="h-8 text-xs font-bold">{t.dashboard.reviewApplication}</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{t.dashboard.evaluateApplication}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">{t.dashboard.applicant}</p>
                                        <p className="font-bold">{application.student?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">{t.dashboard.gpa}</p>
                                        <p className="font-bold">{application.student?.gpa || "N/A"}</p>
                                    </div>
                                </div>
                                {application.answers && (
                                    <div className="space-y-4 pt-6 border-t">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                            </div>
                                            <h3 className="text-sm font-black tracking-tight text-primary">{t.dashboard.applicantResponses}</h3>
                                        </div>
                                        <div className="grid gap-3">
                                            {(() => {
                                                try {
                                                    const answers = JSON.parse(application.answers);
                                                    const questions = application.scholarship?.questions || [];

                                                    return questions.map((q: any) => (
                                                        <div key={q.id} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-2 group/ans hover:bg-white hover:border-primary/20 transition-all">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <p className="text-[10px] font-black text-slate-400 tracking-[0.1em]">{q.question}</p>
                                                                <Badge variant="outline" className="h-4 text-[8px] bg-white">{q.type}</Badge>
                                                            </div>
                                                            <p className="text-sm font-semibold text-slate-900 leading-relaxed italic">
                                                                &ldquo;{answers[q.id] || t.dashboard.noAnswerProvided}&rdquo;
                                                            </p>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return <p className="text-xs text-muted-foreground italic">{t.dashboard.noFormattedAnswers}</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>{t.dashboard.professorEvaluation}</Label>
                                    <Textarea
                                        placeholder={t.dashboard.feedbackPlaceholder}
                                        rows={5}
                                        value={evaluationText}
                                        onChange={(e) => setEvaluationText(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    className="text-amber-600 hover:bg-amber-50 border-amber-100 font-bold"
                                    onClick={() => {
                                        onEvaluate("UNDER_REVIEW", evaluationText);
                                        setIsEvalOpen(false);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {t.dashboard.markUnderReview}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-rose-600 hover:bg-rose-50 border-rose-100 font-bold"
                                    onClick={() => {
                                        onEvaluate("REJECTED", evaluationText);
                                        setIsEvalOpen(false);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {t.dashboard.reject}
                                </Button>
                                <Button
                                    variant="gradient"
                                    className="font-bold"
                                    onClick={() => {
                                        onEvaluate("ACCEPTED", evaluationText);
                                        setIsEvalOpen(false);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {t.dashboard.acceptApplicant}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

function ApplicationTableRow({ application, onEvaluate, isSubmitting }: any) {
    const [isEvalOpen, setIsEvalOpen] = useState(false);
    const [evaluationText, setEvaluationText] = useState(application.evaluation || "");
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState(
        `Re: Your Application for ${application.scholarship?.title || "Scholarship"}`
    );
    const { t } = useTranslation();
    const [emailBody, setEmailBody] = useState("");
    const [interviewForm, setInterviewForm] = useState({
        platform: "ZOOM" as InterviewPlatform,
        scheduledAt: "",
        duration: "",
        meetingLink: "",
        notes: "",
    });
    const { schedule } = useInterviews();

    const studentEmail = application.user?.email || application.student?.email || "";
    const studentName = application.user?.firstName
        ? `${application.user.firstName} ${application.user.lastName || ""}`.trim()
        : (application.student?.name || "Student");

    const handleSendEmail = () => {
        if (!studentEmail) return;
        const mailto = `mailto:${studentEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailto, "_blank");
        setIsEmailOpen(false);
        setEmailBody("");
    };

    const handleScheduleInterview = () => {
        if (!interviewForm.scheduledAt || !interviewForm.platform) return;
        schedule.mutate(
            {
                applicationId: application.id,
                scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
                platform: interviewForm.platform,
                ...(interviewForm.meetingLink && { meetingLink: interviewForm.meetingLink }),
                ...(interviewForm.duration && { duration: Number(interviewForm.duration) }),
                ...(interviewForm.notes && { notes: interviewForm.notes }),
            },
            {
                onSuccess: () => {
                    setIsInterviewOpen(false);
                    setInterviewForm({ platform: "ZOOM", scheduledAt: "", duration: "", meetingLink: "", notes: "" });
                },
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACCEPTED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "REJECTED": return "bg-rose-100 text-rose-700 border-rose-200";
            case "UNDER_REVIEW": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            {/* Student Column */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {(application.user?.firstName || application.student?.name || "?").charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-slate-900">
                            {application.user?.firstName
                                ? `${application.user.firstName} ${application.user.lastName || ''}`.trim()
                                : (application.student?.name || "Unknown")}
                        </p>
                        <p className="text-xs text-slate-500">{application.user?.email || application.student?.email || ""}</p>
                    </div>
                </div>
            </td>

            {/* Scholarship Column */}
            <td className="px-6 py-4">
                <p className="font-medium text-sm text-slate-900">{application.scholarship?.title || "N/A"}</p>
                <p className="text-xs text-slate-500">{application.scholarship?.organization || ""}</p>
            </td>

            {/* Status Column */}
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.status)}`}>
                    {application.status}
                </span>
            </td>

            {/* Applied Date Column */}
            <td className="px-6 py-4">
                <p className="text-sm text-slate-700">
                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </p>
            </td>

            {/* Actions Column */}
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                {/* Send Email Dialog */}
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1" disabled={!studentEmail}>
                            <Mail className="h-3 w-3" />
                            {t.dashboard.emailBtn}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                {t.dashboard.sendEmailTo} {studentName}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label>{t.dashboard.to}</Label>
                                <Input value={studentEmail} readOnly className="bg-muted text-muted-foreground text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t.dashboard.subject}</Label>
                                <Input
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Email subject..."
                                    className="text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>{t.dashboard.message}</Label>
                                <Textarea
                                    rows={6}
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    placeholder={`Dear ${studentName},\n\n`}
                                    className="text-sm resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">{t.dashboard.cancel}</Button>
                            </DialogClose>
                            <Button
                                size="sm"
                                className="gap-1.5 font-bold"
                                onClick={handleSendEmail}
                                disabled={!studentEmail || !emailSubject}
                            >
                                <Send className="h-3.5 w-3.5" />
                                {t.dashboard.openInMail}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Schedule Interview Dialog */}
                <Dialog open={isInterviewOpen} onOpenChange={setIsInterviewOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1 text-violet-600 border-violet-200 hover:bg-violet-50">
                            <Video className="h-3 w-3" />
                            {t.dashboard.interviewBtn}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-violet-600" />
                                {t.dashboard.scheduleInterview}
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground pt-1">
                                {studentName} — {application.scholarship?.title || ""}
                            </p>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            {/* Platform */}
                            <div className="space-y-1.5">
                                <Label>{t.dashboard.interviewPlatform}</Label>
                                <Select
                                    value={interviewForm.platform}
                                    onValueChange={(v) => setInterviewForm((f) => ({ ...f, platform: v as InterviewPlatform }))}
                                >
                                    <SelectTrigger className="text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ZOOM">{t.dashboard.platformZoom}</SelectItem>
                                        <SelectItem value="GOOGLE_MEET">{t.dashboard.platformMeet}</SelectItem>
                                        <SelectItem value="MICROSOFT_TEAMS">{t.dashboard.platformTeams}</SelectItem>
                                        <SelectItem value="PHONE">{t.dashboard.platformPhone}</SelectItem>
                                        <SelectItem value="IN_PERSON">{t.dashboard.platformInPerson}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Date & Time */}
                            <div className="space-y-1.5">
                                <Label>{t.dashboard.interviewDate}</Label>
                                <Input
                                    type="datetime-local"
                                    className="text-sm"
                                    value={interviewForm.scheduledAt}
                                    onChange={(e) => setInterviewForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                                />
                            </div>
                            {/* Duration */}
                            <div className="space-y-1.5">
                                <Label>
                                    {t.dashboard.interviewDuration}
                                    <span className="text-muted-foreground ml-1 text-xs">({t.dashboard.interviewOptional})</span>
                                </Label>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="60"
                                    className="text-sm"
                                    value={interviewForm.duration}
                                    onChange={(e) => setInterviewForm((f) => ({ ...f, duration: e.target.value }))}
                                />
                            </div>
                            {/* Meeting Link */}
                            {interviewForm.platform !== "PHONE" && interviewForm.platform !== "IN_PERSON" && (
                                <div className="space-y-1.5">
                                    <Label>
                                        {t.dashboard.interviewMeetingLink}
                                        <span className="text-muted-foreground ml-1 text-xs">({t.dashboard.interviewOptional})</span>
                                    </Label>
                                    <Input
                                        type="url"
                                        placeholder="https://..."
                                        className="text-sm"
                                        value={interviewForm.meetingLink}
                                        onChange={(e) => setInterviewForm((f) => ({ ...f, meetingLink: e.target.value }))}
                                    />
                                </div>
                            )}
                            {/* Notes */}
                            <div className="space-y-1.5">
                                <Label>
                                    {t.dashboard.interviewNotes}
                                    <span className="text-muted-foreground ml-1 text-xs">({t.dashboard.interviewOptional})</span>
                                </Label>
                                <Textarea
                                    rows={3}
                                    className="text-sm resize-none"
                                    placeholder="..."
                                    value={interviewForm.notes}
                                    onChange={(e) => setInterviewForm((f) => ({ ...f, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" size="sm">{t.dashboard.cancel}</Button>
                            </DialogClose>
                            <Button
                                size="sm"
                                className="gap-1.5 font-bold bg-violet-600 hover:bg-violet-700 text-white"
                                onClick={handleScheduleInterview}
                                disabled={!interviewForm.scheduledAt || schedule.isPending}
                            >
                                {schedule.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Video className="h-3.5 w-3.5" />}
                                {t.dashboard.scheduleInterview}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEvalOpen} onOpenChange={setIsEvalOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold">
                            <Eye className="h-3 w-3 mr-1" />
                            {t.dashboard.reviewBtn}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{t.dashboard.evaluateApplication}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
                            {/* Student Basic Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.applicant}</p>
                                    <p className="font-bold">
                                        {application.user?.firstName
                                            ? `${application.user.firstName} ${application.user.lastName || ''}`.trim()
                                            : (application.student?.name || "N/A")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.email}</p>
                                    <p className="font-medium text-xs">{application.user?.email || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.gpa}</p>
                                    <p className="font-bold">{application.user?.studentProfile?.gpa || application.student?.gpa || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.university}</p>
                                    <p className="font-medium text-xs">{application.user?.studentProfile?.university || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.fieldOfStudy}</p>
                                    <p className="font-medium text-xs">{application.user?.studentProfile?.fieldOfStudy || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.degree}</p>
                                    <p className="font-medium text-xs">{application.user?.studentProfile?.currentDegree || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.graduationYear}</p>
                                    <p className="font-medium text-xs">{application.user?.studentProfile?.graduationYear || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">{t.dashboard.location}</p>
                                    <p className="font-medium text-xs">
                                        {application.user?.studentProfile?.city && application.user?.studentProfile?.country
                                            ? `${application.user.studentProfile.city}, ${application.user.studentProfile.country}`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {application.coverLetter && (
                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.coverLetter}</Label>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{application.coverLetter}</p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            {application.additionalInfo && (
                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.additionalInfo}</Label>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{application.additionalInfo}</p>
                                    </div>
                                </div>
                            )}
                            {/* Skills */}
                            {application.user?.studentProfile?.skills && Array.isArray(application.user.studentProfile.skills) && application.user.studentProfile.skills.length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.skills}</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {application.user.studentProfile.skills.map((skill: string, idx: number) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Languages */}
                            {application.user?.studentProfile?.languages && Array.isArray(application.user.studentProfile.languages) && application.user.studentProfile.languages.length > 0 && (
                                <div className="space-y-2 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.languages}</Label>
                                    <div className="grid gap-2">
                                        {application.user.studentProfile.languages.map((lang: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-medium">{lang.name}</span>
                                                <span className="text-xs text-slate-500">{t.dashboard.proficiency} {lang.proficiency}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {application.user?.studentProfile?.experience && Array.isArray(application.user.studentProfile.experience) && application.user.studentProfile.experience.length > 0 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.experience}</Label>
                                    {application.user.studentProfile.experience.map((exp: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                                            <p className="font-bold text-sm">{exp.title}</p>
                                            <p className="text-xs text-slate-600">{exp.organization} • {exp.location}</p>
                                            <p className="text-xs text-slate-500">{exp.startDate} - {exp.endDate}</p>
                                            {exp.description && <p className="text-xs text-slate-600 pt-1">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Certifications */}
                            {application.user?.studentProfile?.certifications && Array.isArray(application.user.studentProfile.certifications) && application.user.studentProfile.certifications.length > 0 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.certifications}</Label>
                                    {application.user.studentProfile.certifications.map((cert: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                                            <p className="font-bold text-sm">{cert.title}</p>
                                            <p className="text-xs text-slate-600">{cert.organization}</p>
                                            <p className="text-xs text-slate-500">Issued: {cert.issueDate} {cert.expiryDate && `• Expires: ${cert.expiryDate}`}</p>
                                            {cert.credentialId && <p className="text-xs text-slate-500">ID: {cert.credentialId}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Documents */}
                            {((application.documents && Array.isArray(application.documents) && application.documents.length > 0) ||
                              (application.user?.studentProfile?.documents && Array.isArray(application.user.studentProfile.documents) && application.user.studentProfile.documents.length > 0)) && (
                                <div className="space-y-3 pt-4 border-t">
                                    <Label className="text-sm font-bold text-slate-700">{t.dashboard.uploadedDocuments}</Label>
                                    <div className="grid gap-2">
                                        {(application.documents || application.user?.studentProfile?.documents || []).map((doc: string, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {doc.split('/').pop() || `Document ${idx + 1}`}
                                                        </p>
                                                        <p className="text-xs text-slate-500">{t.dashboard.appDocument}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 gap-2"
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.href = doc.startsWith('http') ? doc : `${process.env.NEXT_PUBLIC_API_URL || ''}${doc}`;
                                                        link.download = doc.split('/').pop() || 'document';
                                                        link.target = '_blank';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                >
                                                    <Download className="h-3 w-3" />
                                                    {t.dashboard.download}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Application Answers */}
                            {application.answers && Array.isArray(application.answers) && application.answers.length > 0 && (
                                <div className="space-y-4 pt-6 border-t">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-sm font-black tracking-tight text-primary">{t.dashboard.applicantResponses}</h3>
                                    </div>
                                    <div className="grid gap-3">
                                        {application.answers.map((answerObj: any) => (
                                            <div key={answerObj.id} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100 space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 tracking-[0.1em]">
                                                    {answerObj.question?.question || "Question"}
                                                </p>
                                                {answerObj.question?.type === 'DOCUMENT' ? (
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-emerald-600" />
                                                        <p className="text-sm font-semibold text-emerald-600">{answerObj.answer || t.dashboard.noFileUploaded}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm font-semibold text-slate-900 leading-relaxed italic">
                                                        &ldquo;{answerObj.answer || t.dashboard.noAnswerProvided}&rdquo;
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>{t.dashboard.professorEvaluation}</Label>
                                <Textarea
                                    placeholder={t.dashboard.feedbackPlaceholder}
                                    rows={5}
                                    value={evaluationText}
                                    onChange={(e) => setEvaluationText(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                className="text-amber-600 hover:bg-amber-50 border-amber-100 font-bold"
                                onClick={() => {
                                    onEvaluate("UNDER_REVIEW", evaluationText);
                                    setIsEvalOpen(false);
                                }}
                                disabled={isSubmitting}
                            >
                                {t.dashboard.markUnderReview}
                            </Button>
                            <Button
                                variant="outline"
                                className="text-rose-600 hover:bg-rose-50 border-rose-100 font-bold"
                                onClick={() => {
                                    onEvaluate("REJECTED", evaluationText);
                                    setIsEvalOpen(false);
                                }}
                                disabled={isSubmitting}
                            >
                                {t.dashboard.reject}
                            </Button>
                            <Button
                                variant="gradient"
                                className="font-bold"
                                onClick={() => {
                                    onEvaluate("ACCEPTED", evaluationText);
                                    setIsEvalOpen(false);
                                }}
                                disabled={isSubmitting}
                            >
                                {t.dashboard.acceptApplicant}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
            </td>
        </tr>
    );
}

function TestimonialManageRow({ testimonial, onUpdate, onDelete, isProcessing }: any) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <Card className="hover:border-primary/50 transition-colors bg-white shadow-none border group">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center border shrink-0">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-bold truncate line-clamp-1">{testimonial.author}</p>
                        <p className="text-[10px] text-muted-foreground tracking-widest">{testimonial.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Pencil className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{t.dashboard.editTestimonial}</DialogTitle>
                            </DialogHeader>
                            <TestimonialForm
                                initialData={testimonial}
                                onSubmit={async (data) => {
                                    await onUpdate(data);
                                }}
                                onSuccess={() => setIsEditOpen(false)}
                                onCancel={() => setIsEditOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                        onClick={() => {
                            if (window.confirm(t.dashboard.confirmDeleteTestimonial)) {
                                onDelete();
                            }
                        }}
                        disabled={isProcessing}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
