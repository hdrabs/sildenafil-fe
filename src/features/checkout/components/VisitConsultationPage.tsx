"use client";

import { useVisitConsultation } from "@/features/checkout/hooks/useVisitConsultation";
import { Question } from "./Question";

interface Props {
  slug: string;
}

export const VisitConsultationPage = ({ slug }: Props) => {
  const {
    currentStep,
    responses,
    dispatch,
    enableButton,
    onContinue,
    onBack,
    isLoading,
    isSubmitting,
    isGoingBack,
    isSingleRadioStep,
  } = useVisitConsultation(slug);

  if (isLoading || !currentStep) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 md:py-16">
      <div className="mb-6">
        <button
          onClick={onBack}
          disabled={isGoingBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          {isGoingBack ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          )}
          Back
        </button>
      </div>

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
    </main>
  );
};
