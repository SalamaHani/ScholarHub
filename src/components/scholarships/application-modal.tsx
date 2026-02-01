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
}

export function ApplicationModal({ isOpen, onClose, scholarshipTitle, scholarshipId }: ApplicationModalProps) {
    const { user } = useAuth();
    const { submit } = useApplications();

    // Get profile completeness from user
    const completeness = user?.profileCompleteness ?? 0;
    const isEligible = completeness >= 80;
    const isSubmitting = submit.isPending;

    // Standardized Status System
    const status = getProfileStatus(completeness);
    const statusColor = getStatusColor(status);
    const statusBgColor = getStatusBgColor(status);
    const indicatorColor = getStatusIndicatorColor(status);

    const handleSubmit = async () => {
        if (!isEligible) return;

        try {
            await submit.mutateAsync({
                scholarshipId,
                motivation: "",
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-primary/10 p-0 overflow-hidden shadow-2xl flex flex-col rounded-3xl">
                <DialogHeader className="p-8 pb-4 bg-gradient-to-b from-primary/5 to-transparent relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-[10px] font-black  tracking-[0.2em] text-primary/60">Scholarship Application</span>
                        </div>
                        <Badge variant="outline" className={`font-bold px-3 py-1 ${isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : statusBgColor + ' border-' + status.toLowerCase() + '-200 ' + statusColor}`}>
                            {completeness}% ({status})
                        </Badge>
                    </div>

                    <DialogTitle className="text-2xl font-black tracking-tighter text-primary leading-tight">
                        {scholarshipTitle}
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isEligible ? 'bg-emerald-500' : status === 'GOOD' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                        {isEligible ? 'Your profile meets the requirements' : 'Profile completion required'}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-8 py-6">
                    {isEligible ? (
                        /* Success - Profile Complete */
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
                                <h3 className="text-xl font-black text-primary tracking-tight">Ready to Apply!</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                                    Your profile is complete and meets all requirements. Click below to submit your application.
                                </p>
                            </div>

                            <div className="w-full space-y-3 pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send className="h-4 w-4" />
                                            Submit Application
                                        </div>
                                    )}
                                </Button>
                                <Button variant="ghost" onClick={onClose} className="w-full text-sm font-medium text-slate-400">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        /* Error - Profile Incomplete */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`h-20 w-20 rounded-3xl flex items-center justify-center border-4 ${status === "GOOD" ? "bg-yellow-50 border-yellow-100" : "bg-red-50 border-red-100"
                                        }`}
                                >
                                    <Lock className={`h-8 w-8 ${status === "GOOD" ? "text-yellow-500" : "text-red-500"
                                        }`} />
                                </motion.div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                    <AlertCircle className={`h-5 w-5 ${status === "GOOD" ? "text-yellow-500" : "text-red-500"
                                        }`} />
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
                                <div className="space-y-2">
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
                                <Button variant="ghost" onClick={onClose} className="w-full text-sm font-medium text-slate-400">
                                    I'll do this later
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
