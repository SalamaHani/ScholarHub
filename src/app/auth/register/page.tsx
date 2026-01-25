"use client";

import React, { useState } from "react";
import {
    Github,
    ArrowRight,
    Eye,
    EyeOff,
    Chrome,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { register: registerMutation } = useAuth();
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate({
            email,
            password,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            role: role.toUpperCase() as "STUDENT" | "PROFESSOR",
        });
    };

    const isLoading = registerMutation.isPending;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 w-full max-h-[90vh]"
        >
            <div className="space-y-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 border-l-4 border-primary pl-4">Join Hub</h1>
                <p className="text-sm text-zinc-500 font-medium pl-5">
                    Start your global scholarship journey today
                </p>
            </div>

            <Tabs defaultValue="student" className="w-full" onValueChange={setRole}>
                <TabsList className="grid w-full grid-cols-2 bg-zinc-100/50 border border-zinc-200 h-11 p-1">
                    <TabsTrigger
                        value="student"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-md text-xs font-bold"
                    >
                        Student
                    </TabsTrigger>
                    <TabsTrigger
                        value="professor"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all rounded-md text-xs font-bold"
                    >
                        Professor
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-zinc-600 text-xs font-bold">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="John"
                            className="h-10 border-zinc-200 bg-zinc-50/50 text-sm focus:border-primary focus:ring-primary/20"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-zinc-600 text-xs font-bold">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Doe"
                            className="h-10 border-zinc-200 bg-zinc-50/50 text-sm focus:border-primary focus:ring-primary/20"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-zinc-600 text-xs font-bold">Work Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        className="h-10 border-zinc-200 bg-zinc-50/50 text-sm focus:border-primary focus:ring-primary/20"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" title="Password" className="text-zinc-600 text-xs font-bold">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="h-10 border-zinc-200 bg-zinc-50/50 pr-10 text-sm focus:border-primary focus:ring-primary/20"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors p-1"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    variant="default"
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/95 text-white font-bold shadow-md shadow-primary/10 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : `Register as ${role === "student" ? "Student" : "Professor"}`}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] items-center uppercase font-bold tracking-widest text-zinc-400">
                    <span className="bg-white px-3">Quick Connect</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-10 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                </Button>
                <Button variant="outline" className="h-10 border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold shadow-sm">
                    <Chrome className="h-4 w-4 mr-2" />
                    Google
                </Button>
            </div>

            <p className="text-center text-[10px] text-zinc-400 leading-relaxed px-4">
                By registering, you agree to our{" "}
                <span className="text-primary font-bold cursor-pointer hover:underline">Terms</span> &{" "}
                <span className="text-primary font-bold cursor-pointer hover:underline">Privacy</span>.
            </p>
        </motion.div>
    );
}
