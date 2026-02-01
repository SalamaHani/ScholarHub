"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validations/contact";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    MessageSquare,
    Clock,
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

const contactInfo = [
    {
        icon: Mail,
        title: "Email",
        value: "info@scholarhub.ps",
        href: "mailto:info@scholarhub.ps",
    },
    {
        icon: MapPin,
        title: "Location",
        value: "Gaza, Palestine",
        href: null,
    },
    {
        icon: Clock,
        title: "Response Time",
        value: "Within 24-48 hours",
        href: null,
    },
];

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

const faqItems = [
    {
        question: "How do I apply for scholarships?",
        answer: "Browse our scholarship listings, find opportunities that match your profile, and click the 'Apply' button to be redirected to the official application page.",
    },
    {
        question: "Are the scholarships listed verified?",
        answer: "Yes, we verify all scholarships before listing them on our platform. We only include opportunities from reputable institutions and organizations.",
    },
    {
        question: "Can I save scholarships for later?",
        answer: "Yes! You can save scholarships to your favorites and access them anytime from the 'Saved' section.",
    },
    {
        question: "How often are new scholarships added?",
        answer: "We update our database regularly, adding new scholarships as they become available. Check back frequently for new opportunities.",
    },
];

export default function ContactPage() {
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast({
                title: "Message Sent!",
                description: "We've received your message and will get back to you soon.",
            });
            reset();
        } catch (error) {
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
                        Get in Touch
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                        We&apos;re here to <span className="text-primary italic">Help</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
                        Have questions about scholarships or need technical assistance? Our team is ready to support your academic journey.
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
                                Send us a Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</Label>
                                        <Input
                                            id="name"
                                            {...register("name")}
                                            placeholder="John Doe"
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
                                        <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                            placeholder="john@example.com"
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
                                    <Label htmlFor="subject" className="text-sm font-bold text-slate-700">Subject</Label>
                                    <Input
                                        id="subject"
                                        {...register("subject")}
                                        placeholder="Partnership Inquiry / Scholarship Question"
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
                                    <Label htmlFor="message" className="text-sm font-bold text-slate-700">Message</Label>
                                    <Textarea
                                        id="message"
                                        {...register("message")}
                                        placeholder="How can we help you today?"
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
                                            Sending Message...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Send Message
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
                                <CardTitle>Contact Information</CardTitle>
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
                                                <a
                                                    href={info.href}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
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
                                    <div className="text-sm text-muted-foreground mb-3">Follow Us</div>
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
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="space-y-2">
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
