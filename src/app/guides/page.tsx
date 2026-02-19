"use client";

import { BookOpen, FileText, CheckSquare, Send, Award, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export default function GuidesPage() {
    const { t } = useTranslation();

    const guides = [
        { icon: FileText,    step: t.guides.step1Num, title: t.guides.step1Title, color: "text-blue-600 bg-blue-50 border-blue-200",     points: t.guides.step1Items },
        { icon: BookOpen,    step: t.guides.step2Num, title: t.guides.step2Title, color: "text-violet-600 bg-violet-50 border-violet-200", points: t.guides.step2Items },
        { icon: CheckSquare, step: t.guides.step3Num, title: t.guides.step3Title, color: "text-emerald-600 bg-emerald-50 border-emerald-200", points: t.guides.step3Items },
        { icon: Send,        step: t.guides.step4Num, title: t.guides.step4Title, color: "text-amber-600 bg-amber-50 border-amber-200",    points: t.guides.step4Items },
        { icon: Award,       step: t.guides.step5Num, title: t.guides.step5Title, color: "text-rose-600 bg-rose-50 border-rose-200",       points: t.guides.step5Items },
    ];

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {t.guides.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.guides.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {t.guides.desc}
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-5">
                    {guides.map((guide) => (
                        <Card key={guide.title} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-5">
                                    <div className={`p-3 rounded-xl border shrink-0 ${guide.color}`}>
                                        <guide.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-muted-foreground tracking-widest">
                                                {guide.step}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{guide.title}</h3>
                                        <ul className="space-y-2">
                                            {guide.points.map((point, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
