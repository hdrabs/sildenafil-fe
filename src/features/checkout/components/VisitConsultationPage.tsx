"use client";

import { useVisitConsultation } from "@/features/checkout/hooks/useVisitConsultation";
import { Question } from "./Question";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { AnswerOption } from "@/types/questionnaire";

const BP_CATEGORIES = new Set(["Low", "Normal", "Elevated", "High"]);
const isBpQuestion = (q: { answer_options: AnswerOption[] }) =>
  q.answer_options.some((a) => a.extra_label && BP_CATEGORIES.has(a.extra_label));

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
    progressFraction,
  } = useVisitConsultation(slug);

  if (isLoading || !currentStep) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <SecondaryNav onBack={onBack} isLoading={isGoingBack} />
      <CheckoutProgressBar step="visit_consultation" fraction={progressFraction} />
      <main className="min-h-screen bg-bg-main">
      <div className="mx-auto w-full max-w-2xl px-6 py-10 md:py-16">
      {currentStep.questions.map((question, index) => {
        const isFirstBpQuestion =
          isBpQuestion(question) &&
          !currentStep.questions.slice(0, index).some(isBpQuestion);

        // Hide multi-select questions until the preceding Yes/No radio has "Yes" selected
        if (index > 0 && question.question_type === "multi") {
          const prev = currentStep.questions[index - 1];
          const isYesNoRadio =
            prev.question_type === "radio" &&
            prev.answer_options.some((a) => a.label === "Yes") &&
            prev.answer_options.some((a) => a.label === "No");
          if (isYesNoRadio) {
            const prevResp = responses.questions[prev.id];
            const selectedId = prevResp
              ? Object.keys(prevResp).find((k) => k !== "question_id" && k !== "position")
              : undefined;
            const selectedLabel = selectedId
              ? prev.answer_options.find((a) => a.id.toString() === selectedId)?.label
              : undefined;
            if (selectedLabel !== "Yes") return null;
          }
        }

        const isTreatmentDetailStep = /^q_6_02_\d{2}$/.test(slug);

        return (
          <Question
            key={question.id}
            question={question}
            dispatch={dispatch}
            response={responses.questions[question.id] ?? {}}
            showBpSampleCard={isFirstBpQuestion}
            showLearnMore={isTreatmentDetailStep && index === 0}
          />
        );
      })}

      {!isSingleRadioStep && (
        <div className="mt-6">
          <button
            onClick={onContinue}
            disabled={!enableButton || isSubmitting}
            className="w-full rounded-full bg-red-400 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-400"
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
