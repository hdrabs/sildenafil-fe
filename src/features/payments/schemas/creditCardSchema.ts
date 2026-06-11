import { z } from "zod";

const ZIP_REGEX        = /^\d{5}$/;
const CARD_NUM_REGEX   = /^\d{4} \d{4} \d{4} \d{4}$/;
const EXP_REGEX        = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVV_REGEX        = /^\d{3,4}$/;
const NAME_REGEX       = /^(?=.*[A-Za-z])[A-Za-z\s.]+$/;

export const creditCardSchema = z.object({
  first_name: z
    .string()
    .min(1, "Required")
    .regex(NAME_REGEX, "Must enter a proper name"),
  last_name: z
    .string()
    .min(1, "Required")
    .regex(NAME_REGEX, "Must enter a proper name"),
  zip: z
    .string()
    .min(1, "Required")
    .regex(ZIP_REGEX, "Must be a 5-digit ZIP code"),
  card_number: z
    .string()
    .min(1, "Required")
    .regex(CARD_NUM_REGEX, "Enter a valid 16-digit card number"),
  expiration_date: z
    .string()
    .min(1, "Required")
    .regex(EXP_REGEX, "Enter a valid date, e.g. 12/27"),
  card_code: z
    .string()
    .min(1, "Required")
    .regex(CVV_REGEX, "Must be 3 or 4 digits"),
});

export type CreditCardFormValues = z.infer<typeof creditCardSchema>;
