import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(
    /^(\d+|.*[A-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~].*)$/,
    "Password must include at least one uppercase letter, number, or symbol",
  );
