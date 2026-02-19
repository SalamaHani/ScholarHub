"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validations/contact";
import {
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter,  href: "#", label: "Twitter"  },
    { icon: Linkedin, href: "#", label: "LinkedIn"  },
    { icon: Instagram, href: "#", label: "Instagram" },
];

export default function ContactPage() {
    const { t } = useTranslation();

    const contactInfo = [
        { icon: Mail,   title: t.contact.email,        value: "info@scholarhub.ps",   href: "mailto:info@scholarhub.ps" },
        { icon: MapPin, title: t.contact.location,     value: t.footer.location,      href: null },
        { icon: Clock,  title: t.contact.responseTime, value: t.contact.responseTimeValue, href: null },
    ];

    const faqItems = [
        { question: t.contact.faq1Q, answer: t.contact.faq1A },
        { question: t.contact.faq2Q, answer: t.contact.faq2A },
        { question: t.contact.faq3Q, answer: t.contact.faq3A },
        { question: t.contact.faq4Q, answer: t.contact.faq4A },
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactInput) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast({
                title: "Message Sent!",
                description: "We've received your message and will get back to you soon.",
            });
            reset();
        } catch {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="py-8 md:py-12">
            <div className="container">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center space-y-4 mb-12">
                    <Badge variant="secondary" className="gap-1 px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
                        <MessageSquare className="h-3 w-3" />
                        {t.contact.tag}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                        {t.contact.title}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
                        {t.contact.desc}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Form */}
                    <Card className="border-none shadow-2xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-100">
                        <CardHeader className="bg-slate-50/50 py-8 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black text-slate-800 tracking-tight">
                                <div className="p-2.5 rounded-xl bg-primary/10">
                                    <Send className="h-5 w-5 text-primary" />
                                </div>
                                {t.contact.formTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-bold text-slate-700">{t.contact.fullName}</Label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            placeholder={t.contact.fullNamePlaceholder}
                                            className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-red-500 flex items-center gap-1.5 pl-1 mt-1">
                                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                                    {errors.name.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-700">{t.contact.emailAddress}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder={t.contact.emailPlaceholder}
                                            className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-red-500 flex items-center gap-1.5 pl-1 mt-1">
                                                    <span className="w-1 h-1 rounded-full bg-red-500" />
                                                    {errors.email.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-sm font-bold text-slate-700">{t.contact.subject}</Label>
                                    <Input
                                        id="subject"
                                        {...register("subject")}
                                        placeholder={t.contact.subjectPlaceholder}
                                        className={`h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all ${errors.subject ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <AnimatePresence>
                                        {errors.subject && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-red-500 flex items-center gap-1.5 pl-1 mt-1">
                                                <span className="w-1 h-1 rounded-full bg-red-500" />
                                                {errors.subject.message}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-bold text-slate-700">{t.contact.message}</Label>
                                    <Textarea
                                        id="message"
                                        {...register("message")}
                                        placeholder={t.contact.messagePlaceholder}
                                        rows={5}
                                        className={`rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all min-h-[150px] ${errors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <AnimatePresence>
                                        {errors.message && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-xs font-bold text-red-500 flex items-center gap-1.5 pl-1 mt-1">
                                                <span className="w-1 h-1 rounded-full bg-red-500" />
                                                {errors.message.message}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button type="submit" variant="gradient" size="lg" className="w-full h-14 rounded-2xl gap-2 font-black shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            {t.contact.sendingMessage}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            {t.contact.sendMessage}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Info & FAQ */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.contact.contactInfo}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {contactInfo.map((info) => (
                                    <div key={info.title} className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <info.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">{info.title}</div>
                                            {info.href ? (
                                                <a href={info.href} className="font-medium hover:text-primary transition-colors">
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <div className="font-medium">{info.value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Social Links */}
                                <div className="pt-4 border-t">
                                    <div className="text-sm text-muted-foreground mb-3">{t.contact.followUs}</div>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                                                aria-label={social.label}
                                            >
                                                <social.icon className="h-5 w-5" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.contact.faqTitle}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {faqItems.map((item) => (
                                    <div key={item.question} className="space-y-2">
                                        <h4 className="font-medium">{item.question}</h4>
                                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
