import * as z from "zod";

const languageSchema = z.object({
    name: z.string().min(1, "Language name is required"),
    proficiency: z.number().min(0).max(100),
    level: z.string().optional(),
});

const experienceSchema = z.object({
    title: z.string().min(2, "Title is required"),
    organization: z.string().min(2, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
});

const certificationSchema = z.object({
    title: z.string().min(2, "Title is required"),
    organization: z.string().min(2, "Organization is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email").optional(),
    avatar: z.string().optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    age: z.coerce.number().min(0).max(120).optional(),
    gender: z.string().optional(),

    // Student specific
    university: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    degreeLevel: z.string().optional(),
    currentDegree: z.string().optional(),
    gpa: z.coerce.number().min(0).max(4.0, "GPA cannot exceed 4.0").optional(),
    graduationYear: z.coerce.number().optional(),

    // Professor specific
    institution: z.string().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    specialization: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    officeLocation: z.string().optional(),

    // Arrays
    skills: z.array(z.string()).optional(),
    languages: z.array(languageSchema).optional(),
    experience: z.array(experienceSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
