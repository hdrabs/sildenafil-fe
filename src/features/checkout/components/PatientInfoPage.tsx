"use client";

import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePatientInfo } from "../hooks/usePatientInfo";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { OtpModal } from "@/components/modals/OtpModal";
import { useGenerateOtp, useVerifyOtp } from "@/api/hooks/useAuthQueries";

const blockDigits = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (/\d/.test(e.key)) e.preventDefault();
};

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
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5.5 5.5M19 5h-5M19 5v5" />
  </svg>
);

const FemaleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v6M9 17h6" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-400" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const ChevronDown = () => (
  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </span>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs font-medium text-[#ec534b]">{message}</p> : null;

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-lg border-2 bg-white px-[10px] text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ec534b] focus:border-transparent cursor-pointer ${
    hasError ? "border-red-400" : "border-border-dropdown"
  }`;

export const PatientInfoPage = ({ returnTo }: { returnTo?: string } = {}) => {
  const router = useRouter();
  const { back } = useStepNavigation("patient_info");
  const onBack = returnTo ? () => router.push(returnTo) : back;
  const {
    form,
    submit,
    isLoadingMe,
    isPending,
    submitError,
    canSubmit,
    showOtpModal,
    otpLimitExceeded,
    otpPhone,
    onOtpVerified,
    onOtpSkip,
    onOtpClose,
  } = usePatientInfo({ returnTo });

  const { mutateAsync: generateOtp } = useGenerateOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const gender = watch("gender");

  if (isLoadingMe) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-main">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#ec534b] border-t-transparent" />
      </main>
    );
  }

  return (
    <>
      <SecondaryNav onBack={onBack} />
      <CheckoutProgressBar step="patient_info" />
      <main className="flex min-h-screen items-start justify-center bg-bg-main px-4 py-16">
        <div className="w-full max-w-xl">
          <h1 className="mb-2 text-2xl font-semibold leading-[34px] text-gray-900">
            Patient info
          </h1>
          <p className="mb-[30px] text-base leading-relaxed text-gray-600">
            Could you please provide us with your information as it appears on your
            government-issued identification? This will assist us in verifying who you are.
          </p>

          <form onSubmit={submit} noValidate className="flex flex-col">
            {/* Sex assigned at birth */}
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-xs font-normal text-[#00000080]">Sex assigned at birth</label>
              <div className="flex gap-3">
                {(["male", "female"] as const).map((g) => {
                  const selected = gender === g;
                  return (
                    <label
                      key={g}
                      className={`relative flex flex-1 cursor-pointer items-center gap-2.5 rounded-lg border-2 px-4 py-3 transition-colors ${
                        selected
                          ? "border-[#ec534b] bg-white"
                          : "border-border-dropdown bg-white hover:border-[#a9cbd9]"
                      }`}
                    >
                      <span className={selected ? "text-[#ec534b]" : "text-gray-400"}>
                        {g === "male" ? <MaleIcon /> : <FemaleIcon />}
                      </span>
                      <span className="text-sm font-medium capitalize text-gray-800">{g}</span>
                      <input
                        type="radio"
                        value={g}
                        {...register("gender")}
                        className="sr-only"
                      />
                      {/* Indicator top-right */}
                      <span className="absolute right-3 top-3">
                        {selected ? (
                          <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#ec534b]" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300" />
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              <FieldError message={errors.gender?.message} />
            </div>

            {/* Legal first name */}
            <div className="mb-5 flex flex-col gap-1.5">
              <label htmlFor="first_name" className="text-xs font-normal text-[#00000080]">
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
                  onKeyDown={blockDigits}
                  className={`h-12 w-full cursor-pointer rounded-lg border-2 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ec534b] focus:border-transparent ${
                    errors.first_name ? "border-red-400" : "border-border-dropdown"
                  }`}
                />
              </div>
              <FieldError message={errors.first_name?.message} />
            </div>

            {/* Legal last name */}
            <div className="mb-5 flex flex-col gap-1.5">
              <label htmlFor="last_name" className="text-xs font-normal text-[#00000080]">
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
                  onKeyDown={blockDigits}
                  className={`h-12 w-full cursor-pointer rounded-lg border-2 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ec534b] focus:border-transparent ${
                    errors.last_name ? "border-red-400" : "border-border-dropdown"
                  }`}
                />
              </div>
              <FieldError message={errors.last_name?.message} />
            </div>

            {/* Date of birth */}
            <div className="mb-5 flex flex-col gap-1.5">
              <label className="text-xs font-normal text-[#00000080]">Date of birth</label>
              <div className="flex gap-3">
                {/* Month */}
                <div className="relative flex-1">
                  <select {...register("dob_month")} className={inputClass(!!errors.dob_month)}>
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>

                {/* Day */}
                <div className="relative w-28">
                  <select {...register("dob_day")} className={inputClass(!!errors.dob_day)}>
                    <option value="">Day</option>
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>

                {/* Year */}
                <div className="relative w-28">
                  <select {...register("dob_year")} className={inputClass(!!errors.dob_year)}>
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown />
                </div>
              </div>
              {/* Show single error for DOB — pick the first one that has a message */}
              <FieldError
                message={
                  errors.dob_month?.message ||
                  errors.dob_day?.message ||
                  errors.dob_year?.message
                }
              />
            </div>

            {/* Phone number */}
            <div className="mb-5 flex flex-col gap-1.5">
              <label className="text-xs font-normal text-[#00000080]">
                Phone number{" "}
                <span className="font-normal text-gray-400">
                  (For your privacy mobile is preferred)
                </span>
              </label>
              <div className="flex gap-3">
                {/* Phone type */}
                <div className="relative w-32">
                  <select
                    {...register("phone_type")}
                    className="h-12 w-full cursor-pointer appearance-none rounded-lg border-2 border-border-dropdown bg-white px-[10px] text-sm font-medium text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ec534b]"
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
                        className={`h-12 w-full cursor-pointer rounded-lg border-2 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ec534b] focus:border-transparent ${
                          errors.phone ? "border-red-400" : "border-border-dropdown"
                        }`}
                      />
                    )}
                  />
                </div>
              </div>
              <FieldError message={errors.phone?.message} />
            </div>

            {/* Privacy notice */}
            <p className="mb-4 text-xs font-normal leading-[21px] text-[#777]">
              As part of our efforts to ensure patient safety, we need to verify your phone number.
              By giving us your phone number and continuing, you agree that we may send text messages
              to you to verify your phone number and for any other lawful purpose related to your
              patient account and your use of our services, including order confirmations, shipments
              notifications, messages from your provider, and our partner pharmacy.
            </p>

            {/* SMS agreement (optional) */}
            <label className="mb-4 flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  {...register("sms_agreement")}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded border-2 border-gray-300 bg-white transition-colors peer-checked:border-[#ec534b] peer-checked:bg-[#ec534b]" />
                <svg
                  className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs leading-relaxed text-[#777]">
                I agree to receive SMS (text messages) from sildenafil.com and it&apos;s partner
                pharmacy. We&apos;ll notify you with important updates to your order and refill
                reminders.
              </span>
            </label>

            {/* Include medication names (optional) */}
            <label className="mb-10 flex cursor-pointer items-start gap-3">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  {...register("partner_agreement")}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded border-2 border-gray-300 bg-white transition-colors peer-checked:border-[#ec534b] peer-checked:bg-[#ec534b]" />
                <svg
                  className="pointer-events-none absolute inset-0 m-auto hidden h-3 w-3 text-white peer-checked:block"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs leading-relaxed text-[#777]">
                Include medication names in email and SMS from sildenafil.com and it&apos;s partner
                pharmacy (recommended)
              </span>
            </label>

            {submitError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className="w-full cursor-pointer rounded-full border border-coral bg-coral px-[22px] py-3 text-base font-normal uppercase text-white outline-none transition-colors hover:border-coral-hover hover:bg-coral-hover disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400"
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

      <OtpModal
        show={showOtpModal}
        phone={otpPhone}
        initiallyExhausted={otpLimitExceeded}
        onSubmit={async (code) => { await verifyOtp(code); await onOtpVerified(); }}
        onResend={async () => { await generateOtp(); }}
        onAlternative={onOtpSkip}
        onClose={onOtpClose}
        alternativeText="We're sorry you're having trouble verifying your number. Let's continue with your visit for now, but later on we'll need you to upload a government-issued ID."
        alternativeButtonLabel="Continue with visit"
        showSignUpPrompt={false}
      />
    </>
  );
};
