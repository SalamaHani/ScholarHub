import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScholarHub - Find Scholarships for Students Worldwide",
  description:
    "ScholarHub helps students worldwide discover and access scholarship opportunities for academic and professional growth. Find scholarships, deadlines, and application links in one place.",
  keywords: [
    "scholarships",
    "students",
    "worldwide",
    "education",
    "financial aid",
    "study abroad",
    "university",
    "academic funding",
    "higher education",
  ],
  authors: [{ name: "ScholarHub Team" }],
  openGraph: {
    title: "ScholarHub - Find Scholarships for Students Worldwide",
    description:
      "Empowering students worldwide to discover scholarship opportunities for academic and professional growth.",
    type: "website",
    locale: "en_US",
    siteName: "ScholarHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarHub - Find Scholarships for Students Worldwide",
    description:
      "Empowering students worldwide to discover scholarship opportunities for academic and professional growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script — runs synchronously BEFORE first paint to avoid
            the flash of default CSS variable colors on refresh.
            Reads themePrimary / themeRing / lang from localStorage. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('scholarhub_settings')||'{}');if(s.themePrimary)document.documentElement.style.setProperty('--primary',s.themePrimary);if(s.themeRing)document.documentElement.style.setProperty('--ring',s.themeRing);var lang=localStorage.getItem('scholarhub_user_lang')||s.defaultLanguage;if(lang){document.documentElement.lang=lang;var rtl=['ar','he','fa','ur'].indexOf(lang)!==-1;document.documentElement.dir=rtl?'rtl':'ltr';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          <QueryProvider>
            <ThemeProvider>
              <LayoutWrapper>
                {children}
                <Toaster />
              </LayoutWrapper>
            </ThemeProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
