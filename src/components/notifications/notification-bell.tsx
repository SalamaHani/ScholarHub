"use client";

import { useState } from "react";
import { Bell, ExternalLink, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { usePusherNotifications } from "@/hooks/usePusherNotifications";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export function NotificationBell() {
    const router = useRouter();
    const { user } = useAuth();
    const { list, markRead } = useNotifications();
    const { isConnected, isPusherConfigured } = usePusherNotifications(user?.id);
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const notifications = Array.isArray(list.data?.notifications)
        ? list.data.notifications
        : Array.isArray(list.data)
        ? list.data
        : [];

    const unreadCount = notifications.filter((n: any) => !n.isRead).length;
    const hasPusherError = isPusherConfigured && !isConnected && list.isError;

    // Known valid route prefixes — prevents navigating to a 404
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

    // Mark a single notification as read, then navigate to its link (or /notifications if link is invalid)
    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) {
            markRead.mutate(notification.id);
        }
        setIsOpen(false);
        if (notification.link && isValidRoute(notification.link)) {
            // Strip domain if it's an absolute URL
            const path = notification.link.startsWith("http")
                ? new URL(notification.link).pathname
                : notification.link;
            router.push(path);
        } else {
            // Fallback: open the full notifications page
            router.push("/notifications");
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full hover:bg-muted"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />

                    {/* Unread count badge */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}

                    {/* Connection error dot */}
                    {hasPusherError && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-1 ring-background" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <h4 className="font-bold text-sm">{t.notifications.title}</h4>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} ${t.notifications.unread}` : t.notifications.allCaughtUp}
                        </p>
                    </div>

                    {/* Real-time status dot */}
                    {isPusherConfigured && (
                        <span
                            title={isConnected ? t.notifications.realTimeConnected : t.notifications.realTimeDisconnected}
                            className={cn(
                                "h-2 w-2 rounded-full",
                                isConnected ? "bg-green-500 animate-pulse" : "bg-orange-400"
                            )}
                        />
                    )}
                </div>

                {/* API error banner */}
                {list.isError && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950 text-xs text-orange-700 dark:text-orange-300">
                        <WifiOff className="h-3 w-3 shrink-0" />
                        <span>{t.notifications.retryingDesc}</span>
                    </div>
                )}

                {/* Notification list */}
                <ScrollArea className="h-[380px]">
                    {list.isLoading ? (
                        <div className="space-y-1 p-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/20 mb-3" />
                            <p className="text-sm text-muted-foreground font-medium">
                                {t.notifications.emptyTitle}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t.notifications.willNotify}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification: any) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onClick={() => handleNotificationClick(notification)}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="border-t p-2">
                        <Link href="/notifications" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full text-xs h-8 font-semibold">
                                {t.notifications.viewAll}
                                <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface NotificationItemProps {
    notification: any;
    onClick: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            className={cn(
                "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                "hover:bg-muted/50 focus-visible:bg-muted/50 outline-none",
                !notification.isRead && "bg-primary/5 hover:bg-primary/10"
            )}
        >
            {/* Type icon */}
            <div className="text-xl shrink-0 mt-0.5 w-8 text-center">
                {getNotificationIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                        "text-sm leading-snug line-clamp-1",
                        notification.isRead ? "font-medium text-foreground/80" : "font-bold text-foreground"
                    )}>
                        {notification.title}
                    </p>

                    {/* Unread indicator dot */}
                    {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.message}
                </p>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                    <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>

                    <Badge
                        variant="outline"
                        className={cn("text-[9px] h-4 px-1.5 font-medium", getTypeBadgeClass(notification.type))}
                    >
                        {notification.type}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

function getNotificationIcon(type: string) {
    switch (type) {
        case "SCHOLARSHIP": return "🎓";
        case "APPLICATION":  return "📝";
        case "SUCCESS":      return "✅";
        case "WARNING":      return "⚠️";
        default:             return "ℹ️";
    }
}

function getTypeBadgeClass(type: string) {
    switch (type) {
        case "SCHOLARSHIP": return "border-blue-200 text-blue-600 bg-blue-50";
        case "APPLICATION":  return "border-purple-200 text-purple-600 bg-purple-50";
        case "SUCCESS":      return "border-emerald-200 text-emerald-600 bg-emerald-50";
        case "WARNING":      return "border-amber-200 text-amber-600 bg-amber-50";
        default:             return "border-slate-200 text-slate-600 bg-slate-50";
    }
}
