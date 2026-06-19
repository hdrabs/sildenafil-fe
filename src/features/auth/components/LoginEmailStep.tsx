"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { emailStepSchema, EmailStepValues } from "../schemas/loginSchema";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { TermsOfUseDrawer } from "@/components/legal/TermsOfUseDrawer";
import { PrivacyPolicyDrawer } from "@/components/legal/PrivacyPolicyDrawer";

interface LoginEmailStepProps {
  onNext: (email: string) => void;
  onSwitchToPhone?: () => void;
  defaultEmail?: string;
}

export const LoginEmailStep = ({ onNext, onSwitchToPhone, defaultEmail }: LoginEmailStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: { email: defaultEmail ?? "" },
  });

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="mb-5">
        <h1 className="mb-2 text-[20px] font-bold leading-[142.5%] text-text-primary">
          Welcome back
        </h1>
        <p className="text-sm font-normal text-[#262a32]">
          Enter your email address to sign in to your account
        </p>
      </div>

      <form
        onSubmit={handleSubmit((v) => onNext(v.email))}
        className="flex flex-col"
      >
        <div className="mb-4 flex flex-col gap-1">
          <div className="relative">
            <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-[21px] text-text-muted" />
            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-border-input bg-bg-card py-4 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-text-error">{errors.email.message}</p>
          )}
        </div>

        <p className="text-sm font-normal leading-[175%] text-[#777]">
          By Continuing, you agree to our{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="cursor-pointer font-normal text-link-blue hover:underline"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            className="cursor-pointer font-normal text-link-blue hover:underline"
          >
            Privacy Policy
          </button>
        </p>

        <Button variant="coral" size="lg" type="submit" fullWidth className="my-6">
          Continue
        </Button>
      </form>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-base font-semibold text-text-muted">Or</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      <Button
        variant="outline-dark"
        size="lg"
        type="button"
        fullWidth
        className="mb-6 uppercase"
        onClick={onSwitchToPhone}
      >
        Sign in with my phone number
      </Button>

      <p className="flex items-center gap-1.5 text-sm text-[#262a32]">
        <span>Don&apos;t have an account?</span>
        <Link href={ROUTES.SIGNUP} className="text-link-blue hover:underline">
          Sign up!
        </Link>
      </p>

      <TermsOfUseDrawer
        show={showTerms}
        onClose={() => setShowTerms(false)}
        onOpenPrivacyPolicy={() => setShowPrivacy(true)}
      />
      <PrivacyPolicyDrawer show={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};
