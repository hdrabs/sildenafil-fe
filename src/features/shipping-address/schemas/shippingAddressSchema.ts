import { z } from "zod";

const NAME_REGEX = /^(?=.*[A-Za-z])[A-Za-z\s.]+$/;
const PHONE_REGEX = /^[\d()\s\-+]{10,}$/;
const ZIP_REGEX   = /^\d{5}$/;

export const shippingAddressSchema = z.object({
  first_name: z
    .string()
    .min(1, "Required")
    .regex(NAME_REGEX, "Must enter a proper name"),
  last_name: z
    .string()
    .min(1, "Required")
    .regex(NAME_REGEX, "Must enter a proper name"),
  street_1: z.string().min(1, "Required"),
  street_2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zip: z
    .string()
    .min(1, "Required")
    .regex(ZIP_REGEX, "Must be a 5-digit ZIP code"),
  phone: z
    .string()
    .min(1, "Required")
    .regex(PHONE_REGEX, "Enter a valid US phone number"),
});

export type ShippingAddressFormValues = z.infer<typeof shippingAddressSchema>;
