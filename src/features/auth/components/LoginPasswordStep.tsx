"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  RiLockLine, RiEyeLine, RiEyeOffLine,
  RiMailLine, RiSmartphoneLine, RiArrowRightSLine,
} from "react-icons/ri";
import { passwordStepSchema, PasswordStepValues } from "../schemas/loginSchema";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

interface LoginHints {
  email: string;
  phone: string | null;
}

interface LoginPasswordStepProps {
  email: string;
  hints: LoginHints | null;
  onSubmit: (password: string) => void;
  isPending: boolean;
  apiError?: string | null;
  onSendPhoneOtp: (phone: string) => void | Promise<void>;
  onSendEmailOtp: (email: string) => void | Promise<void>;
}

export const LoginPasswordStep = ({
  email,
  hints,
  onSubmit,
  isPending,
  apiError,
  onSendPhoneOtp,
  onSendEmailOtp,
}: LoginPasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordStepValues>({
    resolver: zodResolver(passwordStepSchema),
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-text-primary">
          Let&apos;s make sure you are you
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Choose how you want to verify your identity
        </p>
      </div>

      <form
        onSubmit={handleSubmit((v) => onSubmit(v.password))}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="relative">
            <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-border-input bg-bg-card pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <RiEyeOffLine className="h-5 w-5" /> : <RiEyeLine className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-text-error">{errors.password.message}</p>
          )}
          {apiError && !errors.password && (
            <p className="text-xs text-text-error">{apiError}</p>
          )}
        </div>

        <p className="text-sm text-text-muted">
          Forgot your password?{" "}
          <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
            Reset it
          </Link>
        </p>

        <Button variant="coral" size="lg" type="submit" fullWidth loading={isPending}>
          Continue
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs text-text-muted">Or</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      <p className="text-sm text-text-muted">
        Sign in without your password. Select an option below:
      </p>

      <div className="flex flex-col gap-2">
        {/* Phone option — only shown if user has a phone on file */}
        {hints?.phone && (
          <button
            type="button"
            onClick={() => onSendPhoneOtp(hints.phone!)}
            className="flex items-center justify-between rounded-lg border border-border-input bg-bg-card px-4 py-3 text-sm text-text-primary hover:bg-bg-input transition-colors"
          >
            <div className="flex items-center gap-3">
              <RiSmartphoneLine className="h-5 w-5 text-text-muted" />
              <div className="text-left">
                <p className="text-xs text-text-muted">Text a code</p>
                <p className="font-medium">{hints.phone}</p>
              </div>
            </div>
            <RiArrowRightSLine className="h-5 w-5 text-text-muted" />
          </button>
        )}

        {/* Email option — always shown */}
        <button
          type="button"
          onClick={() => onSendEmailOtp(email)}
          className="flex items-center justify-between rounded-lg border border-border-input bg-bg-card px-4 py-3 text-sm text-text-primary hover:bg-bg-input transition-colors"
        >
          <div className="flex items-center gap-3">
            <RiMailLine className="h-5 w-5 text-text-muted" />
            <div className="text-left">
              <p className="text-xs text-text-muted">Email a code</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
          <RiArrowRightSLine className="h-5 w-5 text-text-muted" />
        </button>
      </div>

      <p className="text-center text-sm text-text-muted">
        Having Trouble Signing In? Call{" "}
        <Link href="tel:8447453362" className="text-primary hover:underline">
          (844) 745-3362
        </Link>
      </p>
    </div>
  );
};
