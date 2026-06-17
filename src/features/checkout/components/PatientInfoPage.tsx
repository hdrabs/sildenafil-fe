"use client";

import { Controller } from "react-hook-form";
import { usePatientInfo } from "../hooks/usePatientInfo";

/** Formats raw digits into (XXX) XXX-XXXX as the user types — matches profile page behaviour */
const formatUSPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => {
  const y = currentYear - 18 - i;
  return { value: String(y), label: String(y) };
});

const MaleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5.5 5.5M19 5h-5M19 5v5" />
  </svg>
);

const FemaleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v6M9 17h6" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-400" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const selectClass = (hasError: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    hasError ? "border-red-400" : "border-gray-300"
  }`;

export const PatientInfoPage = () => {
  const { form, submit, isLoadingMe, isPending, submitError } = usePatientInfo();

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const gender = watch("gender");

  if (isLoadingMe) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#dff0f5]">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#dff0f5] px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Patient info</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          Could you please provide us with your information as it appears on your
          government-issued identification? This will assist us in verifying who
          you are.
        </p>

        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          {/* Sex assigned at birth */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Sex assigned at birth</label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((g) => {
                const selected = gender === g;
                return (
                  <label
                    key={g}
                    className={`relative flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 transition-colors ${
                      selected
                        ? "border-blue-400 bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {g === "male" ? <MaleIcon /> : <FemaleIcon />}
                    <span className="text-sm font-medium capitalize text-gray-800">{g}</span>
                    <input
                      type="radio"
                      value={g}
                      {...register("gender")}
                      className="sr-only"
                    />
                    {/* Radio indicator top-right */}
                    <span
                      className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border ${
                        selected ? "border-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Legal first name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="first_name" className="text-sm text-gray-700">
              Legal first name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <PersonIcon />
              </span>
              <input
                {...register("first_name")}
                id="first_name"
                type="text"
                placeholder="Legal first name"
                className={`h-12 w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.first_name ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.first_name && (
              <p className="text-xs text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          {/* Legal last name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="last_name" className="text-sm text-gray-700">
              Legal last name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <PersonIcon />
              </span>
              <input
                {...register("last_name")}
                id="last_name"
                type="text"
                placeholder="Legal last name"
                className={`h-12 w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.last_name ? "border-red-400" : "border-gray-200"
                }`}
              />
            </div>
            {errors.last_name && (
              <p className="text-xs text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          {/* Date of birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">Date of birth</label>
            <div className="flex gap-3">
              {/* Month */}
              <div className="relative flex-1">
                <select {...register("dob_month")} className={selectClass(!!errors.dob_month)}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown />
                {errors.dob_month && (
                  <p className="mt-1 text-xs text-red-500">{errors.dob_month.message}</p>
                )}
              </div>

              {/* Day */}
              <div className="relative w-28">
                <select {...register("dob_day")} className={selectClass(!!errors.dob_day)}>
                  <option value="">Day</option>
                  {DAYS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown />
                {errors.dob_day && (
                  <p className="mt-1 text-xs text-red-500">{errors.dob_day.message}</p>
                )}
              </div>

              {/* Year */}
              <div className="relative w-28">
                <select {...register("dob_year")} className={selectClass(!!errors.dob_year)}>
                  <option value="">Year</option>
                  {YEARS.map((y) => (
                    <option key={y.value} value={y.value}>
                      {y.label}
                    </option>
                  ))}
                </select>
                <ChevronDown />
                {errors.dob_year && (
                  <p className="mt-1 text-xs text-red-500">{errors.dob_year.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Phone number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">
              Phone number{" "}
              <span className="font-normal text-gray-500">
                (For your privacy mobile is preferred)
              </span>
            </label>
            <div className="flex gap-3">
              {/* Phone type */}
              <div className="relative w-36">
                <select
                  {...register("phone_type")}
                  className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mobile">Mobile</option>
                  <option value="home">Home</option>
                </select>
                <ChevronDown />
              </div>

              {/* Phone input with US flag */}
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base">
                  🇺🇸
                </span>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={14}
                      placeholder="(555) 555-5555"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(formatUSPhone(e.target.value))}
                      className={`h-12 w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  )}
                />
              </div>
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Privacy notice */}
          <p className="text-xs leading-relaxed text-gray-500">
            As part of our efforts to ensure patient safety, we need to verify
            your phone number. By giving us your phone number and continuing,
            you agree that we may send text messages to you to verify your phone
            number and for any other lawful purpose related to your patient
            account and your use of our services, including order confirmations,
            shipments notifications, messages from your provider, and our
            partner pharmacy.
          </p>

          {/* SMS agreement */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("sms_agreement")}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#e85f5f]"
            />
            <span className="text-xs leading-relaxed text-gray-600">
              I agree to receive SMS (text messages) from sildenafil.com and
              it&apos;s partner pharmacy. We&apos;ll notify you with important
              updates to your order and refill reminders.
            </span>
          </label>

          {/* Partner agreement */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              {...register("partner_agreement")}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-[#e85f5f]"
            />
            <span className="text-xs leading-relaxed text-gray-600">
              Include medication names in email and SMS from sildenafil.com and
              it&apos;s partner pharmacy (recommended)
            </span>
          </label>

          {submitError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-[#e85f5f] py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#d45555] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Please wait…
              </span>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

const ChevronDown = () => (
  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </span>
);
