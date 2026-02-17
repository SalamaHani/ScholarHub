"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Download,
    Search,
    File,
    FileImage,
    FileSpreadsheet,
    Loader2,
    ExternalLink,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { formatFileSize } from "@/lib/document-utils";
import { format } from "date-fns";
import { DocumentCardSkeletonGrid, DocumentListItemSkeleton } from "@/components/skeletons";

const DOCUMENT_CATEGORIES = [
    "General",
    "Guidelines",
    "Templates",
    "Forms",
    "Reports",
    "Policies",
    "Other"
];

const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return FileText;
    if (fileType.includes("image")) return FileImage;
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return FileSpreadsheet;
    return File;
};

interface DocumentViewerProps {
    /**
     * Filter documents by category
     */
    category?: string;
    /**
     * Show only public documents (default: true)
     */
    publicOnly?: boolean;
    /**
     * Custom title for the viewer
     */
    title?: string;
    /**
     * Custom description for the viewer
     */
    description?: string;
    /**
     * Compact mode - shows fewer details
     */
    compact?: boolean;
}

export const DocumentViewer = ({
    category,
    publicOnly = true,
    title = "Documents",
    description = "Browse and download available documents",
    compact = false,
}: DocumentViewerProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");

    const { documents, isLoading, download } = useDocuments({
        search: searchQuery,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        isPublic: publicOnly,
    });

    const handleDownload = async (documentId: string) => {
        try {
            await download.mutateAsync(documentId);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const filteredDocuments = documents || [];

    if (compact) {
        return (
            <div className="space-y-3">
                {isLoading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <DocumentListItemSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No documents available
                    </p>
                ) : (
                    <div className="space-y-2">
                        {filteredDocuments.map((document) => {
                            const FileIcon = getFileIcon(document.fileType);
                            return (
                                <div
                                    key={document.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                            <FileIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{document.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(document.fileSize)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(document.id)}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {!category && (
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {DOCUMENT_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Documents Grid */}
            {isLoading ? (
                <DocumentCardSkeletonGrid count={6} />
            ) : filteredDocuments.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No documents found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDocuments.map((document) => {
                        const FileIcon = getFileIcon(document.fileType);
                        return (
                            <motion.div
                                key={document.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                                <FileIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-base truncate">
                                                    {document.title}
                                                </CardTitle>
                                                <CardDescription className="text-sm mt-1">
                                                    {formatFileSize(document.fileSize)}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 flex-1 flex flex-col">
                                        {document.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                                {document.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {document.category && (
                                                <Badge variant="secondary">
                                                    {document.category}
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="text-xs">
                                                {document.downloads} downloads
                                            </Badge>
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Uploaded {format(new Date(document.createdAt), "MMM d, yyyy")}
                                        </div>

                                        <Button
                                            className="w-full gap-2"
                                            onClick={() => handleDownload(document.id)}
                                            disabled={download.isPending}
                                        >
                                            {download.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/**
 * Compact list view of documents
 */
export const DocumentList = () => {
    return <DocumentViewer compact={true} />;
};
