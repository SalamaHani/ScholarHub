"use client";

import React, { useEffect } from "react";
import {
    AlertCircle,
    RefreshCw,
    Home,
    ShieldAlert,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Dashboard Error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-none shadow-2xl overflow-hidden">
                <div className="h-2 bg-rose-500" />
                <CardHeader className="text-center pt-10">
                    <div className="mx-auto w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6 border-4 border-white shadow-lg animate-pulse">
                        <ShieldAlert className="h-10 w-10 text-rose-600" />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight text-rose-950 px-4">
                        SYSTEM OVERLOAD OR ACCESS DENIED
                    </CardTitle>
                    <p className="text-muted-foreground mt-4 text-sm font-medium px-4">
                        The Admin Dashboard encountered a critical runtime error. This might be due to a connection failure or an invalid data state.
                    </p>
                </CardHeader>

                <CardContent className="px-8 py-6">
                    <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-rose-900/60">Technical Error</p>
                                <p className="text-sm font-mono text-rose-800 break-all bg-white/50 p-2 rounded-lg mt-1 border border-rose-200">
                                    {error.message || "An unknown system error occurred."}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-8 pt-2">
                    <Button
                        onClick={() => reset()}
                        variant="gradient"
                        className="w-full h-12 font-bold shadow-lg shadow-rose-200 group"
                    >
                        <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        Re-initialize Dashboard
                    </Button>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Link href="/dashboard" passHref className="w-full">
                            <Button variant="outline" className="w-full gap-2 font-semibold">
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full gap-2 font-semibold"
                            onClick={() => window.history.back()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
