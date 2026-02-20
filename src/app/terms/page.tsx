"use client";

import { FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="mb-10 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        <FileText className="h-3 w-3 mr-1" />
                        {t.terms.badge}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">{t.terms.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        {t.terms.lastUpdated} <strong>{t.terms.lastUpdatedDate}</strong>
                    </p>
                    <p className="text-muted-foreground">
                        {t.terms.description}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8 bg-card rounded-2xl border p-8">
                    {t.terms.sections.map((section, i) => (
                        <div key={i}>
                            {i > 0 && <Separator className="mb-8" />}
                            <h2 className="text-base font-bold mb-3">{section.title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {t.terms.questions}{" "}
                    <a href="mailto:legal@scholarhub.ps" className="text-primary hover:underline">
                        legal@scholarhub.ps
                    </a>
                </div>
            </div>
        </div>
    );
}
