"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    ShieldCheck,
    Send,
    X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useApplications } from "@/hooks/useApplications";
import { cn } from "@/lib/utils";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    scholarshipTitle: string;
    scholarshipId: string;
}

export function ApplicationModal({ isOpen, onClose, scholarshipTitle, scholarshipId }: ApplicationModalProps) {
    const [step, setStep] = useState(1);
    const { submit } = useApplications();
    const [motivation, setMotivation] = useState("");
    const [documents, setDocuments] = useState<Record<string, any>>({});

    const handleFileSelect = (label: string, fileData: any) => {
        setDocuments(prev => ({ ...prev, [label]: fileData }));
    };

    const handleFileRemove = (label: string) => {
        setDocuments(prev => {
            const newDocs = { ...prev };
            delete newDocs[label];
            return newDocs;
        });
    };

    const STEPS = [
        { id: 1, title: "Personal Statement", icon: FileText },
        { id: 2, title: "Supporting Documents", icon: Upload },
        { id: 3, title: "Final Review", icon: ShieldCheck },
    ];

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submit.mutateAsync({
                scholarshipId,
                motivation,
                documents: JSON.stringify(documents),
            });
            setStep(4); // Success step
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const isSubmitting = submit.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-primary/10 p-0 overflow-hidden shadow-2xl">
                {/* Visual Progress Bar */}
                {step < 4 && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-emerald-500 to-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                )}

                <DialogHeader className="p-8 pb-4 bg-gradient-to-b from-primary/5 to-transparent relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Official Application</span>
                        </div>
                        {step < 4 && (
                            <Badge variant="outline" className="bg-white/80 backdrop-blur font-bold px-3 py-1 border-primary/20 text-primary">
                                Step {step} of 3
                            </Badge>
                        )}
                    </div>

                    <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 leading-tight">
                        Apply for <span className="text-primary italic">Success</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Scholarship: <span className="text-slate-900 font-bold">{scholarshipTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <div className="px-8 py-4 overflow-y-auto min-h-[400px] max-h-[60vh] flex flex-col scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter">Personal Statement</h3>
                                                <p className="text-xs text-slate-500 font-medium italic">Tell the selection committee your story.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="motivation" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Motivation Letter</Label>
                                            <div className="relative group">
                                                <Textarea
                                                    id="motivation"
                                                    placeholder="Explain why you are the best candidate for this scholarship..."
                                                    className="min-h-[250px] resize-none border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary p-5 leading-relaxed rounded-2xl bg-slate-50/50 group-hover:bg-white transition-all"
                                                    required
                                                    value={motivation}
                                                    onChange={(e) => setMotivation(e.target.value)}
                                                />
                                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300">
                                                    {motivation.length} characters
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
                                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                                    <strong>Pro Tip:</strong> Focus on your academic achievements, career aspirations, and how this scholarship aligns with your future goals.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                            <Upload className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tighter">Required Evidence</h3>
                                            <p className="text-xs text-slate-500 font-medium italic">High-quality scans facilitate faster processing.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <DocumentUpload
                                            label="Academic Transcripts"
                                            required
                                            hint="Final year or semester grades."
                                            onUpload={(file) => handleFileSelect("Transcripts", file)}
                                            onRemove={() => handleFileRemove("Transcripts")}
                                        />
                                        <DocumentUpload
                                            label="English Proficiency"
                                            hint="IELTS, TOEFL, or equivalent."
                                            onUpload={(file) => handleFileSelect("English", file)}
                                            onRemove={() => handleFileRemove("English")}
                                        />
                                        <DocumentUpload
                                            label="Curriculum Vitae (CV)"
                                            required
                                            hint="Updated professional summary."
                                            onUpload={(file) => handleFileSelect("CV", file)}
                                            onRemove={() => handleFileRemove("CV")}
                                        />
                                        <DocumentUpload
                                            label="Identity Documentation"
                                            required
                                            hint="Passport or National ID card."
                                            onUpload={(file) => handleFileSelect("ID", file)}
                                            onRemove={() => handleFileRemove("ID")}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="space-y-8 flex flex-col items-center py-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                        <div className="relative w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-primary/20">
                                            <ShieldCheck className="h-12 w-12 text-primary" />
                                        </div>
                                    </div>

                                    <div className="text-center space-y-3 px-10">
                                        <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Application Ready</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            Your dossiers for <span className="text-primary font-bold">{scholarshipTitle}</span> are compiled.
                                            Final verification confirms all required fields are populated.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 text-center">
                                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                            <p className="text-xs font-bold text-slate-900">{Object.keys(documents).length} Documents Secured</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 text-center">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Send className="h-4 w-4 text-primary" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target</p>
                                            <p className="text-xs font-bold text-slate-900">Official Portal</p>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-center text-slate-400 font-medium px-12">
                                        By clicking submit, you attest to the veracity of all information provided and authorize review by the selection board.
                                    </p>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                                >
                                    <div className="relative">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.2, opacity: 0 }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="absolute inset-0 bg-emerald-500/20 rounded-full"
                                        />
                                        <div className="relative w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center shadow-inner">
                                            <CheckCircle2 className="h-14 w-14 text-emerald-600 animate-in zoom-in duration-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic py-2">Mission Accomplished</h3>
                                        <p className="text-slate-500 text-sm font-medium w-72 leading-relaxed">
                                            Your intellectual profile has been transmitted to the <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">ScholarHub Admissions Portal</span>.
                                        </p>
                                    </div>

                                    <div className="bg-emerald-50/50 px-6 py-4 rounded-3xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-700 italic">Expect a follow-up via secure email within 14 business days.</p>
                                    </div>

                                    <Button variant="outline" className="mt-8 rounded-full px-10 h-12 font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm" onClick={onClose}>
                                        Acknowledge & Exit
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {step < 4 && (
                        <DialogFooter className="p-8 bg-slate-50 border-t flex items-center justify-between sm:justify-between w-full">
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <Button type="button" variant="outline" onClick={handleBack} className="rounded-2xl border-slate-200 h-11 px-6 font-bold text-slate-600 hover:bg-white transition-all shadow-sm">
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Button>
                                )}
                                <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl h-11 font-bold text-slate-500">Cancel</Button>
                            </div>

                            <div className="flex-1 flex justify-end">
                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        variant="default"
                                        className="rounded-2xl h-11 px-10 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 transition-all hover:scale-105"
                                    >
                                        Proceed to Step {step + 1}
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="gradient"
                                        className="rounded-2xl h-11 px-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/40 transition-all hover:scale-105 bg-gradient-to-r from-primary to-emerald-600 text-white border-none"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Transmitting...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Transmit Application
                                                <Send className="h-3.5 w-3.5" />
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </DialogFooter>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DocumentUpload({ label, required, hint, onUpload, onRemove }: {
    label: string;
    required?: boolean;
    hint?: string;
    onUpload: (file: any) => void;
    onRemove: () => void;
}) {
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
            setFileInfo({ name: file.name, size: `${sizeInMB} MB` });

            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setFileInfo(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRemove();
    };

    return (
        <div className={cn(
            "relative border-2 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300 group overflow-hidden",
            fileInfo
                ? "bg-emerald-50/30 border-emerald-200 border-solid"
                : "bg-white border-slate-100 border-dashed hover:border-primary/40 hover:bg-primary/5 hover:translate-x-1"
        )}>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {fileInfo && (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 opacity-30"
                />
            )}

            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                    fileInfo ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-primary"
                )}>
                    {fileInfo ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
                        {label}
                        {required && <span className="text-rose-500">*</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium italic truncate max-w-[200px]">
                        {fileInfo ? `${fileInfo.name} (${fileInfo.size})` : (hint || "Upload PDF/JPG source.")}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant={fileInfo ? "success" : "outline"}
                    size="sm"
                    className={cn(
                        "h-9 px-5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all",
                        !fileInfo && "border-slate-200 text-slate-500 hover:border-primary hover:text-primary"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {fileInfo ? "Replace" : "Attach"}
                </Button>
                {fileInfo && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
