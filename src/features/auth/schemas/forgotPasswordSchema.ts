import { z } from "zod";
import { emailSchema } from "@/lib/schemas/authSchema";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
