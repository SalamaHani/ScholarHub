"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";
import { LoginSuccessDialog } from "@/components/auth/login-success-dialog";

/**
 * OAuth Callback Page
 * Handles hash fragment format from backend: #accessToken=...&refreshToken=...
 */
export default function CallbackPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get hash fragment (everything after #)
                const hash = window.location.hash.substring(1); // Remove the #

                if (!hash) {
                    throw new Error("No authentication data received");
                }

                // Parse hash parameters
                const params = new URLSearchParams(hash);
                const accessToken = params.get("accessToken");
                const refreshToken = params.get("refreshToken");
                const success = params.get("success");

                // Check for errors
                const error = params.get("error");
                if (error || success === "false") {
                    throw new Error(error || "Authentication failed");
                }

                // Validate token
                if (!accessToken) {
                    throw new Error("Missing access token");
                }

                // Validate token format
                if (accessToken.length < 20) {
                    throw new Error("Invalid token format");
                }

                // Fetch user data using the token
                const { data } = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const user = data.data?.user || data.user || data.data || data;

                // Validate user object
                if (!user.id || !user.email || !user.role) {
                    throw new Error("Incomplete user data");
                }

                // Store credentials in Redux and localStorage
                dispatch(setCredentials({ user, token: accessToken }));

                // Store user data for dialog
                setUserData(user);
                setStatus("success");

                // Show success dialog
                setShowSuccessDialog(true);
            } catch (error) {
                console.error("OAuth callback error:", error);
                setStatus("error");

                const errorMessage = error instanceof Error
                    ? error.message
                    : "Failed to process authentication";

                toast({
                    title: "Authentication failed",
                    description: errorMessage,
                    variant: "destructive",
                });

                setTimeout(() => {
                    router.push("/auth/login");
                }, 2000);
            }
        };

        processCallback();
    }, [dispatch, router]);

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
