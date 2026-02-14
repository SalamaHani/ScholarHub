"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/axios";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            setIsLoading(true);

            await api.post("/auth/forgot-password", data);

            setIsSuccess(true);
            toast({
                title: "Email sent!",
                description: "Check your email for password reset instructions.",
            });
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast({
                title: "Request failed",
                description:
                    error.response?.data?.message ||
                    "Failed to send reset email. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50 p-4"
            >
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6"
                    >
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-zinc-900">
                                Check your email
                            </h1>
                            <p className="text-sm text-zinc-600">
                                We've sent password reset instructions to your email address.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4">
                            <p className="text-xs text-zinc-500">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="text-primary font-bold hover:underline"
                                >
                                    try again
                                </button>
                            </p>

                            <Link href="/auth/login">
                                <Button
                                    variant="outline"
                                    className="w-full h-11 border-zinc-200 hover:bg-zinc-50"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-blue-50 p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                                Forgot password?
                            </h1>
                            <p className="text-sm text-zinc-500 font-medium">
                                No worries, we'll send you reset instructions
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-600 font-semibold">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className={`pl-10 h-12 border-zinc-200 focus:border-primary focus:ring-primary/20 bg-zinc-50/50 ${
                                            errors.email
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                                : ""
                                        }`}
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

                            <Button
                                variant="default"
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="pt-4">
                            <Link href="/auth/login">
                                <Button
                                    variant="ghost"
                                    className="w-full h-11 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <p className="text-center text-xs text-zinc-400 mt-6">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
