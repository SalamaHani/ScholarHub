"use client";

import { useState, useEffect } from "react";
import { getT, type Translations } from "@/lib/i18n";

const USER_LANG_KEY   = "scholarhub_user_lang";
export const LANG_CHANGE_EVENT = "scholarhub:langchange";

function readCurrentLang(): string {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(USER_LANG_KEY) ?? document.documentElement.lang ?? "en";
}

/**
 * Reactive translation hook.
 * Re-renders automatically when the user or admin changes the language.
 *
 * Usage:
 *   const { t, lang } = useTranslation();
 *   <p>{t.nav.home}</p>
 */
export function useTranslation(): { t: Translations; lang: string } {
    const [lang, setLang] = useState<string>("en");

    useEffect(() => {
        // Sync with the real value after hydration
        setLang(readCurrentLang());

        const handler = (e: Event) => {
            const detail = (e as CustomEvent<{ lang: string }>).detail;
            if (detail?.lang) setLang(detail.lang);
        };

        window.addEventListener(LANG_CHANGE_EVENT, handler);
        return () => window.removeEventListener(LANG_CHANGE_EVENT, handler);
    }, []);

    return { t: getT(lang), lang };
}
