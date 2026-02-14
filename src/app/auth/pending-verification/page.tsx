"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Shield, FileText, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Professor Pending Verification Page
 * Shows when a professor account is waiting for admin verification
 */
export default function PendingVerificationPage() {
    const router = useRouter();
    const { user, logout } = useAuth();

    useEffect(() => {
        // Redirect if not logged in
        if (!user) {
            router.push("/auth/login");
            return;
        }

        // Redirect if not a professor
        if (user.role !== "PROFESSOR") {
            router.push("/");
            return;
        }

        // Redirect if already verified
        if (user.isProfessorVerified || user.isVerified) {
            router.push("/");
            return;
        }
    }, [user, router]);

    const handleLogout = () => {
        logout.mutate();
    };

    const handleCompleteProfile = () => {
        router.push("/profile");
    };

    const isProfileComplete = user?.profileCompleteness && user.profileCompleteness >= 80;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-2 shadow-xl">
                    <CardContent className="p-8 md:p-12">
                        <div className="text-center space-y-6">
                            {/* Icon */}
                            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                                <Clock className="h-10 w-10 text-amber-600" />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-zinc-900">
                                    Account Pending Verification
                                </h1>
                                <p className="text-lg text-zinc-600">
                                    Welcome, Professor {user?.firstName || user?.name}!
                                </p>
                            </div>

                            {/* Status Message */}
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-left space-y-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-zinc-900">
                                            Your account is being reviewed
                                        </h3>
                                        <p className="text-sm text-zinc-600">
                                            Our admin team is reviewing your professor account. This
                                            usually takes 24-48 hours.
                                        </p>
                                    </div>
                                </div>

                                {!isProfileComplete && (
                                    <div className="flex items-start gap-3 pt-4 border-t border-amber-200">
                                        <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-zinc-900">
                                                Complete your profile
                                            </h3>
                                            <p className="text-sm text-zinc-600">
                                                While you wait, complete your profile to speed up the
                                                verification process.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Progress Steps */}
                            <div className="bg-white border-2 border-zinc-200 rounded-xl p-6">
                                <h3 className="font-semibold text-zinc-900 mb-4 text-left">
                                    Verification Steps
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-sm text-zinc-600">
                                            Account created
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-3 text-left ${
                                            isProfileComplete
                                                ? "text-green-600"
                                                : "text-amber-600"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                isProfileComplete
                                                    ? "bg-green-500"
                                                    : "bg-amber-500"
                                            }`}
                                        >
                                            {isProfileComplete ? (
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {isProfileComplete
                                                ? "Profile completed"
                                                : "Complete your profile"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-left text-zinc-400">
                                        <div className="w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm">Admin verification</span>
                                    </div>

                                    <div className="flex items-center gap-3 text-left text-zinc-400">
                                        <div className="w-6 h-6 rounded-full border-2 border-zinc-300 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm">Access granted</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 pt-4">
                                {!isProfileComplete && (
                                    <Button
                                        onClick={handleCompleteProfile}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
                                    >
                                        Complete Your Profile
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}

                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    className="w-full h-11 border-zinc-300"
                                >
                                    Sign Out
                                </Button>
                            </div>

                            {/* Help Text */}
                            <p className="text-xs text-zinc-500 pt-4">
                                Questions? Contact us at{" "}
                                <a
                                    href="mailto:support@scholarhub.com"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    support@scholarhub.com
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
