import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/schemas/authSchema";

const nameSchema = z
  .string()
  .min(1, "This field is required")
  .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed");

export const signupSchema = z.object({
  firstName: nameSchema.refine((v) => v.trim().length > 0, "First name is required"),
  lastName: nameSchema.refine((v) => v.trim().length > 0, "Last name is required"),
  email: emailSchema,
  password: passwordSchema,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
