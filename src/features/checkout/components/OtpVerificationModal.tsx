"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { useGenerateOtp, useVerifyOtp } from "@/api/hooks/useAuthQueries";
import { APIError } from "@/api/baseAPI";

type Props = {
  show: boolean;
  phone: string;
  initialLimitExceeded?: boolean;
  onVerified: () => Promise<void>;
  onSkip: () => Promise<void>;
  onClose: () => void;
};

const MAX_RESENDS = 3;

export const OtpVerificationModal = ({
  show,
  phone,
  initialLimitExceeded = false,
  onVerified,
  onSkip,
  onClose,
}: Props) => {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [newCodeSent, setNewCodeSent] = useState(false);
  const [sendCodeCount, setSendCodeCount] = useState(0);
  const [limitExceeded, setLimitExceeded] = useState(initialLimitExceeded);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutateAsync: generateOtp, isPending: isSending } = useGenerateOtp();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const code = digits.join("");
  const isComplete = code.length === 4;

  const focusInput = (index: number) => inputRefs.current[index]?.focus();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);
    if (digit && index < 3) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    focusInput(Math.min(pasted.length, 3));
  };

  const handleSendNewCode = async () => {
    if (limitExceeded || isSending) return;
    setNewCodeSent(false);
    try {
      await generateOtp();
      const newCount = sendCodeCount + 1;
      setSendCodeCount(newCount);
      setDigits(["", "", "", ""]);
      setError(null);
      setNewCodeSent(true);
      setTimeout(() => setNewCodeSent(false), 6000);
      if (newCount >= MAX_RESENDS) setLimitExceeded(true);
    } catch (e) {
      if (e instanceof APIError && e.status === 429) {
        setLimitExceeded(true);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isComplete || isVerifying) return;
    setError(null);
    try {
      await verifyOtp(code);
      await onVerified();
    } catch (e) {
      setError(
        e instanceof APIError ? e.message : "The code you entered is invalid",
      );
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center px-4" onClick={onClose}>
        <div className="w-full max-w-md cursor-default rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Let&apos;s make sure it&apos;s really you!
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Please enter the 4 digit code we texted to <strong>{phone}</strong>
          </p>

          {/* 4-digit inputs */}
          <div className="mb-2 flex gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`h-16 w-full rounded-xl border-2 text-center text-2xl font-bold text-gray-900 outline-none transition-colors focus:border-[#e05c4b] ${
                  error ? "border-[#e05c4b]" : "border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Inline error */}
          {error && (
            <p className="mb-4 text-sm font-medium text-[#e05c4b]">{error}</p>
          )}

          {/* New code sent success */}
          {newCodeSent && !error && (
            <p className="mb-4 text-center text-sm font-medium text-green-600">
              Your new code has been successfully sent to your provided phone number.
            </p>
          )}

          {/* Send new code / Change phone number */}
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSendNewCode}
              disabled={limitExceeded || isSending}
              className={`text-sm underline transition-colors ${
                limitExceeded || isSending
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer text-gray-700 hover:text-gray-900"
              }`}
            >
              {isSending ? "Sending…" : "Send new code"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-sm text-gray-700 underline hover:text-gray-900"
            >
              Change phone number
            </button>
          </div>

          {/* Limit exceeded — "Continue with visit" */}
          {limitExceeded && (
            <div className="mb-5 rounded-xl bg-gray-100 p-5">
              <p className="mb-4 text-sm leading-relaxed text-gray-700">
                We&apos;re sorry you&apos;re having trouble verifying your number.
                Let&apos;s continue with your visit for now, but later on we&apos;ll need
                you to upload a government-issued ID
              </p>
              <button
                type="button"
                onClick={onSkip}
                className="w-full cursor-pointer rounded-full border-2 border-gray-300 py-3 text-sm font-bold uppercase tracking-widest text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
              >
                Continue with visit
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete || isVerifying}
            className={`w-full rounded-full py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors ${
              isComplete && !isVerifying
                ? "cursor-pointer bg-[#e05c4b] hover:bg-[#c94f3e]"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Please wait…
              </span>
            ) : (
              "Submit"
            )}
          </button>

          {/* Support */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Website Support:{" "}
            <a
              href="tel:8447453362"
              className="cursor-pointer text-blue-600 hover:underline"
            >
              (844) 745-3362
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
