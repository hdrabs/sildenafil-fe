"use client";

import { useState } from "react";
import Link from "next/link";
import { RiSmartphoneLine } from "react-icons/ri";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { TermsOfUseDrawer } from "@/components/legal/TermsOfUseDrawer";
import { PrivacyPolicyDrawer } from "@/components/legal/PrivacyPolicyDrawer";

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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

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
    <div className="flex flex-col">
      <div className="mb-5">
        <h1 className="mb-2 text-[20px] font-bold leading-[142.5%] text-text-primary">
          Welcome back
        </h1>
        <p className="text-sm font-normal text-[#262a32]">
          Enter your phone number to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4 flex flex-col gap-1">
          <div className="relative">
            <RiSmartphoneLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="tel"
              autoComplete="tel"
              placeholder="Mobile phone number"
              maxLength={14}
              value={phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-border-input bg-bg-card py-4 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {error && <p className="text-xs text-text-error">{error}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-primary">
            Your mobile number must be able to receive text messages.
          </p>
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
        </div>

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
        onClick={onSwitchToEmail}
      >
        Sign in with my email
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
