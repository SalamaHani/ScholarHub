"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    FolderOpen,
    Bell,
    Mail,
    MessageSquare,
    Search,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Eye,
    Shield,
    Loader2,
    Send,
    MoreVertical,
    Building2,
    TrendingUp,
    Star,
    RefreshCw,
    Calendar,
    ExternalLink,
    MapPin,
    Phone,
    Hash,
    Award,
    GraduationCap,
    UserCheck,
    ShieldOff,
    FileText,
    Quote,
    Upload,
    Download,
    User as UserIcon,
    Check,
    X,
    HelpCircle,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { User, useUsers } from "@/hooks/useUsers";
import { Scholarship, useScholarships, useScholarship } from "@/hooks/useScholarships";
import { useApplications } from "@/hooks/useApplications";
import { useCategories, CategoryInput } from "@/hooks/useCategories";
import { useNotifications, SendNotificationInput } from "@/hooks/useNotifications";
import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScholarshipForm } from "@/components/scholarships/scholarship-form";

export default function AdminDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Secure access via useEffect to prevent render-phase side effects
    useEffect(() => {
        if (!isAuthLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
        }
    }, [user, isAuthLoading, router]);

    if (isAuthLoading || !user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <p className="text-muted-foreground font-medium">
                        {isAuthLoading ? "Loading Admin Dashboard..." : "Redirecting..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="container px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs">
                            <Shield className="h-4 w-4" />
                            Admin Control Panel
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-emerald-600 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Full platform management and system oversight.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button variant="gradient" className="gap-2 shadow-lg shadow-primary/20 order-last md:order-none">
                                    <Plus className="h-4 w-4" />
                                    New Scholarship
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">Post New Scholarship</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <ScholarshipForm
                                        onSuccess={() => setIsCreateOpen(false)}
                                        onCancel={() => setIsCreateOpen(false)}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" className="bg-white gap-2 relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            Alerts
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white gap-2 group hidden md:flex"
                            onClick={() => {
                                window.location.reload();
                                // Alternative: queryClient.invalidateQueries();
                            }}
                        >
                            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                            Sync Data
                        </Button>
                    </div>
                </motion.div>

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-white border rounded-xl p-1.5 h-auto mb-8 flex flex-wrap gap-1 w-full justify-start">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <Users className="h-4 w-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="scholarships" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Scholarships
                        </TabsTrigger>
                        <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <FileText className="h-4 w-4" />
                            Applications
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <FolderOpen className="h-4 w-4" />
                            Categories
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <Mail className="h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Testimonials
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <OverviewSection />
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <UsersSection />
                    </TabsContent>

                    {/* Scholarships Tab */}
                    <TabsContent value="scholarships">
                        <ScholarshipsSection />
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications">
                        <ApplicationsSection />
                    </TabsContent>

                    {/* Categories Tab */}
                    <TabsContent value="categories">
                        <CategoriesSection />
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <NotificationsSection />
                    </TabsContent>

                    {/* Testimonials Tab */}
                    <TabsContent value="testimonials">
                        <TestimonialsSection />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// ============================================
// OVERVIEW SECTION
// ============================================
function OverviewSection() {
    const { list: usersList } = useUsers();
    const { list: scholarshipsList, adminPendingList, approve, reject } = useScholarships();
    const { allApplications } = useApplications();
    const { list: categoriesList } = useCategories();

    const users = useMemo(() => Array.isArray(usersList.data) ? usersList.data : usersList.data?.users || [], [usersList.data]);
    const scholarships = useMemo(() => Array.isArray(scholarshipsList.data) ? scholarshipsList.data : scholarshipsList.data?.scholarships || [], [scholarshipsList.data]);
    const pendingScholarships = useMemo(() => adminPendingList.data || [], [adminPendingList.data]);
    const applications = useMemo(() => Array.isArray(allApplications.data) ? allApplications.data : allApplications.data?.applications || [], [allApplications.data]);
    const categories = useMemo(() => Array.isArray(categoriesList.data) ? categoriesList.data : categoriesList.data?.categories || [], [categoriesList.data]);

    const stats = useMemo(() => [
        { label: "Total Users", value: users.length || "0", icon: Users, color: "primary", trend: "+12%" },
        { label: "Scholarships", value: scholarships.length || "0", icon: GraduationCap, color: "success", trend: "+8%" },
        { label: "Pending Approvals", value: pendingScholarships.length || "0", icon: Clock, color: "warning", trend: "" },
        { label: "Applications", value: applications.length || "0", icon: FileText, color: "info", trend: "+24%" },
        { label: "Categories", value: categories.length || "0", icon: FolderOpen, color: "secondary", trend: "" },
        { label: "Active Alerts", value: "3", icon: AlertCircle, color: "destructive", trend: "" },
    ], [users.length, scholarships.length, pendingScholarships.length, applications.length, categories.length]);

    const activity = useMemo(() => [
        ...users.slice(0, 3).map((u: any) => ({
            action: `New ${(u.role || "USER").toLowerCase()} registered`,
            user: u.email,
            time: u.createdAt,
            displayTime: new Date(u.createdAt).toLocaleDateString(),
            type: u.role === "ADMIN" ? "default" : u.role === "PROFESSOR" ? "info" : "success"
        })),
        ...scholarships.slice(0, 3).map((s: any) => ({
            action: `Scholarship "${(s.title || "").substring(0, 20)}..."`,
            user: s.organization,
            time: s.createdAt,
            displayTime: new Date(s.createdAt).toLocaleDateString(),
            type: s.status === "APPROVED" ? "success" : s.status === "PENDING" ? "warning" : "destructive"
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5), [users, scholarships]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Approvals Card */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Pending Approvals
                            </CardTitle>
                            <Badge variant="warning">{pendingScholarships.length} pending</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingScholarships.slice(0, 3).map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm line-clamp-1">{s.title}</p>
                                    <p className="text-xs text-muted-foreground">{s.organization}</p>
                                </div>
                                <div className="flex gap-2">
                                    <ConfirmActionDialog
                                        title="Approve Scholarship"
                                        description={`Approve "${s.title}"?`}
                                        onConfirm={() => approve.mutate(s.id)}
                                        isLoading={approve.isPending}
                                        variant="success"
                                        icon={CheckCircle2}
                                        confirmText="Approve (Admin)"
                                        trigger={
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-full"
                                                disabled={approve.isPending}
                                            >
                                                {approve.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                            </Button>
                                        }
                                    />
                                    <RejectDialog
                                        scholarshipId={s.id}
                                        onReject={(reason) => reject.mutate({ id: s.id, reason })}
                                        isLoading={reject.isPending}
                                        confirmText="Reject (Admin)"
                                    />
                                </div>
                            </div>
                        ))}
                        {pendingScholarships.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                                <p className="text-sm">All caught up! No pending approvals.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            System Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activity.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className={`h-2 w-2 rounded-full ${item.type === "success" ? "bg-emerald-500" :
                                        item.type === "info" ? "bg-blue-500" :
                                            item.type === "warning" ? "bg-amber-500" :
                                                item.type === "destructive" ? "bg-rose-500" :
                                                    "bg-gray-400"
                                        }`} />
                                    <div className="flex-1">
                                        <span className="font-medium">{item.action}</span>
                                        <span className="text-muted-foreground"> by </span>
                                        <span className="text-primary truncate inline-block max-w-[150px] align-bottom">{item.user}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                                </div>
                            ))}
                            {activity.length === 0 && (
                                <p className="text-center py-8 text-sm text-muted-foreground">No recent activity</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}

// ============================================
// USERS SECTION
// ============================================
function UsersSection() {
    const { list, updateRole, blockUser, unblockUser, deleteUser, verifyUser, updateProfile } = useUsers();
    const { allApplications } = useApplications();
    const { list: scholarshipsList } = useScholarships();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [viewingUser, setViewingUser] = useState<any | null>(null);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const users = useMemo(() => Array.isArray(list.data) ? list.data : list.data?.users || [], [list.data]);

    const getUserStats = useCallback((userId: string) => {
        const apps = Array.isArray(allApplications.data) ? allApplications.data : allApplications.data?.applications || [];
        const userApps = apps.filter((app: any) => app.studentId === userId).length;

        const scholarships = Array.isArray(scholarshipsList.data) ? scholarshipsList.data : scholarshipsList.data?.scholarships || [];
        const userScholarships = scholarships.filter((s: any) => (s.professorId === userId || s.userId === userId)).length;

        return { userApps, userScholarships };
    }, [allApplications.data, scholarshipsList.data]);

    const filteredUsers = useMemo(() => users.filter((user: any) => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    }), [users, searchTerm, roleFilter]);

    const handleRoleChange = useCallback(async (userId: string, newRole: string) => {
        await updateRole.mutateAsync({ id: userId, role: newRole });
    }, [updateRole]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">User Management</h2>
                    <p className="text-muted-foreground">Manage all users, roles, and permissions</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="STUDENT">Students</SelectItem>
                            <SelectItem value="PROFESSOR">Professors</SelectItem>
                            <SelectItem value="ADMIN">Admins</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <Card className="border-none shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-semibold text-sm">User</th>
                                <th className="text-left p-4 font-semibold text-sm">Role</th>
                                <th className="text-left p-4 font-semibold text-sm">Status</th>
                                <th className="text-left p-4 font-semibold text-sm">Joined</th>
                                <th className="text-right p-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.isLoading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user: any) => (
                                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {(user.firstName || user.name || "U").charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        {user.firstName ? `${user.firstName} ${user.lastName || ""}` : (user.name || "Unknown Member")}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                                disabled={updateRole.isPending}
                                            >
                                                <SelectTrigger className="w-32 h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="STUDENT">Student</SelectItem>
                                                    <SelectItem value="PROFESSOR">Professor</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {user.isBlocked ? (
                                                    <Badge variant="destructive" className="w-fit">Blocked</Badge>
                                                ) : (
                                                    <Badge variant="success" className="w-fit">Active</Badge>
                                                )}
                                                {user.role === "PROFESSOR" ? (
                                                    user.professorProfile?.isVerified ? (
                                                        <Badge variant="outline" className="w-fit text-emerald-600 bg-emerald-50 border-emerald-200">
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="w-fit text-amber-600 bg-amber-50 border-amber-200">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </Badge>
                                                    )
                                                ) : (
                                                    user.isEmailVerified ? (
                                                        <Badge variant="outline" className="w-fit text-blue-600 bg-blue-50 border-blue-200">
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                            Email Verified
                                                        </Badge>
                                                    ) : null
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setViewingUser(user)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit Profile
                                                        </DropdownMenuItem>
                                                        {user.role === "PROFESSOR" && !user.professorProfile?.isVerified && (
                                                            <ConfirmActionDialog
                                                                title="Verify User"
                                                                description={`Are you sure you want to verify ${user.firstName} ${user.lastName}? This will grant them professor privileges.`}
                                                                onConfirm={() => verifyUser.mutate(user.id)}
                                                                isLoading={verifyUser.isPending}
                                                                variant="success"
                                                                icon={UserCheck}
                                                                trigger={
                                                                    <DropdownMenuItem
                                                                        onSelect={(e) => e.preventDefault()}
                                                                        className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                                                    >
                                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                                        Verify User
                                                                    </DropdownMenuItem>
                                                                }
                                                            />
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        {user.isBlocked ? (
                                                            <ConfirmActionDialog
                                                                title="Unblock User"
                                                                description={`Are you sure you want to unblock ${user.firstName} ${user.lastName}? They will regain access to the platform.`}
                                                                onConfirm={() => unblockUser.mutate(user.id)}
                                                                isLoading={unblockUser.isPending}
                                                                variant="success"
                                                                icon={Shield}
                                                                trigger={
                                                                    <DropdownMenuItem
                                                                        onSelect={(e) => e.preventDefault()}
                                                                        className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                                                                    >
                                                                        <Shield className="h-4 w-4 mr-2" />
                                                                        Unblock User
                                                                    </DropdownMenuItem>
                                                                }
                                                            />
                                                        ) : (
                                                            <ConfirmActionDialog
                                                                title="Block User"
                                                                description={`Are you sure you want to block ${user.firstName} ${user.lastName}? they will be restricted from using the platform.`}
                                                                onConfirm={() => blockUser.mutate(user.id)}
                                                                isLoading={blockUser.isPending}
                                                                variant="warning"
                                                                icon={ShieldOff}
                                                                trigger={
                                                                    <DropdownMenuItem
                                                                        onSelect={(e) => e.preventDefault()}
                                                                        className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                                                    >
                                                                        <ShieldOff className="h-4 w-4 mr-2" />
                                                                        Block User
                                                                    </DropdownMenuItem>
                                                                }
                                                            />
                                                        )}
                                                        <ConfirmDeleteDialog
                                                            title="Delete User"
                                                            description={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
                                                            onConfirm={() => deleteUser.mutate(user.id)}
                                                            isLoading={deleteUser.isPending}
                                                            trigger={
                                                                <DropdownMenuItem
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-destructive focus:text-destructive focus:bg-rose-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete User
                                                                </DropdownMenuItem>
                                                            }
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
                <DialogContent className="sm:max-w-[600px] border-none shadow-2xl p-0 overflow-hidden">
                    {viewingUser && (
                        <>
                            <div className="bg-primary/5 p-8 border-b relative">
                                <div className="absolute top-4 right-4">
                                    <Badge variant="outline" className="bg-white/50 backdrop-blur-sm shadow-sm font-mono text-[10px]">
                                        ID: {viewingUser.id}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-white shadow-xl transition-transform group-hover:scale-105 duration-300 overflow-hidden">
                                            {viewingUser.avatar ? (
                                                <Image src={viewingUser.avatar} alt="" fill className="rounded-full object-cover" />
                                            ) : (
                                                viewingUser.firstName?.charAt(0) || viewingUser.name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        {viewingUser.isBlocked && (
                                            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white p-1 rounded-full border-2 border-white shadow-lg">
                                                <ShieldOff className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold tracking-tight">
                                            {viewingUser.firstName ? `${viewingUser.firstName} ${viewingUser.lastName}` : (viewingUser.name || "Unknown Member")}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary" className="px-2 py-0.5 font-bold tracking-wider text-[10px]">
                                                {viewingUser.role}
                                            </Badge>
                                            {viewingUser.role === "PROFESSOR" ? (
                                                viewingUser.professorProfile?.isVerified && (
                                                    <Badge className="bg-emerald-100 text-emerald-600 border-emerald-200 px-2 py-0.5 flex items-center gap-1">
                                                        <UserCheck className="h-3 w-3" />
                                                        Verified Professor
                                                    </Badge>
                                                )
                                            ) : (
                                                viewingUser.isEmailVerified && (
                                                    <Badge className="bg-blue-100 text-blue-600 border-blue-200 px-2 py-0.5 flex items-center gap-1">
                                                        <UserCheck className="h-3 w-3" />
                                                        Email Verified
                                                    </Badge>
                                                )
                                            )}
                                            {viewingUser.isBlocked && (
                                                <Badge variant="destructive" className="px-2 py-0.5">Blocked Account</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                {/* Basic Info */}
                                {(() => {
                                    const profile = viewingUser.role === 'PROFESSOR' ? viewingUser.professorProfile : viewingUser.studentProfile;
                                    const country = viewingUser.country || viewingUser.profile?.country || profile?.country;
                                    const city = viewingUser.city || viewingUser.profile?.city || profile?.city;
                                    const age = viewingUser.age || viewingUser.profile?.age || profile?.age;
                                    const gender = viewingUser.gender || viewingUser.profile?.gender || profile?.gender;
                                    const phone = viewingUser.phone || viewingUser.profile?.phone || profile?.phoneNumber;
                                    const bio = viewingUser.bio || viewingUser.profile?.bio || profile?.bio;

                                    return (
                                        <div className="space-y-8">
                                            {/* Personal Info Expanded */}
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <UserIcon className="h-4 w-4" />
                                                    Profile Details
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Email Address</Label>
                                                        <p className="text-sm font-medium flex items-center gap-2 break-all">
                                                            <Mail className="h-3.5 w-3.5 text-primary/60" />
                                                            {viewingUser.email}
                                                        </p>
                                                    </div>
                                                    {phone && (
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Phone Number</Label>
                                                            <p className="text-sm font-medium flex items-center gap-2">
                                                                <Phone className="h-3.5 w-3.5 text-primary/60" />
                                                                {phone}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {(country || city) && (
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Location</Label>
                                                            <p className="text-sm font-medium flex items-center gap-2">
                                                                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                                                {city ? `${city}, ` : ""}{country || "Not specified"}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {(age || gender) && (
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Demographics</Label>
                                                            <p className="text-sm font-medium flex items-center gap-2">
                                                                <Hash className="h-3.5 w-3.5 text-primary/60" />
                                                                {gender || "Unknown"} {age ? `• ${age} Years Old` : ""}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Member Since</Label>
                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                            <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                                            {new Date(viewingUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Academic/Professional Identity */}
                                            {(viewingUser.university || profile?.university || profile?.institution) && (
                                                <div className="space-y-4 pt-6 border-t">
                                                    <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <GraduationCap className="h-4 w-4" />
                                                        Academic Profile
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">{viewingUser.role === 'PROFESSOR' ? 'Institution' : 'University'}</Label>
                                                            <p className="text-sm font-medium flex items-center gap-2">
                                                                <Building2 className="h-3.5 w-3.5 text-primary/60" />
                                                                {viewingUser.role === 'PROFESSOR'
                                                                    ? (profile?.institution || viewingUser.institution)
                                                                    : (profile?.university || viewingUser.university)}
                                                            </p>
                                                        </div>
                                                        {viewingUser.role === 'PROFESSOR' ? (
                                                            <>
                                                                {(profile?.position || viewingUser.position) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Academic Position</Label>
                                                                        <p className="text-sm font-medium">
                                                                            {profile?.position || viewingUser.position}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {(profile?.specialization || viewingUser.specialization) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Specialization</Label>
                                                                        <p className="text-sm font-medium">
                                                                            {profile?.specialization || viewingUser.specialization}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(profile?.fieldOfStudy || viewingUser.fieldOfStudy) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Major / Field</Label>
                                                                        <p className="text-sm font-medium flex items-center gap-2">
                                                                            <Award className="h-3.5 w-3.5 text-primary/60" />
                                                                            {profile?.fieldOfStudy || viewingUser.fieldOfStudy}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {(profile?.gpa || viewingUser.gpa) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Academic Score (GPA)</Label>
                                                                        <p className="text-sm font-bold text-primary">
                                                                            {profile?.gpa || viewingUser.gpa}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {(profile?.currentDegree || viewingUser.degreeLevel) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Level of Study</Label>
                                                                        <p className="text-sm font-medium text-[11px] bg-muted w-fit px-2 py-0.5 rounded-full border">
                                                                            {profile?.currentDegree || viewingUser.degreeLevel}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {(profile?.graduationYear || viewingUser.graduationYear) && (
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Expected Graduation</Label>
                                                                        <p className="text-sm font-medium">
                                                                            Class of {profile?.graduationYear || viewingUser.graduationYear}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                        {(profile?.department || viewingUser.department) && (
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Department</Label>
                                                                <p className="text-sm font-medium">
                                                                    {profile?.department || viewingUser.department}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Skills & bio */}
                                            {(bio || profile?.skills || profile?.languages) && (
                                                <div className="space-y-6 pt-6 border-t">
                                                    {bio && (
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                                <Quote className="h-3 w-3" />
                                                                Biography
                                                            </Label>
                                                            <p className="text-[11px] leading-relaxed text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-dashed text-center">
                                                                &ldquo;{bio}&rdquo;
                                                            </p>
                                                        </div>
                                                    )}
                                                    {profile?.skills && (
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Expertise & Skills</Label>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {(typeof profile.skills === 'string' ? profile.skills.split(',') : (Array.isArray(profile.skills) ? profile.skills : [])).map((skill: any, idx: number) => {
                                                                    const skillText = typeof skill === 'string' ? skill.trim() : (skill?.name || String(skill));
                                                                    return <Badge key={idx} variant="secondary" className="text-[9px] h-5 bg-blue-50 text-blue-700 border-blue-100">{skillText}</Badge>;
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {profile?.languages && (
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Languages</Label>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {(typeof profile.languages === 'string' ? profile.languages.split(',') : (Array.isArray(profile.languages) ? profile.languages : [])).map((lang: any, idx: number) => {
                                                                    const langText = typeof lang === 'string' ? lang.trim() : (lang?.name || String(lang));
                                                                    return <Badge key={idx} variant="outline" className="text-[9px] h-5 bg-emerald-50 text-emerald-700 border-emerald-100">{langText}</Badge>;
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Professional History */}
                                            {(profile?.experience || profile?.certifications) && (
                                                <div className="space-y-6 pt-6 border-t">
                                                    {profile?.experience && (
                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                                <Building2 className="h-3 w-3" />
                                                                Professional Experience
                                                            </Label>
                                                            <div className="space-y-3">
                                                                {(Array.isArray(profile.experience) ? profile.experience : [profile.experience]).map((exp: any, idx: number) => {
                                                                    if (typeof exp === 'string') return <p key={idx} className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl">{exp}</p>;
                                                                    return (
                                                                        <div key={idx} className="bg-muted/20 p-3 rounded-xl space-y-1">
                                                                            <div className="flex justify-between items-start">
                                                                                <p className="text-xs font-bold text-primary">{exp.title || "Experience Item"}</p>
                                                                                <p className="text-[10px] text-muted-foreground font-medium">{exp.startDate} {exp.endDate ? ` - ${exp.endDate}` : ""}</p>
                                                                            </div>
                                                                            <p className="text-[11px] font-medium leading-none">{exp.organization || exp.company}</p>
                                                                            {exp.description && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {profile?.certifications && (
                                                        <div className="space-y-3">
                                                            <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                                <Award className="h-3 w-3" />
                                                                Training & Certifications
                                                            </Label>
                                                            <div className="space-y-2">
                                                                {(Array.isArray(profile.certifications) ? profile.certifications : [profile.certifications]).map((cert: any, idx: number) => {
                                                                    if (typeof cert === 'string') return <p key={idx} className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl">{cert}</p>;
                                                                    return (
                                                                        <div key={idx} className="bg-muted/20 p-3 rounded-xl space-y-1">
                                                                            <div className="flex justify-between items-start">
                                                                                <p className="text-xs font-bold text-primary">{cert.title || cert.name || "Certification"}</p>
                                                                                <p className="text-[10px] text-muted-foreground font-medium">{cert.date || cert.year}</p>
                                                                            </div>
                                                                            <p className="text-[11px] font-medium leading-none">{cert.organization || cert.issuer}</p>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Documents */}
                                            {profile?.documents && profile.documents.length > 0 && (
                                                <div className="space-y-3 pt-6 border-t">
                                                    <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        Verified Documents
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {(Array.isArray(profile.documents) ? profile.documents : [profile.documents]).map((doc: any, idx: number) => {
                                                            const docName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || "Document");
                                                            const docUrl = typeof doc === 'string' ? doc : doc.url;
                                                            return (
                                                                <a
                                                                    key={idx}
                                                                    href={docUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors group"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-bold truncate pr-2">{docName}</p>
                                                                        <p className="text-[9px] text-muted-foreground opacity-70">Open in New Tab</p>
                                                                    </div>
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Platform Activity Statistics */}
                                            <div className="space-y-4 pt-6 border-t">
                                                <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Platform Activity
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                                                        <p className="text-[10px] font-black text-primary/60 tracking-tighter">Applications</p>
                                                        <p className="text-3xl font-black text-primary">{getUserStats(viewingUser.id).userApps}</p>
                                                    </div>
                                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center">
                                                        <p className="text-[10px] font-black text-emerald-600/60 tracking-tighter">Scholarships</p>
                                                        <p className="text-3xl font-black text-emerald-600">{getUserStats(viewingUser.id).userScholarships}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* System Info */}
                                            <div className="pt-6 border-t opacity-60">
                                                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground tracking-widest">
                                                    <span>System Metadata</span>
                                                    <Hash className="h-3 w-3" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <div className="bg-muted/10 p-2 rounded-lg border border-dashed">
                                                        <p className="opacity-50">Last Update</p>
                                                        <p className="text-[10px]">{new Date(viewingUser.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="bg-muted/10 p-2 rounded-lg border border-dashed text-right">
                                                        <p className="opacity-50">Email Verif.</p>
                                                        <p className={cn("text-[10px]", viewingUser.isEmailVerified ? "text-emerald-600" : "text-amber-600")}>
                                                            {viewingUser.isEmailVerified ? "Verified" : "Pending"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            <DialogFooter className="p-6 bg-muted/20 border-t flex flex-row gap-3">
                                <Button variant="outline" className="flex-1 shadow-sm h-11" onClick={() => setViewingUser(null)}>
                                    Close Member Profile
                                </Button>
                                <Button
                                    variant="default"
                                    className="flex-1 shadow-lg shadow-primary/20 h-11"
                                    onClick={() => {
                                        window.location.href = `mailto:${viewingUser.email}`;
                                    }}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact User
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <UserEditDialog
                user={editingUser}
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
                onUpdate={async (data) => {
                    if (editingUser) {
                        await updateProfile.mutateAsync({ id: editingUser.id, data });
                        setEditingUser(null);
                    }
                }}
                isLoading={updateProfile.isPending}
            />
        </motion.div>
    );
}

const DEGREE_LEVELS = [
    { value: "BACHELOR", label: "Bachelor's Degree" },
    { value: "MASTER", label: "Master's Degree" },
    { value: "PHD", label: "PhD / Doctorate" },
    { value: "HIGHSCHOOL", label: "High School" },
    { value: "DIPLOMA", label: "Diploma / Vocational" },
    { value: "OTHER", label: "Other" },
];

function UserEditDialog({ user, open, onOpenChange, onUpdate, isLoading }: {
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (data: any) => Promise<void>;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState<any>({});

    React.useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                university: user.university || user.profile?.university || "",
                fieldOfStudy: user.fieldOfStudy || user.profile?.fieldOfStudy || "",
                degreeLevel: user.degreeLevel || user.profile?.degreeLevel || "BACHELOR",
                currentDegree: user.currentDegree || user.profile?.currentDegree || "BACHELOR",
                gpa: user.gpa || user.profile?.gpa || "",
                graduationYear: user.graduationYear || user.profile?.graduationYear || user.studentProfile?.graduationYear || "",
                country: user.country || user.profile?.country || user.studentProfile?.country || "",
                city: user.city || user.profile?.city || user.studentProfile?.city || "",
                age: user.age || user.profile?.age || user.studentProfile?.age || "",
                gender: user.gender || user.profile?.gender || user.studentProfile?.gender || "",
                bio: user.bio || user.profile?.bio || user.studentProfile?.bio || "",
                phone: user.phone || user.profile?.phone || user.studentProfile?.phoneNumber || "",
                department: user.department || user.profile?.department || user.professorProfile?.department || "",
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="text-2xl font-black italic tracking-tighter text-primary">Edit User Profile</DialogTitle>
                        <DialogDescription>
                            Modify administrative and academic data for this member.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-primary/10">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">First Name</Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Last Name</Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">University</Label>
                                    <Input
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Degree Level</Label>
                                    <Select
                                        value={formData.degreeLevel}
                                        onValueChange={(v) => setFormData({ ...formData, degreeLevel: v })}
                                    >
                                        <SelectTrigger className="rounded-xl border-primary/10 h-11 focus:ring-primary">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEGREE_LEVELS.map(level => (
                                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Department</Label>
                                    <Input
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Current Degree</Label>
                                    <Select
                                        value={formData.currentDegree}
                                        onValueChange={(v) => setFormData({ ...formData, currentDegree: v })}
                                    >
                                        <SelectTrigger className="rounded-xl border-primary/10 h-11 focus:ring-primary">
                                            <SelectValue placeholder="Select degree" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEGREE_LEVELS.map(level => (
                                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">GPA</Label>
                                    <Input
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                        placeholder="e.g. 3.8"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Graduation Year</Label>
                                    <Input
                                        value={formData.graduationYear}
                                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                        placeholder="e.g. 2025"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Country</Label>
                                    <Input
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">City</Label>
                                    <Input
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Age</Label>
                                    <Input
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(v) => setFormData({ ...formData, gender: v })}
                                    >
                                        <SelectTrigger className="rounded-xl border-primary/10 h-11 focus:ring-primary">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-bold text-primary/70">Phone</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="rounded-xl border-primary/10 h-11 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-primary/70">Bio</Label>
                                <Textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="rounded-xl border-primary/10 h-24 focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 pt-2 border-t gap-2 sm:gap-0">
                        <Button type="button" variant="outline" className="rounded-xl h-11 border-primary/10 hover:bg-primary/5 text-primary" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="gradient" className="rounded-xl h-11 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Update Profile
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ============================================
// SCHOLARSHIPS SECTION
// ============================================
function ScholarshipsSection() {
    const { list, adminPendingList, approve, reject, remove, toggleFeatured } = useScholarships();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingScholarshipId, setEditingScholarshipId] = useState<string | null>(null);
    const [viewingScholarship, setViewingScholarship] = useState<Scholarship | null>(null);

    // Fetch full scholarship data with questions when editing
    const { data: editingScholarship, isLoading: isLoadingEdit } = useScholarship(editingScholarshipId || "");

    const scholarships = useMemo(() => Array.isArray(list.data) ? list.data : list.data?.scholarships || [], [list.data]);
    const pendingScholarships = useMemo(() => adminPendingList.data || [], [adminPendingList.data]);

    const filteredScholarships = useMemo(() => scholarships.filter((s: any) => {
        const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.organization?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [scholarships, searchTerm, statusFilter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Scholarship Management</h2>
                    <p className="text-muted-foreground">Review, approve, and manage all scholarships</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search scholarships..."
                            className="pl-9 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Pending Approvals Section */}
            {pendingScholarships.length > 0 && (
                <Card className="border-amber-200 bg-amber-50/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                            <AlertCircle className="h-5 w-5" />
                            Pending Approvals ({pendingScholarships.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingScholarships.map((s: any) => (
                            <div key={s.id} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <GraduationCap className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{s.title}</p>
                                        <p className="text-sm text-muted-foreground">{s.organization} • {s.fundingType}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <RejectDialog
                                        scholarshipId={s.id}
                                        onReject={(reason) => reject.mutate({ id: s.id, reason })}
                                        isLoading={reject.isPending}
                                        triggerText="Reject"
                                        confirmText="Reject (Admin)"
                                    />
                                    <ConfirmActionDialog
                                        title="Approve Scholarship"
                                        description={`Are you sure you want to approve "${s.title}"? This will make it visible to all students.`}
                                        onConfirm={() => approve.mutate(s.id)}
                                        isLoading={approve.isPending}
                                        variant="success"
                                        icon={CheckCircle2}
                                        confirmText="Approve (Admin)"
                                        trigger={
                                            <Button
                                                size="sm"
                                                variant="success"
                                                className="gap-1 shadow-lg shadow-emerald-200/50 hover:scale-105 transition-transform font-bold"
                                                disabled={approve.isPending}
                                            >
                                                {approve.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                {approve.isPending ? "Approving..." : "Approve"}
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* All Scholarships Table */}
            <Card className="border-none shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-semibold text-sm">Scholarship</th>
                                <th className="text-left p-4 font-semibold text-sm">Status</th>
                                <th className="text-left p-4 font-semibold text-sm">Funding</th>
                                <th className="text-left p-4 font-semibold text-sm">Deadline</th>
                                <th className="text-left p-4 font-semibold text-sm">Views</th>
                                <th className="text-right p-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredScholarships.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No scholarships found
                                    </td>
                                </tr>
                            ) : (
                                filteredScholarships.map((s: any) => (
                                    <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <GraduationCap className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold line-clamp-1">{s.title}</p>
                                                        {s.isFeatured && (
                                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{s.organization}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                variant={
                                                    s.status === "APPROVED" ? "success" :
                                                        s.status === "PENDING" ? "warning" : "destructive"
                                                }
                                            >
                                                {s.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm">{s.fundingType}</td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(s.deadline).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm">{s.views || 0}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                {s.status === "PENDING" && (
                                                    <>
                                                        <ConfirmActionDialog
                                                            title="Approve Scholarship"
                                                            description={`Are you sure you want to approve "${s.title}"? This will make it visible to students.`}
                                                            onConfirm={() => approve.mutate(s.id)}
                                                            isLoading={approve.isPending}
                                                            variant="success"
                                                            icon={CheckCircle2}
                                                            confirmText="Approve (Admin)"
                                                            trigger={
                                                                <Button variant="outline" size="sm" className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 gap-1 px-3">
                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                    Approve
                                                                </Button>
                                                            }
                                                        />
                                                        <RejectDialog
                                                            scholarshipId={s.id}
                                                            onReject={(reason) => reject.mutate({ id: s.id, reason })}
                                                            isLoading={reject.isPending}
                                                            triggerText="Reject"
                                                        />
                                                    </>
                                                )}


                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => setViewingScholarship(s)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Detailed View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingScholarshipId(s.id)}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit Data
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <ConfirmActionDialog
                                                            title={s.isFeatured ? "Remove from Featured" : "Feature Scholarship"}
                                                            description={s.isFeatured
                                                                ? `Are you sure you want to remove "${s.title}" from featured scholarships?`
                                                                : `Are you sure you want to feature "${s.title}"? It will be prioritized in search results.`
                                                            }
                                                            onConfirm={() => toggleFeatured.mutate(s.id)}
                                                            isLoading={toggleFeatured.isPending}
                                                            variant={s.isFeatured ? "warning" : "default"}
                                                            icon={Star}
                                                            confirmText={s.isFeatured ? "Unfeature (Admin)" : "Feature (Admin)"}
                                                            trigger={
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                                    <Star className={cn("h-4 w-4 mr-2", s.isFeatured && "text-amber-500 fill-amber-500")} />
                                                                    {s.isFeatured ? "Unfeature (Admin)" : "Feature (Admin)"}
                                                                </DropdownMenuItem>
                                                            }
                                                        />

                                                        {s.status === "PENDING" && (
                                                            <>
                                                                <ConfirmActionDialog
                                                                    title="Approve Scholarship"
                                                                    description={`Are you sure you want to approve "${s.title}"? This will make it visible to students.`}
                                                                    onConfirm={() => approve.mutate(s.id)}
                                                                    isLoading={approve.isPending}
                                                                    variant="success"
                                                                    icon={CheckCircle2}
                                                                    confirmText="Approve (Admin)"
                                                                    trigger={
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 cursor-pointer">
                                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                            Approve (Admin)
                                                                        </DropdownMenuItem>
                                                                    }
                                                                />
                                                                <RejectDialog
                                                                    scholarshipId={s.id}
                                                                    onReject={(reason) => reject.mutate({ id: s.id, reason })}
                                                                    isLoading={reject.isPending}
                                                                    mode="menu"
                                                                    triggerText="Reject (Admin)"
                                                                    confirmText="Reject (Admin)"
                                                                />
                                                            </>
                                                        )}

                                                        <DropdownMenuSeparator />
                                                        <ConfirmDeleteDialog
                                                            title="Delete Scholarship"
                                                            description={`Are you sure you want to delete "${s.title}"? This action cannot be undone and will remove all associated data.`}
                                                            onConfirm={() => remove.mutate(s.id)}
                                                            isLoading={remove.isPending}
                                                            trigger={
                                                                <DropdownMenuItem
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-destructive focus:text-destructive focus:bg-rose-50"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Permanent Delete
                                                                </DropdownMenuItem>
                                                            }
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Viewing Scholarship Dialog */}
            <Dialog open={!!viewingScholarship} onOpenChange={(open) => !open && setViewingScholarship(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                    {viewingScholarship && (
                        <div className="flex flex-col">
                            <div className="relative h-48 bg-primary/10 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                                <GraduationCap className="h-24 w-24 text-primary/20 absolute -right-4 -bottom-4 rotate-12" />
                                <div className="relative z-10 text-center space-y-2 p-8">
                                    <Badge variant="success" className="mb-2 shadow-lg bg-primary text-white border-none">{viewingScholarship.fundingType}</Badge>
                                    <h2 className="text-3xl font-extrabold tracking-tight text-primary line-clamp-2">{viewingScholarship.title}</h2>
                                    <p className="text-primary/70 font-semibold">{viewingScholarship.organization}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-2xl bg-muted/40 border border-muted-foreground/10 space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Country</p>
                                        <p className="font-bold truncate">{viewingScholarship.country}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40 border border-muted-foreground/10 space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Deadline</p>
                                        <p className="font-bold text-rose-600">{new Date(viewingScholarship.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40 border border-muted-foreground/10 space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Level</p>
                                        <p className="font-bold truncate">{Array.isArray(viewingScholarship.degreeLevel) ? viewingScholarship.degreeLevel.join(", ") : viewingScholarship.degreeLevel}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-muted/40 border border-muted-foreground/10 space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest">Status</p>
                                        <Badge variant={viewingScholarship.status === "APPROVED" ? "success" : viewingScholarship.status === "PENDING" ? "warning" : "destructive"}>
                                            {viewingScholarship.status}
                                        </Badge>
                                    </div>
                                </div>

                                {viewingScholarship.status === "REJECTED" && viewingScholarship.rejectionReason && (
                                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 space-y-2">
                                        <h3 className="text-sm font-bold tracking-widest text-rose-600 flex items-center gap-2">
                                            <XCircle className="h-4 w-4" />
                                            Rejection Reason
                                        </h3>
                                        <p className="text-rose-700/80 leading-relaxed italic">&ldquo;{viewingScholarship.rejectionReason}&rdquo;</p>
                                    </div>
                                )}

                                {/* Main Content */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="md:col-span-2 space-y-8">
                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b">
                                                <FileText className="h-5 w-5 text-primary" />
                                                Description
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{viewingScholarship.description}</p>
                                        </section>

                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b">
                                                <AlertCircle className="h-5 w-5 text-amber-500" />
                                                Requirements
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{viewingScholarship.requirements}</p>
                                        </section>

                                        <section className="space-y-3">
                                            <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                Eligibility
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{viewingScholarship.eligibility}</p>
                                        </section>
                                    </div>

                                    <div className="space-y-8">
                                        <section className="space-y-4 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                            <h3 className="text-sm font-bold tracking-widest text-primary flex items-center gap-2">
                                                <Star className="h-4 w-4" />
                                                Benefits
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{viewingScholarship.benefits || "No benefits listed."}</p>
                                        </section>

                                        <section className="space-y-4">
                                            <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                                <FolderOpen className="h-4 w-4" />
                                                Fields of Study
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(viewingScholarship.fieldOfStudy) ? viewingScholarship.fieldOfStudy.map((f: string) => (
                                                    <Badge key={f} variant="outline" className="bg-white">{f}</Badge>
                                                )) : <Badge variant="outline">{viewingScholarship.fieldOfStudy}</Badge>}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                {/* Scholarship Questions Section */}
                                {viewingScholarship.questions && viewingScholarship.questions.length > 0 && (
                                    <div className="space-y-6 pt-6 border-t border-dashed">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <HelpCircle className="h-5 w-5 text-primary" />
                                            Application Questions
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {viewingScholarship.questions.map((q: any, idx: number) => (
                                                <div key={q.id || idx} className="p-6 rounded-3xl bg-white border shadow-sm space-y-3 relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                                    <div className="flex items-center justify-between">
                                                        <Badge variant="outline" className="text-[9px] font-black tracking-widest">
                                                            {q.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : q.type === 'DOCUMENT' ? 'Document Upload' : 'Text Response'}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-muted-foreground opacity-50">Q{idx + 1}</span>
                                                    </div>
                                                    <p className="font-bold text-sm leading-relaxed">{q.question}</p>

                                                    {q.type === 'MULTIPLE_CHOICE' && q.options && q.options.length > 0 && (
                                                        <div className="space-y-1.5 pt-2">
                                                            <p className="text-[9px] font-bold text-muted-foreground tracking-widest">Available Options:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {q.options.map((opt: string, optIdx: number) => (
                                                                    <div key={optIdx} className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border text-[11px] font-medium">
                                                                        <div className="h-2 w-2 rounded-full bg-primary/40" />
                                                                        {opt}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="p-8 pt-0 flex gap-4">
                                {viewingScholarship.status === "PENDING" && (
                                    <>
                                        <RejectDialog
                                            scholarshipId={viewingScholarship.id}
                                            onReject={(reason) => {
                                                reject.mutate({ id: viewingScholarship.id, reason });
                                                setViewingScholarship(null);
                                            }}
                                            isLoading={reject.isPending}
                                        />
                                        <ConfirmActionDialog
                                            title="Approve Scholarship"
                                            description="Confirm that this scholarship meets all platform requirements."
                                            onConfirm={() => {
                                                approve.mutate(viewingScholarship.id);
                                                setViewingScholarship(null);
                                            }}
                                            isLoading={approve.isPending}
                                            variant="success"
                                            icon={CheckCircle2}
                                            trigger={
                                                <Button variant="success" className="flex-1 shadow-lg shadow-emerald-100">
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Approve for Publication
                                                </Button>
                                            }
                                        />
                                    </>
                                )}
                                <Button
                                    variant="outline"
                                    className="px-8"
                                    onClick={() => {
                                        setViewingScholarship(null);
                                        setEditingScholarshipId(viewingScholarship.id);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Editing Scholarship Dialog */}
            < Dialog open={!!editingScholarshipId} onOpenChange={(open) => !open && setEditingScholarshipId(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Edit Scholarship</DialogTitle>
                        <p className="text-muted-foreground text-sm">Modify questions, answers, and scholarship details</p>
                    </DialogHeader>
                    <div className="py-4">
                        {isLoadingEdit ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-muted-foreground font-medium">Loading scholarship data...</p>
                            </div>
                        ) : editingScholarship ? (
                            <ScholarshipForm
                                initialData={editingScholarship}
                                onSuccess={() => setEditingScholarshipId(null)}
                                onCancel={() => setEditingScholarshipId(null)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <AlertCircle className="h-10 w-10 text-amber-500" />
                                <p className="text-muted-foreground font-medium">Unable to load scholarship data</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog >
        </motion.div >
    );
}

// ============================================
// APPLICATIONS SECTION
// ============================================
function ApplicationsSection() {
    const { allApplications, evaluate, remove, update } = useApplications();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [viewingApplication, setViewingApplication] = useState<any>(null);
    const [evaluatingApplication, setEvaluatingApplication] = useState<any>(null);
    const [evaluationNotes, setEvaluationNotes] = useState("");
    const [targetStatus, setTargetStatus] = useState("");

    // Update evaluation states when viewing or evaluating a new application
    useEffect(() => {
        const app = evaluatingApplication || viewingApplication;
        if (app) {
            setEvaluationNotes(app.evaluationNotes || "");
            setTargetStatus(app.status || "PENDING");
        }
    }, [viewingApplication, evaluatingApplication]);

    const applications = useMemo(() => Array.isArray(allApplications.data) ? allApplications.data : allApplications.data?.applications || [], [allApplications.data]);

    const filteredApplications = useMemo(() => applications.filter((app: any) => {
        const studentName = app.user ? `${app.user.firstName || ""} ${app.user.lastName || ""}`.trim() : "Unknown";
        const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.scholarship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [applications, searchTerm, statusFilter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Application Management</h2>
                    <p className="text-muted-foreground">View and monitor all student applications</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search applications..."
                            className="pl-9 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Applications Table */}
            <Card className="border-none shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="text-left p-4 font-semibold text-sm">Student</th>
                                <th className="text-left p-4 font-semibold text-sm">Scholarship</th>
                                <th className="text-left p-4 font-semibold text-sm">Status</th>
                                <th className="text-left p-4 font-semibold text-sm">Applied</th>
                                <th className="text-right p-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allApplications.isLoading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No applications found
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app: any) => (
                                    <tr key={app.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden border">
                                                    {app.user?.avatar ? (
                                                        <Image src={app.user.avatar} alt="" fill className="object-cover" />
                                                    ) : (
                                                        app.user?.firstName?.charAt(0) || "S"
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{app.user ? `${app.user.firstName || ""} ${app.user.lastName || ""}`.trim() : "Unknown"}</p>
                                                    <p className="text-sm text-muted-foreground">{app.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium line-clamp-1">{app.scholarship?.title || "N/A"}</p>
                                            <p className="text-sm text-muted-foreground">{app.scholarship?.organization}</p>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                variant={
                                                    app.status === "ACCEPTED" ? "success" :
                                                        app.status === "PENDING" ? "warning" :
                                                            app.status === "REJECTED" ? "destructive" : "secondary"
                                                }
                                            >
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary group"
                                                    onClick={() => setEvaluatingApplication(app)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
                                                    Evaluate
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => setViewingApplication(app)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Full Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEvaluatingApplication(app)}>
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        {app.status === "PENDING" && (
                                                            <>
                                                                <ConfirmActionDialog
                                                                    title="Accept Application"
                                                                    description="Are you sure you want to accept this application? The student will be notified."
                                                                    onConfirm={() => evaluate.mutate({ id: app.id, status: "ACCEPTED" })}
                                                                    isLoading={evaluate.isPending}
                                                                    variant="success"
                                                                    icon={CheckCircle2}
                                                                    trigger={
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 cursor-pointer">
                                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                            Quick Accept
                                                                        </DropdownMenuItem>
                                                                    }
                                                                />
                                                                <ConfirmActionDialog
                                                                    title="Reject Application"
                                                                    description="Are you sure you want to reject this application?"
                                                                    onConfirm={() => evaluate.mutate({ id: app.id, status: "REJECTED" })}
                                                                    isLoading={evaluate.isPending}
                                                                    variant="destructive"
                                                                    icon={XCircle}
                                                                    trigger={
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-rose-50 cursor-pointer">
                                                                            <XCircle className="h-4 w-4 mr-2" />
                                                                            Quick Reject
                                                                        </DropdownMenuItem>
                                                                    }
                                                                />
                                                                <DropdownMenuSeparator />
                                                            </>
                                                        )}

                                                        <ConfirmDeleteDialog
                                                            title="Delete Application"
                                                            description="Are you sure you want to delete this application? This action cannot be undone."
                                                            onConfirm={() => remove.mutate(app.id)}
                                                            isLoading={remove.isPending}
                                                            trigger={
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-rose-50 cursor-pointer">
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Permanent Remove
                                                                </DropdownMenuItem>
                                                            }
                                                        />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={!!viewingApplication} onOpenChange={(open) => !open && setViewingApplication(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                    {viewingApplication && (
                        <div className="flex flex-col">
                            <div className="p-8 bg-primary/5 border-b space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-white shadow-lg overflow-hidden">
                                        {viewingApplication.user?.avatar ? (
                                            <Image src={viewingApplication.user.avatar} alt="" fill className="object-cover" />
                                        ) : (
                                            viewingApplication.user?.firstName?.charAt(0) || "S"
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{viewingApplication.user ? `${viewingApplication.user.firstName || ""} ${viewingApplication.user.lastName || ""}`.trim() : "Unknown Student"}</h2>
                                        <p className="text-muted-foreground">{viewingApplication.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={viewingApplication.status === "ACCEPTED" ? "success" : viewingApplication.status === "PENDING" ? "warning" : "destructive"}>
                                        {viewingApplication.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Applied on {new Date(viewingApplication.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        Scholarship Information
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-muted/40 border space-y-1">
                                        <p className="font-bold text-lg text-primary">{viewingApplication.scholarship?.title}</p>
                                        <p className="text-sm font-medium text-muted-foreground">{viewingApplication.scholarship?.organization}</p>
                                    </div>
                                </section>

                                {viewingApplication.user?.studentProfile && (
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                            <UserIcon className="h-4 w-4" />
                                            Student Profile
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">University</p>
                                                    <p className="font-bold text-xs truncate">{viewingApplication.user.studentProfile.university || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">GPA</p>
                                                    <p className="font-bold text-xs text-primary">{viewingApplication.user.studentProfile.gpa || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">Degree</p>
                                                    <p className="font-bold text-xs truncate">{viewingApplication.user.studentProfile.currentDegree || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">Graduation</p>
                                                    <p className="font-bold text-xs">{viewingApplication.user.studentProfile.graduationYear || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">Country</p>
                                                    <p className="font-bold text-xs truncate">{viewingApplication.user.studentProfile.country || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">City</p>
                                                    <p className="font-bold text-xs truncate">{viewingApplication.user.studentProfile.city || "N/A"}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">Age / Gender</p>
                                                    <p className="font-bold text-xs truncate">
                                                        {viewingApplication.user.studentProfile.age || "N/A"} / {viewingApplication.user.studentProfile.gender || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/40 border space-y-1">
                                                    <p className="text-[9px] font-bold text-muted-foreground tracking-widest leading-none">Phone</p>
                                                    <p className="font-bold text-xs truncate">{viewingApplication.user.studentProfile.phoneNumber || viewingApplication.user.phone || "N/A"}</p>
                                                </div>
                                            </div>

                                            {viewingApplication.user.studentProfile.bio && (
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Bio / Introduction</Label>
                                                    <p className="p-3 bg-white border rounded-xl text-xs text-muted-foreground leading-relaxed italic border-dashed">
                                                        &ldquo;{viewingApplication.user.studentProfile.bio}&rdquo;
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {viewingApplication.user.studentProfile.skills && (
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Skills</Label>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(typeof viewingApplication.user.studentProfile.skills === 'string' ? viewingApplication.user.studentProfile.skills.split(',') : (Array.isArray(viewingApplication.user.studentProfile.skills) ? viewingApplication.user.studentProfile.skills : [])).map((skill: any, idx: number) => {
                                                                const skillText = typeof skill === 'string' ? skill.trim() : (skill?.name || String(skill));
                                                                return <Badge key={idx} variant="secondary" className="text-[9px] h-5 bg-blue-50 text-blue-700 border-blue-100">{skillText}</Badge>;
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {viewingApplication.user.studentProfile.languages && (
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-muted-foreground tracking-wider">Languages</Label>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(typeof viewingApplication.user.studentProfile.languages === 'string' ? viewingApplication.user.studentProfile.languages.split(',') : (Array.isArray(viewingApplication.user.studentProfile.languages) ? viewingApplication.user.studentProfile.languages : [])).map((lang: any, idx: number) => {
                                                                const langText = typeof lang === 'string' ? lang.trim() : (lang?.name || String(lang));
                                                                return <Badge key={idx} variant="outline" className="text-[9px] h-5">{langText}</Badge>;
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {viewingApplication.user.studentProfile.experience && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        Experience
                                                    </Label>
                                                    <div className="space-y-2">
                                                        {(Array.isArray(viewingApplication.user.studentProfile.experience) ? viewingApplication.user.studentProfile.experience : [viewingApplication.user.studentProfile.experience]).map((exp: any, idx: number) => {
                                                            if (typeof exp === 'string') return <p key={idx} className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl">{exp}</p>;
                                                            return (
                                                                <div key={idx} className="bg-muted/20 p-3 rounded-xl space-y-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <p className="text-xs font-bold text-primary">{exp.title || "Position"}</p>
                                                                        <p className="text-[10px] text-muted-foreground font-medium">{exp.startDate} - {exp.endDate || "Present"}</p>
                                                                    </div>
                                                                    <p className="text-[11px] font-medium leading-none">{exp.organization || exp.company || "Experience Item"}</p>
                                                                    {exp.location && <p className="text-[9px] text-muted-foreground italic">{exp.location}</p>}
                                                                    {exp.description && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {viewingApplication.user.studentProfile.certifications && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                        <Award className="h-3 w-3" />
                                                        Certifications
                                                    </Label>
                                                    <div className="space-y-2">
                                                        {(Array.isArray(viewingApplication.user.studentProfile.certifications) ? viewingApplication.user.studentProfile.certifications : [viewingApplication.user.studentProfile.certifications]).map((cert: any, idx: number) => {
                                                            if (typeof cert === 'string') return <p key={idx} className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl">{cert}</p>;
                                                            return (
                                                                <div key={idx} className="bg-muted/20 p-3 rounded-xl space-y-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <p className="text-xs font-bold text-primary">{cert.title || cert.name || "Certification"}</p>
                                                                        <p className="text-[10px] text-muted-foreground font-medium">{cert.date || cert.year || cert.issueDate}</p>
                                                                    </div>
                                                                    <p className="text-[11px] font-medium leading-none">{cert.organization || cert.issuer}</p>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {viewingApplication.user.studentProfile.documents && (
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                                        <FileText className="h-3 w-3" />
                                                        Supporting Documentation
                                                    </Label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {(Array.isArray(viewingApplication.user.studentProfile.documents) ? viewingApplication.user.studentProfile.documents : [viewingApplication.user.studentProfile.documents]).map((doc: any, idx: number) => {
                                                            const docName = typeof doc === 'string' ? doc.split('/').pop() : (doc.name || "Document");
                                                            const docUrl = typeof doc === 'string' ? doc : doc.url;
                                                            return (
                                                                <a
                                                                    key={idx}
                                                                    href={docUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors group"
                                                                >
                                                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-bold truncate pr-2">{docName}</p>
                                                                        <p className="text-[9px] text-muted-foreground opacity-70">Open in New Tab</p>
                                                                    </div>
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                )}

                                {viewingApplication.answers && (
                                    <section className="space-y-4">
                                        <h3 className="text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            Scholarship Questions & Answers
                                        </h3>
                                        <div className="space-y-3">
                                            {(() => {
                                                try {
                                                    const answers = typeof viewingApplication.answers === 'string' ? JSON.parse(viewingApplication.answers) : viewingApplication.answers;
                                                    const questions = viewingApplication.scholarship?.questions || [];
                                                    const questionsMap = new Map(questions.map((q: any) => [q.id, q]));

                                                    // Resolve a question object from various formats
                                                    const resolveQuestion = (questionOrId: any): any => {
                                                        if (typeof questionOrId === 'object' && questionOrId?.question) return questionOrId;
                                                        if (typeof questionOrId === 'string') {
                                                            const found = questionsMap.get(questionOrId);
                                                            if (found) return found;
                                                            return { id: questionOrId, question: questionOrId, type: "TEXT" };
                                                        }
                                                        return { question: "Untitled Question", type: "TEXT" };
                                                    };

                                                    // Helper for structured Q&A display
                                                    const renderQuestionAnswer = (q: any, studentAnswer: any, index: number) => (
                                                        <div key={q.id || index} className="p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm space-y-4 relative overflow-hidden group">
                                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />

                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">Question {index + 1}</span>
                                                                    <Badge variant="outline" className="text-[8px] font-bold tracking-widest px-1.5 py-0 h-4 border-slate-200 text-slate-400">
                                                                        {q.type === 'MULTIPLE_CHOICE' ? 'Choice' : q.type === 'DOCUMENT' ? 'File' : 'Text'}
                                                                    </Badge>
                                                                </div>
                                                                <p className="font-bold text-sm text-slate-800 leading-tight">
                                                                    {q.question}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <span className="text-[9px] font-bold text-primary tracking-wider pl-1">Student Answer:</span>
                                                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-dashed border-slate-200 relative">
                                                                    {q.type === 'DOCUMENT' && studentAnswer ? (
                                                                        <div className="flex flex-col gap-2">
                                                                            <button
                                                                                onClick={() => {
                                                                                    try {
                                                                                        const url = studentAnswer.startsWith('http')
                                                                                            ? studentAnswer
                                                                                            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${studentAnswer}`;
                                                                                        window.open(url, '_blank', 'noopener,noreferrer');
                                                                                    } catch (error) {
                                                                                        console.error('Error opening document:', error);
                                                                                        alert('Unable to open document. The file may not be available.');
                                                                                    }
                                                                                }}
                                                                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                                                            >
                                                                                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                                                                                    <FileText className="h-4 w-4" />
                                                                                    <span className="text-sm font-medium">View Document</span>
                                                                                    <ExternalLink className="h-3 w-3" />
                                                                                </div>
                                                                            </button>
                                                                            <button
                                                                                onClick={async () => {
                                                                                    try {
                                                                                        const url = studentAnswer.startsWith('http')
                                                                                            ? studentAnswer
                                                                                            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}${studentAnswer}`;

                                                                                        const response = await fetch(url);
                                                                                        if (!response.ok) throw new Error('Download failed');

                                                                                        const blob = await response.blob();
                                                                                        const downloadUrl = window.URL.createObjectURL(blob);
                                                                                        const link = document.createElement('a');
                                                                                        link.href = downloadUrl;
                                                                                        link.download = `document-${Date.now()}`;
                                                                                        document.body.appendChild(link);
                                                                                        link.click();
                                                                                        document.body.removeChild(link);
                                                                                        window.URL.revokeObjectURL(downloadUrl);
                                                                                    } catch (error) {
                                                                                        console.error('Error downloading document:', error);
                                                                                        alert('Unable to download document. The file may not be available.');
                                                                                    }
                                                                                }}
                                                                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                                                            >
                                                                                <div className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                                                                                    <Download className="h-4 w-4" />
                                                                                    <span className="text-sm font-medium">Download Document</span>
                                                                                </div>
                                                                            </button>
                                                                            <div className="text-xs text-muted-foreground pl-1 break-all">
                                                                                File: {studentAnswer.split('/').pop() || 'document'}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex gap-2 text-sm font-medium text-slate-700 leading-relaxed italic pr-2">
                                                                            &ldquo;{studentAnswer || "No answer provided"}&rdquo;
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {q.type === 'MULTIPLE_CHOICE' && q.options && q.options.length > 0 && (
                                                                <div className="space-y-1.5 pt-1">
                                                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest pl-1">Available Context (Options):</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {q.options.map((opt: string, optIdx: number) => (
                                                                            <div
                                                                                key={optIdx}
                                                                                className={cn(
                                                                                    "px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all",
                                                                                    opt === studentAnswer
                                                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                                                                                        : "bg-white border-slate-100 text-slate-400 opacity-60"
                                                                                )}
                                                                            >
                                                                                {opt}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );

                                                    // Handle array of answers: [{questionId, answer}, ...] or [{question, answer}, ...]
                                                    if (Array.isArray(answers)) {
                                                        return answers.map((a: any, idx: number) => {
                                                            const questionRef = a.questionId || a.question;
                                                            const questionObj = resolveQuestion(questionRef);
                                                            return renderQuestionAnswer(questionObj, a.answer, idx);
                                                        });
                                                    }

                                                    // Object format: {questionId: answer}
                                                    // If questions are populated from scholarship, use them
                                                    if (questions.length > 0) {
                                                        return questions.map((q: any, idx: number) => {
                                                            const studentAnswer = answers[q.id];
                                                            return renderQuestionAnswer(q, studentAnswer, idx);
                                                        });
                                                    }

                                                    // Fallback: questions not populated, render from answer keys
                                                    return Object.entries(answers).map(([questionId, studentAnswer]: [string, any], idx: number) => {
                                                        const questionObj = resolveQuestion(questionId);
                                                        return renderQuestionAnswer(questionObj, studentAnswer, idx);
                                                    });
                                                } catch (e) {
                                                    return <p className="text-xs text-muted-foreground italic">Could not parse answers.</p>;
                                                }
                                            })()}
                                        </div>
                                    </section>
                                )}

                            </div>

                            <DialogFooter className="p-6 bg-white border-t flex flex-row gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 font-bold tracking-widest text-[10px]"
                                    onClick={() => setViewingApplication(null)}
                                >
                                    Close Window
                                </Button>
                                <ConfirmDeleteDialog
                                    title="Delete Application"
                                    description="Are you sure you want to permanently delete this application? This action is irreversible."
                                    onConfirm={async () => {
                                        await remove.mutateAsync(viewingApplication.id);
                                        setViewingApplication(null);
                                    }}
                                    isLoading={remove.isPending}
                                    trigger={
                                        <Button
                                            variant="destructive"
                                            className="flex-1 h-12 font-bold tracking-widest text-[10px] shadow-lg shadow-rose-200 bg-rose-600 hover:bg-rose-700"
                                            disabled={remove.isPending}
                                        >
                                            {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                            Remove Record
                                        </Button>
                                    }
                                />
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={!!evaluatingApplication} onOpenChange={(open) => !open && setEvaluatingApplication(null)}>
                <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-hidden">
                    {evaluatingApplication && (
                        <div className="flex flex-col">
                            <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                            <Pencil className="h-4 w-4 text-primary" />
                                        </div>
                                        <DialogTitle className="text-xl font-bold tracking-tight">Update Application Status</DialogTitle>
                                    </div>
                                    <DialogDescription className="text-[10px] font-medium italic">
                                        Manage status for {evaluatingApplication.user?.firstName}&apos;s application to &ldquo;{evaluatingApplication.scholarship?.title}&rdquo;
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black tracking-widest text-slate-400">Select Achievement Status</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED"].map((status) => (
                                            <Button
                                                key={status}
                                                type="button"
                                                variant={targetStatus === status ? "default" : "outline"}
                                                className={cn(
                                                    "h-11 font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all border-slate-200",
                                                    targetStatus === status && status === "ACCEPTED" && "bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-200",
                                                    targetStatus === status && status === "REJECTED" && "bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg shadow-rose-200",
                                                    targetStatus === status && status === "UNDER_REVIEW" && "bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-200",
                                                    targetStatus === status && status === "PENDING" && "bg-slate-700 hover:bg-slate-800 text-white border-none shadow-lg shadow-slate-200"
                                                )}
                                                onClick={() => setTargetStatus(status)}
                                            >
                                                {status.replace("_", " ")}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black tracking-widest text-slate-400">Decision Notes & Feedback</Label>
                                        <Badge variant="outline" className="text-[9px] font-medium border-slate-200 text-slate-400">
                                            <Mail className="h-2.5 w-2.5 mr-1" />
                                            Email Notification
                                        </Badge>
                                    </div>
                                    <Textarea
                                        placeholder="Write feedback for the student... This will be included in the email notification."
                                        value={evaluationNotes}
                                        onChange={(e) => setEvaluationNotes(e.target.value)}
                                        className="min-h-[140px] bg-slate-50 border-slate-200 focus:border-primary transition-all rounded-2xl resize-none text-sm p-4 font-medium"
                                    />
                                    <p className="text-[9px] text-muted-foreground italic text-center">
                                        The student will be notified immediately upon status change.
                                    </p>
                                </div>

                                {/* Answers Review for Evaluator */}
                                {evaluatingApplication.answers && (
                                    <div className="space-y-3 pt-4 border-t border-dashed">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3 text-primary" />
                                            <Label className="text-[10px] font-black tracking-widest text-slate-400">Review Student Answers</Label>
                                        </div>
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {(() => {
                                                try {
                                                    const answers = typeof evaluatingApplication.answers === 'string' ? JSON.parse(evaluatingApplication.answers) : evaluatingApplication.answers;
                                                    const questions = evaluatingApplication.scholarship?.questions || [];
                                                    const questionsMap = new Map(questions.map((q: any) => [q.id, q]));

                                                    const resolveQ = (id: string) => (questionsMap.get(id) as any)?.question || id;

                                                    // Array format
                                                    if (Array.isArray(answers)) {
                                                        return answers.map((a: any, idx: number) => {
                                                            const qRef = a.questionId || a.question;
                                                            const qText = typeof qRef === 'object' ? qRef.question : resolveQ(qRef);
                                                            return (
                                                                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 space-y-1">
                                                                    <p className="text-[9px] font-bold text-primary/70 leading-tight">{qText}</p>
                                                                    <p className="text-xs font-medium text-slate-700 italic">&ldquo;{a.answer || "No answer"}&rdquo;</p>
                                                                </div>
                                                            );
                                                        });
                                                    }

                                                    // Object format with populated questions
                                                    if (questions.length > 0) {
                                                        return questions.map((q: any) => (
                                                            <div key={q.id} className="p-3 rounded-xl bg-white border border-slate-100 space-y-1">
                                                                <p className="text-[9px] font-bold text-primary/70 leading-tight">{q.question}</p>
                                                                <p className="text-xs font-medium text-slate-700 italic">&ldquo;{answers[q.id] || "No answer"}&rdquo;</p>
                                                            </div>
                                                        ));
                                                    }

                                                    // Fallback: render from answer keys
                                                    return Object.entries(answers).map(([qId, ans]: [string, any], idx: number) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 space-y-1">
                                                            <p className="text-[9px] font-bold text-primary/70 leading-tight">{resolveQ(qId)}</p>
                                                            <p className="text-xs font-medium text-slate-700 italic">&ldquo;{(ans as string) || "No answer"}&rdquo;</p>
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return <p className="text-[10px] text-muted-foreground">Could not load answers.</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="p-6 bg-slate-50/50 border-t flex gap-3">
                                <Button
                                    variant="ghost"
                                    className="flex-1 rounded-xl font-bold text-xs"
                                    onClick={() => setEvaluatingApplication(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="gradient"
                                    className="flex-[2] rounded-xl font-black tracking-widest text-[10px] shadow-xl shadow-primary/20 h-11"
                                    onClick={() => {
                                        evaluate.mutate({
                                            id: evaluatingApplication.id,
                                            status: targetStatus,
                                            evaluation: evaluationNotes
                                        }, {
                                            onSuccess: () => {
                                                setEvaluatingApplication(null);
                                                setEvaluationNotes("");
                                            }
                                        });
                                    }}
                                    disabled={evaluate.isPending}
                                >
                                    {evaluate.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Commit Changes
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}

// ============================================
// CATEGORIES SECTION
// ============================================
function CategoriesSection() {
    const { list, create, update, remove } = useCategories();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const categories = useMemo(() => Array.isArray(list.data) ? list.data : list.data?.categories || [], [list.data]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Category Management</h2>
                    <p className="text-muted-foreground">Manage scholarship categories and fields of study</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="gradient" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            onSubmit={async (data) => {
                                await create.mutateAsync(data);
                                setIsCreateOpen(false);
                            }}
                            isLoading={create.isPending}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.isLoading ? (
                    <Card className="col-span-full">
                        <CardContent className="py-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                ) : categories.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="py-12 text-center text-muted-foreground">
                            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No categories found. Create your first category!</p>
                        </CardContent>
                    </Card>
                ) : (
                    categories.map((category: any) => (
                        <Card key={category.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-xl"
                                            style={{ backgroundColor: category.color || "#6366f1" }}
                                        >
                                            {category.icon || "📚"}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{category.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{category.slug}</p>
                                        </div>
                                    </div>
                                    <Badge variant={category.isActive ? "success" : "secondary"}>
                                        {category.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {category.description || "No description provided"}
                                </p>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="flex-1 gap-1">
                                                <Pencil className="h-3 w-3" />
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Category</DialogTitle>
                                            </DialogHeader>
                                            <CategoryForm
                                                initialData={category}
                                                onSubmit={async (data) => {
                                                    await update.mutateAsync({ id: category.id, data });
                                                }}
                                                isLoading={update.isPending}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <ConfirmDeleteDialog
                                        title="Delete Category"
                                        description={`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`}
                                        onConfirm={() => remove.mutate(category.id)}
                                        isLoading={remove.isPending}
                                        trigger={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </motion.div>
    );
}

// ============================================
// NOTIFICATIONS SECTION
// ============================================
function NotificationsSection() {
    const { sendNotification, sendEmail } = useNotifications();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">Send Notifications</h2>
                <p className="text-muted-foreground">Send notifications and emails to users</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Send Notification Form */}
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Send In-App Notification
                        </CardTitle>
                        <CardDescription>Send notifications to students or professors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NotificationForm
                            onSubmit={async (data) => {
                                await sendNotification.mutateAsync(data);
                            }}
                            isLoading={sendNotification.isPending}
                        />
                    </CardContent>
                </Card>

                {/* Send Email Form */}
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            Send Email Notification
                        </CardTitle>
                        <CardDescription>Send email notifications to users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmailForm
                            onSubmit={async (data) => {
                                await sendEmail.mutateAsync(data);
                            }}
                            isLoading={sendEmail.isPending}
                        />
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}

// ============================================


function CategoryForm({ initialData, onSubmit, isLoading }: {
    initialData?: any;
    onSubmit: (data: CategoryInput) => Promise<void>;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState<CategoryInput>({
        name: initialData?.name || "",
        description: initialData?.description || "",
        icon: initialData?.icon || "📚",
        color: initialData?.color || "#6366f1",
        isActive: initialData?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Category name"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description"
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Icon (Emoji)</Label>
                    <Input
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="📚"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {initialData ? "Update" : "Create"}
                </Button>
            </DialogFooter>
        </form>
    );
}

function NotificationForm({ onSubmit, isLoading }: {
    onSubmit: (data: SendNotificationInput) => Promise<void>;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState<SendNotificationInput>({
        title: "",
        message: "",
        type: "INFO",
        targetRole: "ALL",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData({ title: "", message: "", type: "INFO", targetRole: "ALL" });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Notification title"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Notification message"
                    rows={4}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INFO">Info</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="WARNING">Warning</SelectItem>
                            <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                            <SelectItem value="APPLICATION">Application</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select
                        value={formData.targetRole}
                        onValueChange={(value: any) => setFormData({ ...formData, targetRole: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Users</SelectItem>
                            <SelectItem value="STUDENT">Students Only</SelectItem>
                            <SelectItem value="PROFESSOR">Professors Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Notification
            </Button>
        </form>
    );
}

function EmailForm({ onSubmit, isLoading }: {
    onSubmit: (data: { to: string; subject: string; body: string }) => Promise<void>;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        to: "",
        subject: "",
        body: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setFormData({ to: "", subject: "", body: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>To (Email or Role)</Label>
                <Input
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="email@example.com or ALL_STUDENTS"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Email subject"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Body</Label>
                <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Email content..."
                    rows={6}
                    required
                />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send Email
            </Button>
        </form>
    );
}

function RejectDialog({ scholarshipId, onReject, isLoading, mode = "button", triggerText, confirmText }: {
    scholarshipId: string;
    onReject: (reason: string) => void;
    isLoading: boolean;
    mode?: "button" | "menu";
    triggerText?: string;
    confirmText?: string;
}) {
    const [reason, setReason] = useState("");
    const [open, setOpen] = useState(false);

    const trigger = mode === "menu" ? (
        <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-amber-600 focus:text-amber-600 focus:bg-amber-50 cursor-pointer"
            onClick={() => setOpen(true)}
        >
            <XCircle className="h-4 w-4 mr-2" />
            {triggerText || "Reject (Admin)"}
        </DropdownMenuItem>
    ) : (
        <Button
            size="sm"
            variant="outline"
            className="gap-1 text-rose-600 border-rose-200 hover:bg-rose-50 px-3 h-8"
            disabled={isLoading}
            onClick={() => setOpen(true)}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            {isLoading ? "Rejecting..." : (triggerText || "Reject")}
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110 border border-rose-200">
                        <XCircle className="h-6 w-6 text-rose-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">Reject Scholarship</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground/80">Rejection Reason</Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide a detailed reason for rejection..."
                            className="min-h-[120px] resize-none border-muted-foreground/20 focus:border-rose-300 transition-colors"
                        />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="flex-1">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            className="flex-1 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200"
                            onClick={() => {
                                onReject(reason);
                                setOpen(false);
                            }}
                            disabled={isLoading || !reason.trim()}
                        >
                            {isLoading ? <Loader2 className="h-3 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                            {confirmText || "Reject (Admin)"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StatCard({ label, value, icon: Icon, color, trend }: {
    label: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: string;
}) {
    const colorMap: Record<string, string> = {
        primary: "text-primary bg-primary/10 border-primary/20",
        success: "text-emerald-600 bg-emerald-50 border-emerald-100",
        warning: "text-amber-600 bg-amber-50 border-amber-100",
        info: "text-blue-600 bg-blue-50 border-blue-100",
        secondary: "text-indigo-600 bg-indigo-50 border-indigo-100",
        destructive: "text-rose-600 bg-rose-50 border-rose-100",
    };

    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-2.5 rounded-xl border", colorMap[color] || colorMap.primary)}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {trend && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {trend}
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] font-bold text-muted-foreground tracking-widest">{label}</p>
                    <h3 className="text-2xl font-black tracking-tight">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

function ConfirmActionDialog({
    title,
    description,
    onConfirm,
    isLoading,
    trigger,
    variant = "default",
    icon: Icon = AlertCircle,
    confirmText
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    trigger: React.ReactNode;
    variant?: "default" | "destructive" | "success" | "warning";
    icon?: any;
    confirmText?: string;
}) {
    const [open, setOpen] = useState(false);
    const variantStyles = {
        default: "bg-primary/10 text-primary border-primary/20",
        destructive: "bg-rose-100 text-rose-600 border-rose-200",
        success: "bg-emerald-100 text-emerald-600 border-emerald-200",
        warning: "bg-amber-100 text-amber-600 border-amber-200",
    };

    const buttonStyles = {
        default: "bg-primary hover:bg-primary/90 shadow-primary/40",
        destructive: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
        success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
        warning: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-none shadow-2xl">
                <DialogHeader>
                    <div className={cn("mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 border transition-transform duration-300 hover:scale-110", variantStyles[variant])}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold tracking-tight">{title}</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    <p className="text-center text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" className="flex-1 font-medium">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className={cn("flex-1 shadow-lg font-semibold", buttonStyles[variant])}
                        onClick={() => {
                            onConfirm();
                            setOpen(false);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Icon className="h-4 w-4 mr-2" />
                        )}
                        {confirmText || "Confirm Action"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ConfirmDeleteDialog({
    title,
    description,
    onConfirm,
    isLoading,
    trigger
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    trigger: React.ReactNode;
}) {
    return (
        <ConfirmActionDialog
            title={title}
            description={description}
            onConfirm={onConfirm}
            isLoading={isLoading}
            trigger={trigger}
            variant="destructive"
            icon={Trash2}
        />
    );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
    const { list, create, update, remove } = useTestimonials();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const testimonials = useMemo(() => Array.isArray(list.data) ? list.data : list.data?.testimonials || [], [list.data]);

    const filteredTestimonials = useMemo(() => testimonials.filter((t: any) => {
        const matchesSearch = t.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.quote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.role?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? t.isActive : !t.isActive);
        return matchesSearch && matchesStatus;
    }), [testimonials, searchTerm, statusFilter]);

    const handleDelete = useCallback(async (id: string) => {
        await remove.mutateAsync(id);
    }, [remove]);

    const handleToggleStatus = useCallback(async (t: Testimonial) => {
        await update.mutateAsync({ id: t.id, data: { isActive: !t.isActive } });
    }, [update]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Testimonials</h2>
                    <p className="text-muted-foreground text-sm font-medium italic">Manage social proof and success stories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search stories..."
                            className="pl-9 w-64 bg-white border-slate-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 bg-white border-slate-200 rounded-xl h-10">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="gradient"
                        onClick={() => setIsCreateOpen(true)}
                        className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                    </Button>
                </div>
            </div>

            {/* Testimonials Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-5 font-black tracking-widest text-[10px] text-slate-400">Contributor</th>
                                <th className="text-left p-5 font-black tracking-widest text-[10px] text-slate-400">Insight & Quote</th>
                                <th className="text-left p-5 font-black tracking-widest text-[10px] text-slate-400">Status</th>
                                <th className="text-left p-5 font-black tracking-widest text-[10px] text-slate-400">Created</th>
                                <th className="text-right p-5 font-black tracking-widest text-[10px] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-slate-900">
                            {filteredTestimonials.map((t: any) => (
                                <motion.tr
                                    key={t.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                                {t.avatar ? (
                                                    <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                                                ) : (
                                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{t.author}</span>
                                                <span className="text-[10px] font-medium text-slate-400 italic">{t.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 max-w-md">
                                        <div className="relative">
                                            <Quote className="h-3 w-3 text-primary/20 absolute -top-1 -left-4" />
                                            <p className="text-xs font-medium leading-relaxed italic line-clamp-2">
                                                {t.quote}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <Badge
                                            variant={t.isActive ? "success" : "secondary"}
                                            className="rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none"
                                        >
                                            {t.isActive ? "Live" : "Archived"}
                                        </Badge>
                                    </td>
                                    <td className="p-5 text-xs font-bold text-slate-400">
                                        {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                                onClick={() => setEditingTestimonial(t)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                                                onClick={() => handleToggleStatus(t)}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <ConfirmDeleteDialog
                                                title="Remove Testimonial?"
                                                description="This action cannot be undone. This testimonial will be permanently removed from the public site."
                                                onConfirm={() => handleDelete(t.id)}
                                                isLoading={remove.isPending}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredTestimonials.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <MessageSquare className="h-12 w-12 opacity-20" />
                                            <p className="text-sm font-medium italic">No testimonials match your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Testimonial Dialog (Create/Edit) */}
            <TestimonialDialog
                isOpen={isCreateOpen || !!editingTestimonial}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingTestimonial(null);
                }}
                testimonial={editingTestimonial}
                onSave={async (data) => {
                    if (editingTestimonial) {
                        await update.mutateAsync({ id: editingTestimonial.id, data });
                    } else {
                        await create.mutateAsync(data);
                    }
                    setIsCreateOpen(false);
                    setEditingTestimonial(null);
                }}
                isLoading={create.isPending || update.isPending}
            />
        </motion.div>
    );
}

function TestimonialDialog({
    isOpen,
    onClose,
    testimonial,
    onSave,
    isLoading
}: {
    isOpen: boolean;
    onClose: () => void;
    testimonial: Testimonial | null;
    onSave: (data: any) => Promise<void>;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        author: "",
        role: "",
        quote: "",
        avatar: "",
        isActive: true
    });

    useEffect(() => {
        if (testimonial) {
            setFormData({
                author: testimonial.author,
                role: testimonial.role,
                quote: testimonial.quote,
                avatar: testimonial.avatar || "",
                isActive: testimonial.isActive
            });
        } else {
            setFormData({
                author: "",
                role: "",
                quote: "",
                avatar: "",
                isActive: true
            });
        }
    }, [testimonial, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-b">
                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                        {testimonial ? "Refine Testimonial" : "Create Social Proof"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium italic">
                        {testimonial ? "Polishing someone's inspiring story." : "Add a new success story to the platform."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-slate-400">Contributor Name</Label>
                            <Input
                                placeholder="Full Name..."
                                className="rounded-xl border-slate-200 h-11 transition-all focus:ring-primary/20"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black tracking-widest text-slate-400">Their Role / Title</Label>
                            <Input
                                placeholder="e.g. Master Student..."
                                className="rounded-xl border-slate-200 h-11 transition-all focus:ring-primary/20"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black tracking-widest text-slate-400">Avatar Image URL (Optional)</Label>
                        <Input
                            placeholder="https://..."
                            className="rounded-xl border-slate-200 h-11 transition-all focus:ring-primary/20 font-mono text-xs"
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black tracking-widest text-slate-400">Their Insight & Quote</Label>
                        <Textarea
                            placeholder="Share their experience with ScholarHub..."
                            className="rounded-2xl border-slate-200 min-h-[120px] resize-none p-4 transition-all focus:ring-primary/20 leading-relaxed font-medium italic"
                            required
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="h-5 w-5 rounded-lg border-slate-300 text-primary focus:ring-primary/20"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <Label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Set as Live Immediately</Label>
                    </div>

                    <DialogFooter className="pt-4 border-t gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
                        <Button
                            type="submit"
                            variant="gradient"
                            disabled={isLoading}
                            className="rounded-xl px-10 h-11 font-black tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all hover:scale-105"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                testimonial ? "Update Entry" : "Commit Entry"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
