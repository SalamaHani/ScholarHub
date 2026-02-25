"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";

// Inject / replace the Google Analytics 4 script pair
function applyGa4(id: string) {
    // Remove previous scripts so a changed ID doesn't leave stale tracking
    document.getElementById("ga4-async")?.remove();
    document.getElementById("ga4-inline")?.remove();
    if (!id) return;

    const s1 = document.createElement("script");
    s1.id = "ga4-async";
    s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s1.async = true;
    document.head.appendChild(s1);

    const s2 = document.createElement("script");
    s2.id = "ga4-inline";
    s2.textContent = [
        "window.dataLayer=window.dataLayer||[];",
        "function gtag(){dataLayer.push(arguments);}",
        "gtag('js',new Date());",
        `gtag('config','${id}');`,
    ].join("");
    document.head.appendChild(s2);
}

/**
 * DynamicHead — mounts at the root layout and keeps every <head> tag in
 * sync with admin settings fetched from the API.
 *
 * What this handles:                   | Via
 * ──────────────────────────────────── | ──────────────────────────────
 * document.title                       | applyMetaToDom (useSettings)
 * meta description / robots            | applyMetaToDom (useSettings)
 * og:title / og:description / og:image | applyMetaToDom (useSettings)
 * twitter:card / twitter:title / …     | applyMetaToDom (useSettings)
 * link[rel="canonical"]               | applyMetaToDom (useSettings)
 * CSS --primary / --ring               | applyThemeToDom (useSettings)
 * html lang / dir                      | applyLangToDom (useSettings)
 * link[rel="icon"]  (favicon)         | this component
 * Google Analytics 4 script            | this component
 */
export function DynamicHead() {
    const { settings } = useSettings();
    const prevGaId = useRef<string>("");

    // ── Favicon ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!settings.faviconUrl) return;
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = settings.faviconUrl;
    }, [settings.faviconUrl]);

    // ── Google Analytics 4 ────────────────────────────────────────────────
    useEffect(() => {
        const id = settings.googleAnalyticsId?.trim() ?? "";
        if (id === prevGaId.current) return;
        prevGaId.current = id;
        applyGa4(id);
    }, [settings.googleAnalyticsId]);

    return null;
}
