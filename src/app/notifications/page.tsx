"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const router = useRouter();
    const { list, markRead } = useNotifications();
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const notifications = Array.isArray(list.data?.notifications)
        ? list.data.notifications
        : Array.isArray(list.data)
        ? list.data
        : [];

    const unreadNotifications = notifications.filter((n: any) => !n.isRead);
    const displayedNotifications =
        filter === "all" ? notifications : unreadNotifications;

    const VALID_ROUTES = [
        "/scholarships",
        "/applications",
        "/notifications",
        "/dashboard",
        "/profile",
        "/saved",
        "/documents",
        "/deadlines",
        "/categories",
    ];

    const isValidRoute = (link: string): boolean => {
        try {
            const path = link.startsWith("http") ? new URL(link).pathname : link;
            return VALID_ROUTES.some((r) => path === r || path.startsWith(r + "/"));
        } catch {
            return false;
        }
    };

    // Click a notification → mark it as read, then navigate to its link
    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markRead.mutate(notification.id);
        }
        if (!notification.link) return;
        if (!isValidRoute(notification.link)) return;

        try {
            const path = notification.link.startsWith("http")
                ? new URL(notification.link).pathname
                : notification.link;
            router.push(path);
        } catch {
            // Malformed URL — do nothing
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

    if (list.isError) {
        return (
            <div className="py-8 md:py-12 min-h-screen bg-muted/20">
                <div className="container max-w-4xl">
                    <Card>
                        <CardContent className="py-20 flex flex-col items-center text-center gap-4">
                            <Bell className="h-16 w-16 text-muted-foreground/20 mx-auto" />
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Could not load notifications</h3>
                                <p className="text-muted-foreground text-sm">
                                    Something went wrong while fetching your notifications. Please try again.
                                </p>
                            </div>
                            <button
                                onClick={() => list.refetch()}
                                className="text-sm text-primary underline underline-offset-2"
                            >
                                Retry
                            </button>
                        </CardContent>
                    </Card>
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
                        <p className="text-muted-foreground text-sm">
                            Click a notification to mark it as read
                        </p>
                    </div>

                    {unreadNotifications.length > 0 && (
                        <Badge
                            variant="secondary"
                            className="text-sm px-3 py-1 self-start md:self-auto"
                        >
                            {unreadNotifications.length} unread
                        </Badge>
                    )}
                </div>

                {/* Filter tabs */}
                <Tabs
                    value={filter}
                    onValueChange={(v) => setFilter(v as "all" | "unread")}
                    className="mb-6"
                >
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

                {/* List */}
                {displayedNotifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Bell className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {filter === "all" ? "No notifications yet" : "All caught up!"}
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
                        {displayedNotifications.map((notification: any) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleNotificationClick(notification)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface NotificationCardProps {
    notification: any;
    onClick: () => void;
}

function NotificationCard({ notification, onClick }: NotificationCardProps) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case "SCHOLARSHIP": return "bg-blue-50 border-blue-200 text-blue-700";
            case "APPLICATION":  return "bg-purple-50 border-purple-200 text-purple-700";
            case "SUCCESS":      return "bg-emerald-50 border-emerald-200 text-emerald-700";
            case "WARNING":      return "bg-amber-50 border-amber-200 text-amber-700";
            default:             return "bg-slate-50 border-slate-200 text-slate-700";
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "SCHOLARSHIP": return "🎓";
            case "APPLICATION":  return "📝";
            case "SUCCESS":      return "✅";
            case "WARNING":      return "⚠️";
            default:             return "ℹ️";
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={cn(
                "w-full outline-none rounded-xl transition-all cursor-pointer group",
                "border bg-card shadow-sm",
                "hover:shadow-md hover:border-primary/40",
                "focus-visible:ring-2 focus-visible:ring-primary/40",
                !notification.isRead && "border-l-4 border-l-primary bg-primary/[0.02]"
            )}
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className="text-3xl shrink-0">{getIcon(notification.type)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className={cn(
                                    "text-base leading-snug mb-0.5",
                                    notification.isRead
                                        ? "font-semibold text-foreground/80"
                                        : "font-bold text-foreground"
                                )}>
                                    {notification.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {notification.message}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs shrink-0", getTypeColor(notification.type))}
                                >
                                    {notification.type}
                                </Badge>
                                {!notification.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 pt-1">
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                })}
                            </p>

                            {notification.isRead ? (
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60 font-medium">
                                    <Check className="h-3 w-3" />
                                    Read
                                </span>
                            ) : (
                                <span className="text-[11px] text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to mark as read
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
