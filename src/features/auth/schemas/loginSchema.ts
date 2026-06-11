import { z } from "zod";
import { passwordSchema } from "@/lib/schemas/authSchema";

export const emailStepSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const passwordStepSchema = z.object({
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone number is required"),
  password: passwordSchema,
});

export type EmailStepValues = z.infer<typeof emailStepSchema>;
export type PasswordStepValues = z.infer<typeof passwordStepSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
