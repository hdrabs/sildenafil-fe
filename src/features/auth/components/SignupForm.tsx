"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { MdMailOutline } from "react-icons/md";
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiCircle } from "react-icons/fi";
import { signupSchema, SignupFormValues } from "../schemas/signupSchema";
import { useSignupUser } from "../hooks/useSignupUser";
import { authService } from "@/api/services/authService";
import { APIError } from "@/api/baseAPI";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

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

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch("password") ?? "";

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
    <p className="text-center text-sm text-text-muted">
      Already have an account?{" "}
      <Link href={ROUTES.LOGIN} className="font-semibold text-text-link hover:underline">
        Sign In!
      </Link>
    </p>
  );

  if (step === 1) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Continue with your ED visit.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Next, you&apos;ll provide some basic information about yourself, your lifestyle,
            and your medical history. Your doctor will use information to evaluate your
            symptoms and, if appropriate, prescribe medication for treatment.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            startAdornment={<MdMailOutline size={18} />}
            error={errors.email?.message}
            {...register("email", { onChange: () => setEmailCheckError(null) })}
          />

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

          <Button
            type="button"
            variant="coral"
            size="lg"
            fullWidth
            loading={isCheckingEmail}
            onClick={handleContinue}
          >
            Continue
          </Button>

          {alreadyHaveAccount}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary">
        Continue with your ED visit.
      </h1>

      <form onSubmit={handleSubmit(signup)} className="flex flex-col gap-4">
        <Input
          placeholder="First name"
          autoComplete="given-name"
          startAdornment={<FiUser size={16} />}
          error={errors.firstName?.message}
          onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
          {...register("firstName")}
        />
        <Input
          placeholder="Last name"
          autoComplete="family-name"
          startAdornment={<FiUser size={16} />}
          error={errors.lastName?.message}
          onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
          {...register("lastName")}
        />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          autoComplete="new-password"
          startAdornment={<FiLock size={16} />}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="text-text-muted hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        <ul className="flex flex-col gap-1.5">
          {passwordChecks.map(({ label, test }) => {
            const passed = test(passwordValue);
            return (
              <li key={label} className={`flex items-start gap-2 text-sm transition-colors ${passed ? "text-green-600" : "text-text-muted"}`}>
                {passed
                  ? <FiCheckCircle size={14} className="mt-0.5 shrink-0 text-green-600" />
                  : <FiCircle size={14} className="mt-0.5 shrink-0" />
                }
                {label}
              </li>
            );
          })}
        </ul>

        <p className="text-sm text-text-muted">
          By Continuing, you agree to our{" "}
          <Link href="/terms" className="text-text-link hover:underline">
            Terms
          </Link>{" "}
          and Privacy{" "}
          <Link href="/privacy" className="text-text-link hover:underline">
            Policy.
          </Link>
        </p>

        {signupError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-text-error">
            {signupError}
          </p>
        )}

        <Button type="submit" variant="dark" size="lg" loading={isPending} fullWidth>
          Create Account
        </Button>

        {alreadyHaveAccount}
      </form>
    </div>
  );
};
