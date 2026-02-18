"use client";

import { useEffect } from "react";
import { initSettingsFromStorage } from "@/hooks/useSettings";

/**
 * ThemeProvider — applies the admin-saved theme color from localStorage
 * before the first visible paint to avoid a flash of the default color.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initSettingsFromStorage();
    }, []);

    return <>{children}</>;
}
