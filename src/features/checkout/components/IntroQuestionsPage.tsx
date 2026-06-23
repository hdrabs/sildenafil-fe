"use client";

import { useIntroQuestions } from "@/features/checkout/hooks/useIntroQuestions";
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
    isAnswered,
  } = useIntroQuestions(slug);

  if (isLoading || !currentStep) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <SecondaryNav onBack={onBack} />
      <CheckoutProgressBar step="intro_questions" />
      <main className="min-h-screen bg-bg-main">
      <div className="mx-auto w-full max-w-lg px-6 py-10 md:py-16">
      {currentStep.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          dispatch={dispatch}
          response={responses.questions[question.id] ?? {}}
        />
      ))}

      {/* A single-radio step auto-advances on tap, so its Continue button only
          shows on a back-nav revisit — an already-answered step the user hasn't
          touched yet (isAnswered && !hasInteracted). The !hasInteracted gate kills
          the flash: tapping to advance flips hasInteracted true, and onContinue's
          addIntroResponse() flips isAnswered true, but the button stays hidden
          because the user already interacted. */}
      {(!isSingleRadioStep || (isAnswered && !responses.hasInteracted)) && (
        <div className="mt-6">
          <button
            onClick={onContinue}
            disabled={!enableButton || isSubmitting}
            className="w-full rounded-lg bg-coral px-2.5 py-3 text-base font-normal uppercase text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
          >
            {isSubmitting ? "Processing" : currentStep.button_text || "Continue"}
          </button>
        </div>
      )}
      </div>
      </main>
    </>
  );
};
