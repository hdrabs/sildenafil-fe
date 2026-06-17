import { z } from "zod";

export const visitConsentSchema = z.object({
  state: z.string().min(1, "Please select your state"),
  terms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms of Use and Privacy Policy",
  }),
  state_ack: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge your location",
  }),
});

export type VisitConsentFormValues = z.infer<typeof visitConsentSchema>;
