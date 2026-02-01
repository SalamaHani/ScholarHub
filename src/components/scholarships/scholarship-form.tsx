"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scholarshipSchema, ScholarshipInput } from "@/lib/validations/scholarship";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Save, BookOpen, AlertCircle } from "lucide-react";
import { useScholarships, Scholarship } from "@/hooks/useScholarships";
import { useCategories, Category } from "@/hooks/useCategories";
import { motion, AnimatePresence } from "framer-motion";

interface ScholarshipFormProps {
    initialData?: Partial<Scholarship>;
    onSuccess: () => void;
    onCancel: () => void;
}

const degreeLevels = [
    { label: "Bachelor", value: "BACHELOR" },
    { label: "Master", value: "MASTER" },
    { label: "PhD", value: "PHD" },
    { label: "Postdoctoral", value: "POSTDOC" },
    { label: "Research", value: "RESEARCH" },
];

const fundingTypes = [
    { label: "Full Funding", value: "FULL" },
    { label: "Partial Funding", value: "PARTIAL" },
    { label: "Tuition Only", value: "TUITION_ONLY" },
    { label: "Stipend", value: "STIPEND" },
];

export function ScholarshipForm({ initialData, onSuccess, onCancel }: ScholarshipFormProps) {
    const { create, update } = useScholarships();
    const { list } = useCategories();
    const categories = list.data?.categories || [];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValidating, isSubmitting: isFormSubmitting },
    } = useForm<ScholarshipInput>({
        resolver: zodResolver(scholarshipSchema),
        defaultValues: {
            title: initialData?.title || "",
            organization: initialData?.organization || "",
            country: initialData?.country || "",
            deadline: (initialData?.deadline && !isNaN(new Date(initialData.deadline).getTime())) ? new Date(initialData.deadline).toISOString().split('T')[0] : "",
            fundingType: (initialData?.fundingType as any) || "FULL",
            applicationLink: initialData?.applicationLink || "",
            description: initialData?.description || "",
            requirements: initialData?.requirements || "",
            eligibility: initialData?.eligibility || "",
            benefits: initialData?.benefits || "",
            documents: initialData?.documents || "",
            isFeatured: initialData?.isFeatured || false,
            degreeLevel: initialData?.degreeLevel
                ? (Array.isArray(initialData.degreeLevel) ? initialData.degreeLevel : String(initialData.degreeLevel).split(',').map(s => s.trim()).filter(Boolean))
                : [],
            fieldOfStudy: initialData?.fieldOfStudy
                ? (Array.isArray(initialData.fieldOfStudy) ? initialData.fieldOfStudy : String(initialData.fieldOfStudy).split(',').map(s => s.trim()).filter(Boolean))
                : [],
        }
    });

    const selectedDegreeLevels = watch("degreeLevel");
    const selectedFields = watch("fieldOfStudy");

    const onSubmit = async (data: ScholarshipInput) => {
        try {
            if (initialData?.id) {
                await update.mutateAsync({
                    id: initialData.id,
                    data,
                });
            } else {
                await create.mutateAsync(data);
            }
            onSuccess();
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    const toggleDegreeLevel = (value: string) => {
        const current = selectedDegreeLevels || [];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setValue("degreeLevel", next, { shouldValidate: true });
    };

    const toggleField = (value: string) => {
        const current = selectedFields || [];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setValue("fieldOfStudy", next, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-bold">Scholarship Title</Label>
                        <Input
                            id="title"
                            {...register("title")}
                            placeholder="e.g. Fulbright Foreign Student Program"
                            className={errors.title ? "border-red-500 bg-red-50/30" : ""}
                        />
                        {errors.title && <p className="text-[10px] font-bold text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="organization" className="text-sm font-bold">Organization / University</Label>
                        <Input
                            id="organization"
                            {...register("organization")}
                            placeholder="e.g. U.S. Department of State"
                            className={errors.organization ? "border-red-500 bg-red-50/30" : ""}
                        />
                        {errors.organization && <p className="text-[10px] font-bold text-red-500">{errors.organization.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-sm font-bold">Country</Label>
                            <Input
                                id="country"
                                {...register("country")}
                                placeholder="e.g. United States"
                                className={errors.country ? "border-red-500 bg-red-50/30" : ""}
                            />
                            {errors.country && <p className="text-[10px] font-bold text-red-500">{errors.country.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-sm font-bold">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                {...register("deadline")}
                                className={errors.deadline ? "border-red-500 bg-red-50/30" : ""}
                            />
                            {errors.deadline && <p className="text-[10px] font-bold text-red-500">{errors.deadline.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-bold">Degree Levels</Label>
                        <div className="flex flex-wrap gap-2">
                            {degreeLevels.map((level) => (
                                <Badge
                                    key={level.value}
                                    variant={selectedDegreeLevels?.includes(level.value) ? "default" : "outline"}
                                    className={`cursor-pointer px-3 py-1 transition-all ${selectedDegreeLevels?.includes(level.value) ? "bg-primary shadow-md" : "hover:bg-primary/5"}`}
                                    onClick={() => toggleDegreeLevel(level.value)}
                                >
                                    {level.label}
                                </Badge>
                            ))}
                        </div>
                        {errors.degreeLevel && <p className="text-[10px] font-bold text-red-500">{errors.degreeLevel.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Fields of Study
                        </Label>

                        <div className="flex gap-2">
                            <Select onValueChange={(v) => {
                                if (v && !selectedFields?.includes(v)) {
                                    toggleField(v);
                                }
                            }}>
                                <SelectTrigger className="rounded-xl border-primary/10 h-11 focus:ring-primary bg-zinc-50/50">
                                    <SelectValue placeholder="Add a major or field of study..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat: Category) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.name}
                                            disabled={selectedFields?.includes(cat.name)}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                    {categories.length === 0 && (
                                        <div className="p-2 text-xs text-muted-foreground italic text-center">
                                            No categories found
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-xl bg-primary/5 border border-dashed border-primary/20">
                            {(selectedFields || []).length > 0 ? (
                                selectedFields.map((field) => (
                                    <Badge
                                        key={field}
                                        variant="secondary"
                                        className="px-3 py-1 flex items-center gap-1.5 bg-white text-primary border-primary/10 hover:bg-primary/5 transition-colors group shadow-sm"
                                    >
                                        <span className="text-xs font-semibold">{field}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer text-muted-foreground group-hover:text-destructive transition-colors"
                                            onClick={() => toggleField(field)}
                                        />
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-[10px] text-muted-foreground italic flex items-center justify-center w-full">
                                    Select fields from the dropdown above...
                                </p>
                            )}
                        </div>
                        {errors.fieldOfStudy && (
                            <p className="text-[10px] font-bold text-red-500">
                                {errors.fieldOfStudy.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fundingType" className="text-sm font-bold">Funding Type</Label>
                        <Select
                            value={watch("fundingType")}
                            onValueChange={(v: any) => setValue("fundingType", v, { shouldValidate: true })}
                        >
                            <SelectTrigger id="fundingType" className="bg-zinc-50/50">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {fundingTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.fundingType && <p className="text-[10px] font-bold text-red-500">{errors.fundingType.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="applicationLink" className="text-sm font-bold">Original Application Link</Label>
                        <Input
                            id="applicationLink"
                            {...register("applicationLink")}
                            placeholder="https://..."
                            className={errors.applicationLink ? "border-red-500 bg-red-50/30" : ""}
                        />
                        {errors.applicationLink && <p className="text-[10px] font-bold text-red-500">{errors.applicationLink.message}</p>}
                    </div>
                </div>

                {/* Detailed Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Brief overview of the scholarship..."
                            className={`min-h-[100px] bg-zinc-50/50 ${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && <p className="text-[10px] font-bold text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requirements" className="text-sm font-bold">Requirements</Label>
                        <Textarea
                            id="requirements"
                            {...register("requirements")}
                            placeholder="Academic records, Language scores, etc."
                            className="min-h-[80px] bg-zinc-50/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="eligibility" className="text-sm font-bold">Eligibility</Label>
                        <Textarea
                            id="eligibility"
                            {...register("eligibility")}
                            placeholder="Who can apply?"
                            className="min-h-[80px] bg-zinc-50/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="benefits" className="text-sm font-bold">Benefits & Coverage</Label>
                        <Textarea
                            id="benefits"
                            {...register("benefits")}
                            placeholder="Tuition, Stipend, Insurance, etc."
                            className="min-h-[80px] bg-zinc-50/50"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isFormSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="gradient" className="min-w-[140px]" disabled={isFormSubmitting}>
                    {isFormSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {initialData ? "Update Scholarship" : "Post Scholarship"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
