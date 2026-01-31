/**
 * Professional cookie management utilities
 */

export const COOKIE_OPTIONS = {
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days (seconds)
    sameSite: "Lax" as const,
};

export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        let [key, ...valueParts] = cookie.split("=");
        key = key.trim();
        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }
    return null;
};

export const setCookie = (name: string, value: string): void => {
    if (typeof document === "undefined") return;

    // Check if secure is needed (HTTPS only)
    const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";

    const cookieOptions = [
        `${name}=${encodeURIComponent(value)}`,
        `path=${COOKIE_OPTIONS.path}`,
        `max-age=${COOKIE_OPTIONS.maxAge}`,
        `SameSite=${COOKIE_OPTIONS.sameSite}`,
    ];

    if (isSecure) {
        cookieOptions.push("Secure");
    }

    document.cookie = cookieOptions.join("; ");
};

export const deleteCookie = (name: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
};

export const clearAllAuthCookies = (): void => {
    ["token", "role", "user_name", "user_data"].forEach(deleteCookie);
};
