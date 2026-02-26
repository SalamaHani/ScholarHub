import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
    themePrimary: string;
    themeRing: string;
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportEmail: string;
    logoUrl: string;
    faviconUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
    registrationEnabled: boolean;
    studentsOpen: boolean;
    professorsOpen: boolean;
    allowGoogleAuth: boolean;
    requireEmailVerification: boolean;
    defaultLanguage: string;
    timezone: string;
    footerText: string;
    copyrightText: string;
    googleAnalyticsId: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    robotsMeta: string;
    canonicalUrl: string;
    maxFileSizeMB: number;
}

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
// Color helpers
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

export function hslToHex(hsl: string): string {
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
// API normalise — flatten nested API response → flat SiteSettings
// ─────────────────────────────────────────────────────────────────────────────

function normalise(raw: any): SiteSettings {
    const nested = raw?.data?.settings ?? raw?.settings ?? null;

    if (!nested || typeof nested !== "object" || !nested.site) {
        return { ...DEFAULT_SETTINGS, ...(raw?.data ?? raw) };
    }

    const primaryHsl = nested.branding?.primaryColor
        ? hexToHsl(nested.branding.primaryColor)
        : DEFAULT_SETTINGS.themePrimary;

    return {
        ...DEFAULT_SETTINGS,
        defaultLanguage:          nested.platform?.defaultLanguage          ?? DEFAULT_SETTINGS.defaultLanguage,
        timezone:                 nested.platform?.timezone                 ?? DEFAULT_SETTINGS.timezone,
        registrationEnabled:      nested.platform?.registrationEnabled      ?? DEFAULT_SETTINGS.registrationEnabled,
        studentsOpen:             nested.platform?.registrationEnabled      ?? DEFAULT_SETTINGS.studentsOpen,
        requireEmailVerification: nested.platform?.requireEmailVerification ?? DEFAULT_SETTINGS.requireEmailVerification,
        maxFileSizeMB:            nested.platform?.maxFileSizeMB            ?? DEFAULT_SETTINGS.maxFileSizeMB,
        siteName:            nested.site?.siteName         ?? DEFAULT_SETTINGS.siteName,
        siteDescription:     nested.site?.siteDescription  ?? DEFAULT_SETTINGS.siteDescription,
        logoUrl:             nested.site?.siteLogoUrl      ?? DEFAULT_SETTINGS.logoUrl,
        faviconUrl:          nested.site?.siteFaviconUrl   ?? DEFAULT_SETTINGS.faviconUrl,
        contactEmail:        nested.site?.contactEmail     ?? DEFAULT_SETTINGS.contactEmail,
        supportEmail:        nested.site?.supportEmail     ?? DEFAULT_SETTINGS.supportEmail,
        maintenanceMode:     nested.site?.maintenanceMode  ?? DEFAULT_SETTINGS.maintenanceMode,
        maintenanceMessage:  nested.site?.maintenanceMessage ?? DEFAULT_SETTINGS.maintenanceMessage,
        themePrimary: primaryHsl,
        themeRing:    primaryHsl,
        facebookUrl:  nested.social?.facebookUrl  ?? DEFAULT_SETTINGS.facebookUrl,
        twitterUrl:   nested.social?.twitterUrl   ?? DEFAULT_SETTINGS.twitterUrl,
        linkedinUrl:  nested.social?.linkedinUrl  ?? DEFAULT_SETTINGS.linkedinUrl,
        instagramUrl: nested.social?.instagramUrl ?? DEFAULT_SETTINGS.instagramUrl,
        youtubeUrl:   nested.social?.youtubeUrl   ?? DEFAULT_SETTINGS.youtubeUrl,
        metaTitle:        nested.seo?.metaTitle        ?? DEFAULT_SETTINGS.metaTitle,
        metaDescription:  nested.seo?.metaDescription  ?? DEFAULT_SETTINGS.metaDescription,
        googleAnalyticsId: nested.seo?.googleAnalyticsId ?? DEFAULT_SETTINGS.googleAnalyticsId,
        ogTitle:          nested.seo?.ogTitle          ?? DEFAULT_SETTINGS.ogTitle,
        ogDescription:    nested.seo?.ogDescription    ?? DEFAULT_SETTINGS.ogDescription,
        ogImage:          nested.seo?.ogImageUrl       ?? DEFAULT_SETTINGS.ogImage,
        twitterCard:      nested.seo?.twitterCard      ?? DEFAULT_SETTINGS.twitterCard,
        robotsMeta:       nested.seo?.robotsMeta       ?? DEFAULT_SETTINGS.robotsMeta,
        canonicalUrl:     nested.seo?.canonicalUrl     ?? DEFAULT_SETTINGS.canonicalUrl,
        footerText:    nested.footer?.footerText    ?? DEFAULT_SETTINGS.footerText,
        copyrightText: nested.footer?.copyrightText ?? DEFAULT_SETTINGS.copyrightText,
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

export function toApiPayload(s: SiteSettings): Record<string, unknown> {
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
// Cross-tab sync via BroadcastChannel
// ─────────────────────────────────────────────────────────────────────────────

export const SETTINGS_SYNC_CHANNEL = "scholarhub_settings_sync";

export function broadcastSettingsUpdate() {
    try {
        if (typeof BroadcastChannel === "undefined") return;
        const ch = new BroadcastChannel(SETTINGS_SYNC_CHANNEL);
        ch.postMessage({ type: "updated" });
        ch.close();
    } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Redux state
// ─────────────────────────────────────────────────────────────────────────────

export interface SettingsState {
    data: SiteSettings;
    isLoading: boolean;
    isSaving: boolean;
    isError: boolean;
    isLoaded: boolean;
}

const initialState: SettingsState = {
    data: DEFAULT_SETTINGS,
    isLoading: false,
    isSaving: false,
    isError: false,
    isLoaded: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Async thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchSettings = createAsyncThunk(
    "settings/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get("/admin/settings");
            return normalise(data);
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to load settings"
            );
        }
    }
);

export const saveSettings = createAsyncThunk(
    "settings/save",
    async (updates: Partial<SiteSettings>, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { settings: SettingsState };
            const merged = { ...state.settings.data, ...updates };
            const { data } = await api.put("/admin/settings", toApiPayload(merged));
            const saved = normalise(data);
            broadcastSettingsUpdate();
            toast({ title: "Settings saved", description: "Platform settings updated successfully." });
            return saved;
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save settings. Please try again.",
                variant: "destructive",
            });
            return rejectWithValue(
                error.response?.data?.message || "Failed to save settings"
            );
        }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
                state.isLoaded = true;
                state.isError = false;
            })
            .addCase(fetchSettings.rejected, (state) => {
                state.isLoading = false;
                state.isLoaded = true;
                state.isError = true;
            });

        builder
            .addCase(saveSettings.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(saveSettings.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isSaving = false;
            })
            .addCase(saveSettings.rejected, (state) => {
                state.isSaving = false;
            });
    },
});

export default settingsSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const selectSettings       = (state: { settings: SettingsState }) => state.settings.data;
export const selectSettingsLoading = (state: { settings: SettingsState }) => state.settings.isLoading;
export const selectSettingsSaving  = (state: { settings: SettingsState }) => state.settings.isSaving;
export const selectSettingsError   = (state: { settings: SettingsState }) => state.settings.isError;
export const selectSettingsLoaded  = (state: { settings: SettingsState }) => state.settings.isLoaded;
