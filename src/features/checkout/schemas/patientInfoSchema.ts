import { z } from "zod";

const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const patientInfoSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "Required")
      .regex(NAME_REGEX, "Must enter a proper first name"),

    last_name: z
      .string()
      .trim()
      .min(1, "Required")
      .regex(NAME_REGEX, "Must enter a proper last name"),

    gender: z.enum(["male", "female"], { message: "Required" }),

    dob_month: z.string().min(1, "Required"),
    dob_day: z.string().min(1, "Required"),
    dob_year: z.string().min(1, "Required"),

    phone_type: z.enum(["mobile", "home"]),

    phone: z
      .string()
      .regex(
        /^\(\d{3}\) \d{3}-\d{4}$/,
        "Enter a valid US phone number, e.g. (555) 555-5555",
      ),

    sms_agreement: z.boolean(),
    partner_agreement: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const { dob_month, dob_day, dob_year } = data;
    if (!dob_month || !dob_day || !dob_year) return;

    const dob = new Date(`${dob_year}-${dob_month}-${dob_day}`);
    if (isNaN(dob.getTime())) {
      ctx.addIssue({ code: "custom", path: ["dob_day"], message: "Invalid date" });
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear() -
      (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);

    if (age < 21) {
      ctx.addIssue({ code: "custom", path: ["dob_year"], message: "You must be at least 21 to continue" });
    }
    if (age > 75) {
      ctx.addIssue({ code: "custom", path: ["dob_year"], message: "Please call us for assistance" });
    }
  });

export type PatientInfoFormValues = z.infer<typeof patientInfoSchema>;
