"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Send,
    Info,
    HelpCircle,
    FileText,
    ArrowRight,
    ArrowLeft,
    Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useApplications } from "@/hooks/useApplications";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Lock, UserCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getProfileStatus, getStatusColor, getStatusBgColor, getStatusIndicatorColor } from "@/lib/profileStatus";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scholarshipTitle: string;
    scholarshipId: string;
    questions?: Array<{ id: string; question: string; type: "TEXT" | "MULTIPLE_CHOICE" | "DOCUMENT"; options?: string[] }>;
}

export function ApplicationModal({ isOpen, onClose, scholarshipTitle, scholarshipId, questions = [] }: ApplicationModalProps) {
    const { user } = useAuth();
    const { submit } = useApplications();
    const [activeTab, setActiveTab] = React.useState("profile");
    const [answers, setAnswers] = React.useState<Record<string, string>>({});
    const [motivation, setMotivation] = React.useState("");
    const [additionalInfo, setAdditionalInfo] = React.useState("");

    // Get profile completeness from user
    const completeness = user?.profileCompleteness ?? 0;
    const isEligible = completeness >= 80;
    const isSubmitting = submit.isPending;

    // Standardized Status System
    const status = getProfileStatus(completeness);
    const statusColor = getStatusColor(status);
    const statusBgColor = getStatusBgColor(status);
    const indicatorColor = getStatusIndicatorColor(status);

    // Steps configuration - matching the image style
    const steps = [
        { id: "profile", label: "BASIC", icon: Info, description: "Profile Verification" },
        { id: "questions", label: "DETAILED", icon: FileText, description: "Application Questions" },
        { id: "review", label: "QUESTIONS", icon: HelpCircle, description: "Final Review" },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === activeTab);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const handleStepChange = (targetTab: string) => {
        const targetIndex = steps.findIndex(s => s.id === targetTab);

        // Can't go to questions if profile is not eligible
        if (targetTab === "questions" && !isEligible) {
            toast({
                title: "Profile Incomplete",
                description: "Please complete your profile to at least 80% before proceeding.",
                variant: "destructive"
            });
            return;
        }

        // Can't go to review if no questions answered (when there are questions)
        if (targetTab === "review" && questions.length > 0) {
            const unanswered = questions.filter(q => !answers[q.id]);
            if (unanswered.length > 0 || !motivation) {
                toast({
                    title: "Incomplete Application",
                    description: "Please answer all questions and provide your motivation letter.",
                    variant: "destructive"
                });
                return;
            }
        }

        setActiveTab(targetTab);
    };

    const handleNext = () => {
        if (activeTab === "profile" && isEligible) {
            if (questions && questions.length > 0) {
                setActiveTab("questions");
            } else {
                setActiveTab("review");
            }
        } else if (activeTab === "questions") {
            handleStepChange("review");
        }
    };

    const handleBack = () => {
        if (activeTab === "questions") {
            setActiveTab("profile");
        } else if (activeTab === "review") {
            if (questions && questions.length > 0) {
                setActiveTab("questions");
            } else {
                setActiveTab("profile");
            }
        }
    };

    const answeredCount = Object.keys(answers).filter(id => answers[id]).length;
    const totalQuestions = (questions?.length || 0) + 1; // +1 for Motivation
    const quizProgress = (answeredCount + (motivation ? 1 : 0)) / totalQuestions * 100;

    const handleSubmit = async () => {
        if (!isEligible) return;

        // Map answers object to array format expected by backend
        const answersArray = questions.map(q => ({
            questionId: q.id,
            answer: answers[q.id] || ""
        }));

        // Validate that all questions have an answer if required
        const unanswered = answersArray.filter(a => !a.answer);
        if (unanswered.length > 0 && questions.length > 0) {
            toast({
                title: "Incomplete Questions",
                description: "Please answer all scholarship questions before submitting.",
                variant: "destructive",
            });
            return;
        }

        try {
            await submit.mutateAsync({
                scholarshipId,
                motivation,
                answers: answersArray,
                documents: [],
                additionalInfo,
                metadata: JSON.stringify({
                    fullName: user?.name || "",
                    phone: user?.phoneNumber || "",
                    university: user?.university || user?.institution || "",
                    gpa: user?.gpa || "",
                    major: user?.fieldOfStudy || ""
                })
            } as any);
            toast({
                title: "Application Sent!",
                description: "Your application has been submitted successfully.",
            });
            onClose();
            // Reset for next time
            setTimeout(() => {
                setActiveTab("profile");
                setAnswers({});
                setMotivation("");
                setAdditionalInfo("");
            }, 500);
        } catch (error: any) {
            console.error("Submission failed:", error);
            toast({
                title: "Submission Failed",
                description: error?.response?.data?.message || "There was an error submitting your application. Please try again.",
                variant: "destructive",
            });
        }
    };

    const resetModal = () => {
        setActiveTab("profile");
        setAnswers({});
        setMotivation("");
        setAdditionalInfo("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                setTimeout(resetModal, 500);
            }
        }}>
            <DialogContent className="sm:max-w-2xl bg-white border-slate-200 p-0 overflow-hidden shadow-xl flex flex-col rounded-2xl max-h-[90vh]">
                {/* Step Indicators - matching image style */}
                <div className="px-8 pt-8 pb-4 bg-white">
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = activeTab === step.id;
                            const isCompleted = steps.findIndex(s => s.id === activeTab) > idx;
                            const isDisabled = step.id === "questions" && !isEligible;

                            return (
                                <React.Fragment key={step.id}>
                                    <div
                                        className={cn(
                                            "flex flex-col items-center gap-3 transition-all cursor-pointer",
                                            isDisabled && "opacity-40 cursor-not-allowed"
                                        )}
                                        onClick={() => !isDisabled && handleStepChange(step.id)}
                                    >
                                        {/* Circle Icon - like the image */}
                                        <div className={cn(
                                            "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                            isActive
                                                ? "bg-primary text-white border-primary"
                                                : isCompleted
                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                    : "bg-white text-slate-400 border-slate-200"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        {/* Label */}
                                        <span className={cn(
                                            "text-[11px] font-bold tracking-wider",
                                            isActive ? "text-primary" : "text-slate-400"
                                        )}>
                                            {step.label}
                                        </span>
                                    </div>

                                    {/* Connector line between steps */}
                                    {idx < steps.length - 1 && (
                                        <div className="flex-1 mx-4" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Progress Bar - blue line like the image */}
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-primary rounded-full"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-8 py-6 flex-1 overflow-y-auto bg-white">
                    <Tabs value={activeTab} className="w-full">
                        <TabsList className="hidden">
                            <TabsTrigger value="profile" />
                            <TabsTrigger value="questions" />
                            <TabsTrigger value="review" />
                        </TabsList>

                        {/* Step 1: Profile Verification */}
                        <TabsContent value="profile" className="outline-none mt-0">
                            <AnimatePresence mode="wait">
                                {isEligible ? (
                                    <motion.div
                                        key="eligible"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        {/* Success Header */}
                                        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-emerald-800">Profile Verified!</h3>
                                                <p className="text-sm text-emerald-600">
                                                    Your profile is {completeness}% complete
                                                </p>
                                            </div>
                                        </div>

                                        {/* Scholarship Title */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Scholarship</label>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-base font-semibold text-slate-800">{scholarshipTitle}</p>
                                            </div>
                                        </div>

                                        {/* Profile Summary */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-slate-700">Your Information</label>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500">Full Name</label>
                                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <p className="text-sm font-medium text-slate-700">{user?.name || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500">University</label>
                                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <p className="text-sm font-medium text-slate-700 truncate">{user?.university || user?.institution || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500">Field of Study</label>
                                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <p className="text-sm font-medium text-slate-700 truncate">{user?.fieldOfStudy || "Not provided"}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-semibold text-slate-500">GPA</label>
                                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <p className="text-sm font-medium text-slate-700">{user?.gpa || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="not-eligible"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        {/* Warning Header */}
                                        <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center",
                                                status === "GOOD" ? "bg-amber-100" : "bg-red-100"
                                            )}>
                                                <Lock className={cn("h-6 w-6", status === "GOOD" ? "text-amber-600" : "text-red-600")} />
                                            </div>
                                            <div>
                                                <h3 className={cn("text-base font-bold", status === "GOOD" ? "text-amber-800" : "text-red-800")}>
                                                    Complete Your Profile
                                                </h3>
                                                <p className={cn("text-sm", status === "GOOD" ? "text-amber-600" : "text-red-600")}>
                                                    Your profile is {completeness}% complete (80% required)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-600">Progress</span>
                                                <span className="font-bold text-slate-700">{completeness}% / 80%</span>
                                            </div>
                                            <Progress value={(completeness / 80) * 100} className="h-2 bg-slate-100" indicatorClassName={indicatorColor} />
                                        </div>

                                        {/* Complete Profile Button */}
                                        <Link href="/profile" className="block" onClick={onClose}>
                                            <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold">
                                                <UserCircle2 className="mr-2 h-5 w-5" />
                                                Complete Profile
                                            </Button>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </TabsContent>

                        {/* Step 2: Questions */}
                        <TabsContent value="questions" className="outline-none mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Questions List */}
                                {questions.map((q, idx) => (
                                    <div key={q.id} className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">
                                            {q.question}
                                        </label>

                                        {q.type === "TEXT" ? (
                                            <textarea
                                                className="w-full min-h-[100px] p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm text-slate-700 transition-all resize-none placeholder:text-slate-400"
                                                placeholder="Type your answer here..."
                                                value={answers[q.id] || ""}
                                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            />
                                        ) : q.type === "MULTIPLE_CHOICE" ? (
                                            <div className="space-y-2">
                                                {q.options?.map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                        className={cn(
                                                            "flex items-center gap-3 w-full p-4 rounded-xl text-left text-sm font-medium transition-all border",
                                                            answers[q.id] === opt
                                                                ? 'bg-primary/5 border-primary text-primary'
                                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                                            answers[q.id] === opt ? 'border-primary bg-primary' : 'border-slate-300'
                                                        )}>
                                                            {answers[q.id] === opt && <div className="h-2 w-2 rounded-full bg-white" />}
                                                        </div>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className={cn(
                                                    "relative cursor-pointer group rounded-2xl border-2 border-dashed transition-all p-6 text-center",
                                                    answers[q.id]
                                                        ? "border-emerald-200 bg-emerald-50/30"
                                                        : "border-slate-200 hover:border-primary/40 hover:bg-slate-50/50"
                                                )}>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                // In a real app, you'd upload this to S3/Cloudinary and set the URL
                                                                setAnswers(prev => ({ ...prev, [q.id]: `uploaded-${file.name}` }));
                                                                toast({ title: "File Added", description: `${file.name} prepared for upload.` });
                                                            }
                                                        }}
                                                    />
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className={cn(
                                                            "h-12 w-12 rounded-full flex items-center justify-center",
                                                            answers[q.id] ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                                        )}>
                                                            <Upload className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700">
                                                                {answers[q.id] ? "File Selected" : "Upload Document"}
                                                            </p>
                                                            <p className="text-xs text-slate-400">
                                                                {answers[q.id] ? answers[q.id] : "Click or drag to upload (PDF, JPG, PNG)"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Motivation Letter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">
                                        Motivation Letter <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="w-full min-h-[120px] p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm text-slate-700 transition-all resize-none placeholder:text-slate-400"
                                        placeholder="Why are you the ideal candidate for this scholarship?"
                                        value={motivation}
                                        onChange={(e) => setMotivation(e.target.value)}
                                    />
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">
                                        Additional Information <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        className="w-full min-h-[80px] p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm text-slate-700 transition-all resize-none placeholder:text-slate-400"
                                        placeholder="Any additional details..."
                                        value={additionalInfo}
                                        onChange={(e) => setAdditionalInfo(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Step 3: Review */}
                        <TabsContent value="review" className="outline-none mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Ready to Submit */}
                                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-emerald-800">Ready to Submit</h3>
                                        <p className="text-sm text-emerald-600">Review your application below</p>
                                    </div>
                                </div>

                                {/* Profile Review */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700">Profile Information</h4>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-500">Name</span>
                                            <span className="text-sm font-medium text-slate-700">{user?.name || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-500">University</span>
                                            <span className="text-sm font-medium text-slate-700">{user?.university || user?.institution || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Answers Review */}
                                {questions.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-slate-700">Your Answers</h4>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                                            {questions.map((q, idx) => (
                                                <div key={q.id} className="space-y-1">
                                                    <p className="text-xs font-semibold text-slate-500">Q{idx + 1}: {q.question}</p>
                                                    <p className="text-sm text-slate-700">
                                                        {q.type === 'DOCUMENT' && answers[q.id] ? (
                                                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                                                <FileText className="h-3.5 w-3.5" />
                                                                {answers[q.id]}
                                                            </span>
                                                        ) : (
                                                            answers[q.id] || <span className="text-slate-400 italic">Not answered</span>
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Motivation Review */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700">Motivation Letter</h4>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="text-sm text-slate-700 line-clamp-4">{motivation || <span className="text-slate-400 italic">Not provided</span>}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer with Navigation */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white">
                    <div className="flex items-center justify-between gap-4">
                        {/* Back Button */}
                        <div>
                            {activeTab !== "profile" && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="h-11 rounded-xl border-slate-200 text-slate-600 font-semibold px-5 hover:bg-slate-50"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            )}
                        </div>

                        {/* Next/Submit Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 font-medium"
                            >
                                Cancel
                            </Button>

                            {activeTab === "profile" && isEligible && (
                                <Button
                                    onClick={handleNext}
                                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6"
                                >
                                    {questions.length > 0 ? "Continue" : "Continue to Review"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}

                            {activeTab === "questions" && (
                                <Button
                                    onClick={() => handleStepChange("review")}
                                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6"
                                >
                                    Review
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}

                            {activeTab === "review" && (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6 disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
