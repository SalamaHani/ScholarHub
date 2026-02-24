"use client";

import { FileText, Mail, Handshake, Users, AlertTriangle, Shield, Globe, Ban, RefreshCw, Phone, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageContentEntry, usePageSections } from "@/hooks/usePageContent";

const SECTION_ICONS = [Handshake, Users, Shield, Globe, AlertTriangle, Ban, RefreshCw, Phone, FileText, Mail];

// Renders content with bullet points as proper <ul><li> elements.
function ContentRenderer({ content }: { content: string }) {
    const blocks = content.split(/\n\n+/);
    return (
        <div className="space-y-3">
            {blocks.map((block, i) => {
                const lines = block.split("\n");
                const isBulletLine = (line: string) => /^(?:\u00e2\u20ac\u00a2|\u2022|-)\s*/.test(line.trim());
                const bulletLines = lines.filter((line) => isBulletLine(line));
                const textLines = lines.filter((line) => !isBulletLine(line));
                const textPart = textLines.join(" ").trim();

                if (bulletLines.length > 0) {
                    return (
                        <div key={i} className="space-y-2">
                            {textPart && (
                                <p className="text-sm text-muted-foreground leading-relaxed">{textPart}</p>
                            )}
                            <ul className="space-y-1.5">
                                {bulletLines.map((line, j) => (
                                    <li key={j} className="flex items-start gap-2.5">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                        <span className="text-sm text-muted-foreground leading-relaxed">
                                            {line.replace(/^(?:\u00e2\u20ac\u00a2|\u2022|-)\s*/, "")}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
                return (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{block.trim()}</p>
                );
            })}
        </div>
    );
}

const KEY_POINTS = [
    { icon: CheckCircle2, text: "Free to use for all students seeking scholarships.", color: "text-emerald-600" },
    { icon: Shield,       text: "Your submitted content and personal data remain yours.", color: "text-blue-600" },
    { icon: Info,         text: "Final scholarship decisions are made by the providers.", color: "text-amber-600" },
    { icon: AlertTriangle, text: "Misuse or fraud may result in immediate account removal.", color: "text-rose-600" },
];

export default function TermsPage() {
    const { t } = useTranslation();
    const { data: pageEntry } = usePageContentEntry("terms-of-service");
    const { data: apiSections, isLoading } = usePageSections("terms-of-service");

    const sections = apiSections && apiSections.length > 0
        ? apiSections.map(c => ({ title: c.title, content: c.description || c.subtitle || "" }))
        : t.terms.sections;

    return (
        <div className="min-h-screen bg-muted/20">

            {/* Hero */}
            <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b">
                <div className="container max-w-5xl py-14 md:py-20">
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <Badge variant="outline" className="w-fit text-primary border-primary/30 bg-primary/5 gap-1.5 px-3 py-1">
                            <FileText className="h-3.5 w-3.5" />
                            {pageEntry?.heroText || t.terms.badge}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            {pageEntry?.title || t.terms.title}
                        </h1>
                        <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
                            {pageEntry?.description || pageEntry?.subtitle || t.terms.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t.terms.lastUpdated}{" "}
                            <strong className="text-foreground">{t.terms.lastUpdatedDate}</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="container max-w-5xl py-10 md:py-14 space-y-10">

                {/* At a Glance */}
                <div className="rounded-2xl border bg-card shadow-sm p-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Terms at a Glance</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {KEY_POINTS.map(({ icon: Icon, text, color }, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
                                <p className="text-sm text-foreground/80 leading-snug">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">

                    {/* Sidebar — Table of Contents */}
                    <aside className="hidden lg:block sticky top-24 space-y-4">
                        <div className="bg-card border rounded-2xl p-5 space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                Contents
                            </p>
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-3 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
                                    ))}
                                </div>
                            ) : (
                                sections.map((section, i) => (
                                    <a
                                        key={i}
                                        href={`#section-${i}`}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1 group"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                            {i + 1}
                                        </span>
                                        <span className="leading-snug line-clamp-2">
                                            {section.title.replace(/^\d+\.\s*/, "")}
                                        </span>
                                    </a>
                                ))
                            )}
                        </div>

                        {/* Contact card */}
                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">{t.terms.questions}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Contact our legal team for any clarification.
                            </p>
                            <a
                                href="mailto:legal@scholarhub.ps"
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Mail className="h-3.5 w-3.5" />
                                legal@scholarhub.ps
                            </a>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main>
                        {isLoading ? (
                            <div className="space-y-8">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="h-5 bg-muted rounded animate-pulse w-2/5" />
                                        <div className="h-3 bg-muted rounded animate-pulse w-full" />
                                        <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
                                        <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {sections.map((section, i) => {
                                    const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
                                    return (
                                        <div key={i} id={`section-${i}`} className="scroll-mt-24">
                                            {i > 0 && <Separator className="my-8" />}
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
                                                    <Icon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-xs font-bold text-muted-foreground">
                                                            {String(i + 1).padStart(2, "0")}
                                                        </span>
                                                        <h2 className="text-base font-bold text-foreground">
                                                            {section.title.replace(/^\d+\.\s*/, "")}
                                                        </h2>
                                                    </div>
                                                    <ContentRenderer content={section.content} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Mobile contact */}
                        <div className="lg:hidden mt-10 flex items-center gap-2 text-sm text-muted-foreground border-t pt-6">
                            <Mail className="h-4 w-4 shrink-0" />
                            {t.terms.questions}{" "}
                            <a href="mailto:legal@scholarhub.ps" className="text-primary hover:underline">
                                legal@scholarhub.ps
                            </a>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}





