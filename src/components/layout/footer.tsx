"use client";

import Link from "next/link";
import { GraduationCap, Heart, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettings } from "@/hooks/useSettings";
import { usePageContent } from "@/hooks/usePageContent";

const SOCIAL_META = [
  {
    key: "facebookUrl" as const,
    letter: "f",
    label: "Facebook",
    color: "hover:bg-blue-600  hover:text-white",
  },
  {
    key: "twitterUrl" as const,
    letter: "X",
    label: "Twitter/X",
    color: "hover:bg-zinc-900  hover:text-white",
  },
  {
    key: "linkedinUrl" as const,
    letter: "in",
    label: "LinkedIn",
    color: "hover:bg-blue-700  hover:text-white",
  },
  {
    key: "instagramUrl" as const,
    letter: "ig",
    label: "Instagram",
    color: "hover:bg-pink-600  hover:text-white",
  },
];

export function Footer() {
  const { t, lang } = useTranslation();
  const { settings } = useSettings();
  const { list: contentList } = usePageContent();
  const currentYear = new Date().getFullYear();

  // Build nav links: prefer API page-content entries grouped by section, fall back to i18n
  const contentItems = Array.isArray(contentList.data) ? contentList.data : [];
  const activeItems = contentItems.filter((c: any) => c.isActive !== false);

  const getApiLinks = (section: string) =>
    activeItems
      .filter((c: any) => c.section === section && c.ctaLink)
      .map((c: any) => ({
        href: c.ctaLink as string,
        label: c.title || c.pageKey,
      }));

  const staticPlatform = [
    { href: "/scholarships", label: t.footer.links.browseScholarships },
    { href: "/saved", label: t.footer.links.savedScholarships },
    { href: "/categories", label: t.footer.links.categories },
    { href: "/deadlines", label: t.footer.links.upcomingDeadlines },
  ];
  const staticResources = [
    { href: "/guides", label: t.footer.links.applicationGuides },
    { href: "/tips", label: t.footer.links.tips },
    { href: "/faq", label: t.footer.links.faq },
    { href: "/blog", label: t.footer.links.blog },
  ];
  const staticCompany = [
    { href: "/about", label: t.footer.links.aboutUs },
    { href: "/contact", label: t.footer.links.contact },
    { href: "/privacy", label: t.footer.links.privacyPolicy },
    { href: "/terms", label: t.footer.links.terms },
  ];

  const footerLinks = {
    platform:
      getApiLinks("platform").length > 0
        ? getApiLinks("platform")
        : staticPlatform,
    resources:
      getApiLinks("resources").length > 0
        ? getApiLinks("resources")
        : staticResources,
    company:
      getApiLinks("company").length > 0
        ? getApiLinks("company")
        : staticCompany,
  };

  // Social links: only show icons that have a real URL configured in settings.
  const socialLinks = SOCIAL_META.map((s) => ({
    ...s,
    href: (settings[s.key] as string) || "",
  })).filter((s) => s.href);

  const contactEmail = settings.contactEmail || "info@scholarhub.ps";
  // In Arabic always use the translated tagline; in English prefer admin-configured text.
  const tagline =
    lang === "ar"
      ? t.footer.tagline
      : settings.footerText || settings.siteDescription || t.footer.tagline;

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group ltr"
              dir="ltr"
            >
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName || "ScholarHub"} className="h-8 w-8 object-contain" />
              ) : (
                <GraduationCap className="h-8 w-8 text-primary" />
              )}
              <span className="text-xl font-bold gradient-text">
                {settings.siteName || "ScholarHub"}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              {tagline}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{t.footer.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href={`mailto:${contactEmail}`}
                className="hover:text-primary transition-colors ltr"
                dir="ltr"
              >
                {contactEmail}
              </a>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 ltr" dir="ltr">
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
            <h4 className="font-semibold text-foreground">
              {t.footer.platform}
            </h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">
              {t.footer.company}
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
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
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <p className="ltr" data-ltr>
              {settings.copyrightText || `© ${currentYear} ${settings.siteName || "ScholarHub"}. ${t.footer.rights}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language picker: users can override admin default */}
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
