"use client";

import { useState, useEffect } from "react";
import { getT, type Translations } from "@/lib/i18n";

const USER_LANG_KEY   = "scholarhub_user_lang";
const SETTINGS_KEY    = "scholarhub_settings";
export const LANG_CHANGE_EVENT = "scholarhub:langchange";

function readCurrentLang(): string {
    if (typeof window === "undefined") return "en";
    const userPref = localStorage.getItem(USER_LANG_KEY);
    if (userPref) return userPref;
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
            const s = JSON.parse(raw);
            if (s.defaultLanguage) return s.defaultLanguage;
        }
    } catch {}
    return "en";
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
