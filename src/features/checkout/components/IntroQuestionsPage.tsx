"use client";

import { useIntroQuestions } from "@/features/checkout/hooks/useIntroQuestions";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { Question } from "./Question";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";

interface Props {
  slug: string;
}

export const IntroQuestionsPage = ({ slug }: Props) => {
  const {
    currentStep,
    responses,
    dispatch,
    enableButton,
    onContinue,
    onBack,
    isLoading,
    isSubmitting,
    isSingleRadioStep,
  } = useIntroQuestions(slug);

  // Progress bar only — back here is the intro sub-flow's own (onBack above).
  const { steps } = useStepNavigation("intro_questions");

  if (isLoading || !currentStep) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <SecondaryNav onBack={onBack} />
      <CheckoutProgressBar steps={steps} />
      <main className="min-h-screen bg-bg-main">
      <div className="mx-auto w-full max-w-2xl px-6 py-10 md:py-16">
      {currentStep.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          dispatch={dispatch}
          response={responses.questions[question.id] ?? {}}
        />
      ))}

      {!isSingleRadioStep && (
        <div className="mt-6">
          <button
            onClick={onContinue}
            disabled={!enableButton || isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Please wait…
              </span>
            ) : (
              currentStep.button_text || "Continue"
            )}
          </button>
        </div>
      )}
      </div>
      </main>
    </>
  );
};
