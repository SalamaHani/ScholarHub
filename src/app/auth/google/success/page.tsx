"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { Loader2, XCircle } from "lucide-react";
import { LoginSuccessDialog } from "@/components/auth/login-success-dialog";

/**
 * Google OAuth Success Page
 * Handles storing auth data after successful Google authentication
 */
export default function GoogleAuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const processAuth = async () => {
            try {
                const token = searchParams.get("token");
                const userStr = searchParams.get("user");

                // Validate required parameters
                if (!token || !userStr) {
                    setStatus("error");
                    toast({
                        title: "Authentication failed",
                        description: "Missing authentication data from server",
                        variant: "destructive",
                    });

                    setTimeout(() => router.push("/auth/login"), 2000);
                    return;
                }

                // Validate token format (basic check)
                if (token.length < 20) {
                    throw new Error("Invalid token format");
                }

                // Parse and validate user data
                let user;
                try {
                    user = JSON.parse(decodeURIComponent(userStr));
                } catch (parseError) {
                    throw new Error("Invalid user data format");
                }

                // Validate user object has required fields
                if (!user.id || !user.email || !user.role) {
                    throw new Error("Incomplete user data");
                }

                // Store credentials in Redux and localStorage
                dispatch(setCredentials({ user, token }));

                // Store user data for dialog
                setUserData(user);
                setStatus("success");

                // Show success dialog
                setShowSuccessDialog(true);
            } catch (error) {
                console.error("Google auth success page error:", error);
                setStatus("error");

                const errorMessage = error instanceof Error
                    ? error.message
                    : "Failed to process authentication data";

                toast({
                    title: "Authentication failed",
                    description: errorMessage,
                    variant: "destructive",
                });

                setTimeout(() => router.push("/auth/login"), 2000);
            }
        };

        processAuth();
    }, [searchParams, dispatch, router]);

    const handleContinue = () => {
        if (!userData) {
            router.push("/");
            return;
        }

        // Check if professor needs verification
        const isProfessor = userData.role === "PROFESSOR";
        const isVerified = userData.isProfessorVerified || userData.isVerified;

        if (isProfessor && !isVerified) {
            // Professor not verified - show pending page
            router.push("/auth/pending-verification");
        } else {
            // Student or verified professor - go to dashboard
            router.push("/");
        }
    };

    return (
        <>
            <LoginSuccessDialog
                open={showSuccessDialog}
                userName={userData?.name || userData?.firstName}
                userRole={userData?.role}
                onContinue={handleContinue}
                autoRedirect={true}
                redirectDelay={3000}
            />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50">
                <div className="text-center space-y-4 max-w-md px-4">
                    {status === "loading" && (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                            <h2 className="text-xl font-bold text-zinc-900">Completing authentication...</h2>
                            <p className="text-sm text-zinc-500">Please wait while we sign you in</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                            <h2 className="text-xl font-bold text-zinc-900">Authentication Failed</h2>
                            <p className="text-sm text-zinc-500">Redirecting back to login...</p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
