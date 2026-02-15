"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationBell() {
    const { list, markRead, markAllRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const notifications = Array.isArray(list.data) ? list.data : [];
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

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

    const handleMarkAsRead = (e: React.MouseEvent, notificationId: string) => {
        e.preventDefault();
        e.stopPropagation();
        markRead.mutate(notificationId);
    };

    const handleMarkAllAsRead = () => {
        markAllRead.mutate();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full hover:bg-muted"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                        <h4 className="font-bold text-sm">Notifications</h4>
                        <p className="text-xs text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleMarkAllAsRead}
                            disabled={markAllRead.isPending}
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/20 mb-3" />
                            <p className="text-sm text-muted-foreground font-medium">
                                No notifications yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                We'll notify you when something happens
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification: any) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    isMarkingRead={markRead.isPending}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="border-t p-2">
                        <Link href="/notifications" onClick={() => setIsOpen(false)}>
                            <Button
                                variant="ghost"
                                className="w-full text-xs h-8 font-semibold"
                            >
                                View all notifications
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
    onMarkAsRead: (e: React.MouseEvent, id: string) => void;
    isMarkingRead: boolean;
}

function NotificationItem({ notification, onMarkAsRead, isMarkingRead }: NotificationItemProps) {
    const NotificationWrapper = notification.link ? Link : "div";
    const wrapperProps = notification.link ? { href: notification.link } : {};

    return (
        <NotificationWrapper
            {...wrapperProps}
            className={cn(
                "block px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                !notification.isRead && "bg-primary/5"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm leading-tight line-clamp-1">
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>

                {/* Mark as read button */}
                {!notification.isRead && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => onMarkAsRead(e, notification.id)}
                        disabled={isMarkingRead}
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </NotificationWrapper>
    );
}

function getNotificationIcon(type: string) {
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
}
