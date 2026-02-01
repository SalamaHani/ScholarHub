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

const testimonialSchema = z.object({
    quote: z.string().min(10, "Quote must be at least 10 characters"),
    author: z.string().min(2, "Author name is required"),
    role: z.string().min(2, "Role/Title is required"),
    avatar: z.string().optional(),
    isActive: z.boolean().default(true),
});

interface TestimonialFormProps {
    initialData?: Partial<Testimonial>;
    onSuccess: () => void;
    onCancel: () => void;
    onSubmit: (data: TestimonialInput) => Promise<void>;
}

export function TestimonialForm({ initialData, onSuccess, onCancel, onSubmit }: TestimonialFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                <Label htmlFor="author">Author Name</Label>
                <Input
                    id="author"
                    placeholder="e.g. Dr. Jane Smith or Student Name"
                    {...register("author")}
                    className={errors.author ? "border-destructive" : ""}
                />
                {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role / Position</Label>
                <Input
                    id="role"
                    placeholder="e.g. PhD Researcher at MIT"
                    {...register("role")}
                    className={errors.role ? "border-destructive" : ""}
                />
                {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quote">Testimonial Quote</Label>
                <Textarea
                    id="quote"
                    placeholder="Describe the experience or impact..."
                    rows={4}
                    {...register("quote")}
                    className={errors.quote ? "border-destructive" : ""}
                />
                {errors.quote && <p className="text-xs text-destructive">{errors.quote.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                <Input
                    id="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    {...register("avatar")}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {initialData?.id ? "Update Testimonial" : "Create Testimonial"}
                </Button>
            </div>
        </form>
    );
}
