"use client";

import Link from "next/link";
import {
    Search,
    BookOpen,
    Bell,
    ArrowRight,
    Globe,
    CalendarDays,
    TrendingUp,
    Users,
    Star,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeaturedScholarships } from "@/components/home/featured-scholarships";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
    const { t } = useTranslation();

    const stats = [
        { icon: BookOpen,   value: t.home.stat1Value, label: t.home.stat1Label },
        { icon: Globe,      value: t.home.stat2Value, label: t.home.stat2Label },
        { icon: Users,      value: t.home.stat3Value, label: t.home.stat3Label },
        { icon: TrendingUp, value: t.home.stat4Value, label: t.home.stat4Label },
    ];

    const features = [
        { icon: Search,      title: t.home.feature1Title, description: t.home.feature1Desc },
        { icon: CalendarDays, title: t.home.feature2Title, description: t.home.feature2Desc },
        { icon: Bell,        title: t.home.feature3Title, description: t.home.feature3Desc },
        { icon: BookOpen,    title: t.home.feature4Title, description: t.home.feature4Desc },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                </div>

                <div className="container">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-fadeIn">
                            <Sparkles className="h-4 w-4" />
                            <span>{t.home.heroTag}</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slideUp">
                            {t.home.heroTitle.split("Academic Excellence")[0]}
                            <span className="gradient-text">Academic Excellence</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp">
                            {t.home.heroSub}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slideUp">
                            <Link href="/scholarships">
                                <Button variant="gradient" size="xl" className="gap-2">
                                    <Search className="h-5 w-5" />
                                    {t.home.browseScholarships}
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="xl" className="gap-2">
                                    {t.home.learnMore}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 animate-fadeIn">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-4 rounded-xl bg-card border shadow-sm"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                                    <div className="text-2xl md:text-3xl font-bold" data-ltr>{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Scholarships Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            {t.home.featuredTag}
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            {t.home.featuredTitle}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.home.featuredSub}
                        </p>
                    </div>

                    <FeaturedScholarships />

                    <div className="text-center mt-12">
                        <Link href="/scholarships">
                            <Button variant="outline" size="lg" className="gap-2 group">
                                {t.home.viewAll}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            {t.home.whyTitle}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.home.whySub}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="text-center p-6 rounded-xl border bg-card card-hover"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                                    <feature.icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-blue-600 text-white">
                <div className="container text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        {t.home.ctaTitle}
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        {t.home.ctaSub}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/scholarships">
                            <Button size="xl" variant="secondary" className="gap-2 text-primary">
                                {t.home.exploreScholarships}
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="xl" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
                                {t.home.contactUs}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
