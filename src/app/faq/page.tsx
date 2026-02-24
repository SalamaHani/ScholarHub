"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useFaqItems } from "@/hooks/useFaqItems";
import { usePageContentEntry } from "@/hooks/usePageContent";

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "border rounded-xl overflow-hidden transition-all",
                open ? "border-primary/40 shadow-sm" : "border-border"
            )}
        >
            <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className={cn("text-sm font-semibold", open && "text-primary")}>
                    {question}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        open && "rotate-180 text-primary"
                    )}
                />
            </button>
            {open && (
                <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const { t, lang } = useTranslation();
    const { list } = useFaqItems({ pageKey: "faq" });
    const { data: pageEntry } = usePageContentEntry("faq");

    // Static i18n fallback items
    const staticFaqs = [
        { question: t.faq.q1,  answer: t.faq.a1  },
        { question: t.faq.q2,  answer: t.faq.a2  },
        { question: t.faq.q3,  answer: t.faq.a3  },
        { question: t.faq.q4,  answer: t.faq.a4  },
        { question: t.faq.q5,  answer: t.faq.a5  },
        { question: t.faq.q6,  answer: t.faq.a6  },
        { question: t.faq.q7,  answer: t.faq.a7  },
        { question: t.faq.q8,  answer: t.faq.a8  },
        { question: t.faq.q9,  answer: t.faq.a9  },
        { question: t.faq.q10, answer: t.faq.a10 },
    ];

    // Use API items if loaded and non-empty, else fall back to i18n
    const apiItems = Array.isArray(list.data) ? list.data : [];
    const faqs = apiItems.length > 0
        ? [...apiItems]
            .filter((item: any) => item.isActive !== false)
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((item: any) => ({
                question: lang === "ar" ? (item.question_ar || item.question_en) : (item.question_en || item.question_ar),
                answer:   lang === "ar" ? (item.answer_ar   || item.answer_en)   : (item.answer_en   || item.answer_ar),
            }))
        : staticFaqs;

    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        {pageEntry?.heroText || t.faq.tag}
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        {pageEntry?.title || t.faq.title}
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        {pageEntry?.description || pageEntry?.subtitle || t.faq.desc}
                    </p>
                </div>

                {/* FAQ list */}
                {list.isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
