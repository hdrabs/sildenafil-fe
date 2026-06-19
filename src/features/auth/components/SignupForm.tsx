"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { PersonIcon } from "@/components/icons/PersonIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
import { signupSchema, SignupFormValues } from "../schemas/signupSchema";
import { useSignupUser } from "../hooks/useSignupUser";
import { authService } from "@/api/services/authService";
import { APIError } from "@/api/baseAPI";
import { Button } from "@/components/ui/Button";
import { TermsOfUseDrawer } from "@/components/legal/TermsOfUseDrawer";
import { PrivacyPolicyDrawer } from "@/components/legal/PrivacyPolicyDrawer";
import { ROUTES } from "@/constants/routes";

// Shared field styling — matches the signin email/phone inputs.
const fieldClass =
  "w-full rounded-lg border border-border-input bg-bg-card py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

const passwordChecks = [
  {
    label: "Password must be at least 8 characters long",
    test: (v: string) => v.length >= 8,
  },
  {
    label: "Include at least one uppercase letter or number or symbol",
    test: (v: string) => /[A-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(v),
  },
];

export const SignupForm = () => {
  const { signup, isPending, signupError } = useSignupUser();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [emailCheckError, setEmailCheckError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const passwordValue = watch("password") ?? "";
  const firstNameValue = watch("firstName") ?? "";
  const lastNameValue = watch("lastName") ?? "";

  // Gate the Create Account button on the same rules shown to the user — both
  // names filled and the password meeting the regex checks below. (handleSubmit
  // still enforces the full zod schema on submit.)
  const isStep2Valid =
    firstNameValue.trim().length > 0 &&
    lastNameValue.trim().length > 0 &&
    passwordChecks.every((c) => c.test(passwordValue));

  const handleContinue = async () => {
    setEmailCheckError(null);
    const valid = await trigger("email");
    if (!valid) return;

    setIsCheckingEmail(true);
    try {
      await authService.checkEmail(getValues("email"));
      setStep(2);
    } catch (err) {
      if (err instanceof APIError && err.status === 422) {
        setEmailCheckError("email_taken");
      } else {
        setEmailCheckError("unknown");
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const alreadyHaveAccount = (
    <p className="mb-5 flex items-center gap-1.5 text-sm text-text-muted">
      <span>Already have an account?</span>
      <Link href={ROUTES.LOGIN} className="text-link-blue hover:underline">
        Sign In!
      </Link>
    </p>
  );

  if (step === 1) {
    return (
      <div className="flex flex-col">
        <div className="mb-5">
          <h1 className="mb-2 text-[20px] font-bold leading-[142.5%] text-text-primary">
            Continue with your ED visit.
          </h1>
          <p className="text-sm font-normal leading-[175%] text-[#262a32]">
            Next, you&apos;ll provide some basic information about yourself, your lifestyle,
            and your medical history. Your doctor will use information to evaluate your
            symptoms and, if appropriate, prescribe medication for treatment.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-1.5">
          <label htmlFor="signup-email" className="text-xs font-normal text-text-muted">
            Email
          </label>
          <div className="relative">
            <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-[21px] text-text-muted" />
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={`${fieldClass} pl-10 pr-3`}
              {...register("email", { onChange: () => setEmailCheckError(null) })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-text-error">{errors.email.message}</p>
          )}
          {emailCheckError === "email_taken" && (
            <p className="text-sm text-text-error">
              This email has an existing account, to sign in click{" "}
              <Link
                href={`${ROUTES.LOGIN}?email=${encodeURIComponent(getValues("email"))}`}
                className="font-semibold underline"
              >
                HERE
              </Link>
            </p>
          )}
          {emailCheckError === "unknown" && (
            <p className="text-sm text-text-error">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="coral"
          size="lg"
          fullWidth
          loading={isCheckingEmail}
          onClick={handleContinue}
          className="mb-6"
        >
          Continue
        </Button>

        {alreadyHaveAccount}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-5 text-[20px] font-bold leading-[142.5%] text-text-primary">
        Continue with your ED visit.
      </h1>

      <form onSubmit={handleSubmit(signup)} className="flex flex-col">
        <div className="mb-4 flex flex-col gap-1">
          <div className="relative">
            <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              placeholder="First name"
              autoComplete="given-name"
              onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
              className={`${fieldClass} pl-10 pr-3`}
              {...register("firstName")}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-text-error">{errors.firstName.message}</p>
          )}
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <div className="relative">
            <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              placeholder="Last name"
              autoComplete="family-name"
              onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
              className={`${fieldClass} pl-10 pr-3`}
              {...register("lastName")}
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-text-error">{errors.lastName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="relative">
            <PasswordIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              className={`${fieldClass} pl-10 pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-text-error">{errors.password.message}</p>
          )}
        </div>

        <ul className="my-8 flex flex-col gap-2">
          {passwordChecks.map(({ label, test }) => {
            const passed = test(passwordValue);
            return (
              <li key={label} className="flex items-start gap-2 text-sm text-text-primary">
                <FaCheckCircle size={16} className={`mt-0.5 shrink-0 transition-colors ${passed ? "text-primary" : "text-gray-300"}`} />
                {label}
              </li>
            );
          })}
        </ul>

        <p className="mb-2 text-xs text-text-muted">
          By Continuing, you agree to our{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="cursor-pointer text-text-link hover:underline"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="cursor-pointer text-text-link hover:underline"
          >
            Privacy Policy
          </button>
        </p>

        {signupError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-text-error">
            {signupError}
          </p>
        )}

        <Button
          type="submit"
          variant="coral"
          size="lg"
          loading={isPending}
          disabled={!isStep2Valid}
          fullWidth
          className="my-2 border border-coral disabled:cursor-not-allowed disabled:border-[#a8a8ae] disabled:bg-[#a8a8ae] disabled:opacity-100 disabled:hover:bg-[#a8a8ae]"
        >
          Create Account
        </Button>

        {alreadyHaveAccount}
      </form>

      <TermsOfUseDrawer
        show={showTerms}
        onClose={() => setShowTerms(false)}
        onOpenPrivacyPolicy={() => setShowPrivacy(true)}
      />
      <PrivacyPolicyDrawer show={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};
