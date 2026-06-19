"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";
import { APIError } from "@/api/baseAPI";
import { ROUTES } from "@/constants/routes";

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

const OtpPhoneIllustration = () => (
  <svg width="57" height="66" viewBox="0 0 57 66" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20.62" cy="32.855" r="6.089" fill="#2BB673" />
    <path d="M36.872 56.743a5.418 5.418 0 01-5.411 5.412H9.844a5.418 5.418 0 01-5.412-5.412V9.895a5.418 5.418 0 015.412-5.412h21.624a5.418 5.418 0 015.412 5.412v46.848h-.008zM31.461.883H9.844C4.874.883.832 4.925.832 9.895v46.848c0 4.963 4.042 9.012 9.012 9.012h21.624c4.963 0 9.012-4.041 9.012-9.012V9.895c0-4.97-4.041-9.012-9.012-9.012h-.007z" fill="#8090AE" />
    <path d="M24.255 56.743c0 4.803-7.208 4.803-7.208 0s7.208-4.803 7.208 0z" fill="#8090AE" />
    <path d="M24.254 6.29h-7.208a1.803 1.803 0 100 3.607h7.208a1.803 1.803 0 100-3.608z" fill="#8090AE" />
    <path fillRule="evenodd" clipRule="evenodd" d="M25.174 30.822a.619.619 0 00.046-.883.619.619 0 00-.883-.046l-3.76 3.388-1.675-1.508a.625.625 0 00-.837.93l2.093 1.88a.628.628 0 00.837 0l4.179-3.76zm-12.338-4.856a1.88 1.88 0 011.88-1.88h13.8a1.88 1.88 0 011.88 1.88v7.117c0 1.202-.016 2.626-.648 3.851-.555 1.089-1.43 2.07-2.686 3.174-1.249 1.096-2.916 2.344-5.077 3.935a.64.64 0 01-.746 0c-2.17-1.598-3.829-2.839-5.077-3.935-1.248-1.096-2.131-2.085-2.687-3.174-.624-1.225-.647-2.641-.647-3.851v-7.117h.008z" fill="#BFD9E4" />
    <rect x="26.711" y="41.227" width="29.685" height="13.701" rx="4" fill="#fff" />
    <path fillRule="evenodd" clipRule="evenodd" d="M51.928 48.537l-.594.944-1.126-.83.099 1.446h-1.12l.115-1.446-1.119.83-.601-.944 1.34-.586-1.34-.586.601-.96 1.119.815-.114-1.43h1.119l-.1 1.43 1.127-.814.594.959-1.325.586 1.325.586zm-5.184 0l-.586.944-1.134-.83.1 1.446h-1.12l.114-1.446-1.118.83-.602-.944 1.34-.586-1.34-.586.602-.96 1.118.815-.114-1.43h1.12l-.1 1.43 1.134-.814.586.959-1.324.586 1.324.586zm-5.175 0l-.587.944-1.134-.83.1 1.446h-1.12l.115-1.446-1.12.83-.6-.944 1.34-.586-1.34-.586.6-.96 1.12.815-.114-1.43h1.118l-.099 1.43 1.135-.814.586.959-1.325.586 1.325.586zm-5.184 0l-.586.944-1.134-.83.099 1.446h-1.119l.114-1.446-1.134.83-.586-.944 1.34-.586-1.34-.586.586-.96 1.134.815-.114-1.43h1.119l-.099 1.43 1.134-.814.586.959-1.324.586 1.324.586z" fill="#8090AE" />
  </svg>
);

const OtpEmailIllustration = () => (
  <svg width="55" height="60" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g clipPath="url(#otp-email-clip)">
      <path d="M3.404 44.797v-23.31l3.206 2.656c.106.118.232.22.368.308l13.771 11.417a1.568 1.568 0 002 0l17.345-14.382v23.311H3.404zM6.2 16.556v3.118l-1.878-1.557L6.2 16.561v-.006zm27.946-7.829v13.558L21.75 32.56 9.35 22.285V8.727h24.796zM21.75 3.663l2.246 1.864h-4.493l2.247-1.864zm17.43 14.449l-1.878 1.557V16.55l1.878 1.557v.005zm4.034-.338c-.005-.03-.02-.061-.026-.092a2.065 2.065 0 00-.075-.23.664.664 0 00-.056-.103c-.035-.061-.07-.123-.111-.18-.025-.035-.056-.066-.08-.102a1.964 1.964 0 00-.142-.148c-.02-.015-.03-.036-.046-.051l-5.37-4.455V7.12c0-.885-.708-1.597-1.576-1.597h-6.74L22.749.36a1.557 1.557 0 00-1.994 0L14.52 5.532H7.78c-.873 0-1.574.717-1.574 1.598v5.294L.824 16.873s-.03.036-.045.051c-.05.046-.096.092-.141.149-.026.035-.056.066-.081.102a2.14 2.14 0 00-.111.18c-.02.035-.04.066-.056.102-.03.071-.055.148-.076.23-.01.03-.02.056-.025.092a1.506 1.506 0 00-.035.338V46.4c0 .886.707 1.597 1.58 1.597h39.845c.873 0 1.575-.716 1.575-1.597V18.117c0-.118-.015-.23-.035-.338l-.005-.005z" fill="#8090AE" />
      <circle cx="20.75" cy="18.5" r="4.5" fill="#2BB673" />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.386 17.033a.465.465 0 00.034-.66.455.455 0 00-.654-.034l-2.782 2.53-1.24-1.125a.46.46 0 00-.653.034.47.47 0 00.034.66l1.55 1.404a.46.46 0 00.619 0l3.092-2.81zm-9.13-3.628c0-.78.625-1.405 1.39-1.405H26.86c.771 0 1.391.631 1.391 1.405v5.317c0 .898-.011 1.961-.479 2.877-.41.813-1.059 1.547-1.988 2.371-.924.82-2.157 1.752-3.757 2.94a.47.47 0 01-.552 0c-1.605-1.194-2.833-2.12-3.757-2.94-.924-.819-1.577-1.558-1.988-2.37-.462-.917-.479-1.974-.479-2.878v-5.317h.006z" fill="#BFD9E4" />
    </g>
    <defs>
      <clipPath id="otp-email-clip">
        <path fill="#fff" transform="translate(.25)" d="M0 0h43v48H0z" />
      </clipPath>
    </defs>
  </svg>
);

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
