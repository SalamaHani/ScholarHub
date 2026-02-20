"use client";

import { DocumentViewer } from "@/components/documents/document-viewer";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function DocumentsPage() {
    const { t } = useTranslation();
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
                            {t.documents.title}
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            {t.documents.subtitle}
                        </p>
                    </div>
                </motion.div>

                <DocumentViewer
                    title={t.documents.viewerTitle}
                    description={t.documents.viewerDesc}
                    publicOnly={true}
                />
            </div>
        </div>
    );
}
