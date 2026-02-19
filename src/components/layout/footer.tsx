"use client";

import Link from "next/link";
import { GraduationCap, Heart, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";

const socialLinks = [
    { href: "#", letter: "f",  label: "Facebook",  color: "hover:bg-blue-600  hover:text-white" },
    { href: "#", letter: "𝕏",  label: "Twitter/X", color: "hover:bg-zinc-900  hover:text-white" },
    { href: "#", letter: "in", label: "LinkedIn",   color: "hover:bg-blue-700  hover:text-white" },
    { href: "#", letter: "ig", label: "Instagram",  color: "hover:bg-pink-600  hover:text-white" },
];

export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { href: "/scholarships", label: t.footer.links.browseScholarships },
            { href: "/saved",        label: t.footer.links.savedScholarships   },
            { href: "/categories",   label: t.footer.links.categories          },
            { href: "/deadlines",    label: t.footer.links.upcomingDeadlines   },
        ],
        resources: [
            { href: "/guides", label: t.footer.links.applicationGuides },
            { href: "/tips",   label: t.footer.links.tips              },
            { href: "/faq",    label: t.footer.links.faq               },
            { href: "/blog",   label: t.footer.links.blog              },
        ],
        company: [
            { href: "/about",   label: t.footer.links.aboutUs      },
            { href: "/contact", label: t.footer.links.contact       },
            { href: "/privacy", label: t.footer.links.privacyPolicy },
            { href: "/terms",   label: t.footer.links.terms         },
        ],
    };

    return (
        <footer className="bg-muted/30 border-t">
            <div className="container py-12 md:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold gradient-text">ScholarHub</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            {t.footer.tagline}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{t.footer.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <a href="mailto:info@scholarhub.ps" className="hover:text-primary transition-colors">
                                info@scholarhub.ps
                            </a>
                        </div>
                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold transition-all duration-300 ${social.color}`}
                                >
                                    {social.letter}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">{t.footer.platform}</h4>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">{t.footer.resources}</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">{t.footer.company}</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Copyright + Language Switcher */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p className="ltr" data-ltr>
                        © {currentYear} ScholarHub. {t.footer.rights}
                    </p>

                    <div className="flex items-center gap-4">
                        {/* Language picker — users can override admin default */}
                        <LanguageSwitcher />

                        <p className="flex items-center gap-1">
                            {t.footer.madeWith}
                            <Heart className="h-4 w-4 text-red-500 fill-red-500 mx-1" />
                            {t.footer.forStudents}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
