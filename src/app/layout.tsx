import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

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
  const headersList = headers();
  const lang = headersList.get("x-lang") ?? "en";
  const dir = headersList.get("x-dir") ?? "ltr";

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${cairo.variable} ${inter.className} antialiased`}>
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
