"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Heart, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettings } from "@/hooks/useSettings";
import { usePageContent } from "@/hooks/usePageContent";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const SOCIAL_META = [
  {
    key: "facebookUrl" as const,
    icon: FacebookIcon,
    label: "Facebook",
    color: "hover:bg-blue-600 hover:text-white",
  },
  {
    key: "twitterUrl" as const,
    icon: TwitterXIcon,
    label: "Twitter/X",
    color: "hover:bg-zinc-900 hover:text-white",
  },
  {
    key: "linkedinUrl" as const,
    icon: LinkedInIcon,
    label: "LinkedIn",
    color: "hover:bg-blue-700 hover:text-white",
  },
  {
    key: "instagramUrl" as const,
    icon: InstagramIcon,
    label: "Instagram",
    color: "hover:bg-pink-600 hover:text-white",
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
                <Image src={settings.logoUrl} alt={settings.siteName || "ScholarHub"} width={32} height={32} className="object-contain" unoptimized />
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
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center transition-all duration-300 ${social.color}`}
                >
                  <social.icon />
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
