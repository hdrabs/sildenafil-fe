import { z } from "zod";

// Telemedicine eligibility: patients must be 25–80 (mirrors UserUpdateForm on the
// backend). Age is computed the same way the server does.
const ageFrom = (dob: string): number => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

// 8–70 chars, with at least one uppercase letter, number, or special char.
const PASSWORD_RULE = /^((?=.*\d)|(?=.*[A-Z])|(?=.*\W)).{8,70}$/;

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !v || ageFrom(v) >= 25, "Min age is 25 to continue")
    .refine((v) => !v || ageFrom(v) <= 80, "Please call (844) 745-3362 for assistance"),
  // Telemedicine is available for male patients only (backend enforces this too).
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
    newPassword: z
      .string()
      .regex(
        PASSWORD_RULE,
        "8–70 characters, with at least one uppercase letter, number, or special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
