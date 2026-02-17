import Link from "next/link";
import { Calendar, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const deadlines = [
    {
        id: "1",
        title: "Chevening Scholarships 2025/26",
        organization: "UK Government",
        deadline: "2025-11-05",
        daysLeft: 12,
        type: "Full Funding",
        category: "General",
        urgent: true,
    },
    {
        id: "2",
        title: "DAAD Study Scholarships",
        organization: "German Academic Exchange Service",
        deadline: "2025-11-30",
        daysLeft: 37,
        type: "Full Funding",
        category: "Science & Research",
        urgent: false,
    },
    {
        id: "3",
        title: "Fulbright Foreign Student Program",
        organization: "U.S. Department of State",
        deadline: "2025-12-15",
        daysLeft: 52,
        type: "Full Funding",
        category: "All Fields",
        urgent: false,
    },
    {
        id: "4",
        title: "Erasmus Mundus Joint Master Degrees",
        organization: "European Commission",
        deadline: "2026-01-10",
        daysLeft: 78,
        type: "Full Funding",
        category: "Technology",
        urgent: false,
    },
    {
        id: "5",
        title: "Turkish Government Scholarship",
        organization: "Republic of Türkiye",
        deadline: "2026-02-20",
        daysLeft: 119,
        type: "Full Funding",
        category: "General",
        urgent: false,
    },
];

function getDaysColor(days: number) {
    if (days <= 14) return "text-red-600 bg-red-50 border-red-200";
    if (days <= 30) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
}

function getDaysLabel(days: number) {
    if (days === 0) return "Today!";
    if (days === 1) return "1 day left";
    return `${days} days left`;
}

export default function DeadlinesPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="mb-10 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider">
                        <Calendar className="h-4 w-4" />
                        UPCOMING DEADLINES
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Don't Miss a Deadline</h1>
                    <p className="text-muted-foreground max-w-xl">
                        Stay on top of scholarship application deadlines. Sorted by the closest
                        closing dates so you never miss an opportunity.
                    </p>
                </div>

                {/* Urgent banner */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-8">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                        <strong>1 scholarship</strong> closing within the next 14 days — apply now!
                    </p>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {deadlines.map((item) => (
                        <Card key={item.id} className="hover:shadow-md hover:border-primary/40 transition-all group">
                            <CardContent className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                                                {item.title}
                                            </h3>
                                            {item.urgent && (
                                                <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.organization}</p>
                                        <div className="flex flex-wrap items-center gap-3 pt-1">
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(item.deadline).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <Badge variant="outline" className="text-[10px] h-5">
                                                {item.type}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] h-5">
                                                {item.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs font-bold px-3 py-1 ${getDaysColor(item.daysLeft)}`}
                                        >
                                            <Clock className="h-3 w-3 mr-1" />
                                            {getDaysLabel(item.daysLeft)}
                                        </Badge>
                                        <Link href={`/scholarships/${item.id}`}>
                                            <Button size="sm" variant="outline" className="gap-1">
                                                Apply
                                                <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link href="/scholarships">
                        <Button variant="outline" className="gap-2">
                            Browse All Scholarships
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
