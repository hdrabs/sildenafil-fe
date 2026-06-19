import { z } from "zod";
import { US_STATE_CODES } from "@/constants/usStates";

// Matches the backend ZIP_PATTERN (lib/concerns/validation_patterns.rb): a
// 5-digit ZIP, optionally followed by the +4 extension (e.g. 92833 or 92833-4823).
const ZIP_REGEX = /^\d{5}(?:-\d{4})?$/;

/**
 * The checkout shipping form only collects the address itself — name and phone
 * come from the authenticated user and are merged in at submit time.
 */
export const shippingCheckoutSchema = z.object({
  street_1: z.string().trim().min(1, "Required"),
  street_2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Required"),
  // State must be a valid 2-letter US code (the legacy field accepted any code
  // from the backend StatesList). Case-insensitive; normalized to upper at submit.
  state: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((s) => US_STATE_CODES.has(s.toUpperCase()), "Please check your state."),
  zip: z.string().trim().min(1, "Required").regex(ZIP_REGEX, "Please check your zip code."),
});

export type ShippingCheckoutFormValues = z.infer<typeof shippingCheckoutSchema>;
