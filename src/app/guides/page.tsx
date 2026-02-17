import { BookOpen, FileText, CheckSquare, Send, Award, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const guides = [
    {
        icon: FileText,
        step: "01",
        title: "Finding the Right Scholarship",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        points: [
            "Use filters to match your field of study and degree level",
            "Check eligibility requirements carefully before applying",
            "Look for scholarships with upcoming deadlines first",
            "Bookmark scholarships you're interested in for easy access",
        ],
    },
    {
        icon: BookOpen,
        step: "02",
        title: "Writing a Strong Personal Statement",
        color: "text-violet-600 bg-violet-50 border-violet-200",
        points: [
            "Start with a compelling story or experience",
            "Clearly state your academic goals and career aspirations",
            "Explain why you specifically deserve this scholarship",
            "Tailor each statement to the scholarship's mission and values",
        ],
    },
    {
        icon: CheckSquare,
        step: "03",
        title: "Preparing Your Documents",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        points: [
            "Academic transcripts (official and translated if needed)",
            "Two to three strong recommendation letters",
            "Valid passport and national ID copies",
            "Language proficiency certificates (IELTS, TOEFL, etc.)",
        ],
    },
    {
        icon: Send,
        step: "04",
        title: "Submitting Your Application",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        points: [
            "Submit at least one week before the deadline",
            "Double-check all required fields are completed",
            "Use PDF format for all uploaded documents",
            "Save a copy of the confirmation email",
        ],
    },
    {
        icon: Award,
        step: "05",
        title: "After Applying",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        points: [
            "Track your application status in the Applications page",
            "Respond promptly to any interview invitations",
            "Prepare for scholarship interviews with mock sessions",
            "Continue applying to other scholarships while you wait",
        ],
    },
];

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        Step-by-Step
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">Application Guides</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Everything you need to know to submit a winning scholarship application —
                        from finding the right opportunity to hitting submit.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-5">
                    {guides.map((guide, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-5">
                                    <div className={`p-3 rounded-xl border shrink-0 ${guide.color}`}>
                                        <guide.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-muted-foreground tracking-widest">
                                                STEP {guide.step}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-3">{guide.title}</h3>
                                        <ul className="space-y-2">
                                            {guide.points.map((point, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
