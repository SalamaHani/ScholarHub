"use client";

import React, { useState } from "react";
import {
    Mail,
    ArrowRight,
    Eye,
    EyeOff,
    Github,
    Chrome
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

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const isLoading = login.isPending;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        login.mutate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 w-full"
        >
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h1>
                <p className="text-sm text-zinc-500 font-medium">
                    Enter your credentials to access your academic dashboard
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-600 font-semibold">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
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
                        <Label htmlFor="password" title="Password" className="text-zinc-600 font-semibold">Password</Label>
                        <Link href="/auth/forgot-password" title="Forgot password" className="text-xs text-primary font-bold hover:underline underline-offset-4">
                            Forgot password?
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
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    {isLoading ? "Authenticating..." : "Sign In to ScholarHub"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] items-center uppercase font-bold tracking-widest text-zinc-400">
                    <span className="bg-white px-3">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold shadow-sm transition-all active:scale-95">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                </Button>
                <Button variant="outline" className="h-12 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold shadow-sm transition-all active:scale-95">
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                </Button>
            </div>
        </motion.div>
    );
}
