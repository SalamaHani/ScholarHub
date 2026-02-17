"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqs = [
    {
        question: "Who can use ScholarHub?",
        answer:
            "ScholarHub is open to all students from Gaza, Palestine. Whether you're pursuing undergraduate, graduate, or doctoral studies, you can create a free account and start browsing scholarships right away.",
    },
    {
        question: "Is ScholarHub free to use?",
        answer:
            "Yes, ScholarHub is completely free for students. Creating an account, browsing scholarships, saving opportunities, and submitting applications through our platform costs nothing.",
    },
    {
        question: "How do I apply for a scholarship?",
        answer:
            "Find a scholarship you're interested in, click 'View Details', read the requirements carefully, then click 'Apply Now'. You'll be guided through the application form. Make sure your profile is complete and your documents are uploaded before applying.",
    },
    {
        question: "How can I track my application status?",
        answer:
            "Go to 'My Applications' in your account. Each application shows its current status: Pending, Under Review, Accepted, or Rejected. You'll also receive notifications when your status changes.",
    },
    {
        question: "What documents do I typically need?",
        answer:
            "Most scholarships require academic transcripts, a personal statement or motivation letter, one or more letters of recommendation, a copy of your passport or national ID, and language test scores (IELTS or TOEFL). Specific requirements vary by scholarship.",
    },
    {
        question: "Can I save scholarships to apply later?",
        answer:
            "Yes. Click the bookmark icon on any scholarship to save it to your 'Saved Scholarships' list. You can access this list any time from your account menu.",
    },
    {
        question: "What happens after I submit an application?",
        answer:
            "Your application is sent to the scholarship provider for review. You can track the status in 'My Applications'. The review process timeline varies by scholarship — some take a few weeks while others may take several months.",
    },
    {
        question: "How do I get notifications about new scholarships?",
        answer:
            "Enable notifications in your browser when prompted. You'll receive alerts for new scholarships matching your profile, upcoming deadlines for saved scholarships, and updates on your applications.",
    },
    {
        question: "I forgot my password. What should I do?",
        answer:
            "Click 'Forgot Password' on the login page and enter your email address. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive in your inbox.",
    },
    {
        question: "How do I contact the ScholarHub team?",
        answer:
            "You can reach us through the Contact page. We aim to respond to all inquiries within 1–2 business days.",
    },
];

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
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        Help Center
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Can't find what you're looking for? Visit our{" "}
                        <a href="/contact" className="text-primary hover:underline font-medium">
                            Contact page
                        </a>{" "}
                        and we'll get back to you.
                    </p>
                </div>

                {/* FAQ list */}
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </div>
    );
}
