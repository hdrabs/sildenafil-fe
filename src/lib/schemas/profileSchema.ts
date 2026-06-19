import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  mobilePhone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\(\d{3}\) \d{3}-\d{4}$/.test(v),
      "Enter a valid US phone number, e.g. (555) 555-5555",
    ),
  homePhone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\(\d{3}\) \d{3}-\d{4}$/.test(v),
      "Enter a valid US phone number, e.g. (555) 555-5555",
    ),
  email: z.string().email("Enter a valid email address"),
});

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
