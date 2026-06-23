"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
import { TextCodeIcon } from "@/components/icons/TextCodeIcon";
import { EmailCodeIcon } from "@/components/icons/EmailCodeIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
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

  const optionClass =
    "flex items-center justify-between rounded-xl border border-[#e3eaf5] bg-bg-card px-4 py-3 transition-colors hover:bg-bg-input";

  return (
    <div className="flex flex-col">
      <div className="mb-5">
        <h1 className="mb-2 text-[20px] font-bold leading-[142.5%] text-text-primary">
          Let&apos;s make sure you are you
        </h1>
        <p className="text-sm font-normal text-[#262a32]">
          Choose how you want to verify your identity
        </p>
      </div>

      <form onSubmit={handleSubmit((v) => onSubmit(v.password))} className="flex flex-col">
        <div className="mb-4 flex flex-col gap-1">
          <div className="relative">
            <PasswordIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border-input bg-bg-card py-4 pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm font-semibold text-text-error">{errors.password.message}</p>
          )}
          {apiError && !errors.password && (
            <p className="text-sm font-semibold text-text-error">{apiError}</p>
          )}
        </div>

        <p className="text-sm text-[#262a32]">
          Forgot your password?{" "}
          <Link href={ROUTES.FORGOT_PASSWORD} className="text-link-blue hover:underline">
            Reset it
          </Link>
        </p>

        <Button variant="coral" size="lg" type="submit" fullWidth loading={isPending} className="my-6">
          Continue
        </Button>
      </form>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border-default" />
        <span className="text-base font-semibold text-text-muted">Or</span>
        <div className="h-px flex-1 bg-border-default" />
      </div>

      <p className="mb-5 text-sm text-text-primary">
        Sign in without your password. Select an option below:
      </p>

      <div className="mb-6 flex flex-col gap-4">
        {/* Phone option — only shown if user has a phone on file */}
        {hints?.phone && (
          <button type="button" onClick={() => onSendPhoneOtp(hints.phone!)} className={optionClass}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff8fc]">
                <TextCodeIcon className="h-6 w-6" />
              </span>
              <div className="pointer-events-none text-left">
                <p className="text-sm text-[#777]">Text a code</p>
                <p className="text-sm font-semibold text-[#262a32]">{hints.phone}</p>
              </div>
            </div>
            <ChevronRightIcon className="h-6 w-[9px] shrink-0 text-[#777]" />
          </button>
        )}

        {/* Email option — always shown */}
        <button type="button" onClick={() => onSendEmailOtp(email)} className={optionClass}>
          <div className="flex items-center gap-3">
            <EmailCodeIcon className="h-10 w-10 shrink-0" />
            <div className="pointer-events-none text-left">
              <p className="text-sm text-[#777]">Email a code</p>
              <p className="text-sm font-semibold text-[#262a32]">{email}</p>
            </div>
          </div>
          <ChevronRightIcon className="h-6 w-[9px] shrink-0 text-[#777]" />
        </button>
      </div>

      <p className="text-center text-sm text-text-primary">
        Having Trouble Signing In? Call{" "}
        <a href="tel:8447453362" className="font-medium text-link-blue hover:underline">
          (844) 745-3362
        </a>
      </p>
    </div>
  );
};
