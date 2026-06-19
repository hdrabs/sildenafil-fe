"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
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

// "Text a code" — phone-vibrate glyph (multi-color, rendered as-is).
const TextCodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24" fill="none" aria-hidden="true" className={className}>
    <path d="M9.89 2.93a3.5 3.5 0 00-3.5 3.5v11a3.5 3.5 0 003.5 3.5h5a3.5 3.5 0 003.5-3.5v-11a3.5 3.5 0 00-3.5-3.5h-5zm0 2h5a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5v-11a1.5 1.5 0 011.5-1.5zM4.236 7.992a1.015 1.015 0 00-1.282.625 9.972 9.972 0 00-.562 3.313c0 1.15.186 2.28.562 3.344a.998.998 0 001.282.593c.52-.184.809-.73.625-1.25a8.087 8.087 0 01-.47-2.687c0-.916.142-1.812.439-2.657.183-.52-.073-1.098-.594-1.28zm16.344.063a.98.98 0 00-.626 1.25 8.022 8.022 0 01-.031 5.312c-.185.52.105 1.096.625 1.281.52.186 1.096-.104 1.282-.624a9.916 9.916 0 00.562-3.344c0-1.126-.202-2.238-.562-3.282a.964.964 0 00-1.25-.593zm-8.19 7.875a1 1 0 100 2 1 1 0 000-2z" fill="#777" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.953 8.618a1.015 1.015 0 011.282-.625c.52.183.777.76.594 1.281a7.988 7.988 0 00-.438 2.656c0 .923.168 1.838.469 2.688.184.52-.105 1.066-.625 1.25a.998.998 0 01-1.282-.594 10.02 10.02 0 01-.562-3.344c0-1.141.19-2.256.562-3.312zm17 .687c-.18-.522.104-1.069.626-1.25a.964.964 0 011.25.594c.36 1.044.562 2.156.562 3.281a9.916 9.916 0 01-.562 3.344c-.186.52-.761.81-1.282.625-.52-.185-.81-.76-.625-1.281a8.007 8.007 0 00.03-5.313z" fill="#EC534B" />
  </svg>
);

// "Email a code" — envelope glyph with its own circular backdrop.
const EmailCodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 38" fill="none" aria-hidden="true" className={className}>
    <circle cx="19.688" cy="19" r="19" fill="#EFF8FC" />
    <path d="M12.688 11a4 4 0 00-4 4v8a4 4 0 004 4h12a4 4 0 004-4v-8a4 4 0 00-4-4h-12zm0 2h12c1.008 0 1.84.74 1.979 1.71-.959.893-2.383 1.989-3.324 2.665C21.178 18.93 19.273 20 18.688 20c-.586 0-2.491-1.069-4.656-2.625a41.492 41.492 0 01-2.563-2 12.543 12.543 0 01-.688-.625c.138-.97.899-1.75 1.906-1.75zm-1.99 4.354c2.537 2.053 6.256 4.634 7.99 4.646 1.129.008 3.06-1.07 5.03-2.431 1.018-.705 2.152-1.542 2.97-2.229V23a2 2 0 01-2 2h-12a2 2 0 01-2-2l.01-5.646z" fill="#777" />
    <circle cx="27.172" cy="12.5" r="3.5" fill="#EC534B" />
  </svg>
);

// Right chevron for the option rows (uses currentColor so it stays visible —
// the source SVG's #fff fill would be invisible on the white tab).
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 18" fill="none" aria-hidden="true" className={className}>
    <path d="M9.006 8.848a1.64 1.64 0 00-.38-.904L2.861 1.11A1.607 1.607 0 001.764.509 1.577 1.577 0 00.573.893a1.623 1.623 0 00-.57 1.139 1.651 1.651 0 00.416 1.197l4.873 5.772L.42 14.776a1.632 1.632 0 00-.416 1.197A1.647 1.647 0 00.56 17.11a1.594 1.594 0 001.191.384 1.584 1.584 0 001.098-.602l5.763-6.833a1.634 1.634 0 00.394-1.21z" fill="currentColor" />
  </svg>
);

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
