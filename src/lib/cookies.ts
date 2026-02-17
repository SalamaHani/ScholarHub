/**
 * Cookie management utilities
 *
 * Auth cookies use a FIXED 7-day expiry anchored to login time.
 * The expiry is stored in `auth_expiry` and reused on every subsequent
 * setCookie call — it never resets until the user logs out.
 */

/** 7 days in seconds (cookie max-age unit) */
const AUTH_DURATION_SECONDS = 60 * 60 * 24 * 7; // 604800 s

const COOKIE_PATH = "/";
const COOKIE_SAME_SITE = "Lax" as const;

// ─── Internal helpers ──────────────────────────────────────────────────────

/** Read a raw cookie string by name (no decoding). */
function readRawCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    for (const part of document.cookie.split(";")) {
        const [k, ...v] = part.split("=");
        if (k.trim() === name) return v.join("=");
    }
    return null;
}

/**
 * Write a cookie string to document.cookie.
 * @param name     Cookie name
 * @param value    Encoded value
 * @param expires  Absolute expiry Date (uses Expires= attribute)
 */
function writeCookie(name: string, value: string, expires: Date): void {
    if (typeof document === "undefined") return;
    const isSecure =
        typeof window !== "undefined" && window.location.protocol === "https:";

    const parts = [
        `${name}=${value}`,
        `path=${COOKIE_PATH}`,
        `expires=${expires.toUTCString()}`,
        `SameSite=${COOKIE_SAME_SITE}`,
    ];
    if (isSecure) parts.push("Secure");

    document.cookie = parts.join("; ");
}

// ─── Auth-expiry anchor ────────────────────────────────────────────────────

/**
 * Call once at login. Stores the absolute expiry timestamp (Unix ms) in
 * a cookie named `auth_expiry`. If the cookie already exists (user was
 * already logged in), the existing expiry is kept — no reset.
 */
export function initAuthExpiry(): Date {
    const existing = readRawCookie("auth_expiry");
    if (existing) {
        const ts = parseInt(existing, 10);
        if (!isNaN(ts) && ts > Date.now()) {
            return new Date(ts);
        }
    }
    // First login: anchor the expiry now
    const expiry = new Date(Date.now() + AUTH_DURATION_SECONDS * 1000);
    writeCookie("auth_expiry", String(expiry.getTime()), expiry);
    return expiry;
}

/**
 * Return the stored auth expiry Date, or null if not set / already expired.
 */
export function getAuthExpiry(): Date | null {
    const raw = readRawCookie("auth_expiry");
    if (!raw) return null;
    const ts = parseInt(raw, 10);
    if (isNaN(ts) || ts <= Date.now()) return null;
    return new Date(ts);
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Read a cookie value (URL-decoded).
 */
export const getCookie = (name: string): string | null => {
    const raw = readRawCookie(name);
    return raw !== null ? decodeURIComponent(raw) : null;
};

/**
 * Set a cookie that uses the FIXED auth expiry (no reset).
 * Always call `initAuthExpiry()` before calling this at login.
 */
export const setAuthCookie = (name: string, value: string): void => {
    const expiry = getAuthExpiry();
    if (!expiry) {
        // Fallback: shouldn't happen after initAuthExpiry(), but be safe
        const fallback = new Date(Date.now() + AUTH_DURATION_SECONDS * 1000);
        writeCookie(name, encodeURIComponent(value), fallback);
        return;
    }
    writeCookie(name, encodeURIComponent(value), expiry);
};

/**
 * General-purpose cookie setter (not tied to auth expiry).
 * @deprecated Prefer `setAuthCookie` for auth-related cookies.
 */
export const setCookie = (name: string, value: string): void => {
    const expiry = new Date(Date.now() + AUTH_DURATION_SECONDS * 1000);
    writeCookie(name, encodeURIComponent(value), expiry);
};

/**
 * Delete a cookie by setting it to the past.
 */
export const deleteCookie = (name: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
};

/**
 * Delete all auth-related cookies (call on logout).
 */
export const clearAllAuthCookies = (): void => {
    ["token", "role", "user_name", "user_data", "auth_expiry"].forEach(deleteCookie);
};
