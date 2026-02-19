"use client";

import { Lightbulb, Star, Target, Clock, Users, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export default function TipsPage() {
    const { t } = useTranslation();

    const tips = [
        { icon: Target,    color: "text-blue-600 bg-blue-50 border-blue-200",     category: t.tips.tip1Tag, title: t.tips.tip1Title, body: t.tips.tip1Desc },
        { icon: Clock,     color: "text-amber-600 bg-amber-50 border-amber-200",  category: t.tips.tip2Tag, title: t.tips.tip2Title, body: t.tips.tip2Desc },
        { icon: FileCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200", category: t.tips.tip3Tag, title: t.tips.tip3Title, body: t.tips.tip3Desc },
        { icon: Users,     color: "text-violet-600 bg-violet-50 border-violet-200", category: t.tips.tip4Tag, title: t.tips.tip4Title, body: t.tips.tip4Desc },
        { icon: Star,      color: "text-rose-600 bg-rose-50 border-rose-200",     category: t.tips.tip5Tag, title: t.tips.tip5Title, body: t.tips.tip5Desc },
        { icon: Lightbulb, color: "text-cyan-600 bg-cyan-50 border-cyan-200",     category: t.tips.tip6Tag, title: t.tips.tip6Title, body: t.tips.tip6Desc },
    ];

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {t.tips.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.tips.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {t.tips.desc}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {tips.map((tip) => (
                        <Card key={tip.title} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl border ${tip.color}`}>
                                        <tip.icon className="h-4 w-4" />
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {tip.category}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-base">{tip.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
