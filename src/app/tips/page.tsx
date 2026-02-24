"use client";

import { Lightbulb, Star, Target, Clock, Users, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageContentEntry, usePageSections } from "@/hooks/usePageContent";

const CARD_ICONS = [Target, Clock, FileCheck, Users, Star, Lightbulb];
const CARD_COLORS = [
    "text-blue-600 bg-blue-50 border-blue-200",
    "text-amber-600 bg-amber-50 border-amber-200",
    "text-emerald-600 bg-emerald-50 border-emerald-200",
    "text-violet-600 bg-violet-50 border-violet-200",
    "text-rose-600 bg-rose-50 border-rose-200",
    "text-cyan-600 bg-cyan-50 border-cyan-200",
];

export default function TipsPage() {
    const { t } = useTranslation();
    const { data: pageEntry } = usePageContentEntry("tips-tricks");
    const { data: apiSections, isLoading } = usePageSections("tips-tricks");

    // Static i18n tip cards fallback
    const staticTips = [
        { category: t.tips.tip1Tag, title: t.tips.tip1Title, body: t.tips.tip1Desc },
        { category: t.tips.tip2Tag, title: t.tips.tip2Title, body: t.tips.tip2Desc },
        { category: t.tips.tip3Tag, title: t.tips.tip3Title, body: t.tips.tip3Desc },
        { category: t.tips.tip4Tag, title: t.tips.tip4Title, body: t.tips.tip4Desc },
        { category: t.tips.tip5Tag, title: t.tips.tip5Title, body: t.tips.tip5Desc },
        { category: t.tips.tip6Tag, title: t.tips.tip6Title, body: t.tips.tip6Desc },
    ];

    // Use API sections when available, fallback to i18n
    const tips = apiSections && apiSections.length > 0
        ? apiSections.map(c => ({
            category: c.subtitle || c.heroText || "",
            title:    c.title,
            body:     c.description || "",
          }))
        : staticTips;

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {pageEntry?.heroText || t.tips.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{pageEntry?.title || t.tips.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {pageEntry?.description || pageEntry?.subtitle || t.tips.desc}
                    </p>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                                        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                                    </div>
                                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-full" />
                                    <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {tips.map((tip, i) => {
                            const Icon = CARD_ICONS[i % CARD_ICONS.length];
                            const color = CARD_COLORS[i % CARD_COLORS.length];
                            return (
                                <Card key={i} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-2.5 rounded-xl border ${color}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            {tip.category && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {tip.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-base">{tip.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
