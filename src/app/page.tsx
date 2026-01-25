import Link from "next/link";
import {
    GraduationCap,
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FeaturedScholarships } from "@/components/home/featured-scholarships";

const stats = [
    { icon: BookOpen, value: "500+", label: "Scholarships" },
    { icon: Globe, value: "50+", label: "Countries" },
    { icon: Users, value: "10K+", label: "Students Helped" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
];

const features = [
    {
        icon: Search,
        title: "Easy Search",
        description: "Find scholarships matching your profile with our powerful search and filter system.",
    },
    {
        icon: CalendarDays,
        title: "Deadline Tracking",
        description: "Never miss a deadline with our automatic reminders and organized deadline calendar.",
    },
    {
        icon: Bell,
        title: "Smart Alerts",
        description: "Get notified about new scholarships that match your interests and qualifications.",
    },
    {
        icon: BookOpen,
        title: "Application Guides",
        description: "Access comprehensive guides to help you submit winning scholarship applications.",
    },
];

export default function HomePage() {
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
                            <span>Empowering Gaza Students</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slideUp">
                            Discover Your Path to{" "}
                            <span className="gradient-text">Academic Excellence</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp">
                            Find scholarship opportunities from around the world. We organize all scholarships
                            in one place with clear requirements, deadlines, and application links.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slideUp">
                            <Link href="/scholarships">
                                <Button variant="gradient" size="xl" className="gap-2">
                                    <Search className="h-5 w-5" />
                                    Browse Scholarships
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="xl" className="gap-2">
                                    Learn More
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 animate-fadeIn">
                            {stats.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="text-center p-4 rounded-xl bg-card border shadow-sm"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
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
                            Featured
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Top Scholarship Opportunities
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore carefully selected scholarships from prestigious institutions worldwide
                        </p>
                    </div>

                    <FeaturedScholarships />

                    <div className="text-center mt-12">
                        <Link href="/scholarships">
                            <Button variant="outline" size="lg" className="gap-2 group">
                                View All Scholarships
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
                            Why Choose ScholarHub?
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We make finding and applying for scholarships easier than ever before
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
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
                        Start Your Scholarship Journey Today
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Join thousands of students who have found their path to higher education through ScholarHub.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/scholarships">
                            <Button size="xl" variant="secondary" className="gap-2 text-primary">
                                Explore Scholarships
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="xl" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
