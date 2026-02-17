"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Circle,
    UserCircle2,
    Lock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProfileStatus, getStatusColor, getStatusIndicatorColor, getStatusBgColor } from "@/lib/profileStatus";
import { cn } from "@/lib/utils";

interface CompletenessCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    completeness: number;
}

export function CompletenessCheckModal({ isOpen, onClose, completeness }: CompletenessCheckModalProps) {
    const isReady = completeness >= 80;
    const status = getProfileStatus(completeness);
    const statusColor = getStatusColor(status);
    const indicatorColor = getStatusIndicatorColor(status);
    const bgColor = getStatusBgColor(status);

    // Dynamic color configurations based on status
    const getIconBgColor = () => {
        switch (status) {
            case "EXCELLENT": return "bg-emerald-50 border-emerald-100";
            case "GOOD": return "bg-yellow-50 border-yellow-100";
            case "POOR": return "bg-red-50 border-red-100";
        }
    };

    const getIconColor = () => {
        switch (status) {
            case "EXCELLENT": return "text-emerald-500";
            case "GOOD": return "text-yellow-500";
            case "POOR": return "text-red-500";
        }
    };

    const getTopBarGradient = () => {
        switch (status) {
            case "EXCELLENT": return "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600";
            case "GOOD": return "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500";
            case "POOR": return "bg-gradient-to-r from-red-400 via-rose-500 to-red-600";
        }
    };

    const getButtonGradient = () => {
        switch (status) {
            case "EXCELLENT": return "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/30";
            case "GOOD": return "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-yellow-500/30";
            case "POOR": return "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/30";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden border-none shadow-2xl">
                <div className={cn("h-2", getTopBarGradient())} />

                <div className="p-8">
                    <DialogHeader className="items-center text-center space-y-4">
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={cn("h-24 w-24 rounded-full flex items-center justify-center border-4", getIconBgColor())}
                            >
                                <Lock className={cn("h-10 w-10", getIconColor())} />
                            </motion.div>
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                                <AlertCircle className={cn("h-6 w-6", getIconColor())} />
                            </div>
                        </div>

                        <DialogTitle className={cn("text-2xl font-black tracking-tighter uppercase", statusColor)}>
                            Application Locked
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium leading-relaxed">
                            Your professional profile is at <span className={`${statusColor} font-bold underline decoration-2 underline-offset-4`}>{completeness}% strength ({status})</span>.
                            ScholarHub requires a minimum of <span className="text-primary font-bold">80% profile completeness</span> to ensure your application meets high academic standards.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black tracking-widest text-slate-400">Current Strength</span>
                                <span className={`text-lg font-black ${statusColor}`}>{completeness}%</span>
                            </div>
                            <Progress value={completeness} className="h-3 bg-slate-100" indicatorClassName={indicatorColor} />
                        </div>

                        <div className={cn("p-4 rounded-2xl border space-y-3", bgColor, "border-" + status.toLowerCase() + "-200")}>
                            <h4 className={cn("text-[10px] font-black uppercase tracking-widest", statusColor)}>Why this matters?</h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                                &quot;Institutions prioritize complete profiles. A comprehensive dossier increases your chances of approval by up to 300%.&quot;
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Link href="/profile" className="w-full">
                            <Button className={cn("w-full h-12 rounded-2xl text-white font-bold group transition-all text-xs uppercase tracking-widest shadow-lg", getButtonGradient())}>
                                Complete My Profile
                                <UserCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="ghost" onClick={onClose} className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600">
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
