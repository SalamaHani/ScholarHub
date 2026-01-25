"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    Calendar,
    MapPin,
    GraduationCap,
    DollarSign,
    Building2,
    Clock,
    CheckCircle,
    FileText,
    Bookmark,
    Share2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, getDeadlineStatus, formatDeadline } from "@/lib/utils";
import { ApplicationModal } from "@/components/scholarships/application-modal";
import { useScholarship } from "@/hooks/useScholarships";
import { useSavedScholarships, useCheckSaved } from "@/hooks/useSavedScholarships";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export default function ScholarshipDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { data: scholarship, isLoading, error } = useScholarship(id);
    const { save, remove } = useSavedScholarships();
    const { isAuthenticated } = useAuth();
    const { data: isSaved, isLoading: isCheckingSaved } = useCheckSaved(id);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const isPendingSave = save.isPending || remove.isPending;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium">Loading scholarship details...</p>
            </div>
        );
    }

    if (error || !scholarship) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 container max-w-md text-center">
                <div className="p-4 bg-destructive/10 rounded-full">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Scholarship Not Found</h1>
                    <p className="text-muted-foreground">The scholarship you are looking for does not exist or has been removed.</p>
                </div>
                <Link href="/scholarships">
                    <Button>Back to Scholarships</Button>
                </Link>
            </div>
        );
    }

    const deadlineStatus = getDeadlineStatus(scholarship.deadline);
    const deadlineText = formatDeadline(scholarship.deadline);

    const handleSaveToggle = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to save scholarships to your profile.",
                variant: "destructive",
            });
            return;
        }

        try {
            if (isSaved) {
                await remove.mutateAsync(scholarship.id);
            } else {
                await save.mutateAsync(scholarship.id);
            }
        } catch (error) {
            // Error managed by hook's toast
        }
    };

    const getStatusBadge = () => {
        switch (deadlineStatus) {
            case "urgent":
                return <Badge variant="destructive" className="gap-1 animate-pulse"><AlertCircle className="h-3 w-3" />{deadlineText}</Badge>;
            case "soon":
                return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" />{deadlineText}</Badge>;
            case "expired":
                return <Badge variant="destructive">{deadlineText}</Badge>;
            default:
                return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />{deadlineText}</Badge>;
        }
    };

    return (
        <div className="py-8 md:py-12 bg-muted/20 min-h-screen">
            <div className="container max-w-6xl">
                <Link href="/scholarships">
                    <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Scholarships
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            {scholarship.isFeatured && (
                                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">⭐ Featured Scholarship</Badge>
                            )}
                            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                                {scholarship.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white rounded-md border shadow-sm">
                                        <Building2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{scholarship.organization}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white rounded-md border shadow-sm">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{scholarship.country}</span>
                                </div>
                            </div>
                        </div>

                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b">
                                <CardTitle className="text-xl">About This Scholarship</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 bg-white/50">
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    {scholarship.description}
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard title="Eligibility Criteria" icon={CheckCircle} content={scholarship.eligibility} />
                            <InfoCard title="Requirements" icon={FileText} content={scholarship.requirements} />
                        </div>

                        {scholarship.benefits && (
                            <InfoCard title="Benefits & Coverage" icon={DollarSign} content={scholarship.benefits} />
                        )}
                        {scholarship.documents && (
                            <InfoCard title="Required Documents" icon={FileText} content={scholarship.documents} />
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="sticky top-24 shadow-xl border-primary/5 glass overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deadline</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-bold text-lg">{formatDate(scholarship.deadline)}</span>
                                        </div>
                                        {getStatusBadge()}
                                    </div>
                                </div>

                                <Separator className="bg-primary/5" />

                                <div className="space-y-5">
                                    <DetailItem label="Funding Type" value={scholarship.fundingType} isBadge />
                                    <DetailItem label="Location" value={scholarship.country} />
                                    <DetailItem label="Degree Level" value={scholarship.degreeLevel} isTag />
                                    <DetailItem label="Field of Study" value={scholarship.fieldOfStudy} isTag />
                                </div>

                                <Separator className="bg-primary/5" />

                                <div className="space-y-3">
                                    <Button
                                        variant="gradient"
                                        size="lg"
                                        className="w-full h-14 text-base font-bold shadow-lg shadow-primary/25 group"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Apply on ScholarHub
                                        <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    {scholarship.applicationLink && (
                                        <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button variant="outline" className="w-full h-12 gap-2 text-muted-foreground font-semibold">
                                                Official Website
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            disabled={isPendingSave || isCheckingSaved}
                                            onClick={handleSaveToggle}
                                            className={`flex-1 gap-2 text-xs font-bold border transition-colors ${isSaved ? 'bg-primary/5 text-primary border-primary/20' : 'hover:bg-muted/50'}`}
                                        >
                                            {isPendingSave ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                                            )}
                                            {isSaved ? 'Saved' : 'Save'}
                                        </Button>
                                        <Button variant="ghost" className="flex-1 gap-2 text-xs font-bold border hover:bg-muted/50 transition-colors">
                                            <Share2 className="h-4 w-4 text-primary" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                scholarshipTitle={scholarship.title}
                scholarshipId={scholarship.id}
            />
        </div>
    );
}

function InfoCard({ title, icon: Icon, content }: any) {
    return (
        <Card className="border-none shadow-sm h-full hover:shadow-md transition-all">
            <CardHeader className="pb-3 border-b bg-muted/5">
                <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                        <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="whitespace-pre-line text-muted-foreground text-sm leading-relaxed">
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}

function DetailItem({ label, value, isBadge, isTag }: any) {
    const values = Array.isArray(value)
        ? value
        : typeof value === 'string'
            ? value.split(',').map(v => v.trim()).filter(Boolean)
            : [];

    return (
        <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
            <div className="flex flex-wrap gap-1.5">
                {values.length > 0 ? (
                    values.map((v: string) => (
                        <Badge key={v} variant={isTag ? "secondary" : "outline"} className="text-[10px] px-2 py-0">
                            {v}
                        </Badge>
                    ))
                ) : (
                    isBadge ? <Badge variant="success" className="text-[10px] px-2 py-0">{value}</Badge> : <span className="font-bold text-sm">{value}</span>
                )}
            </div>
        </div>
    );
}
