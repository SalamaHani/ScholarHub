"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Upload,
    Download,
    Trash2,
    Pencil,
    Search,
    Plus,
    X,
    Loader2,
    Eye,
    File,
    FileImage,
    FileVideo,
    FileAudio,
    FileSpreadsheet,
    FilePdf,
    ExternalLink,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useDocuments, Document, CreateDocumentInput } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
    if (fileType.includes("pdf")) return FilePdf;
    if (fileType.includes("image")) return FileImage;
    if (fileType.includes("video")) return FileVideo;
    if (fileType.includes("audio")) return FileAudio;
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return FileSpreadsheet;
    return File;
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const DocumentManager = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { documents, isLoading, create, update, remove, upload, download } = useDocuments({
        search: searchQuery,
        category: selectedCategory === "all" ? undefined : selectedCategory,
    });

    const [formData, setFormData] = useState<Partial<CreateDocumentInput>>({
        title: "",
        description: "",
        category: "General",
        isPublic: true,
        fileName: "",
        fileUrl: "",
        fileSize: 0,
        fileType: "",
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadProgress(10);

            // Upload file
            const result = await upload.mutateAsync(file);

            setUploadProgress(100);

            // Update form with file details
            setFormData((prev) => ({
                ...prev,
                fileName: file.name,
                fileUrl: result.fileUrl || result.url,
                fileSize: file.size,
                fileType: file.type,
                title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Remove extension if no title
            }));

            setTimeout(() => setUploadProgress(0), 1000);
        } catch (error) {
            setUploadProgress(0);
            console.error("Upload error:", error);
        }
    };

    const handleCreate = async () => {
        if (!formData.title || !formData.fileUrl) {
            return;
        }

        try {
            await create.mutateAsync(formData as CreateDocumentInput);
            setIsCreateOpen(false);
            resetForm();
        } catch (error) {
            console.error("Create error:", error);
        }
    };

    const handleUpdate = async () => {
        if (!selectedDocument || !formData.title) {
            return;
        }

        try {
            await update.mutateAsync({
                id: selectedDocument.id,
                data: formData,
            });
            setIsEditOpen(false);
            setSelectedDocument(null);
            resetForm();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async (document: Document) => {
        if (!confirm(`Are you sure you want to delete "${document.title}"?`)) {
            return;
        }

        try {
            await remove.mutateAsync(document.id);
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleDownload = async (document: Document) => {
        try {
            await download.mutateAsync(document.id);
        } catch (error) {
            console.error("Download error:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: "General",
            isPublic: true,
            fileName: "",
            fileUrl: "",
            fileSize: 0,
            fileType: "",
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openEditDialog = (document: Document) => {
        setSelectedDocument(document);
        setFormData({
            title: document.title,
            description: document.description || "",
            category: document.category || "General",
            isPublic: document.isPublic,
            fileName: document.fileName,
            fileUrl: document.fileUrl,
            fileSize: document.fileSize,
            fileType: document.fileType,
        });
        setIsEditOpen(true);
    };

    const filteredDocuments = documents || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Document Management</h2>
                    <p className="text-muted-foreground">
                        Upload, edit, and manage documents for users to download
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsCreateOpen(true);
                    }}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Upload Document
                </Button>
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
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {DOCUMENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Documents Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
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
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
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
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {document.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {document.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {document.category && (
                                                <Badge variant="secondary">
                                                    {document.category}
                                                </Badge>
                                            )}
                                            <Badge
                                                variant={document.isPublic ? "default" : "outline"}
                                            >
                                                {document.isPublic ? "Public" : "Private"}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Download className="h-3 w-3" />
                                            <span>{document.downloads} downloads</span>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleDownload(document)}
                                            >
                                                <Download className="h-3 w-3 mr-1" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(document)}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(document)}
                                            >
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Upload New Document</DialogTitle>
                        <DialogDescription>
                            Upload and configure a new document for users
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>File Upload</Label>
                            <div className="flex gap-2">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="*/*"
                                />
                            </div>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                            {formData.fileName && (
                                <p className="text-sm text-muted-foreground">
                                    Uploaded: {formData.fileName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                placeholder="Document title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                placeholder="Brief description of the document"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DOCUMENT_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibility</Label>
                                <Select
                                    value={formData.isPublic ? "public" : "private"}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, isPublic: value === "public" }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCreateOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!formData.title || !formData.fileUrl || create.isPending}
                        >
                            {create.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Document
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Document</DialogTitle>
                        <DialogDescription>
                            Update document details and settings
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title *</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                placeholder="Document title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                placeholder="Brief description of the document"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DOCUMENT_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-visibility">Visibility</Label>
                                <Select
                                    value={formData.isPublic ? "public" : "private"}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, isPublic: value === "public" }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">Current File</p>
                            <div className="flex items-center gap-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{formData.fileName}</span>
                                <Badge variant="secondary" className="ml-auto">
                                    {formatFileSize(formData.fileSize || 0)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditOpen(false);
                                setSelectedDocument(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={!formData.title || update.isPending}
                        >
                            {update.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Document
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
