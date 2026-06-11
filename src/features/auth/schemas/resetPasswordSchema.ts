import { z } from "zod";
import { passwordSchema } from "@/lib/schemas/authSchema";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
