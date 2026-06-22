"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const SSN_LENGTH = 4;

interface Props {
  onClose: () => void;
  onSubmit: (code: string) => Promise<void> | void;
  isVerifying: boolean;
  error: string | null;
  /** After SSN attempts are spent, swap to the "continue with visit" fallback. */
  limitExceeded: boolean;
  onContinueWithVisit: () => Promise<void> | void;
  isContinuing: boolean;
}

const SupportLine = () => (
  <p className="mt-6 text-center text-base text-text-primary">
    Website Support:{" "}
    <a href="tel:8447453362" className="font-medium text-link-blue hover:underline">
      (844) 745-3362
    </a>
  </p>
);

// Rendered only while open (the parent mounts/unmounts it), so the boxes start
// empty on every open without a reset effect.
export const SsnVerificationModal = ({
  onClose,
  onSubmit,
  isVerifying,
  error,
  limitExceeded,
  onContinueWithVisit,
  isContinuing,
}: Props) => {
  const [digits, setDigits] = useState<string[]>(Array(SSN_LENGTH).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");
  const isComplete = code.length === SSN_LENGTH;

  const focusAt = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    if (digit && i < SSN_LENGTH - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) focusAt(i - 1);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, SSN_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((d, idx) => {
      next[idx] = d;
    });
    setDigits(next);
    focusAt(Math.min(pasted.length, SSN_LENGTH - 1));
  };

  const submit = async () => {
    if (!isComplete) return;
    await onSubmit(code);
    // Still mounted afterwards → a failed / over-limit attempt: clear for retry.
    // (A pass navigates away and unmounts this modal.)
    setDigits(Array(SSN_LENGTH).fill(""));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {!isVerifying && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex items-center justify-center rounded-full p-1 text-text-primary transition-colors hover:bg-bg-input"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        )}

        {isVerifying ? (
          <div className="flex flex-col items-center justify-center gap-5 py-14">
            <Spinner size="lg" />
            <p className="text-center text-lg font-bold text-text-primary">
              Please wait while we verify your SSN Number
            </p>
          </div>
        ) : limitExceeded ? (
          <div className="mt-2">
            <p className="text-sm leading-relaxed text-text-primary">
              We&apos;re sorry you&apos;re having trouble verifying your SSN. Let&apos;s continue with
              your visit for now, but later on we&apos;ll need you to upload a government-issued ID
            </p>
            <Button
              variant="outline-dark"
              size="lg"
              fullWidth
              loading={isContinuing}
              onClick={onContinueWithVisit}
              className="mt-6"
            >
              Continue with visit
            </Button>
          </div>
        ) : (
          <>
            <h2 className="pr-8 text-xl font-bold text-text-primary">Please Provide Your SSN Number</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-primary">
              Verifying your identity is crucial to ensuring the right person receives the right
              medical advice and treatment. We apologize for any inconvenience and appreciate your
              cooperation.
            </p>

            <h3 className="mt-5 text-sm font-bold text-text-primary">
              Input the last 4 of your Social Security Number:
            </h3>

            <div className="mt-4 grid grid-cols-4 gap-4">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  autoFocus={i === 0}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "h-[72px] w-full rounded-xl border bg-white text-center text-2xl font-bold text-text-primary transition-colors focus:border-primary focus:outline-none",
                    error ? "border-coral" : "border-border-dropdown",
                  )}
                />
              ))}
            </div>

            {error && <p className="mt-3 text-sm text-text-error">{error}</p>}

            <Button
              variant="coral"
              size="lg"
              fullWidth
              disabled={!isComplete}
              onClick={submit}
              className="mt-6 disabled:bg-[#6b7685] disabled:opacity-100"
            >
              Submit
            </Button>
          </>
        )}

        <SupportLine />
      </div>
    </div>,
    document.body,
  );
};
