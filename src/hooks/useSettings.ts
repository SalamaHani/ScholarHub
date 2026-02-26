"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    saveSettings,
    selectSettings,
    selectSettingsLoading,
    selectSettingsSaving,
    selectSettingsError,
    selectSettingsLoaded,
    DEFAULT_SETTINGS,
    type SiteSettings,
} from "@/store/slices/settingsSlice";

// ─────────────────────────────────────────────────────────────────────────────
// Re-export types and defaults so all existing imports stay unchanged
// ─────────────────────────────────────────────────────────────────────────────

export type { SiteSettings };
export { DEFAULT_SETTINGS };

// ─────────────────────────────────────────────────────────────────────────────
// DOM helpers — applied client-side to sync API settings with the browser
// ─────────────────────────────────────────────────────────────────────────────

const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

const LANGUAGE_FONTS: Record<string, { id: string; family: string; href: string }> = {
    ar: {
        id: "font-cairo",
        family: "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap",
    },
};

function injectFontLink(id: string, href: string) {
    if (typeof document === "undefined") return;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

export function applyLangToDom(language: string) {
    if (typeof document === "undefined") return;
    const isRtl = RTL_LANGUAGES.has(language);
    const root = document.documentElement;
    root.lang = language;
    root.dir = isRtl ? "rtl" : "ltr";
    root.setAttribute("data-lang", language);
    const fontDef = LANGUAGE_FONTS[language];
    if (fontDef) {
        injectFontLink(fontDef.id, fontDef.href);
        root.style.setProperty("--font-sans", fontDef.family);
    } else {
        root.style.removeProperty("--font-sans");
    }
    window.dispatchEvent(
        new CustomEvent("scholarhub:langchange", { detail: { lang: language } })
    );
}

export function applyThemeToDom(primary: string, ring: string) {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--ring", ring);
}

function setMeta(selector: string, content: string) {
    let el = document.querySelector<HTMLMetaElement>(selector);
    if (!el) {
        el = document.createElement("meta");
        const attr = selector.match(/\[(\w+[-\w]*)="([^"]+)"\]/);
        if (attr) el.setAttribute(attr[1], attr[2]);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
    let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
    }
    el.href = href;
}

export function applyMetaToDom(settings: SiteSettings) {
    if (typeof document === "undefined") return;
    document.title = settings.metaTitle || settings.siteName;
    if (settings.metaDescription) setMeta('meta[name="description"]',        settings.metaDescription);
    if (settings.robotsMeta)      setMeta('meta[name="robots"]',              settings.robotsMeta);
    if (settings.ogTitle)         setMeta('meta[property="og:title"]',        settings.ogTitle);
    if (settings.ogDescription)   setMeta('meta[property="og:description"]',  settings.ogDescription);
    if (settings.ogImage)         setMeta('meta[property="og:image"]',        settings.ogImage);
    setMeta('meta[property="og:site_name"]', settings.siteName);
    if (settings.twitterCard)     setMeta('meta[name="twitter:card"]',        settings.twitterCard);
    if (settings.ogTitle)         setMeta('meta[name="twitter:title"]',       settings.twitterTitle || settings.ogTitle);
    if (settings.ogDescription)   setMeta('meta[name="twitter:description"]', settings.twitterDescription || settings.ogDescription);
    if (settings.twitterImage || settings.ogImage)
        setMeta('meta[name="twitter:image"]', settings.twitterImage || settings.ogImage);
    if (settings.canonicalUrl)    setLink("canonical", settings.canonicalUrl);
}

function applyAll(s: SiteSettings) {
    applyThemeToDom(s.themePrimary, s.themeRing);
    applyMetaToDom(s);
    applyLangToDom(s.defaultLanguage);
}

// ─────────────────────────────────────────────────────────────────────────────
// initSettingsFromStorage — applies user lang preference before first paint
// (called once from ThemeProvider; settings theme is now fully API-driven)
// ─────────────────────────────────────────────────────────────────────────────

const USER_LANG_KEY = "scholarhub_user_lang";

export function initSettingsFromStorage() {
    if (typeof window === "undefined") return;
    try {
        const userLang = localStorage.getItem(USER_LANG_KEY);
        if (userLang) applyLangToDom(userLang);
    } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// useSettings — Redux-backed hook with DOM application side-effects.
// Public API is identical to the previous React Query version.
// ─────────────────────────────────────────────────────────────────────────────

export function useSettings() {
    const dispatch  = useAppDispatch();
    const settings  = useAppSelector(selectSettings);
    const isLoading = useAppSelector(selectSettingsLoading);
    const isSaving  = useAppSelector(selectSettingsSaving);
    const isError   = useAppSelector(selectSettingsError);
    const isLoaded  = useAppSelector(selectSettingsLoaded);

    // Apply theme, meta, and language to the DOM whenever settings change
    useEffect(() => {
        applyAll(settings);
    }, [settings]);

    const save = useCallback(
        (updates: Partial<SiteSettings>) => {
            dispatch(saveSettings(updates));
        },
        [dispatch]
    );

    const reset = useCallback(() => {
        dispatch(saveSettings(DEFAULT_SETTINGS));
    }, [dispatch]);

    return {
        settings,
        save,
        reset,
        isLoaded: isLoaded || !isLoading,
        isSaving,
        isError,
    };
}
