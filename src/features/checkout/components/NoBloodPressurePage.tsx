"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import {
  useFinishNoBloodPressure,
  useGoBackQuestionaire,
} from "@/api/hooks/useQuestionnaireQueries";
import { ROUTES } from "@/constants/routes";

const BloodPressureIllustration = () => (
  <svg
    viewBox="0 0 120 120"
    className="h-28 w-28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="60" cy="60" r="60" fill="#ddeef5" />
    <rect x="28" y="45" width="64" height="44" rx="8" fill="white" />
    <rect x="36" y="53" width="48" height="22" rx="4" fill="#c8dce6" />
    <rect x="42" y="59" width="20" height="5" rx="2" fill="#4a90a4" />
    <rect x="42" y="67" width="14" height="4" rx="2" fill="#4a90a4" />
    <path
      d="M60 89 Q60 98 50 100 Q40 102 38 96"
      stroke="#4a90a4"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <ellipse cx="35" cy="97" rx="10" ry="6" fill="#e0e7ef" stroke="#4a90a4" strokeWidth="1.5" />
    <path
      d="M74 57 C74 55 72 53 70 54 C68 55 68 57 70 59 L74 63 L78 59 C80 57 80 55 78 54 C76 53 74 55 74 57Z"
      fill="#e85f5f"
    />
  </svg>
);

export const NoBloodPressurePage = () => {
  const router = useRouter();
  const activeCart = useActiveCart();

  const cartAuth = useMemo(
    () => ({
      cart_id: activeCart?.cart.id ?? 0,
      cart_token: activeCart?.cart.token,
    }),
    [activeCart],
  );

  const { mutateAsync: finishNoBloodPressure, isPending: isFinishing } = useFinishNoBloodPressure();
  const { mutateAsync: goBack, isPending: isGoingBack } = useGoBackQuestionaire();

  const onContinueLater = async () => {
    const result = await finishNoBloodPressure(cartAuth);
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
          Let&apos;s talk about your health
        </h1>

        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 shadow-sm">
          <BloodPressureIllustration />

          <p className="text-center text-sm leading-relaxed text-gray-600">
            Once you get a blood pressure reading. Come back to complete your
            visit from where you left off.
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
