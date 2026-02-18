"use client";

import { useState, useEffect, useCallback } from "react";

export interface SiteSettings {
    // Theme
    themePrimary: string;
    themeRing: string;
    // Project info
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    // System
    maintenanceMode: boolean;
    studentsOpen: boolean;
    professorsOpen: boolean;
    // SEO / Metadata
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
}

const STORAGE_KEY = "scholarhub_settings";

const DEFAULT_SETTINGS: SiteSettings = {
    themePrimary: "217 91% 60%",
    themeRing: "217 91% 60%",
    siteName: "ScholarHub",
    siteDescription: "Connecting students with scholarship opportunities worldwide.",
    contactEmail: "admin@scholarhub.com",
    maintenanceMode: false,
    studentsOpen: true,
    professorsOpen: true,
    metaTitle: "ScholarHub - Find Scholarships for Students Worldwide",
    metaDescription: "ScholarHub helps students worldwide discover and access scholarship opportunities for academic and professional growth.",
    metaKeywords: "scholarships, students, worldwide, education, financial aid, study abroad, university",
    ogTitle: "ScholarHub - Find Scholarships for Students Worldwide",
    ogDescription: "Empowering students worldwide to discover scholarship opportunities for academic and professional growth.",
    ogImage: "",
};

function loadSettings(): SiteSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

function applyThemeToDom(primary: string, ring: string) {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--ring", ring);
}

function applyMetaToDom(settings: SiteSettings) {
    if (typeof document === "undefined") return;
    // Update browser tab title
    document.title = settings.metaTitle || settings.siteName;
    // Update meta description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", settings.metaDescription);
    // Update OG tags
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute("content", settings.ogTitle);
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute("content", settings.ogDescription);
    const ogImageEl = document.querySelector('meta[property="og:image"]');
    if (ogImageEl && settings.ogImage) ogImageEl.setAttribute("content", settings.ogImage);
}

export function useSettings() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = loadSettings();
        setSettings(saved);
        applyThemeToDom(saved.themePrimary, saved.themeRing);
        applyMetaToDom(saved);
        setIsLoaded(true);
    }, []);

    const save = useCallback((updates: Partial<SiteSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            applyThemeToDom(next.themePrimary, next.themeRing);
            applyMetaToDom(next);
            return next;
        });
    }, []);

    const reset = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSettings(DEFAULT_SETTINGS);
        applyThemeToDom(DEFAULT_SETTINGS.themePrimary, DEFAULT_SETTINGS.themeRing);
        applyMetaToDom(DEFAULT_SETTINGS);
    }, []);

    return { settings, save, reset, isLoaded };
}

// Lightweight initializer — call this once at app root to apply saved theme before first paint
export function initSettingsFromStorage() {
    if (typeof window === "undefined") return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const s: Partial<SiteSettings> = JSON.parse(raw);
        if (s.themePrimary) document.documentElement.style.setProperty("--primary", s.themePrimary);
        if (s.themeRing) document.documentElement.style.setProperty("--ring", s.themeRing);
    } catch {}
}
