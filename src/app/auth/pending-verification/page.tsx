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
  const { user, logout, refresh, isLoading } = useAuth();

  // Initialize auth on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    // Wait for auth to load before redirecting
    if (isLoading) return;
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
  }, [user, router, isLoading]);

  const handleLogout = () => {
    logout.mutate();
  };

  const handleCompleteProfile = () => {
    router.push("/profile");
  };

  const isProfileComplete = user?.profileCompleteness == 100; // Assuming profileCompleteness is a percentage value

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="text-center space-y-5">
              {/* Title */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-900">
                  Pending Verification
                </h1>
                <p className="text-base text-zinc-600">
                  Welcome, Professor {user?.firstName || user?.name}!
                </p>
              </div>

              {/* Status Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left space-y-3">
                <div className="flex items-start gap-2.5">
                  <Shield className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-900">
                      Your account is being reviewed
                    </h3>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Our admin team is reviewing your professor account. This
                      usually takes 24-48 hours.
                    </p>
                  </div>
                </div>

                {!isProfileComplete && (
                  <div className="flex items-start gap-2.5 pt-3 border-t border-amber-200">
                    <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900">
                        Complete your profile
                      </h3>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        While you wait, complete your profile to speed up the
                        verification process.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Steps */}
              <div className="bg-white border border-zinc-200 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-zinc-900 mb-3 text-left">
                  Verification Steps
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-zinc-600">
                      Account created
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2.5 text-left ${
                      isProfileComplete ? "text-green-600" : "text-amber-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isProfileComplete ? "bg-green-500" : "bg-amber-500"
                      }`}
                    >
                      {isProfileComplete ? (
                        <CheckCircle className="h-3 w-3 text-white" />
                      ) : (
                        <Clock className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium">
                      {isProfileComplete
                        ? "Profile completed"
                        : "Complete your profile"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-left text-zinc-400">
                    <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Admin verification</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-left text-zinc-400">
                    <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Access granted</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {!isProfileComplete && (
                  <Button
                    onClick={handleCompleteProfile}
                    className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold text-sm"
                  >
                    Complete Your Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-9 border-zinc-300 text-sm"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
