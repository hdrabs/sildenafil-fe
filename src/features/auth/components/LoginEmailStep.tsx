"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RiMailLine, RiPhoneLine } from "react-icons/ri";
import { emailStepSchema, EmailStepValues } from "../schemas/loginSchema";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

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

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your email address to sign in to your account
        </p>
      </div>

      <form
        onSubmit={handleSubmit((v) => onNext(v.email))}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <div className="relative">
            <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-lg border border-border-input bg-bg-card pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-text-error">{errors.email.message}</p>
          )}
        </div>

        <p className="text-xs text-text-muted">
          By Continuing, you agree to our{" "}
          <Link href="/terms-of-use" className="text-primary underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-primary underline">
            Privacy Policy
          </Link>
        </p>

        <Button variant="coral" size="lg" type="submit" fullWidth>
          Continue
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs text-text-muted">Or</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      <Button variant="outline-dark" size="lg" type="button" fullWidth onClick={onSwitchToPhone}>
        <RiPhoneLine className="h-4 w-4" />
        Sign in with my phone number
      </Button>

      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.SIGNUP} className="text-primary hover:underline">
          Sign up!
        </Link>
      </p>
    </div>
  );
};
