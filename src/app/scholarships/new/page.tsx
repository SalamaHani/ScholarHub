"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Upload,
    Plus,
    Trash2,
    Save,
    Globe,
    Building2,
    GraduationCap,
    Calendar,
    DollarSign,
    Briefcase,
    BookOpen,
    X
} from "lucide-react";
import { useCategories, Category } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function NewScholarshipPage() {
    const { list: categoriesList } = useCategories();
    const categories = Array.isArray(categoriesList.data) ? categoriesList.data : [];

    const [isLoading, setIsLoading] = useState(false);
    const [fields, setFields] = useState<string[]>([]);

    const toggleField = (value: string) => {
        setFields(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/dashboard";
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            <div className="container px-4 py-8 max-w-4xl">
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Post New Scholarship</h1>
                        <p className="text-muted-foreground">Fill in the details to announce a new academic opportunity.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <Card className="shadow-sm border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Primary details about the scholarship organization and title.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label htmlFor="title">Scholarship Title</Label>
                                        <Input id="title" placeholder="e.g. Full Master's Fellowship in Artificial Intelligence" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="org">Organization Name</Label>
                                        <Input id="org" placeholder="e.g. University of Oxford / Global Foundation" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Host Country</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input id="country" className="pl-10" placeholder="e.g. United Kingdom" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea
                                        id="desc"
                                        placeholder="Provide a comprehensive summary of the scholarship..."
                                        className="min-h-[120px] resize-none"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Eligibility & Details */}
                        <Card className="shadow-sm border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    Eligibility & Requirements
                                </CardTitle>
                                <CardDescription>Define who can apply and what is required.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Degree Level</Label>
                                        <Select required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bachelor">Bachelor</SelectItem>
                                                <SelectItem value="master">Master</SelectItem>
                                                <SelectItem value="phd">PhD</SelectItem>
                                                <SelectItem value="postdoc">PostDoc</SelectItem>
                                                <SelectItem value="research">Research</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Funding Type</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shadow-sm" />
                                            <Select required>
                                                <SelectTrigger className="pl-10">
                                                    <SelectValue placeholder="Select funding" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="full">Full Funding</SelectItem>
                                                    <SelectItem value="partial">Partial Funding</SelectItem>
                                                    <SelectItem value="tuition">Tuition Only</SelectItem>
                                                    <SelectItem value="stipend">Stipend Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        Fields of Study
                                    </Label>
                                    <div className="space-y-3">
                                        <Select onValueChange={(v) => {
                                            if (v && !fields.includes(v)) {
                                                toggleField(v);
                                            }
                                        }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Add a major or field of study..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat: Category) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={cat.name}
                                                        disabled={fields.includes(cat.name)}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                                {categories.length === 0 && (
                                                    <div className="p-2 text-xs text-muted-foreground italic text-center">
                                                        No categories found
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl bg-primary/5 border border-dashed border-primary/20">
                                            {fields.length > 0 ? (
                                                fields.map((field) => (
                                                    <Badge
                                                        key={field}
                                                        variant="secondary"
                                                        className="px-3 py-1 flex items-center gap-2 bg-white text-primary border-primary/10 hover:bg-primary/5 transition-all group"
                                                    >
                                                        <span className="text-xs font-bold">{field}</span>
                                                        <X
                                                            className="h-3 w-3 cursor-pointer text-muted-foreground group-hover:text-destructive transition-colors"
                                                            onClick={() => toggleField(field)}
                                                        />
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic flex items-center justify-center w-full">
                                                    Select academic fields from the menu above...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Deadline & Application */}
                        <Card className="shadow-sm border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Deadlines & Links
                                </CardTitle>
                                <CardDescription>When should they apply and where?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="deadline">Application Deadline</Label>
                                        <Input id="deadline" type="date" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="link">Application Link (External)</Label>
                                        <Input id="link" placeholder="https://university.edu/apply" required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href="/dashboard">
                                <Button variant="ghost">Cancel</Button>
                            </Link>
                            <Button type="submit" variant="gradient" className="px-8 h-12 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Publishing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Post Scholarship
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
