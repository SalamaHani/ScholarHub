"use client";

import { PusherConnectionStatus } from "@/components/notifications/pusher-connection-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function TestPusherPage() {
    const { user, isAuthenticated } = useAuth();
    const { isInitialized, permission, interests } = usePushNotifications();
    const { sendNotification } = useNotifications();
    const [isSending, setIsSending] = useState(false);

    const handleSendTestNotification = async () => {
        if (!user || user.role !== "ADMIN") {
            toast({
                title: "Error",
                description: "Only admins can send test notifications",
                variant: "destructive",
            });
            return;
        }

        setIsSending(true);
        try {
            await sendNotification.mutateAsync({
                title: "🧪 Test Push Notification",
                message: "This is a test notification from Pusher Beams!",
                type: "INFO",
                link: "/notifications",
                targetRole: "ALL",
                sendPush: true,
            });

            toast({
                title: "Success",
                description: "Test notification sent! Check your browser notifications.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send test notification",
                variant: "destructive",
            });
        } finally {
            setIsSending(false);
        }
    };

    const runConsoleTest = () => {
        console.log("🧪 Running Pusher Connection Test...\n");
        console.log("1️⃣ User Authenticated:", isAuthenticated);
        console.log("2️⃣ Pusher Initialized:", isInitialized);
        console.log("3️⃣ Browser Permission:", permission);
        console.log("4️⃣ Subscribed Interests:", interests);
        console.log("5️⃣ User ID:", user?.id);
        console.log("6️⃣ User Role:", user?.role);

        if (typeof window !== "undefined" && "Notification" in window) {
            console.log("7️⃣ Browser Supports Notifications:", true);
            console.log("8️⃣ Current Permission:", Notification.permission);
        }

        console.log("\n🎉 Test Complete! Check output above.");

        toast({
            title: "Console Test Complete",
            description: "Check browser console (F12) for detailed results",
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>🔒 Authentication Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Please login to test Pusher notifications.
                        </p>
                        <Button className="mt-4" onClick={() => window.location.href = "/auth/login"}>
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container py-8 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">🧪 Pusher Connection Test</h1>
                <p className="text-muted-foreground mt-2">
                    Verify Pusher Beams connection and test push notifications
                </p>
            </div>

            {/* Connection Status */}
            <PusherConnectionStatus />

            {/* Quick Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">User</p>
                            <p className="font-medium">{user?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <Badge>{user?.role || "N/A"}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Instance ID</p>
                            <p className="font-mono text-xs">
                                {process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || "Not configured"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Environment</p>
                            <p className="font-medium">
                                {process.env.NODE_ENV === "production" ? "Production" : "Development"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Test Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Console Test */}
                    <Button
                        onClick={runConsoleTest}
                        variant="outline"
                        className="w-full"
                    >
                        Run Console Test
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Prints connection details to browser console (F12)
                    </p>

                    {/* Send Test Notification (Admin Only) */}
                    {user?.role === "ADMIN" && (
                        <>
                            <Button
                                onClick={handleSendTestNotification}
                                disabled={!isInitialized || isSending}
                                className="w-full"
                            >
                                {isSending ? "Sending..." : "Send Test Push Notification"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Sends a test notification via Pusher Beams
                            </p>
                        </>
                    )}

                    {/* Browser Notification Test */}
                    <Button
                        onClick={() => {
                            if (Notification.permission === "granted") {
                                new Notification("🧪 Browser Test", {
                                    body: "If you see this, browser notifications work!",
                                    icon: "/logo.png",
                                });
                                toast({
                                    title: "Test Sent",
                                    description: "Browser notification sent!",
                                });
                            } else {
                                toast({
                                    title: "Permission Required",
                                    description: "Please allow notifications first",
                                    variant: "destructive",
                                });
                            }
                        }}
                        variant="outline"
                        className="w-full"
                        disabled={permission !== "granted"}
                    >
                        Test Browser Notification
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Tests native browser notifications (bypasses Pusher)
                    </p>
                </CardContent>
            </Card>

            {/* Help */}
            <Card>
                <CardHeader>
                    <CardTitle>Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div>
                        <p className="font-medium">❌ Not Connected?</p>
                        <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                            <li>Make sure you allowed browser notifications</li>
                            <li>Check console (F12) for errors</li>
                            <li>Verify backend is running on port 8080</li>
                            <li>Try logout and login again</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium">❌ No Notifications Appearing?</p>
                        <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                            <li>Check Pusher Beams is initialized (green status above)</li>
                            <li>Verify you're subscribed to interests</li>
                            <li>Check backend logs for "Push notification sent"</li>
                            <li>Try the browser notification test first</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-medium">📚 Documentation</p>
                        <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-1">
                            <li>AUTO_PUSH_NOTIFICATION_SETUP.md - Full implementation guide</li>
                            <li>PUSHER_FRONTEND_TEST.md - Testing guide</li>
                            <li>NOTIFICATION_SYSTEM_TEST_REPORT.md - Test report</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
