"use client";

import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { applyLangToDom } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

const USER_LANG_KEY = "scholarhub_user_lang";

export const LANGUAGES = [
    { code: "en", label: "English", native: "English",  flag: "🇺🇸", rtl: false },
    { code: "ar", label: "Arabic",  native: "العربية",  flag: "🇸🇦", rtl: true  },
];

function getInitialLang(): string {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(USER_LANG_KEY) ?? document.documentElement.lang ?? "en";
}

export function LanguageSwitcher() {
    const [current, setCurrent] = useState("en");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setCurrent(getInitialLang());
    }, []);

    const handleSelect = (code: string) => {
        localStorage.setItem(USER_LANG_KEY, code);
        // Also persist in a cookie so middleware can read it server-side
        document.cookie = `${USER_LANG_KEY}=${code};path=/;max-age=31536000;SameSite=Lax`;
        setCurrent(code);
        applyLangToDom(code); // also dispatches LANG_CHANGE_EVENT internally
        setOpen(false);
    };

    const activeLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <span className="text-base leading-none">{activeLang.flag}</span>
                    <span className="hidden sm:inline">{activeLang.native}</span>
                    <Globe className="h-3.5 w-3.5" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-52 p-1.5">
                <DropdownMenuLabel className="text-[10px] font-bold tracking-widest text-muted-foreground px-2 py-1.5">
                    CHOOSE LANGUAGE
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />

                {LANGUAGES.map((lang) => {
                    const isActive = current === lang.code;
                    return (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-2 py-2.5 cursor-pointer transition-colors",
                                isActive && "bg-primary/10"
                            )}
                        >
                            {/* Flag */}
                            <span className="text-xl leading-none w-7 text-center shrink-0">
                                {lang.flag}
                            </span>

                            {/* Names */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={cn(
                                        "text-sm font-semibold leading-tight",
                                        isActive && "text-primary",
                                        lang.rtl && "font-cairo"
                                    )}
                                    dir={lang.rtl ? "rtl" : "ltr"}
                                >
                                    {lang.native}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {lang.label}
                                </p>
                            </div>

                            {/* RTL badge */}
                            {lang.rtl && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded shrink-0">
                                    RTL
                                </span>
                            )}

                            {/* Active check */}
                            {isActive && (
                                <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
