"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "@/hooks/use-toast";
import { Loader2, XCircle } from "lucide-react";

/**
 * Google OAuth Success Page
 * Handles storing auth data after successful Google authentication
 */
function GoogleAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

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

        setStatus("success");

        // Redirect based on role and verification status
        const isProfessor = user.role === "PROFESSOR";
        const isVerified = user.isProfessorVerified || user.isVerified;

        if (isProfessor && !isVerified) {
          router.push("/auth/pending-verification");
        } else {
          router.push("/profile");
        }
      } catch (error) {
        console.error("Google auth success page error:", error);
        setStatus("error");
        const errorMessage =
          error instanceof Error
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50">
      <div className="text-center space-y-4 max-w-md px-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-xl font-bold text-zinc-900">
              Completing authentication...
            </h2>
            <p className="text-sm text-zinc-500">
              Please wait while we sign you in
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-zinc-900">
              Authentication Failed
            </h2>
            <p className="text-sm text-zinc-500">
              Redirecting back to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleAuthSuccessPage() {
  return (
    <Suspense>
      <GoogleAuthSuccessContent />
    </Suspense>
  );
}
