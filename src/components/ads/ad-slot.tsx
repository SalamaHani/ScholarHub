"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
    layout?: string;
    layoutKey?: string;
    fullWidthResponsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

export function AdSlot({
    slot,
    format = "auto",
    layout,
    layoutKey,
    fullWidthResponsive = true,
    className,
    style,
}: AdSlotProps) {
    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    const pushed = useRef(false);

    useEffect(() => {
        if (!client || pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch {
            // adsbygoogle not yet loaded — will retry on next mount
        }
    }, [client]);

    if (!client) return null;

    return (
        <ins
            className={`adsbygoogle ${className ?? ""}`.trim()}
            style={{ display: "block", ...style }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-ad-layout={layout}
            data-ad-layout-key={layoutKey}
            data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        />
    );
}
