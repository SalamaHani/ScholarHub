"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Heart,
    Target,
    Users,
    Globe,
    Sparkles,
    Award,
    BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageContentEntry } from "@/hooks/usePageContent";

const teamMembers = [
    {
        name: "Tareq Radi",
        role: "CEO & Founder",
        description: "Visionary leader driving ScholarHub's mission to make higher education accessible for every student in Gaza and beyond.",
        descriptionAr: "قائد رؤيوي يقود مهمة ScholarHub لجعل التعليم العالي في متناول كل طالب في غزة وخارجها.",
        color: "bg-primary/10 text-primary",
        initials: "TR",
        image: "",
    },
    {
        name: "Mahmoud Alshantti",
        role: "Software Architect",
        description: "Designs the backbone of ScholarHub's platform — scalable, secure, and built to serve thousands of students.",
        descriptionAr: "يصمم البنية التحتية لمنصة ScholarHub — قابلة للتوسع وآمنة ومبنية لخدمة آلاف الطلاب.",
        color: "bg-violet-100 text-violet-700",
        initials: "MA",
        image: "",
    },
    {
        name: "Salama Eligla",
        role: "Full-Stack Developer",
        description: "Brings features to life with clean, performant code — from backend APIs to seamless front-end experiences.",
        descriptionAr: "يُحيي الميزات بكود نظيف وعالي الأداء — من واجهات برمجية خلفية إلى تجارب أمامية سلسة.",
        color: "bg-emerald-100 text-emerald-700",
        initials: "SE",
        image: "",
    },
    {
        name: "Amir Alshantti",
        role: "UI/UX Designer",
        description: "Crafts intuitive, beautiful interfaces that make finding scholarships feel effortless for every student.",
        descriptionAr: "يصمم واجهات بديهية وجميلة تجعل البحث عن المنح أمراً سهلاً لكل طالب.",
        color: "bg-amber-100 text-amber-700",
        initials: "AA",
        image: "",
    },
];

export default function AboutPage() {
    const { t, lang } = useTranslation();
    const { data: pageEntry } = usePageContentEntry("about-us");
    const [viewMember, setViewMember] = useState<typeof teamMembers[0] | null>(null);

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

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {teamMembers.map((member) => (
                            <Card key={member.name} className="card-hover group border-transparent hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
                                <CardContent className="p-6 text-center space-y-4">
                                    {/* Circular clickable avatar */}
                                    <button
                                        onClick={() => setViewMember(member)}
                                        className="mx-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full"
                                        aria-label={`View ${member.name}`}
                                    >
                                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-2xl font-black tracking-tight shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all hover:scale-105 ${!member.image ? member.color : ""}`}>
                                            {member.image ? (
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover rounded-full"
                                                    unoptimized
                                                />
                                            ) : (
                                                member.initials
                                            )}
                                        </div>
                                    </button>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-base leading-tight">{member.name}</h3>
                                        <Badge variant="secondary" className="text-[10px] font-semibold tracking-wide px-2">
                                            {member.role}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {lang === "ar" ? member.descriptionAr : member.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Member profile dialog */}
                    <Dialog open={!!viewMember} onOpenChange={(open) => { if (!open) setViewMember(null); }}>
                        <DialogContent className="max-w-sm text-center p-8">
                            {viewMember && (
                                <div className="space-y-5">
                                    {/* Large circular avatar */}
                                    <div className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center text-4xl font-black tracking-tight shadow-lg overflow-hidden ring-4 ring-primary/20 ${!viewMember.image ? viewMember.color : ""}`}>
                                        {viewMember.image ? (
                                            <Image
                                                src={viewMember.image}
                                                alt={viewMember.name}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover rounded-full"
                                                unoptimized
                                            />
                                        ) : (
                                            viewMember.initials
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">{viewMember.name}</h3>
                                        <Badge className="text-xs px-3 py-1">{viewMember.role}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {lang === "ar" ? viewMember.descriptionAr : viewMember.description}
                                    </p>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
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
