"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Flat interface — all consumers (footer, navbar, contact, admin) use this.
// Field names are intentionally kept stable; normalise() maps the nested API
// response onto these fields so no consumer file needs to change.
// ─────────────────────────────────────────────────────────────────────────────
export interface SiteSettings {
    // ── Theme (derived from branding.primaryColor, stored as HSL for CSS vars) ─
    themePrimary: string;
    themeRing: string;

    // ── Site info ──────────────────────────────────────────────────────────────
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;

    // ── Branding ───────────────────────────────────────────────────────────────
    logoUrl: string;       // ← site.siteLogoUrl
    faviconUrl: string;    // ← site.siteFaviconUrl

    // ── Social ─────────────────────────────────────────────────────────────────
    facebookUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    youtubeUrl: string;

    // ── Feature flags ──────────────────────────────────────────────────────────
    maintenanceMode: boolean;
    maintenanceMessage: string;
    registrationEnabled: boolean;
    studentsOpen: boolean;       // kept for admin UI (maps to registrationEnabled)
    professorsOpen: boolean;     // admin UI only — no API equivalent
    allowGoogleAuth: boolean;    // admin UI only — no API equivalent
    requireEmailVerification: boolean;

    // ── Localisation ───────────────────────────────────────────────────────────
    defaultLanguage: string;
    timezone: string;

    // ── Footer ─────────────────────────────────────────────────────────────────
    footerText: string;
    copyrightText: string;

    // ── SEO / meta ─────────────────────────────────────────────────────────────
    googleAnalyticsId: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;             // ← seo.ogImageUrl
    twitterCard: string;         // ← seo.twitterCard  e.g. "summary_large_image"
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    robotsMeta: string;          // ← seo.robotsMeta  e.g. "index, follow"
    canonicalUrl: string;        // ← seo.canonicalUrl

    // ── Platform ───────────────────────────────────────────────────────────────
    maxFileSizeMB: number;
}

const STORAGE_KEY = "scholarhub_settings";

export const DEFAULT_SETTINGS: SiteSettings = {
    themePrimary: "217 91% 60%",
    themeRing: "217 91% 60%",
    siteName: "ScholarHub",
    siteDescription: "Connecting students with scholarship opportunities worldwide.",
    contactEmail: "admin@scholarhub.com",
    supportEmail: "",
    logoUrl: "",
    faviconUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    maintenanceMode: false,
    maintenanceMessage: "We are currently under maintenance. Please check back soon.",
    registrationEnabled: true,
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
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    robotsMeta: "index, follow",
    canonicalUrl: "",
    maxFileSizeMB: 10,
};

// ─────────────────────────────────────────────────────────────────────────────
// Color helpers — shared with admin page which has its own copies; duplicated
// here so useSettings is self-contained and can convert for save/apply.
// ─────────────────────────────────────────────────────────────────────────────
function hexToHsl(hex: string): string {
    if (!hex || !hex.startsWith("#")) return DEFAULT_SETTINGS.themePrimary;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hsl: string): string {
    const parts = hsl.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return "#3b82f6";
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const rv = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const gv = Math.round(hue2rgb(p, q, h) * 255);
    const bv = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    return `#${rv.toString(16).padStart(2, "0")}${gv.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// normalise — flatten nested API response → flat SiteSettings
//
// API shape: { success, message, data: { settings: { platform, site, … } } }
// ─────────────────────────────────────────────────────────────────────────────
function normalise(raw: any): SiteSettings {
    const nested = raw?.data?.settings ?? raw?.settings ?? null;

    // If not nested (e.g. old localStorage flat cache), fall back gracefully
    if (!nested || typeof nested !== "object" || !nested.site) {
        return { ...DEFAULT_SETTINGS, ...(raw?.data ?? raw) };
    }

    const primaryHsl = nested.branding?.primaryColor
        ? hexToHsl(nested.branding.primaryColor)
        : DEFAULT_SETTINGS.themePrimary;

    return {
        ...DEFAULT_SETTINGS,

        // platform
        defaultLanguage:          nested.platform?.defaultLanguage          ?? DEFAULT_SETTINGS.defaultLanguage,
        timezone:                 nested.platform?.timezone                 ?? DEFAULT_SETTINGS.timezone,
        registrationEnabled:      nested.platform?.registrationEnabled      ?? DEFAULT_SETTINGS.registrationEnabled,
        studentsOpen:             nested.platform?.registrationEnabled      ?? DEFAULT_SETTINGS.studentsOpen,
        requireEmailVerification: nested.platform?.requireEmailVerification ?? DEFAULT_SETTINGS.requireEmailVerification,
        maxFileSizeMB:            nested.platform?.maxFileSizeMB            ?? DEFAULT_SETTINGS.maxFileSizeMB,

        // site
        siteName:            nested.site?.siteName         ?? DEFAULT_SETTINGS.siteName,
        siteDescription:     nested.site?.siteDescription  ?? DEFAULT_SETTINGS.siteDescription,
        logoUrl:             nested.site?.siteLogoUrl      ?? DEFAULT_SETTINGS.logoUrl,
        faviconUrl:          nested.site?.siteFaviconUrl   ?? DEFAULT_SETTINGS.faviconUrl,
        contactEmail:        nested.site?.contactEmail     ?? DEFAULT_SETTINGS.contactEmail,
        supportEmail:        nested.site?.supportEmail     ?? DEFAULT_SETTINGS.supportEmail,
        maintenanceMode:     nested.site?.maintenanceMode  ?? DEFAULT_SETTINGS.maintenanceMode,
        maintenanceMessage:  nested.site?.maintenanceMessage ?? DEFAULT_SETTINGS.maintenanceMessage,

        // branding → CSS-friendly HSL
        themePrimary: primaryHsl,
        themeRing:    primaryHsl,

        // social
        facebookUrl:  nested.social?.facebookUrl  ?? DEFAULT_SETTINGS.facebookUrl,
        twitterUrl:   nested.social?.twitterUrl   ?? DEFAULT_SETTINGS.twitterUrl,
        linkedinUrl:  nested.social?.linkedinUrl  ?? DEFAULT_SETTINGS.linkedinUrl,
        instagramUrl: nested.social?.instagramUrl ?? DEFAULT_SETTINGS.instagramUrl,
        youtubeUrl:   nested.social?.youtubeUrl   ?? DEFAULT_SETTINGS.youtubeUrl,

        // seo
        metaTitle:        nested.seo?.metaTitle        ?? DEFAULT_SETTINGS.metaTitle,
        metaDescription:  nested.seo?.metaDescription  ?? DEFAULT_SETTINGS.metaDescription,
        googleAnalyticsId: nested.seo?.googleAnalyticsId ?? DEFAULT_SETTINGS.googleAnalyticsId,
        ogTitle:          nested.seo?.ogTitle          ?? DEFAULT_SETTINGS.ogTitle,
        ogDescription:    nested.seo?.ogDescription    ?? DEFAULT_SETTINGS.ogDescription,
        ogImage:          nested.seo?.ogImageUrl       ?? DEFAULT_SETTINGS.ogImage,
        twitterCard:      nested.seo?.twitterCard      ?? DEFAULT_SETTINGS.twitterCard,
        robotsMeta:       nested.seo?.robotsMeta       ?? DEFAULT_SETTINGS.robotsMeta,
        canonicalUrl:     nested.seo?.canonicalUrl     ?? DEFAULT_SETTINGS.canonicalUrl,

        // footer
        footerText:    nested.footer?.footerText    ?? DEFAULT_SETTINGS.footerText,
        copyrightText: nested.footer?.copyrightText ?? DEFAULT_SETTINGS.copyrightText,

        // fields with no direct API equivalent — keep defaults
        metaKeywords:       DEFAULT_SETTINGS.metaKeywords,
        twitterTitle:       DEFAULT_SETTINGS.twitterTitle,
        twitterDescription: DEFAULT_SETTINGS.twitterDescription,
        twitterImage:       DEFAULT_SETTINGS.twitterImage,
        professorsOpen:     DEFAULT_SETTINGS.professorsOpen,
        allowGoogleAuth:    DEFAULT_SETTINGS.allowGoogleAuth,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// toApiPayload — re-nest flat SiteSettings into the API's nested format
// ─────────────────────────────────────────────────────────────────────────────
function toApiPayload(s: SiteSettings): Record<string, unknown> {
    return {
        platform: {
            defaultLanguage:          s.defaultLanguage,
            timezone:                 s.timezone,
            registrationEnabled:      s.registrationEnabled ?? s.studentsOpen,
            requireEmailVerification: s.requireEmailVerification,
            maxFileSizeMB:            s.maxFileSizeMB,
        },
        site: {
            siteName:           s.siteName,
            siteDescription:    s.siteDescription,
            siteLogoUrl:        s.logoUrl        || null,
            siteFaviconUrl:     s.faviconUrl     || null,
            contactEmail:       s.contactEmail,
            supportEmail:       s.supportEmail   || null,
            maintenanceMode:    s.maintenanceMode,
            maintenanceMessage: s.maintenanceMessage,
        },
        branding: {
            // Admin page stores colors as HSL; convert back to hex for the API
            primaryColor: s.themePrimary.startsWith("#")
                ? s.themePrimary
                : hslToHex(s.themePrimary),
        },
        social: {
            facebookUrl:  s.facebookUrl  || null,
            twitterUrl:   s.twitterUrl   || null,
            linkedinUrl:  s.linkedinUrl  || null,
            instagramUrl: s.instagramUrl || null,
            youtubeUrl:   s.youtubeUrl   || null,
        },
        seo: {
            metaTitle:        s.metaTitle,
            metaDescription:  s.metaDescription,
            googleAnalyticsId: s.googleAnalyticsId,
            ogTitle:          s.ogTitle,
            ogDescription:    s.ogDescription,
            ogImageUrl:       s.ogImage        || null,
            twitterCard:      s.twitterCard,
            robotsMeta:       s.robotsMeta,
            canonicalUrl:     s.canonicalUrl   || null,
        },
        footer: {
            footerText:    s.footerText,
            copyrightText: s.copyrightText,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Languages that use RTL layout
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

/**
 * Applies language, direction, and font to the document root.
 */
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

function applyMetaToDom(settings: SiteSettings) {
    if (typeof document === "undefined") return;

    // Title
    document.title = settings.metaTitle || settings.siteName;

    // Basic meta
    if (settings.metaDescription) setMeta('meta[name="description"]',          settings.metaDescription);
    if (settings.robotsMeta)      setMeta('meta[name="robots"]',                settings.robotsMeta);

    // Open Graph
    if (settings.ogTitle)       setMeta('meta[property="og:title"]',       settings.ogTitle);
    if (settings.ogDescription) setMeta('meta[property="og:description"]', settings.ogDescription);
    if (settings.ogImage)       setMeta('meta[property="og:image"]',       settings.ogImage);
    setMeta('meta[property="og:site_name"]', settings.siteName);

    // Twitter card
    if (settings.twitterCard)       setMeta('meta[name="twitter:card"]',        settings.twitterCard);
    if (settings.ogTitle)           setMeta('meta[name="twitter:title"]',       settings.twitterTitle || settings.ogTitle);
    if (settings.ogDescription)     setMeta('meta[name="twitter:description"]', settings.twitterDescription || settings.ogDescription);
    if (settings.twitterImage || settings.ogImage)
        setMeta('meta[name="twitter:image"]', settings.twitterImage || settings.ogImage);

    // Canonical URL
    if (settings.canonicalUrl) setLink("canonical", settings.canonicalUrl);
}

function applyAll(s: SiteSettings) {
    applyThemeToDom(s.themePrimary, s.themeRing);
    applyMetaToDom(s);
    applyLangToDom(s.defaultLanguage);
}

// ─────────────────────────────────────────────────────────────────────────────
// useSettings hook
// ─────────────────────────────────────────────────────────────────────────────
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

    useEffect(() => {
        applyAll(settings);
    }, [settings]);

    const saveMutation = useMutation<SiteSettings, Error, Partial<SiteSettings>>({
        mutationFn: async (updates) => {
            const merged = { ...settings, ...updates };
            const { data } = await api.put("/admin/settings", toApiPayload(merged));
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
 * Lightweight initializer — called once at app root to apply saved theme,
 * lang, and dir from localStorage before the first visible paint.
 */
export function initSettingsFromStorage() {
    if (typeof window === "undefined") return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const s: Partial<SiteSettings> = JSON.parse(raw);
            if (s.themePrimary) document.documentElement.style.setProperty("--primary", s.themePrimary);
            if (s.themeRing)    document.documentElement.style.setProperty("--ring",    s.themeRing);
        }

        // User personal language preference takes priority over admin default
        const userLang = localStorage.getItem(USER_LANG_KEY);
        if (userLang) {
            applyLangToDom(userLang);
            return;
        }

        if (raw) {
            const s: Partial<SiteSettings> = JSON.parse(raw);
            if (s.defaultLanguage) applyLangToDom(s.defaultLanguage);
        }
    } catch {}
}
