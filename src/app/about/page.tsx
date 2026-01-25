import { Metadata } from "next";
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

export const metadata: Metadata = {
    title: "About Us | ScholarHub",
    description: "Learn about ScholarHub's mission to help students in Gaza find scholarship opportunities.",
};

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

const values = [
    {
        icon: Heart,
        title: "Accessibility",
        description: "Making scholarship information freely available to all students regardless of their circumstances.",
    },
    {
        icon: Target,
        title: "Accuracy",
        description: "Providing verified and up-to-date information about scholarship requirements and deadlines.",
    },
    {
        icon: Users,
        title: "Community",
        description: "Building a supportive community of students helping each other achieve their dreams.",
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Connecting students with opportunities from universities around the world.",
    },
];

const milestones = [
    { value: "500+", label: "Scholarships Listed" },
    { value: "10K+", label: "Students Helped" },
    { value: "50+", label: "Countries Covered" },
    { value: "200+", label: "Success Stories" },
];

export default function AboutPage() {
    return (
        <div className="py-8 md:py-12">
            {/* Hero Section */}
            <section className="container mb-16">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        About Us
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Empowering Students to{" "}
                        <span className="gradient-text">Achieve Their Dreams</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        ScholarHub was born from a simple belief: every student deserves access
                        to educational opportunities, regardless of their circumstances. We&apos;re
                        dedicated to helping students in Gaza and beyond find their path to
                        academic excellence.
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
                                Our Mission
                            </Badge>
                            <h2 className="text-3xl font-bold">
                                Opening Doors to Education
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We believe that education is the key to a brighter future. Our mission
                                is to collect and organize scholarship opportunities in one accessible
                                platform, displaying requirements, deadlines, and application links
                                clearly so students can focus on what matters most—their applications.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                For students in Gaza facing unique challenges in accessing educational
                                resources, we aim to be a bridge connecting them with opportunities
                                that can transform their lives and communities.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {milestones.map((milestone) => (
                                <Card key={milestone.label} className="text-center">
                                    <CardContent className="p-6">
                                        <div className="text-3xl font-bold text-primary mb-2">
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
                            Our Values
                        </Badge>
                        <h2 className="text-3xl font-bold">What We Stand For</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our core values guide everything we do at ScholarHub
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
                            Our Team
                        </Badge>
                        <h2 className="text-3xl font-bold">Meet the Team</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Passionate individuals dedicated to helping students succeed
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
                            Our Story
                        </Badge>
                        <h2 className="text-3xl font-bold">Why We Started ScholarHub</h2>
                    </div>

                    <div className="prose prose-lg mx-auto text-muted-foreground">
                        <p>
                            ScholarHub started as a simple idea: what if there was one place where
                            students could find all the scholarship opportunities they need? As students
                            ourselves, we experienced firsthand the challenges of searching for scholarships—
                            scattered information, missed deadlines, and unclear requirements.
                        </p>
                        <p>
                            For students in Gaza, these challenges are even greater. Limited internet access,
                            difficulty reaching international institutions, and a lack of guidance make the
                            already daunting process of applying for scholarships even more difficult.
                        </p>
                        <p>
                            That&apos;s why we created ScholarHub. We wanted to build a platform that would
                            organize scholarship information clearly, track deadlines, and make the
                            application process as smooth as possible. Our goal is to ensure that no
                            student misses out on an opportunity simply because they didn&apos;t know about it.
                        </p>
                        <p className="font-medium text-foreground">
                            Together, we can open doors to education and create a brighter future for
                            students everywhere.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
