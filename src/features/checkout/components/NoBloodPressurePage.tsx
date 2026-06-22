"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import {
  useFinishNoBloodPressure,
  useGoBackQuestionaire,
} from "@/api/hooks/useQuestionnaireQueries";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";
import { questionnaireKeys } from "@/constants/queryKeys";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";

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

  const queryClient = useQueryClient();
  const { mutateAsync: finishNoBloodPressure, isPending: isFinishing } = useFinishNoBloodPressure();
  const { mutateAsync: goBack, isPending: isGoingBack } = useGoBackQuestionaire();

  const onContinueLater = async () => {
    const result = await finishNoBloodPressure(cartAuth);
    router.push(result.redirect_path);
  };

  const onBackToQuestions = async () => {
    const prevStep = await goBack(cartAuth);
    // Refetch the step we're returning to so it shows the current saved answer,
    // not the previously-cached selection.
    queryClient.invalidateQueries({
      queryKey: questionnaireKeys.step(prevStep.label, cartAuth.cart_id),
    });
    router.push(ROUTES.VISIT_CONSULTATION_STEP(prevStep.label));
  };

  return (
    <>
      <SecondaryNav onBack={onBackToQuestions} isLoading={isGoingBack} />
      <main className="flex min-h-screen flex-col items-center justify-start bg-bg-main px-4 pt-16">
      <div className="w-full max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Let&apos;s talk about your health
        </h1>

        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white p-[55px] shadow-[0_0_45px_#1529471a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/no_blood_pressure_illust.svg"
            alt="no-blood-pressure"
            className="h-[160px] w-[160px]"
          />

          <p className="text-center text-sm leading-relaxed text-gray-600">
            Once you get a blood pressure reading. Come back to complete your
            visit from where you left off.
          </p>
        </div>

        <button
          onClick={onContinueLater}
          disabled={isFinishing || isGoingBack}
          className="mt-6 w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
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
          className="mt-6 w-full rounded-full border border-gray-300 bg-white py-4 text-sm font-semibold uppercase tracking-widest text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
    </>
  );
};
