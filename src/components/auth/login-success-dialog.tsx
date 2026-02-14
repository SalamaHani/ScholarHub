"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LoginSuccessDialogProps {
    open: boolean;
    userName?: string;
    userRole?: string;
    onContinue: () => void;
    autoRedirect?: boolean;
    redirectDelay?: number;
}

export function LoginSuccessDialog({
    open,
    userName,
    userRole,
    onContinue,
    autoRedirect = true,
    redirectDelay = 3000,
}: LoginSuccessDialogProps) {
    const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));

    useEffect(() => {
        if (!open || !autoRedirect) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onContinue();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open, autoRedirect, onContinue]);

    useEffect(() => {
        if (open) {
            setCountdown(Math.floor(redirectDelay / 1000));
        }
    }, [open, redirectDelay]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onContinue()}>
            <DialogContent className="sm:max-w-[420px] border-2 shadow-2xl p-6">
                <DialogHeader className="space-y-3">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="h-7 w-7 text-green-600" />
                    </motion.div>

                    <DialogTitle className="text-center text-xl font-bold">
                        Welcome to ScholarHub! 🎓
                    </DialogTitle>
                    <DialogDescription className="text-center space-y-2 pt-1">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-1.5"
                        >
                            <p className="text-base font-medium text-zinc-900">
                                {userName ? `Hello, ${userName}!` : "Login successful!"}
                            </p>
                            {userRole && (
                                <div className="flex items-center justify-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <span className="text-sm text-zinc-600">
                                        Logged in as {userRole === "PROFESSOR" ? "Professor" : "Student"}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-zinc-500 pt-1"
                        >
                            You're being redirected to your dashboard...
                        </motion.p>
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col gap-2 pt-1"
                >
                    {autoRedirect && (
                        <div className="text-center text-xs text-zinc-400">
                            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
                        </div>
                    )}

                    <Button
                        onClick={onContinue}
                        className="w-full bg-primary hover:bg-primary/90 font-semibold h-10"
                    >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
