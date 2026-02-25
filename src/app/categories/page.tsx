"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight, Tag, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useCategories } from "@/hooks/useCategories";

// Detect whether a string is an emoji (non-ASCII, not a plain slug/word)
function isEmoji(str: string) {
    return str.length <= 4 && str.codePointAt(0)! > 127;
}

// Convert hex color to a light background tint for the icon badge
function hexToStyle(hex: string | undefined) {
    if (!hex) return { bg: "hsl(var(--muted))", text: "hsl(var(--foreground))" };
    return { bg: hex + "1a", text: hex }; // 1a ≈ 10% opacity background
}

export default function CategoriesPage() {
    const { t } = useTranslation();
    const { list } = useCategories();

    const rawData: any[] = Array.isArray(list.data) ? list.data : [];
    const activeCategories = rawData.filter((c) => c.isActive !== false);

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        {t.categories.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.categories.title}</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">{t.categories.desc}</p>
                </div>

                {/* Loading skeleton */}
                {list.isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {list.isError && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                        <AlertCircle className="h-10 w-10 text-destructive/60" />
                        <p className="text-muted-foreground text-sm">Failed to load categories. Please try again.</p>
                    </div>
                )}

                {/* Grid */}
                {!list.isLoading && !list.isError && (
                    <>
                        {activeCategories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                <Tag className="h-10 w-10 text-muted-foreground/50" />
                                <p className="text-muted-foreground text-sm">No categories found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {activeCategories.map((cat) => {
                                    const { bg, text } = hexToStyle(cat.color);
                                    const hasEmoji = cat.icon && isEmoji(cat.icon);

                                    return (
                                        <Link
                                            key={cat.id}
                                            href={`/scholarships?category=${encodeURIComponent(cat.slug ?? cat.name)}`}
                                        >
                                            <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                                                <CardContent className="p-6 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        {/* Icon badge — emoji or fallback Lucide */}
                                                        <div
                                                            className="h-11 w-11 rounded-xl flex items-center justify-center text-xl border"
                                                            style={{ backgroundColor: bg, borderColor: text + "33", color: text }}
                                                        >
                                                            {hasEmoji
                                                                ? <span>{cat.icon}</span>
                                                                : <GraduationCap className="h-5 w-5" />
                                                            }
                                                        </div>

                                                        {cat.scholarshipsCount != null && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {cat.scholarshipsCount} {t.categories.scholarshipsCount}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                                            {cat.name}
                                                        </h3>
                                                        {cat.description && (
                                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                                                {cat.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: text }}>
                                                        {t.categories.browse}
                                                        <ArrowRight className="h-3 w-3 ml-1" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}
