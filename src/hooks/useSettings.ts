"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export interface SiteSettings {
    // ── Theme ────────────────────────────────────────────────────────────────
    themePrimary: string;
    themeRing: string;

    // ── Project Info ─────────────────────────────────────────────────────────
    siteName: string;
    siteDescription: string;
    contactEmail: string;

    // ── Appearance & Branding ────────────────────────────────────────────────
    logoUrl: string;
    faviconUrl: string;

    // ── Social Links ─────────────────────────────────────────────────────────
    facebookUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
    instagramUrl: string;

    // ── System / Feature Flags ───────────────────────────────────────────────
    maintenanceMode: boolean;
    studentsOpen: boolean;
    professorsOpen: boolean;
    allowGoogleAuth: boolean;
    requireEmailVerification: boolean;

    // ── Localization ─────────────────────────────────────────────────────────
    defaultLanguage: string;
    timezone: string;

    // ── Footer ───────────────────────────────────────────────────────────────
    footerText: string;
    copyrightText: string;

    // ── Analytics & Integrations ─────────────────────────────────────────────
    googleAnalyticsId: string;

    // ── SEO / Basic Meta ─────────────────────────────────────────────────────
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;

    // ── Open Graph ───────────────────────────────────────────────────────────
    ogTitle: string;
    ogDescription: string;
    ogImage: string;

    // ── Twitter / X Card ─────────────────────────────────────────────────────
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
}

const STORAGE_KEY = "scholarhub_settings";

export const DEFAULT_SETTINGS: SiteSettings = {
    themePrimary: "217 91% 60%",
    themeRing: "217 91% 60%",
    siteName: "ScholarHub",
    siteDescription: "Connecting students with scholarship opportunities worldwide.",
    contactEmail: "admin@scholarhub.com",
    logoUrl: "",
    faviconUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    maintenanceMode: false,
    studentsOpen: true,
    professorsOpen: true,
    allowGoogleAuth: true,
    requireEmailVerification: true,
    defaultLanguage: "en",
    timezone: "UTC",
    footerText: "Connecting students with scholarship opportunities worldwide.",
    copyrightText: `© ${new Date().getFullYear()} ScholarHub. All rights reserved.`,
    googleAnalyticsId: "",
    metaTitle: "ScholarHub - Find Scholarships for Students Worldwide",
    metaDescription:
        "ScholarHub helps students worldwide discover and access scholarship opportunities for academic and professional growth.",
    metaKeywords:
        "scholarships, students, worldwide, education, financial aid, study abroad, university",
    ogTitle: "ScholarHub - Find Scholarships for Students Worldwide",
    ogDescription:
        "Empowering students worldwide to discover scholarship opportunities for academic and professional growth.",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
};

// Languages that use RTL layout
const RTL_LANGUAGES = new Set(["ar", "he", "fa", "ur"]);

// Font definitions per language family
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

/**
 * Applies language, direction, and font to the document root.
 * Called on every settings change and on initial load from localStorage.
 */
export function applyLangToDom(language: string) {
    if (typeof document === "undefined") return;

    const isRtl = RTL_LANGUAGES.has(language);
    const root = document.documentElement;

    // 1 ─ lang + dir attributes
    root.lang = language;
    root.dir = isRtl ? "rtl" : "ltr";

    // 2 ─ data attribute used for CSS targeting
    root.setAttribute("data-lang", language);

    // 3 ─ load & apply the correct font
    const fontDef = LANGUAGE_FONTS[language];
    if (fontDef) {
        injectFontLink(fontDef.id, fontDef.href);
        root.style.setProperty("--font-sans", fontDef.family);
    } else {
        // Restore default (Inter / system-ui)
        root.style.removeProperty("--font-sans");
    }

    // 4 ─ notify all useTranslation() subscribers
    window.dispatchEvent(
        new CustomEvent("scholarhub:langchange", { detail: { lang: language } })
    );
}

function loadFromStorage(): SiteSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function applyThemeToDom(primary: string, ring: string) {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--ring", ring);
}

function applyMetaToDom(settings: SiteSettings) {
    if (typeof document === "undefined") return;
    document.title = settings.metaTitle || settings.siteName;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", settings.metaDescription);
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute("content", settings.ogTitle);
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute("content", settings.ogDescription);
    const ogImageEl = document.querySelector('meta[property="og:image"]');
    if (ogImageEl && settings.ogImage) ogImageEl.setAttribute("content", settings.ogImage);
}

function applyAll(s: SiteSettings) {
    applyThemeToDom(s.themePrimary, s.themeRing);
    applyMetaToDom(s);
    applyLangToDom(s.defaultLanguage);
}

function normalise(raw: any): SiteSettings {
    return { ...DEFAULT_SETTINGS, ...(raw?.data ?? raw) };
}

export function useSettings() {
    const queryClient = useQueryClient();

    const {
        data: settings = DEFAULT_SETTINGS,
        isLoading,
        isError,
    } = useQuery<SiteSettings>({
        queryKey: ["admin-settings"],
        queryFn: async () => {
            const { data } = await api.get("/admin/settings");
            const s = normalise(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
            return s;
        },
        placeholderData: loadFromStorage,
        staleTime: 1000 * 60 * 5,
    });

    // Apply theme + meta + lang whenever settings change
    useEffect(() => {
        applyAll(settings);
    }, [settings]);

    const saveMutation = useMutation<SiteSettings, Error, Partial<SiteSettings>>({
        mutationFn: async (updates) => {
            const merged = { ...settings, ...updates };
            const { data } = await api.put("/admin/settings", merged);
            return normalise(data);
        },
        onSuccess: (saved) => {
            queryClient.setQueryData(["admin-settings"], saved);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            applyAll(saved);
            toast({ title: "Settings saved", description: "Platform settings updated successfully." });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            });
        },
    });

    const save = useCallback(
        (updates: Partial<SiteSettings>) => saveMutation.mutate(updates),
        [saveMutation]
    );

    const reset = useCallback(
        () => saveMutation.mutate(DEFAULT_SETTINGS),
        [saveMutation]
    );

    return {
        settings,
        save,
        reset,
        isLoaded: !isLoading,
        isSaving: saveMutation.isPending,
        isError,
    };
}

const USER_LANG_KEY = "scholarhub_user_lang";

/**
 * Lightweight initializer — called once at app root (ThemeProvider) to apply
 * saved theme, lang, and dir from localStorage before the first visible paint.
 * Priority: user personal preference > admin-configured default.
 */
export function initSettingsFromStorage() {
    if (typeof window === "undefined") return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const s: Partial<SiteSettings> = JSON.parse(raw);
            if (s.themePrimary) document.documentElement.style.setProperty("--primary", s.themePrimary);
            if (s.themeRing) document.documentElement.style.setProperty("--ring", s.themeRing);
        }

        // User personal language preference takes priority over admin default
        const userLang = localStorage.getItem(USER_LANG_KEY);
        if (userLang) {
            applyLangToDom(userLang);
            return;
        }

        // Fall back to admin-configured default language
        if (raw) {
            const s: Partial<SiteSettings> = JSON.parse(raw);
            if (s.defaultLanguage) applyLangToDom(s.defaultLanguage);
        }
    } catch {}
}
