import type { MetadataRoute } from "next";

const STATIC_ROUTES = [
    "",
    "/about",
    "/contact",
    "/scholarships",
    "/categories",
    "/deadlines",
    "/saved",
    "/applications",
    "/notifications",
    "/tips",
    "/guides",
    "/blog",
    "/faq",
    "/privacy",
    "/terms",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://scholarhub.ps";
    const lastModified = new Date();

    return STATIC_ROUTES.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.7,
    }));
}
