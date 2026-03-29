"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Chrome,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

function LoginPageContent() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const isLoading = login.isPending;
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Check for OAuth errors from URL parameters
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        google_auth_failed: "Google authentication failed. Please try again.",
        token_exchange_failed:
          "Failed to verify Google account. Please try again.",
        user_info_failed: "Could not retrieve your Google account information.",
        oauth_failed: "Authentication failed. Please try again.",
        auth_failed: "Authentication error occurred. Please try again.",
      };

      toast({
        title: "Authentication Failed",
        description:
          errorMessages[error] ||
          "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const onSubmit = (data: LoginInput) => {
    login.mutate(data);
  };

  const handleGoogleLogin = () => {
    try {
      setGoogleLoading(true);
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";
      window.location.href = `${backendUrl}/auth/google`;
    } catch (error) {
      setGoogleLoading(false);
      toast({
        title: "Error",
        description: "Failed to initiate Google login. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 w-full"
    >
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t.auth.welcomeBack}
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          {t.auth.welcomeBackSub}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-600 font-semibold">
            {t.auth.emailAddress}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="email"
              type="email"
              placeholder={t.auth.emailPlaceholder}
              className={`pl-10 h-12 border-zinc-200 focus:border-primary focus:ring-primary/20 bg-zinc-50/50 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              {...register("email")}
            />
          </div>
          <AnimatePresence mode="wait">
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              title="Password"
              className="text-zinc-600 font-semibold"
            >
              {t.auth.password}
            </Label>
            <Link
              href="/auth/forgot-password"
              title="Forgot password"
              className="text-xs text-primary font-bold hover:underline underline-offset-4"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`pl-3.5 pr-10 h-12 border-zinc-200 focus:border-primary focus:ring-primary/20 bg-zinc-50/50 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1.5"
              >
                <span className="w-1 h-1 rounded-full bg-red-500" />
                {errors.password.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="default"
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? t.auth.authenticating : t.auth.signInBtn}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-[10px] items-center font-bold tracking-widest text-zinc-400">
          <span className="bg-white px-3">{t.auth.orContinueWith}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-12 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold shadow-sm transition-all active:scale-95"
          disabled
        >
          <Github className="h-4 w-4 mr-2" />
          GitHub
        </Button>
        <Button
          variant="outline"
          className="h-12 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold shadow-sm transition-all active:scale-95"
          onClick={handleGoogleLogin}
          type="button"
          disabled={googleLoading || isLoading}
        >
          <Chrome
            className={`h-4 w-4 mr-2 ${googleLoading ? "animate-spin" : ""}`}
          />
          {googleLoading ? t.auth.redirecting : "Google"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
