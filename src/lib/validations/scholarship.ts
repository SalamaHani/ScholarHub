import * as z from "zod";

export const scholarshipSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    organization: z.string().min(2, "Organization is required"),
    country: z.string().min(2, "Country is required"),
    deadline: z.string().min(1, "Deadline is required"),
    fundingType: z.enum(["FULL", "PARTIAL", "TUITION_ONLY", "STIPEND"]),
    applicationLink: z.string().url("Please enter a valid URL"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.string().optional(),
    eligibility: z.string().optional(),
    benefits: z.string().optional(),
    documents: z.string().optional(),
    isFeatured: z.boolean().optional(),
    degreeLevel: z.array(z.string()).min(1, "At least one degree level is required"),
    fieldOfStudy: z.array(z.string()).min(1, "At least one field of study is required"),
    questions: z.array(z.object({
        id: z.string(),
        question: z.string(),
        type: z.enum(["TEXT", "MULTIPLE_CHOICE", "DOCUMENT"]),
        options: z.array(z.string()).optional()
    })).optional(),
});

export type ScholarshipInput = z.infer<typeof scholarshipSchema>;
