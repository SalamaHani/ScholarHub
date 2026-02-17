import { Lightbulb, Star, Target, Clock, Users, FileCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tips = [
    {
        icon: Target,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        category: "Strategy",
        title: "Apply to Multiple Scholarships",
        body: "Don't put all your hopes on a single scholarship. Apply to at least 5–10 scholarships simultaneously to increase your chances of success. Prioritize those that best match your profile.",
    },
    {
        icon: Clock,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        category: "Timing",
        title: "Start Early",
        body: "Begin your applications at least 2–3 months before the deadline. This gives you time to gather documents, write polished essays, and request recommendation letters without rushing.",
    },
    {
        icon: FileCheck,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        category: "Documents",
        title: "Tailor Every Application",
        body: "Never submit the same personal statement to multiple scholarships. Research each organization's values and mission, then customize your statement to show why you are the perfect fit.",
    },
    {
        icon: Users,
        color: "text-violet-600 bg-violet-50 border-violet-200",
        category: "References",
        title: "Choose Strong Recommenders",
        body: "Select professors or mentors who know you well and can speak specifically to your abilities. Give them enough lead time (4–6 weeks) and share your personal statement so they can align their letter.",
    },
    {
        icon: Star,
        color: "text-rose-600 bg-rose-50 border-rose-200",
        category: "Presentation",
        title: "Proofread Everything",
        body: "A single typo can undermine an otherwise excellent application. Read your essay aloud, use spell-check tools, and ask a trusted friend or teacher to review your work before submitting.",
    },
    {
        icon: Lightbulb,
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
        category: "Mindset",
        title: "Rejection is Part of the Process",
        body: "Most successful scholarship recipients faced rejections before winning. Treat every rejection as feedback and an opportunity to improve. Keep applying — persistence is your greatest advantage.",
    },
];

export default function TipsPage() {
    return (
        <div className="min-h-screen bg-muted/20 py-12 md:py-16">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5">
                        Expert Advice
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight">Tips & Tricks</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Proven strategies from scholarship winners and advisors to help you
                        stand out and maximize your success rate.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {tips.map((tip, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl border ${tip.color}`}>
                                        <tip.icon className="h-4 w-4" />
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {tip.category}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-base">{tip.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
