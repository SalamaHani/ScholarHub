/**
 * Pusher Beams Client Configuration
 * Handles push notification setup and authentication
 */

import * as PusherPushNotifications from "@pusher/push-notifications-web";
import api from "@/lib/axios";

let beamsClient: any = null;

export interface BeamsAuthResponse {
    token: string;
}

/**
 * Initialize Pusher Beams client
 */
export const initializePusherBeams = async (userId: string): Promise<void> => {
    if (typeof window === "undefined") {
        console.warn("Pusher Beams can only be initialized in browser environment");
        return;
    }

    const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;

    if (!instanceId) {
        console.warn("NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID not configured");
        return;
    }

    try {
        // Initialize Beams client if not already initialized
        if (!beamsClient) {
            beamsClient = new PusherPushNotifications.Client({
                instanceId: instanceId,
            });
        }

        // Start the client and authenticate
        await beamsClient.start();

        // Set user ID for authenticated notifications
        await beamsClient.setUserId(userId, {
            fetchToken: async () => {
                try {
                    const { data } = await api.post<BeamsAuthResponse>(
                        "/notifications/beams-auth",
                        { userId }
                    );
                    return data.token;
                } catch (error) {
                    console.error("Failed to fetch Beams auth token:", error);
                    throw error;
                }
            },
        });

        console.log("✅ Pusher Beams initialized successfully for user:", userId);
    } catch (error) {
        console.error("❌ Failed to initialize Pusher Beams:", error);
        throw error;
    }
};

/**
 * Stop Pusher Beams client (on logout)
 */
export const stopPusherBeams = async (): Promise<void> => {
    if (beamsClient) {
        try {
            await beamsClient.stop();
            beamsClient = null;
            console.log("✅ Pusher Beams stopped successfully");
        } catch (error) {
            console.error("❌ Failed to stop Pusher Beams:", error);
        }
    }
};

/**
 * Get current Beams client instance
 */
export const getBeamsClient = () => beamsClient;

/**
 * Subscribe to interest (topic-based notifications)
 */
export const subscribeToInterest = async (interest: string): Promise<void> => {
    if (!beamsClient) {
        console.warn("Beams client not initialized");
        return;
    }

    try {
        await beamsClient.addDeviceInterest(interest);
        console.log(`✅ Subscribed to interest: ${interest}`);
    } catch (error) {
        console.error(`❌ Failed to subscribe to interest ${interest}:`, error);
        throw error;
    }
};

/**
 * Unsubscribe from interest
 */
export const unsubscribeFromInterest = async (interest: string): Promise<void> => {
    if (!beamsClient) {
        console.warn("Beams client not initialized");
        return;
    }

    try {
        await beamsClient.removeDeviceInterest(interest);
        console.log(`✅ Unsubscribed from interest: ${interest}`);
    } catch (error) {
        console.error(`❌ Failed to unsubscribe from interest ${interest}:`, error);
        throw error;
    }
};

/**
 * Get all current device interests
 */
export const getDeviceInterests = async (): Promise<string[]> => {
    if (!beamsClient) {
        console.warn("Beams client not initialized");
        return [];
    }

    try {
        const interests = await beamsClient.getDeviceInterests();
        return interests;
    } catch (error) {
        console.error("❌ Failed to get device interests:", error);
        return [];
    }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
        console.warn("This browser does not support notifications");
        return "denied";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
};
