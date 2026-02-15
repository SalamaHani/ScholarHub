"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import {
    Menu,
    X,
    GraduationCap,
    Search,
    User,
    LogOut,
    LayoutDashboard,
    Bell,
    ChevronDown,
    Bookmark,
    BookOpen,
    Home,
    Info,
    Mail,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications/notification-bell";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/scholarships", label: "Scholarships", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm border-b py-1"
                : "bg-background py-3"
                }`}
        >
            <div className="container px-4 md:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight gradient-text">
                            ScholarHub
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary relative group ${(pathname || "").startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                                        }`}
                                >
                                    {link.label}
                                    {(pathname || "").startsWith(link.href) && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 border-l pl-8 border-muted-foreground/20">
                            <div className="relative">
                                <AnimatePresence>
                                    {isSearchOpen ? (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 220, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <Input
                                                placeholder="Search..."
                                                className="h-9 pr-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                autoFocus
                                                onBlur={() => setIsSearchOpen(false)}
                                            />
                                        </motion.div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsSearchOpen(true)}
                                            className="h-9 w-9 text-muted-foreground hover:text-primary"
                                        >
                                            <Search className="h-5 w-5" />
                                        </Button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <NotificationBell />

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-center gap-2 pl-2 h-9 hover:bg-muted/50 transition-all rounded-full border border-muted-foreground/10">
                                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 shadow-sm">
                                                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                                                </div>
                                                <span className="font-medium text-xs">{user.name || user.email?.split('@')[0]}</span>
                                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 glass mt-1 border-primary/10">
                                            <DropdownMenuLabel className="font-bold text-[10px] tracking-wider text-muted-foreground px-3 py-2">
                                                {user.role} Account
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {mounted && user.role !== "STUDENT" && (
                                                <>
                                                    {/* Only show Dashboard if not a professor OR if professor is verified */}
                                                    {(user.role !== "PROFESSOR" || user.isProfessorVerified || user.isVerified) && (
                                                        <DropdownMenuItem asChild>
                                                            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer w-full py-2">
                                                                <LayoutDashboard className="h-4 w-4 text-primary" />
                                                                <span>Dashboard</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                </>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href="/saved" className="flex items-center gap-2 cursor-pointer w-full py-2">
                                                    <Bookmark className="h-4 w-4 text-primary" />
                                                    <span>Saved Scholarships</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full py-2">
                                                    <User className="h-4 w-4 text-primary" />
                                                    <span>My Profile</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            {mounted && user.role === "ADMIN" && (
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer w-full py-2">
                                                        <Shield className="h-4 w-4 text-amber-500" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => logout.mutate()}
                                                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5 font-medium py-2"
                                                disabled={logout.isPending}
                                            >
                                                <LogOut className="h-4 w-4" />
                                                {logout.isPending ? "Logging out..." : "Log out"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/auth/login">
                                        <Button variant="ghost" size="sm" className="text-xs font-semibold">Sign In</Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button variant="gradient" size="sm" className="text-xs font-bold px-5 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-3">
                        {user && (
                            <Button variant="ghost" size="icon" className="relative h-9 w-9">
                                <Bell className="h-5 w-5" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-9 w-9 bg-muted/50"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="lg:hidden bg-background border-b overflow-hidden shadow-2xl"
                    >
                        <div className="container px-4 py-8 space-y-8">
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 text-lg font-bold p-4 rounded-xl transition-all ${(pathname || "") === link.href
                                            ? "text-primary bg-primary/5 border-l-4 border-primary"
                                            : "text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        <link.icon className={`h-5 w-5 ${(pathname || "") === link.href ? "text-primary" : "text-muted-foreground"}`} />
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-muted-foreground/10 space-y-4">
                                {isAuthLoading ? (
                                    <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
                                ) : user ? (
                                    <div className="space-y-2">
                                        {mounted && user.role !== "STUDENT" && (user.role !== "PROFESSOR" || user.isProfessorVerified || user.isVerified) && (
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 text-lg font-bold text-muted-foreground p-4 rounded-xl hover:bg-muted"
                                            >
                                                <LayoutDashboard className="h-5 w-5" />
                                                Dashboard
                                            </Link>
                                        )}
                                        {mounted && user.role === "ADMIN" && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-4 text-lg font-bold text-amber-600 p-4 rounded-xl hover:bg-amber-50"
                                            >
                                                <Shield className="h-5 w-5" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout.mutate(); setIsOpen(false); }}
                                            className="flex items-center gap-4 text-lg font-bold text-destructive p-4 rounded-xl hover:bg-destructive/5 w-full text-left"
                                            disabled={logout.isPending}
                                        >
                                            <LogOut className="h-5 w-5" />
                                            {logout.isPending ? "Logging out..." : "Log out"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 h-12">
                                        <Link href="/auth/login" className="w-full">
                                            <Button variant="outline" className="w-full h-full font-bold rounded-xl" onClick={() => setIsOpen(false)}>Login</Button>
                                        </Link>
                                        <Link href="/auth/register" className="w-full">
                                            <Button variant="gradient" className="w-full h-full font-bold rounded-xl" onClick={() => setIsOpen(false)}>Join Now</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
