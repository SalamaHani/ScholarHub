"use client";

import Link from "next/link";
import { GraduationCap, Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

import { useTestimonials, Testimonial } from "@/hooks/useTestimonials";
import { useTranslation } from "@/hooks/useTranslation";


const GRADIENTS = [
    "from-emerald-400 to-blue-500",
    "from-amber-400 to-rose-500",
    "from-blue-400 to-indigo-600",
    "from-primary to-emerald-600",
    "from-purple-400 to-pink-500",
    "from-cyan-400 to-blue-600"
];

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = useTranslation();
    const pathname = usePathname();
    const isLogin = pathname === "/auth/login";
    const { list } = useTestimonials({ limit: 10, isActive: true });
    const [testimonialIndex, setTestimonialIndex] = React.useState(0);

    // Merge API testimonials with default ones
    const testimonials = React.useMemo(() => {
        const apiData = Array.isArray(list.data?.testimonials) ? list.data?.testimonials : [];
        return apiData.map((t: Testimonial, i: number) => ({
            quote: t.quote,
            author: t.author,
            role: t.role,
            gradient: GRADIENTS[i % GRADIENTS.length]
        }));
    }, [list.data?.testimonials]);
    React.useEffect(() => {
        if (testimonials.length === 0) return;

        const timer = setInterval(() => {
            setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);
    const current = testimonials[testimonialIndex] || [];

    return (
        <div className="h-screen grid lg:grid-cols-2 bg-white text-zinc-900 overflow-hidden">
            {/* Left Sidebar - Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden group">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: "url('/images/pexels-hson-13091880.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-slate-900/95 mix-blend-multiply" />
                <div className="absolute inset-0 backdrop-blur-xs" />

                <Link href="/" className="flex items-center gap-2 relative z-10 transition-transform hover:scale-105 active:scale-95 group/logo">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-xl border border-white/20 group-hover/logo:rotate-12 transition-transform">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">ScholarHub</span>
                </Link>

                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonialIndex}
                            initial={{ opacity: 0, x: -20, filter: "blur(2px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: 20, filter: "blur(2px)" }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="space-y-6"
                        >
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full w-fit border border-white/20 shadow-xl">
                                <Quote className="h-4 w-4 text-emerald-400 fill-emerald-400" />
                            </div>
                            <blockquote className="space-y-4">
                                <p className="text-4xl w-full font-black leading-tight tracking-tighter text-white drop-shadow-lg italic">
                                    &quot;{current.quote}&quot;
                                </p>
                                <footer className="flex items-center gap-4 pt-4">
                                    <div className={`h-12 w-12 rounded-full border-2 border-white/50 overflow-hidden bg-gradient-to-tr ${current.gradient} shadow-xl animate-pulse`} />
                                    <div className="text-sm">
                                        <div className="font-black text-white tracking-widest text-[10px]">{current.author}</div>
                                        <div className="text-white/60 font-medium italic">{current.role}</div>
                                    </div>
                                </footer>
                            </blockquote>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Decorative Element & Indicators */}
                <div className="absolute bottom-12 right-12 z-10 flex flex-col items-center gap-6">
                    <div className="flex gap-2">
                        {testimonials.map((_: any, i: any) => (
                            <motion.div
                                key={i}
                                animate={{
                                    width: i === testimonialIndex ? 24 : 6,
                                    opacity: i === testimonialIndex ? 1 : 0.4
                                }}
                                className="h-1.5 rounded-full bg-white shadow-sm"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Content - Forms */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="absolute top-8 right-8 lg:top-12 lg:right-12 z-20">
                    <Link
                        href={isLogin ? "/auth/register" : "/auth/login"}
                        className="text-sm font-semibold text-zinc-500 hover:text-primary transition-colors flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200 hover:border-primary/30 hover:bg-primary/5 shadow-sm"
                    >
                        {isLogin ? t.auth.createAccount : t.auth.backToLogin}
                    </Link>
                </div>

                <div className="w-full max-w-[400px] py-12">
                    {children}
                </div>

                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-[10px] text-zinc-400 font-medium tracking-widest">
                        © 2026 ScholarHub • Academic Excellence
                    </p>
                </div>
            </div>
        </div>
    );
}
