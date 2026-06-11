"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { RiCloseLine, RiSmartphoneLine } from "react-icons/ri";
import { Button } from "@/components/ui/Button";
import { authService } from "@/api/services/authService";
import { APIError } from "@/api/baseAPI";

interface OtpModalProps {
  phone: string;
  isPending: boolean;
  onSubmit: (code: string) => void;
  onClose: () => void;
  onSwitchToEmail: () => void;
}

const OTP_LENGTH = 4;

export const OtpModal = ({ phone, isPending, onSubmit, onClose, onSwitchToEmail }: OtpModalProps) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "rate_limited">("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    setError(null);
    if (digit && i < OTP_LENGTH - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) focusAt(i - 1);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((d, idx) => { next[idx] = d; });
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = () => {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter all 4 digits.");
      return;
    }
    onSubmit(code);
  };

  const handleResend = async () => {
    setResendStatus("sending");
    setError(null);
    try {
      await authService.sendPhoneOtp(phone);
    } catch (err) {
      // Only surface rate-limit errors; hide everything else (incl. "no account found")
      if ((err as APIError)?.status === 429) {
        setResendStatus("rate_limited");
        return;
      }
    }
    setResendStatus("sent");
    setTimeout(() => setResendStatus("idle"), 30000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Please check your phone</h2>
            <p className="mt-1 text-sm text-text-muted">
              Please enter the 4 digit code we texted to{" "}
              <span className="font-bold text-text-primary">{phone}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-bg-input transition-colors"
          >
            <RiCloseLine className="h-5 w-5 text-text-primary" />
          </button>
        </div>

        {/* Phone illustration */}
        <div className="my-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <RiSmartphoneLine className="h-12 w-12 text-primary" />
          </div>
        </div>

        {/* OTP boxes */}
        <div className="flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              autoFocus={i === 0}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="h-16 w-16 rounded-xl border-2 border-border-input bg-bg-card text-center text-2xl font-bold text-text-primary focus:border-primary focus:outline-none transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="mt-3 text-center text-sm text-text-error">{error}</p>
        )}

        {/* Resend / change row */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={resendStatus === "sending" || resendStatus === "rate_limited"}
            onClick={handleResend}
            className="text-text-link underline hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {resendStatus === "sending" ? "Sending…" : "Send new code"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-text-link underline hover:opacity-80 transition-opacity"
          >
            Change phone number
          </button>
        </div>

        {/* Code sent success message */}
        {resendStatus === "sent" && (
          <p className="mt-3 text-center text-sm font-medium text-green-600">
            Your new code has been successfully sent to your provided phone number.
          </p>
        )}

        {/* Rate-limited — alternative method */}
        {resendStatus === "rate_limited" && (
          <div className="mt-4 rounded-xl border border-border-default bg-bg-main p-4 text-center">
            <p className="text-sm text-text-muted">
              We&apos;re sorry you&apos;re having trouble verifying your number.
              <br />
              Let&apos;s have you try logging in using an alternative method.
            </p>
            <Button
              variant="outline-dark"
              size="lg"
              fullWidth
              onClick={onSwitchToEmail}
              className="mt-3"
            >
              Continue
            </Button>
            <p className="mt-3 text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign Up!
              </a>
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          variant="dark"
          size="lg"
          fullWidth
          loading={isPending}
          onClick={handleSubmit}
          className="mt-5"
        >
          Submit
        </Button>

        {/* Support */}
        <p className="mt-4 text-center text-sm text-text-muted">
          Having Trouble Signing In? Call{" "}
          <a href="tel:8447453362" className="text-primary font-medium hover:underline">
            (844) 745-3362
          </a>
        </p>
      </div>
    </div>
  );
};
