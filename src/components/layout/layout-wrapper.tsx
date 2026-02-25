"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { DynamicHead } from "./dynamic-head";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Pathname can be null during the very first render or SSR pass
    const safePathname = pathname || "";
    const isAuth = safePathname.startsWith("/auth");

    if (isAuth) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <DynamicHead />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
