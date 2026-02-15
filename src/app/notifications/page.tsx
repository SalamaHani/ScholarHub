"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
    const { list, markRead, markAllRead } = useNotifications();
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const notifications = Array.isArray(list.data) ? list.data : [];
    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    const displayedNotifications = filter === "all" ? notifications : unreadNotifications;

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "SCHOLARSHIP":
                return "bg-blue-50 border-blue-200 text-blue-700";
            case "APPLICATION":
                return "bg-purple-50 border-purple-200 text-purple-700";
            case "SUCCESS":
                return "bg-emerald-50 border-emerald-200 text-emerald-700";
            case "WARNING":
                return "bg-amber-50 border-amber-200 text-amber-700";
            default:
                return "bg-slate-50 border-slate-200 text-slate-700";
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "SCHOLARSHIP":
                return "🎓";
            case "APPLICATION":
                return "📝";
            case "SUCCESS":
                return "✅";
            case "WARNING":
                return "⚠️";
            default:
                return "ℹ️";
        }
    };

    if (list.isLoading) {
        return (
            <div className="py-8 md:py-12 min-h-screen bg-muted/20">
                <div className="container max-w-4xl space-y-6">
                    <Skeleton className="h-10 w-64" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 md:py-12 min-h-screen bg-muted/20">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Stay updated with your scholarship journey
                        </p>
                    </div>

                    {unreadNotifications.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => markAllRead.mutate()}
                            disabled={markAllRead.isPending}
                            className="gap-2"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read ({unreadNotifications.length})
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
                    <TabsList>
                        <TabsTrigger value="all" className="gap-2">
                            All
                            <Badge variant="secondary" className="h-5 text-xs">
                                {notifications.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="gap-2">
                            Unread
                            <Badge variant="secondary" className="h-5 text-xs">
                                {unreadNotifications.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Notifications List */}
                {displayedNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Bell className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filter === "all"
                                    ? "No notifications yet"
                                    : "All caught up!"}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {filter === "all"
                                    ? "We'll notify you when something important happens"
                                    : "You've read all your notifications"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {displayedNotifications.map((notification: any) => {
                            const NotificationWrapper = notification.link ? Link : "div";
                            const wrapperProps = notification.link
                                ? { href: notification.link }
                                : {};

                            return (
                                <NotificationWrapper
                                    key={notification.id}
                                    {...wrapperProps}
                                >
                                    <Card
                                        className={cn(
                                            "hover:shadow-md transition-all cursor-pointer group",
                                            !notification.isRead && "border-l-4 border-l-primary bg-primary/5"
                                        )}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="text-3xl shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-base leading-tight mb-1">
                                                                {notification.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-xs shrink-0",
                                                                getNotificationColor(notification.type)
                                                            )}
                                                        >
                                                            {notification.type}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4 pt-2">
                                                        <p className="text-xs text-muted-foreground font-medium">
                                                            {formatDistanceToNow(
                                                                new Date(notification.createdAt),
                                                                { addSuffix: true }
                                                            )}
                                                        </p>

                                                        {!notification.isRead && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    markRead.mutate(notification.id);
                                                                }}
                                                                disabled={markRead.isPending}
                                                            >
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Mark as read
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </NotificationWrapper>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
