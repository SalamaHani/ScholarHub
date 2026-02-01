import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid academic email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid academic email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["STUDENT", "PROFESSOR"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
