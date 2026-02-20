"use client";

import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    GraduationCap,
    DollarSign,
    ExternalLink,
    Bookmark,
    Clock,
    Building2,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatDeadline, getDeadlineStatus, truncateText } from "@/lib/utils";
import { useSavedScholarships, useCheckSaved } from "@/hooks/useSavedScholarships";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/useTranslation";

interface ScholarshipCardProps {
    scholarship: {
        id: string;
        title: string;
        description: string;
        organization: string;
        country: string;
        degreeLevel: string[] | string; // Can be array or comma-separated string
        fundingType: string;
        deadline: Date | string;
        applicationLink: string;
        isFeatured?: boolean;
    };
    index?: number;
}

// Helper to parse degreeLevel (handles both array and comma-separated string)
function parseDegreeLevels(degreeLevel: string[] | string): string[] {
    if (!degreeLevel) return [];
    if (Array.isArray(degreeLevel)) return degreeLevel;
    return degreeLevel.split(',').map(s => s.trim());
}

export function ScholarshipCard({ scholarship, index = 0 }: ScholarshipCardProps) {
    const { save, remove: removeSaved } = useSavedScholarships();
    const { isAuthenticated } = useAuth();
    const { data: isSaved, isLoading: isCheckingSaved } = useCheckSaved(scholarship.id);
    const { t } = useTranslation();

    const deadlineStatus = getDeadlineStatus(scholarship.deadline);
    const deadlineText = formatDeadline(scholarship.deadline);

    const isPendingSave = save.isPending || removeSaved.isPending;

    const handleSaveToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast({
                title: t.scholarships.authRequired,
                description: t.scholarships.authRequiredDesc,
                variant: "destructive",
            });
            return;
        }

        try {
            if (isSaved) {
                await removeSaved.mutateAsync(scholarship.id);
            } else {
                await save.mutateAsync(scholarship.id);
            }
        } catch (error) {
            console.error("Save toggle error:", error);
        }
    };

    const getBadgeVariant = () => {
        switch (deadlineStatus) {
            case "urgent":
                return "urgent";
            case "soon":
                return "warning";
            case "expired":
                return "destructive";
            default:
                return "success";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Card className={`h-full card-hover group ${scholarship.isFeatured ? 'ring-2 ring-primary/50' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                            {scholarship.isFeatured && (
                                <Badge variant="default" className="mb-2">
                                    ⭐ {t.scholarships.featured}
                                </Badge>
                            )}
                            <Link
                                href={`/scholarships/${scholarship.id}`}
                                className="block"
                            >
                                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {scholarship.title}
                                </h3>
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span>{scholarship.organization}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`shrink-0 transition-all rounded-full ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}
                            onClick={handleSaveToggle}
                            disabled={isPendingSave || isCheckingSaved}
                        >
                            {isPendingSave ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Bookmark
                                    className={`h-5 w-5 transition-all ${isSaved ? 'fill-current' : ''}`}
                                />
                            )}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pb-3 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {truncateText(scholarship.description, 120)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {parseDegreeLevels(scholarship.degreeLevel).slice(0, 2).map((level) => (
                            <Badge key={level} variant="secondary" className="text-xs">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {level}
                            </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {scholarship.fundingType}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{scholarship.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <Badge variant={getBadgeVariant()} className="text-xs">
                                {deadlineText}
                            </Badge>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-3 border-t">
                    <div className="flex flex-col w-full gap-3">
                        <div className="flex items-center justify-between w-full gap-2">
                            <Link href={`/scholarships/${scholarship.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                    {t.scholarships.viewDetails}
                                </Button>
                            </Link>
                            <a
                                href={scholarship.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="default" size="sm" className="gap-1">
                                    {t.scholarships.apply}
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
