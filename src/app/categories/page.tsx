"use client";

import Link from "next/link";
import { GraduationCap, Microscope, Briefcase, Palette, Globe, Code, Heart, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
    const { t } = useTranslation();

    const categories = [
        { icon: Microscope,   label: t.categories.cat1Title, color: "text-blue-600 bg-blue-50 border-blue-200",     count: 48, description: t.categories.cat1Desc },
        { icon: Code,         label: t.categories.cat2Title, color: "text-violet-600 bg-violet-50 border-violet-200", count: 62, description: t.categories.cat2Desc },
        { icon: Briefcase,    label: t.categories.cat3Title, color: "text-emerald-600 bg-emerald-50 border-emerald-200", count: 35, description: t.categories.cat3Desc },
        { icon: Palette,      label: t.categories.cat4Title, color: "text-rose-600 bg-rose-50 border-rose-200",       count: 29, description: t.categories.cat4Desc },
        { icon: Heart,        label: t.categories.cat5Title, color: "text-red-600 bg-red-50 border-red-200",          count: 41, description: t.categories.cat5Desc },
        { icon: Globe,        label: t.categories.cat6Title, color: "text-cyan-600 bg-cyan-50 border-cyan-200",       count: 27, description: t.categories.cat6Desc },
        { icon: BookOpen,     label: t.categories.cat7Title, color: "text-amber-600 bg-amber-50 border-amber-200",    count: 22, description: t.categories.cat7Desc },
        { icon: GraduationCap, label: t.categories.cat8Title, color: "text-slate-600 bg-slate-50 border-slate-200",  count: 55, description: t.categories.cat8Desc },
    ];

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {t.categories.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.categories.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {t.categories.desc}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => (
                        <Link key={cat.label} href={`/scholarships?category=${encodeURIComponent(cat.label)}`}>
                            <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                                            <cat.icon className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {cat.count} {t.categories.scholarshipsCount}
                                        </Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                            {cat.label}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {t.categories.browse} <ArrowRight className="h-3 w-3 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
