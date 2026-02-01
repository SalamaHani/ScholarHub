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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useApplications } from "@/hooks/useApplications";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Lock, UserCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getProfileStatus, getStatusColor, getStatusBgColor, getStatusIndicatorColor } from "@/lib/profileStatus";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scholarshipTitle: string;
    scholarshipId: string;
    questions?: Array<{ id: string; question: string; type: "TEXT" | "MULTIPLE_CHOICE"; options?: string[] }>;
}

export function ApplicationModal({ isOpen, onClose, scholarshipTitle, scholarshipId, questions = [] }: ApplicationModalProps) {
    const { user } = useAuth();
    const { submit } = useApplications();
    const [step, setStep] = React.useState(1);
    const [answers, setAnswers] = React.useState<Record<string, string>>({});

    // Get profile completeness from user
    const completeness = user?.profileCompleteness ?? 0;
    const isEligible = completeness >= 80;
    const isSubmitting = submit.isPending;

    // Standardized Status System
    const status = getProfileStatus(completeness);
    const statusColor = getStatusColor(status);
    const statusBgColor = getStatusBgColor(status);
    const indicatorColor = getStatusIndicatorColor(status);

    const handleNext = () => {
        if (step === 1 && isEligible) {
            if (questions && questions.length > 0) {
                setStep(2);
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        if (!isEligible) return;

        try {
            await submit.mutateAsync({
                scholarshipId,
                motivation: "",
                answers: JSON.stringify(answers),
                documents: "{}",
                metadata: JSON.stringify({
                    fullName: user?.name || "",
                    phone: user?.phoneNumber || "",
                    university: user?.university || user?.institution || "",
                    gpa: user?.gpa || "",
                    major: user?.fieldOfStudy || ""
                })
            });
            toast({
                title: "Application Sent!",
                description: "Your application has been submitted successfully.",
            });
            onClose();
            // Reset for next time
            setTimeout(() => {
                setStep(1);
                setAnswers({});
            }, 500);
        } catch (error) {
            console.error("Submission failed:", error);
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your application. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
                setTimeout(() => {
                    setStep(1);
                    setAnswers({});
                }, 500);
            }
        }}>
            <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-xl border-primary/10 p-0 overflow-hidden shadow-2xl flex flex-col rounded-3xl">
                {/* Progress Stripe */}
                <div className="h-1.5 w-full flex">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: step === 1 ? (questions.length > 0 ? "50%" : "100%") : "100%" }}
                        className="h-full bg-primary"
                    />
                    <div className="flex-1 bg-muted" />
                </div>

                <DialogHeader className="p-8 pb-4 bg-gradient-to-b from-primary/5 to-transparent relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-[10px] font-black  tracking-[0.2em] text-primary/60 uppercase">Step {step} of {questions.length > 0 ? 2 : 1}</span>
                        </div>
                        <Badge variant="outline" className={`font-bold px-3 py-1 ${isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : statusBgColor + ' border-' + status.toLowerCase() + '-200 ' + statusColor}`}>
                            {completeness}% ({status})
                        </Badge>
                    </div>

                    <DialogTitle className="text-2xl font-black tracking-tighter text-primary leading-tight">
                        {step === 1 ? scholarshipTitle : "Scholarship Quiz"}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-2">
                        {step === 1 ? (
                            <>
                                <div className={`w-1.5 h-1.5 rounded-full ${isEligible ? 'bg-emerald-500' : status === 'GOOD' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                                {isEligible ? 'Step 1: Profile Verified' : 'Step 1: Complete Your Profile'}
                            </>
                        ) : (
                            <>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Step 2: Answer scholarship specific questions (Optional)
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                    {step === 1 ? (
                        /* Step 1: Profile Verification */
                        isEligible ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1.2, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 bg-emerald-500/20 rounded-full"
                                    />
                                    <div className="relative w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-primary tracking-tight">Profile Verified!</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                                        Your academic profile is 80%+ complete, which meets the scholarship requirements.
                                        {questions.length > 0 ? " Proceed to the next step to answer a few optional questions." : " You're ready to submit your application."}
                                    </p>
                                </div>

                                <div className="w-full pt-4">
                                    <Button
                                        onClick={handleNext}
                                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]"
                                    >
                                        {questions.length > 0 ? "Continue to Questions" : "Apply Now"}
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`h-20 w-20 rounded-3xl flex items-center justify-center border-4 ${status === "GOOD" ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100"}`}
                                    >
                                        <Lock className={`h-8 w-8 ${status === "GOOD" ? "text-yellow-500" : "text-red-500"}`} />
                                    </motion.div>
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                        <AlertCircle className={`h-5 w-5 ${status === "GOOD" ? "text-yellow-500" : "text-red-500"}`} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-primary tracking-tight">Complete Your Profile</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                                        Your profile is at <span className={`${statusColor} font-bold`}>{completeness}% ({status})</span>.
                                        A minimum of <span className="text-primary font-bold">80% (EXCELLENT)</span> is required to apply.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="space-y-2 text-left">
                                        <div className="flex justify-between text-xs font-semibold text-slate-400">
                                            <span>Current Progress</span>
                                            <span>{completeness}% / 80%</span>
                                        </div>
                                        <Progress value={(completeness / 80) * 100} className="h-2 bg-slate-100" indicatorClassName={indicatorColor} />
                                    </div>

                                    <Link href="/profile" className="block w-full" onClick={onClose}>
                                        <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold group transition-all shadow-xl shadow-primary/30 hover:scale-[1.02]">
                                            <UserCircle2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                            Complete Profile
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )
                    ) : (
                        /* Step 2: Scholarship Questions */
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                {questions.map((q, idx) => (
                                    <div key={q.id} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <label className="text-sm font-bold text-slate-700 block">
                                            {idx + 1}. {q.question}
                                        </label>
                                        {q.type === "TEXT" ? (
                                            <textarea
                                                className="w-full min-h-[100px] p-3 rounded-xl border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
                                                placeholder="Write your answer here..."
                                                value={answers[q.id] || ""}
                                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2">
                                                {q.options?.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                        className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all border ${answers[q.id] === opt ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 font-bold"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold shadow-xl shadow-primary/30"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Complete Application
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="p-6 bg-slate-50/50 border-t flex justify-center">
                    <Button variant="ghost" onClick={onClose} className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                        Dismiss Application
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
