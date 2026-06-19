"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import {
  useFinishNoCheckup,
  useGoBackQuestionaire,
} from "@/api/hooks/useQuestionnaireQueries";
import { ROUTES } from "@/constants/routes";

const ClinicIllustration = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-28 w-28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="60" r="60" fill="#ddeef5" />
    <rect x="25" y="55" width="70" height="55" rx="4" fill="white" />
    <path d="M20 58 L60 28 L100 58Z" fill="#e0e7ef" />
    <rect x="52" y="38" width="16" height="5" rx="2" fill="#e85f5f" />
    <rect x="55.5" y="34.5" width="9" height="12" rx="2" fill="#e85f5f" />
    <rect x="47" y="80" width="26" height="30" rx="3" fill="#c8dce6" />
    <rect x="30" y="65" width="18" height="12" rx="2" fill="#c8dce6" />
    <rect x="72" y="65" width="18" height="12" rx="2" fill="#c8dce6" />
  </svg>
);

export const NoCheckupPage = () => {
  const router = useRouter();
  const activeCart = useActiveCart();

  const cartAuth = useMemo(
    () => ({
      cart_id: activeCart?.cart.id ?? 0,
      cart_token: activeCart?.cart.token,
    }),
    [activeCart],
  );

  const { mutateAsync: finishNoCheckup, isPending: isFinishing } = useFinishNoCheckup();
  const { mutateAsync: goBack, isPending: isGoingBack } = useGoBackQuestionaire();

  const onContinueLater = async () => {
    const result = await finishNoCheckup(cartAuth);
    router.push(result.redirect_path);
  };

  const onBackToQuestions = async () => {
    const prevStep = await goBack(cartAuth);
    router.push(ROUTES.VISIT_CONSULTATION_STEP(prevStep.label));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-bg-main px-4 pt-16">
      <div className="w-full max-w-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          See a healthcare provider
        </h1>

        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 shadow-sm">
          <ClinicIllustration />

          <p className="text-center text-sm leading-relaxed text-gray-600">
            It is important that you see a healthcare provider in person for a
            physical exam. After completing your in-person visit return to the
            site and one of our clinical providers may be able to assist you.
          </p>
        </div>

        <button
          onClick={onContinueLater}
          disabled={isFinishing || isGoingBack}
          className="mt-6 w-full rounded-full bg-[#e85f5f] py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#d45555] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isFinishing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Please wait…
            </span>
          ) : (
            "Continue Later On"
          )}
        </button>

        <button
          onClick={onBackToQuestions}
          disabled={isFinishing || isGoingBack}
          className="mt-3 w-full rounded-full border border-gray-300 bg-white py-4 text-sm font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGoingBack ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              Please wait…
            </span>
          ) : (
            "Back to Health Questions"
          )}
        </button>
      </div>
    </main>
  );
};
