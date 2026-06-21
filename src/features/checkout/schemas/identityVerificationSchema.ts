import { z } from "zod";

export const ssnSchema = z.object({
  ssn_code: z
    .string()
    .regex(/^\d{4}$/, "Enter the last 4 digits of your SSN"),
});

export type SsnFormValues = z.infer<typeof ssnSchema>;
