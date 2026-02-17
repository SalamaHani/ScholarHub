"use client";

import { useEffect, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Bell, RefreshCw } from "lucide-react";

/**
 * Pusher Connection Status Component
 * Shows real-time Pusher Beams connection status
 * Helps debug notification issues
 */
export function PusherConnectionStatus() {
    const { user, isAuthenticated } = useAuth();
    const { isInitialized, permission, interests, requestPermission } = usePushNotifications();
    const [beamsStatus, setBeamsStatus] = useState<"connected" | "disconnected" | "error">("disconnected");

    useEffect(() => {
        if (isInitialized) {
            setBeamsStatus("connected");
        } else if (isAuthenticated && permission === "denied") {
            setBeamsStatus("error");
        } else {
            setBeamsStatus("disconnected");
        }
    }, [isInitialized, isAuthenticated, permission]);

    const getStatusColor = () => {
        switch (beamsStatus) {
            case "connected":
                return "bg-green-500";
            case "error":
                return "bg-red-500";
            default:
                return "bg-yellow-500";
        }
    };

    const getStatusIcon = () => {
        switch (beamsStatus) {
            case "connected":
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case "error":
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-600" />;
        }
    };

    const getStatusText = () => {
        switch (beamsStatus) {
            case "connected":
                return "Connected";
            case "error":
                return "Error";
            default:
                return "Disconnected";
        }
    };

    if (!isAuthenticated) {
        return null; // Don't show for non-authenticated users
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Push Notification Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Overall Status */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                        {getStatusIcon()}
                        <div>
                            <p className="font-semibold">Pusher Beams</p>
                            <p className="text-sm text-muted-foreground">{getStatusText()}</p>
                        </div>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse`} />
                </div>

                {/* Detailed Status */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Authentication */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">User Authentication</p>
                        <Badge variant={isAuthenticated ? "default" : "secondary"}>
                            {isAuthenticated ? "✓ Authenticated" : "Not Authenticated"}
                        </Badge>
                    </div>

                    {/* Browser Permission */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Browser Permission</p>
                        <Badge
                            variant={
                                permission === "granted"
                                    ? "default"
                                    : permission === "denied"
                                    ? "destructive"
                                    : "secondary"
                            }
                        >
                            {permission === "granted" && "✓ Granted"}
                            {permission === "denied" && "✗ Denied"}
                            {permission === "default" && "⚠ Not Requested"}
                        </Badge>
                    </div>

                    {/* Pusher Initialization */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Pusher Beams</p>
                        <Badge variant={isInitialized ? "default" : "secondary"}>
                            {isInitialized ? "✓ Initialized" : "Not Initialized"}
                        </Badge>
                    </div>

                    {/* User ID */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">User ID</p>
                        <Badge variant="outline" className="font-mono text-xs">
                            {user?.id ? `${user.id.substring(0, 8)}...` : "N/A"}
                        </Badge>
                    </div>
                </div>

                {/* Subscribed Interests */}
                {interests.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Subscribed Interests</p>
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <Badge key={interest} variant="outline">
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {permission !== "granted" && isAuthenticated && (
                    <div className="pt-4 border-t">
                        <Button onClick={requestPermission} className="w-full">
                            <Bell className="h-4 w-4 mr-2" />
                            Enable Push Notifications
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Click to request browser notification permission
                        </p>
                    </div>
                )}

                {/* Connection Help */}
                {beamsStatus === "error" && (
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                            Connection Error
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                            {permission === "denied"
                                ? "Browser notifications are blocked. Please enable them in your browser settings."
                                : "Failed to initialize Pusher Beams. Check console for details."}
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {beamsStatus === "connected" && (
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            ✓ Push Notifications Active
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                            You will receive browser notifications for new updates.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/**
 * Compact Pusher Status Indicator (for navbar/footer)
 */
export function PusherStatusIndicator() {
    const { isInitialized, permission } = usePushNotifications();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    const isConnected = isInitialized && permission === "granted";

    return (
        <div className="flex items-center gap-2">
            <div
                className={`h-2 w-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-yellow-500"
                } ${isConnected ? "animate-pulse" : ""}`}
            />
            <span className="text-xs text-muted-foreground">
                {isConnected ? "Push Active" : "Push Inactive"}
            </span>
        </div>
    );
}
