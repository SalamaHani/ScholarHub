"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X } from "lucide-react";
import { Testimonial, TestimonialInput } from "@/hooks/useTestimonials";
import { useTranslation } from "@/hooks/useTranslation";

interface TestimonialFormProps {
    initialData?: Partial<Testimonial>;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: TestimonialInput) => Promise<void>;
}

export function TestimonialForm({ initialData, onSuccess, onCancel, onSubmit }: TestimonialFormProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const testimonialSchema = z.object({
        quote: z.string().min(10, t.testimonialForm.quoteMin),
        author: z.string().min(2, t.testimonialForm.authorRequired),
        role: z.string().min(2, t.testimonialForm.roleRequired),
        avatar: z.string().optional(),
        isActive: z.boolean().default(true),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TestimonialInput>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            quote: initialData?.quote || "",
            author: initialData?.author || "",
            role: initialData?.role || "",
            avatar: initialData?.avatar || "",
            isActive: initialData?.isActive ?? true,
        }
    });

    const handleFormSubmit = async (data: TestimonialInput) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            onSuccess();
        } catch (error) {
            console.error("Testimonial submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label htmlFor="author">{t.testimonialForm.authorName}</Label>
                <Input
                    id="author"
                    placeholder={t.testimonialForm.authorPlaceholder}
                    {...register("author")}
                    className={errors.author ? "border-destructive" : ""}
                />
                {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">{t.testimonialForm.roleLabel}</Label>
                <Input
                    id="role"
                    placeholder={t.testimonialForm.rolePlaceholder}
                    {...register("role")}
                    className={errors.role ? "border-destructive" : ""}
                />
                {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quote">{t.testimonialForm.quoteLabel}</Label>
                <Textarea
                    id="quote"
                    placeholder={t.testimonialForm.quotePlaceholder}
                    rows={4}
                    {...register("quote")}
                    className={errors.quote ? "border-destructive" : ""}
                />
                {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar">{t.testimonialForm.avatarLabel}</Label>
                <Input
                    id="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    {...register("avatar")}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t.testimonialForm.cancel}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {initialData?.id ? t.testimonialForm.updateTestimonial : t.testimonialForm.createTestimonial}
                </Button>
            </div>
        </form>
    );
}
