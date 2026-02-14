"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";

/**
 * OAuth Callback Page
 * Handles hash fragment format from backend: #accessToken=...&refreshToken=...
 */
export default function CallbackPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

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

                setStatus("success");

                // Redirect based on professor verification status
                const isProfessor = user.role === "PROFESSOR";
                const isVerified = user.isProfessorVerified || user.isVerified;

                if (isProfessor && !isVerified) {
                    router.push("/auth/pending-verification");
                } else {
                    router.push("/dashboard");
                }
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

    return (
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
    );
}
