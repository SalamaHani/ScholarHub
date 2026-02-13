"use client";

import { DocumentViewer } from "@/components/documents/document-viewer";
import { motion } from "framer-motion";

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="container px-4 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-emerald-600 bg-clip-text text-transparent">
                            Resource Center
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Access important documents, guidelines, and resources
                        </p>
                    </div>
                </motion.div>

                <DocumentViewer
                    title="Available Documents"
                    description="Browse and download documents to help with your scholarship applications"
                    publicOnly={true}
                />
            </div>
        </div>
    );
}
