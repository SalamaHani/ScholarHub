import Link from "next/link";
import { GraduationCap, Microscope, Briefcase, Palette, Globe, Code, Heart, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
    {
        icon: Microscope,
        label: "Science & Research",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        count: 48,
        description: "Physics, Chemistry, Biology, Environmental Science",
    },
    {
        icon: Code,
        label: "Technology & Engineering",
        color: "text-violet-600 bg-violet-50 border-violet-200",
        count: 62,
        description: "Computer Science, Software Engineering, AI, Data Science",
    },
    {
        icon: Briefcase,
        label: "Business & Economics",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        count: 35,
        description: "Finance, Management, Entrepreneurship, MBA",
    },
    {
        icon: Palette,
        label: "Arts & Humanities",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        count: 29,
        description: "Literature, History, Philosophy, Fine Arts, Journalism",
    },
    {
        icon: Heart,
        label: "Medicine & Health",
        color: "text-red-600 bg-red-50 border-red-200",
        count: 41,
        description: "Medicine, Pharmacy, Public Health, Nursing",
    },
    {
        icon: Globe,
        label: "International Studies",
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
        count: 27,
        description: "Political Science, International Relations, Languages",
    },
    {
        icon: BookOpen,
        label: "Education",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        count: 22,
        description: "Teaching, Pedagogy, Educational Psychology",
    },
    {
        icon: GraduationCap,
        label: "General Scholarships",
        color: "text-slate-600 bg-slate-50 border-slate-200",
        count: 55,
        description: "Open to all fields and disciplines",
    },
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        Browse by Category
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">Scholarship Categories</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Explore scholarships organized by field of study. Find opportunities
                        that match your academic interests and career goals.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => (
                        <Link key={cat.label} href={`/scholarships?category=${encodeURIComponent(cat.label)}`}>
                            <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group">
                                <CardContent className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                                            <cat.icon className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {cat.count} scholarships
                                        </Badge>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                            {cat.label}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Browse <ArrowRight className="h-3 w-3 ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
