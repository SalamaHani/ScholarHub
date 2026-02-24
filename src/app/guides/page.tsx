"use client";

import { BookOpen, FileText, CheckSquare, Send, Award, ChevronRight, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageContentEntry, usePageSections } from "@/hooks/usePageContent";

const STEP_ICONS = [FileText, BookOpen, CheckSquare, Send, Award, Lightbulb];
const STEP_COLORS = [
    "text-blue-600 bg-blue-50 border-blue-200",
    "text-violet-600 bg-violet-50 border-violet-200",
    "text-emerald-600 bg-emerald-50 border-emerald-200",
    "text-amber-600 bg-amber-50 border-amber-200",
    "text-rose-600 bg-rose-50 border-rose-200",
    "text-cyan-600 bg-cyan-50 border-cyan-200",
];

export default function GuidesPage() {
    const { t } = useTranslation();
    const { data: pageEntry } = usePageContentEntry("application-guides");
    const { data: apiSections, isLoading } = usePageSections("application-guides");

    // Static i18n guide steps fallback
    const staticGuides = [
        { step: t.guides.step1Num, title: t.guides.step1Title, points: t.guides.step1Items, desc: "" },
        { step: t.guides.step2Num, title: t.guides.step2Title, points: t.guides.step2Items, desc: "" },
        { step: t.guides.step3Num, title: t.guides.step3Title, points: t.guides.step3Items, desc: "" },
        { step: t.guides.step4Num, title: t.guides.step4Title, points: t.guides.step4Items, desc: "" },
        { step: t.guides.step5Num, title: t.guides.step5Title, points: t.guides.step5Items, desc: "" },
    ];

    // Use API sections when available, fallback to i18n
    const guides = apiSections && apiSections.length > 0
        ? apiSections.map((c, i) => ({
            step:   c.subtitle || c.heroText || `STEP ${String(i + 1).padStart(2, "0")}`,
            title:  c.title,
            points: [] as string[],
            desc:   c.description || "",
          }))
        : staticGuides;

    const usingApi = apiSections && apiSections.length > 0;

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {pageEntry?.heroText || t.guides.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{pageEntry?.title || t.guides.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {pageEntry?.description || pageEntry?.subtitle || t.guides.desc}
                    </p>
                </div>

                {/* Steps */}
                {isLoading ? (
                    <div className="space-y-5">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse shrink-0" />
                                        <div className="flex-1 space-y-3">
                                            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                                            <div className="h-5 bg-muted rounded animate-pulse w-2/3" />
                                            <div className="h-3 bg-muted rounded animate-pulse w-full" />
                                            <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {guides.map((guide, i) => {
                            const Icon = STEP_ICONS[i % STEP_ICONS.length];
                            const color = STEP_COLORS[i % STEP_COLORS.length];
                            return (
                                <Card key={i} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-5">
                                            <div className={`p-3 rounded-xl border shrink-0 ${color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold text-muted-foreground tracking-widest">
                                                        {guide.step}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-3">{guide.title}</h3>

                                                {/* API mode: show description as paragraph */}
                                                {usingApi && guide.desc && (
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {guide.desc}
                                                    </p>
                                                )}

                                                {/* i18n mode: show bullet-point list */}
                                                {!usingApi && guide.points.length > 0 && (
                                                    <ul className="space-y-2">
                                                        {guide.points.map((point, j) => (
                                                            <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                                <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
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
