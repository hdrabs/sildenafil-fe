"use client";

import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { useSkipPhotoStep } from "@/features/checkout/hooks/useSkipPhotoStep";

interface Props {
  kind: "id" | "selfie";
  title: string;
  description: string;
}

// ID / selfie upload pages. Photo capture (IDV) is deferred, so each page is a
// thin stub whose only action is "Skip this step" — which advances the cart.
export const PhotoUploadStep = ({ kind, title, description }: Props) => {
  const { back, steps, skip, isSkipping } = useSkipPhotoStep(kind);

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isSkipping} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="mt-1 text-text-muted">{description}</p>

          <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
            <p className="text-sm text-text-muted">
              Photo capture isn&apos;t available here yet — you can skip this step for now and
              submit it later.
            </p>

            <button
              type="button"
              onClick={skip}
              disabled={isSkipping}
              className="mt-6 w-full cursor-pointer rounded-full bg-[#e05c4b] py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Skip this step
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
