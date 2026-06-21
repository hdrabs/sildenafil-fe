"use client";

import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useIdentityVerification } from "@/features/checkout/hooks/useIdentityVerification";

export const IdentityVerificationPage = () => {
  const {
    form,
    submitSsn,
    uploadIdInstead,
    limitExceeded,
    error,
    isVerifying,
    isContinuing,
    back,
    steps,
  } = useIdentityVerification();
  const { register, formState } = form;

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isVerifying || isContinuing} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">Verify your identity</h1>
          <p className="mt-1 text-text-muted">
            To keep your prescription safe, we confirm your identity using the last 4 digits of your
            Social Security number. It&apos;s a soft check and won&apos;t affect your credit.
          </p>

          <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
            {limitExceeded ? (
              <div>
                <p className="text-sm text-text-primary">
                  You&apos;ve reached the maximum number of SSN attempts. You can still verify your
                  identity by uploading a photo of your government-issued ID instead.
                </p>
                <Button
                  variant="coral"
                  size="lg"
                  fullWidth
                  loading={isContinuing}
                  onClick={uploadIdInstead}
                  className="mt-6"
                >
                  Upload my ID instead
                </Button>
              </div>
            ) : (
              <form onSubmit={submitSsn} noValidate>
                <Input
                  label="Last 4 digits of SSN"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  placeholder="••••"
                  error={formState.errors.ssn_code?.message}
                  {...register("ssn_code")}
                />

                {error && <p className="mt-2 text-sm text-text-error">{error}</p>}

                <Button
                  type="submit"
                  variant="coral"
                  size="lg"
                  fullWidth
                  loading={isVerifying}
                  className="mt-6"
                >
                  Verify
                </Button>

                <button
                  type="button"
                  onClick={uploadIdInstead}
                  disabled={isContinuing}
                  className="mt-4 w-full cursor-pointer text-sm font-medium text-link-blue underline transition-opacity hover:opacity-80 disabled:opacity-60"
                >
                  I&apos;d rather upload my ID
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
