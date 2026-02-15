"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
    initializePusherBeams,
    stopPusherBeams,
    subscribeToInterest,
    unsubscribeFromInterest,
    getDeviceInterests,
    requestNotificationPermission,
} from "@/lib/pusher-beams";

export const usePushNotifications = () => {
    const { user, isAuthenticated } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [interests, setInterests] = useState<string[]>([]);

    // Initialize Pusher Beams when user logs in
    useEffect(() => {
        const initialize = async () => {
            if (isAuthenticated && user?.id && !isInitialized) {
                try {
                    // Request notification permission first
                    const perm = await requestNotificationPermission();
                    setPermission(perm);

                    if (perm === "granted") {
                        await initializePusherBeams(user.id);
                        setIsInitialized(true);

                        // Auto-subscribe to role-based interests
                        if (user.role) {
                            await subscribeToInterest(`role-${user.role.toLowerCase()}`);
                        }

                        // Load current interests
                        const currentInterests = await getDeviceInterests();
                        setInterests(currentInterests);
                    }
                } catch (error) {
                    console.error("Failed to initialize push notifications:", error);
                }
            }
        };

        initialize();
    }, [isAuthenticated, user, isInitialized]);

    // Cleanup on logout
    useEffect(() => {
        return () => {
            if (!isAuthenticated && isInitialized) {
                stopPusherBeams();
                setIsInitialized(false);
                setInterests([]);
            }
        };
    }, [isAuthenticated, isInitialized]);

    const subscribe = async (interest: string) => {
        try {
            await subscribeToInterest(interest);
            const currentInterests = await getDeviceInterests();
            setInterests(currentInterests);
        } catch (error) {
            console.error("Failed to subscribe:", error);
            throw error;
        }
    };

    const unsubscribe = async (interest: string) => {
        try {
            await unsubscribeFromInterest(interest);
            const currentInterests = await getDeviceInterests();
            setInterests(currentInterests);
        } catch (error) {
            console.error("Failed to unsubscribe:", error);
            throw error;
        }
    };

    const requestPermission = async () => {
        const perm = await requestNotificationPermission();
        setPermission(perm);
        return perm;
    };

    return {
        isInitialized,
        permission,
        interests,
        subscribe,
        unsubscribe,
        requestPermission,
    };
};
