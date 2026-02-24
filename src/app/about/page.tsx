"use client";

import {
    Heart,
    Target,
    Users,
    Globe,
    GraduationCap,
    Sparkles,
    Award,
    BookOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageContentEntry } from "@/hooks/usePageContent";

const teamMembers = [
    {
        name: "Ahmad Hassan",
        role: "Founder & Lead Developer",
        description: "Computer Science graduate passionate about education access.",
    },
    {
        name: "Sara Mahmoud",
        role: "Content Manager",
        description: "Experienced in scholarship research and student guidance.",
    },
    {
        name: "Mohammed Ali",
        role: "Community Outreach",
        description: "Connecting with universities and scholarship providers.",
    },
];

export default function AboutPage() {
    const { t } = useTranslation();
    const { data: pageEntry } = usePageContentEntry("about-us");

    const values = [
        { icon: Heart,  title: t.about.value1Title, description: t.about.value1Desc },
        { icon: Target, title: t.about.value2Title, description: t.about.value2Desc },
        { icon: Users,  title: t.about.value3Title, description: t.about.value3Desc },
        { icon: Globe,  title: t.about.value4Title, description: t.about.value4Desc },
    ];

    const milestones = [
        { value: t.about.stat1Value, label: t.about.stat1Label },
        { value: t.about.stat2Value, label: t.about.stat2Label },
        { value: t.about.stat3Value, label: t.about.stat3Label },
        { value: t.about.stat4Value, label: t.about.stat4Label },
    ];

    return (
        <div className="py-8 md:py-12">
            {/* Hero Section */}
            <section className="container mb-16">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        {pageEntry?.heroText || t.about.tag}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {pageEntry?.title || t.about.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {pageEntry?.description || pageEntry?.subtitle || t.about.desc}
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-muted/30 py-16">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge variant="default" className="gap-1">
                                <Target className="h-3 w-3" />
                                {t.about.missionTag}
                            </Badge>
                            <h2 className="text-3xl font-bold">
                                {t.about.missionTitle}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t.about.missionDesc}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {milestones.map((milestone) => (
                                <Card key={milestone.label} className="text-center">
                                    <CardContent className="p-6">
                                        <div className="text-3xl font-bold text-primary mb-2" data-ltr>
                                            {milestone.value}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {milestone.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <Badge variant="secondary" className="gap-1">
                            <Award className="h-3 w-3" />
                            {t.about.valuesTag}
                        </Badge>
                        <h2 className="text-3xl font-bold">{t.about.valuesTitle}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.about.valuesSub}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <Card key={value.title} className="card-hover">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                        <value.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="bg-muted/30 py-16">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <Badge variant="secondary" className="gap-1">
                            <Users className="h-3 w-3" />
                            {t.about.teamTag}
                        </Badge>
                        <h2 className="text-3xl font-bold">{t.about.teamTitle}</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {t.about.teamSub}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {teamMembers.map((member) => (
                            <Card key={member.name} className="card-hover">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                                        <GraduationCap className="h-10 w-10 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{member.name}</h3>
                                        <p className="text-sm text-primary">{member.role}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {member.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container max-w-3xl">
                    <div className="text-center space-y-4 mb-8">
                        <Badge variant="secondary" className="gap-1">
                            <BookOpen className="h-3 w-3" />
                            {t.about.storyTag}
                        </Badge>
                        <h2 className="text-3xl font-bold">{t.about.storyTitle}</h2>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg text-center">
                        {t.about.storyDesc}
                    </p>
                </div>
            </section>
        </div>
    );
}
