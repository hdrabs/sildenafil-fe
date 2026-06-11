"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { RiSmartphoneLine, RiMailLine } from "react-icons/ri";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

const US_PHONE_RE = /^\(\d{3}\) \d{3}-\d{4}$/;

const formatUSPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

interface LoginPhoneStepProps {
  onNext: (phone: string) => void;
  onSwitchToEmail: () => void;
}

export const LoginPhoneStep = ({ onNext, onSwitchToEmail }: LoginPhoneStepProps) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatUSPhone(e.target.value));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!US_PHONE_RE.test(phone)) {
      setError("Enter a valid US phone number, e.g. (212) 354-6357");
      return;
    }
    onNext(phone);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-text-muted">
          Enter your phone number to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <RiSmartphoneLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="tel"
              autoComplete="tel"
              placeholder="Mobile phone number"
              maxLength={14}
              value={phone}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-border-input bg-bg-card pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {error && <p className="text-xs text-text-error">{error}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-text-primary">
            Your mobile number must be able to receive text messages.
          </p>
          <p className="text-sm text-text-muted">
            By Continuing, you agree to our{" "}
            <Link href="/terms-of-use" className="text-primary underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <Button variant="coral" size="lg" type="submit" fullWidth>
          Continue
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs text-text-muted">Or</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      <Button variant="outline-dark" size="lg" type="button" fullWidth onClick={onSwitchToEmail}>
        <RiMailLine className="h-4 w-4" />
        Sign in with my email
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
