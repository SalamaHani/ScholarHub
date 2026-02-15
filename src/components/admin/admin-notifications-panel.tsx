"use client";

import { useState } from "react";
import { Bell, Send, Users, Filter, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function AdminNotificationsPanel() {
    const { sendNotification, sendEmail } = useNotifications();
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [notificationData, setNotificationData] = useState({
        title: "",
        message: "",
        type: "INFO" as any,
        link: "",
        targetRole: "ALL",
        sendPush: false,
        interests: [] as string[],
    });

    const handleSendNotification = () => {
        if (!notificationData.title || !notificationData.message) {
            toast({
                title: "Validation Error",
                description: "Title and message are required",
                variant: "destructive",
            });
            return;
        }

        sendNotification.mutate(notificationData, {
            onSuccess: () => {
                setIsSendDialogOpen(false);
                setNotificationData({
                    title: "",
                    message: "",
                    type: "INFO",
                    link: "",
                    targetRole: "ALL",
                    sendPush: false,
                    interests: [],
                });
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                        <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +20% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">573</div>
                        <p className="text-xs text-muted-foreground">
                            Users with notifications enabled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Push Delivered</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">892</div>
                        <p className="text-xs text-muted-foreground">
                            Last 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Send Notification */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Send Notification</CardTitle>
                        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Compose Notification
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Send New Notification</DialogTitle>
                                    <DialogDescription>
                                        Send in-app and push notifications to users
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., New Scholarship Available"
                                            value={notificationData.title}
                                            onChange={(e) =>
                                                setNotificationData((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Enter notification message..."
                                            rows={4}
                                            value={notificationData.message}
                                            onChange={(e) =>
                                                setNotificationData((prev) => ({
                                                    ...prev,
                                                    message: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Type */}
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={notificationData.type}
                                                onValueChange={(value) =>
                                                    setNotificationData((prev) => ({
                                                        ...prev,
                                                        type: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="INFO">Info</SelectItem>
                                                    <SelectItem value="SUCCESS">Success</SelectItem>
                                                    <SelectItem value="WARNING">Warning</SelectItem>
                                                    <SelectItem value="SCHOLARSHIP">
                                                        Scholarship
                                                    </SelectItem>
                                                    <SelectItem value="APPLICATION">
                                                        Application
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Target Role */}
                                        <div className="space-y-2">
                                            <Label>Target Audience</Label>
                                            <Select
                                                value={notificationData.targetRole}
                                                onValueChange={(value) =>
                                                    setNotificationData((prev) => ({
                                                        ...prev,
                                                        targetRole: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ALL">All Users</SelectItem>
                                                    <SelectItem value="STUDENT">Students</SelectItem>
                                                    <SelectItem value="PROFESSOR">
                                                        Professors
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Link */}
                                    <div className="space-y-2">
                                        <Label htmlFor="link">Link (Optional)</Label>
                                        <Input
                                            id="link"
                                            placeholder="/scholarships/123"
                                            value={notificationData.link}
                                            onChange={(e) =>
                                                setNotificationData((prev) => ({
                                                    ...prev,
                                                    link: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    {/* Push Notification */}
                                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                                        <Checkbox
                                            id="sendPush"
                                            checked={notificationData.sendPush}
                                            onCheckedChange={(checked) =>
                                                setNotificationData((prev) => ({
                                                    ...prev,
                                                    sendPush: checked as boolean,
                                                }))
                                            }
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="sendPush"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Send Push Notification
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                Users will receive a browser push notification
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSendDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSendNotification}
                                        disabled={sendNotification.isPending}
                                        className="gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send Notification
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bell className="h-4 w-4" />
                        <p>
                            Quickly notify users about new scholarships, updates, and important
                            announcements
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Quick Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                setNotificationData({
                                    title: "New Scholarship Available",
                                    message:
                                        "A new scholarship matching your profile has been posted. Check it out now!",
                                    type: "SCHOLARSHIP",
                                    link: "/scholarships",
                                    targetRole: "STUDENT",
                                    sendPush: true,
                                    interests: ["role-student"],
                                });
                                setIsSendDialogOpen(true);
                            }}
                        >
                            📚 New Scholarship Alert
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                setNotificationData({
                                    title: "Application Status Update",
                                    message: "Your scholarship application has been reviewed.",
                                    type: "APPLICATION",
                                    link: "/dashboard",
                                    targetRole: "STUDENT",
                                    sendPush: true,
                                    interests: [],
                                });
                                setIsSendDialogOpen(true);
                            }}
                        >
                            ✅ Application Update
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                                setNotificationData({
                                    title: "System Maintenance",
                                    message:
                                        "Scheduled maintenance will occur on Sunday at 2 AM EST.",
                                    type: "WARNING",
                                    link: "",
                                    targetRole: "ALL",
                                    sendPush: true,
                                    interests: [],
                                });
                                setIsSendDialogOpen(true);
                            }}
                        >
                            ⚠️ System Alert
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                            <span>Default notification type</span>
                            <Badge variant="outline">INFO</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Push notifications enabled</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                Active
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Email notifications</span>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Configured
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
