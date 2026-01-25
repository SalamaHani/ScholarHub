import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ScholarHub - Find Scholarships for Gaza Students",
    description:
        "ScholarHub helps students in Gaza discover and access scholarship opportunities for academic and professional growth. Find scholarships, deadlines, and application links in one place.",
    keywords: [
        "scholarships",
        "Gaza",
        "Palestine",
        "education",
        "financial aid",
        "study abroad",
        "university",
    ],
    authors: [{ name: "ScholarHub Team" }],
    openGraph: {
        title: "ScholarHub - Find Scholarships for Gaza Students",
        description:
            "Empowering students in Gaza to discover scholarship opportunities for academic growth.",
        type: "website",
        locale: "en_US",
        siteName: "ScholarHub",
    },
    twitter: {
        card: "summary_large_image",
        title: "ScholarHub - Find Scholarships for Gaza Students",
        description:
            "Empowering students in Gaza to discover scholarship opportunities for academic growth.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <ReduxProvider>
                    <QueryProvider>
                        <LayoutWrapper>
                            {children}
                            <Toaster />
                        </LayoutWrapper>
                    </QueryProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
