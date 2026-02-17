/**
 * Pusher Channels Client
 * Real-time WebSocket connection for in-app notifications
 */

import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export type PusherConnectionState =
    | "initialized"
    | "connecting"
    | "connected"
    | "unavailable"
    | "failed"
    | "disconnected";

/**
 * Get or create the Pusher Channels singleton client.
 * Returns null if NEXT_PUBLIC_PUSHER_KEY is not set.
 */
export const getPusherClient = (): Pusher | null => {
    if (typeof window === "undefined") return null;

    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

    if (!key) {
        // Pusher Channels not configured — notifications will use polling fallback
        return null;
    }

    if (!pusherClient) {
        pusherClient = new Pusher(key, {
            cluster,
            forceTLS: true,
            authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/notifications/pusher-auth`,
            auth: {
                headers: {
                    // Auth header is set in the authTransport fetch, but we set it here too
                    Authorization: `Bearer ${
                        typeof document !== "undefined"
                            ? document.cookie
                                  .split("; ")
                                  .find((c) => c.startsWith("token="))
                                  ?.split("=")[1] || ""
                            : ""
                    }`,
                },
            },
        });
    }

    return pusherClient;
};

/**
 * Disconnect and destroy the Pusher client (call on logout)
 */
export const disconnectPusher = (): void => {
    if (pusherClient) {
        pusherClient.disconnect();
        pusherClient = null;
    }
};
