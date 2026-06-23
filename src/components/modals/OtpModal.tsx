"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";
import { APIError } from "@/api/baseAPI";
import { ROUTES } from "@/constants/routes";
import { OtpPhoneIllustration } from "@/components/illustrations/OtpPhoneIllustration";
import { OtpEmailIllustration } from "@/components/illustrations/OtpEmailIllustration";

const OTP_LENGTH = 4;
const MAX_RESENDS = 3;

const DEFAULT_ALTERNATIVE_TEXT =
  "We're sorry you're having trouble verifying your number. Let's have you try logging in using an alternative method.";

interface OtpModalProps {
  /** When provided and false, the modal does not render. */
  show?: boolean;
  phone: string;
  /** Delivery channel — switches the copy + illustration (SMS vs email). */
  channel?: "phone" | "email";
  /** Verify the code. Throw / reject to surface an inline error. */
  onSubmit: (code: string) => Promise<void> | void;
  /** Resend a new code. */
  onResend: () => Promise<void>;
  /** Close / change phone number. */
  onClose: () => void;
  /** "Continue" action in the alternative-method box (after attempts are exhausted). */
  onAlternative: () => void;
  /** Pre-exhaust the resend attempts (e.g. backend already reported a limit). */
  initiallyExhausted?: boolean;
  alternativeText?: string;
  alternativeButtonLabel?: string;
  showSignUpPrompt?: boolean;
}

export const OtpModal = ({
  show = true,
  phone,
  channel = "phone",
  onSubmit,
  onResend,
  onClose,
  onAlternative,
  initiallyExhausted = false,
  alternativeText = DEFAULT_ALTERNATIVE_TEXT,
  alternativeButtonLabel = "Continue",
  showSignUpPrompt = true,
}: OtpModalProps) => {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [newCodeSent, setNewCodeSent] = useState(false);
  const [resendCount, setResendCount] = useState(initiallyExhausted ? MAX_RESENDS : 0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH;
  const exhausted = resendCount >= MAX_RESENDS;

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

  const handleResend = async () => {
    if (exhausted || isResending) return;
    setNewCodeSent(false);
    setIsResending(true);
    try {
      await onResend();
      const count = resendCount + 1;
      setResendCount(count);
      setDigits(Array(OTP_LENGTH).fill(""));
      setError(null);
      // Once attempts run out we swap to the alternative-method box instead of
      // the success message.
      if (count < MAX_RESENDS) setNewCodeSent(true);
    } catch (err) {
      if (err instanceof APIError && err.status === 429) setResendCount(MAX_RESENDS);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      setError("Please enter all 4 digits.");
      return;
    }
    setError(null);
    setIsVerifying(true);
    try {
      await onSubmit(code);
    } catch (err) {
      setError(err instanceof APIError ? err.message : "The code you entered is invalid.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[500px] rounded-lg bg-white p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              {channel === "email" ? "Please check your email" : "Please check your phone"}
            </h2>
            <p className="mt-1 text-sm font-normal text-text-primary">
              Please enter the 4 digit code we {channel === "email" ? "emailed" : "texted"} to{" "}
              <span className="font-bold">{phone}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-2 ml-4 flex shrink-0 items-center justify-center rounded-full p-1.5 text-text-primary hover:bg-bg-input transition-colors"
          >
            <CloseIcon className="h-7 w-7 shrink-0" />
          </button>
        </div>

        {/* Illustration */}
        <div className="mt-7 flex justify-center">
          <div className="relative mb-6 flex h-[119.5px] w-[119.5px] items-center justify-center rounded-full bg-[#e8f4f8]">
            {channel === "email" ? <OtpEmailIllustration /> : <OtpPhoneIllustration />}
          </div>
        </div>

        {/* OTP boxes */}
        <div className="grid grid-cols-4 gap-[25px]">
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
              className="h-[72px] w-full rounded-xl border border-[#ced5e1] bg-bg-card text-center text-2xl font-bold text-text-primary transition-colors focus:border-primary focus:outline-none"
            />
          ))}
        </div>

        {error && <p className="mt-3 text-center text-sm text-text-error">{error}</p>}

        {/* Resend / change row */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={exhausted || isResending}
            onClick={handleResend}
            className="text-sm font-normal text-text-primary underline transition-colors hover:opacity-80 disabled:text-text-muted"
          >
            {isResending ? "Sending…" : "Send new code"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-normal text-text-primary underline transition-colors hover:opacity-80"
          >
            {channel === "email" ? "Change email" : "Change phone number"}
          </button>
        </div>

        {/* New-code success message */}
        {newCodeSent && !exhausted && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">
            Your new code has been successfully sent to your provided phone number.
          </p>
        )}

        {/* Submit */}
        <Button
          variant="coral"
          size="lg"
          fullWidth
          loading={isVerifying}
          disabled={!isComplete}
          onClick={handleSubmit}
          className="mt-5 font-normal disabled:cursor-not-allowed disabled:bg-[#6b7685] disabled:opacity-100"
        >
          Submit
        </Button>

        {/* Alternative method (after attempts exhausted) */}
        {exhausted && (
          <div className="mb-6 mt-6 flex flex-col rounded-lg bg-[#f7f7f7] p-3">
            <p className="text-sm leading-relaxed text-text-primary">{alternativeText}</p>
            <Button
              variant="outline-dark"
              size="lg"
              fullWidth
              onClick={onAlternative}
              className="mt-4 border-black bg-white text-sm font-normal text-black hover:bg-white hover:text-black"
            >
              {alternativeButtonLabel}
            </Button>
            {showSignUpPrompt && (
              <p className="mt-4 text-center text-sm text-text-primary">
                Don&apos;t have an account?{" "}
                <Link href={ROUTES.SIGNUP} className="text-link-blue hover:underline">
                  Sign Up!
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Support */}
        <p className="mt-4 text-center text-base text-text-primary">
          Having Trouble Signing In? Call{" "}
          <a href="tel:8447453362" className="font-medium text-link-blue hover:underline">
            (844) 745-3362
          </a>
        </p>
      </div>
    </div>
  );
};
