"use client";

import { useVisitConsultation } from "@/features/checkout/hooks/useVisitConsultation";
import { Question } from "./Question";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { AnswerOption, AnswerResponseEntry } from "@/types/questionnaire";
import { isQuestionVisible } from "@/features/checkout/lib/questionVisibility";

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
    isAnswered,
    progressFraction,
  } = useVisitConsultation(slug);

  // medication_search: with nothing added the Continue button reads "I don't
  // take any medications" (submitting an empty list is a valid answer); once a
  // medication is added it reverts to the normal Continue label.
  const medQuestion = currentStep?.questions.find(
    (q) => q.question_type === "medication_search",
  );
  const medResponse = medQuestion
    ? responses.questions[medQuestion.id.toString()]
    : undefined;
  const medSelectedId = medResponse
    ? Object.keys(medResponse).find((k) => k !== "question_id" && k !== "position")
    : undefined;
  const medCount = medSelectedId
    ? (medResponse![medSelectedId] as AnswerResponseEntry).metadata?.medication_search?.length ?? 0
    : 0;
  const continueLabel =
    medQuestion && medCount === 0
      ? "I don't take any medications"
      : currentStep?.button_text || "Continue";

  // While the slug is still being resolved (the no-slug resolver route, or a
  // step transition before the new fetch lands), currentStep.label won't match
  // the URL slug. Show only the loader instead of flashing the soon-to-be-
  // replaced step's body — that flash is the "double flick" on entry.
  if (isLoading || !currentStep || currentStep.label !== slug) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <SecondaryNav onBack={onBack} isLoading={isGoingBack} />
      <CheckoutProgressBar step="visit_consultation" fraction={progressFraction} />
      <main className="min-h-screen bg-bg-main">
      <div className="mx-auto w-full max-w-lg px-6 py-10 md:py-16">
      {currentStep.questions.map((question, index) => {
        const isFirstBpQuestion =
          isBpQuestion(question) &&
          !currentStep.questions.slice(0, index).some(isBpQuestion);

        // Conditional follow-ups (e.g. the side-effects multi after its Yes/No
        // gate) are hidden unless the gate is "Yes" — same rule the Continue
        // gate uses, so the two never disagree and lock the page.
        if (!isQuestionVisible(currentStep.questions, index, responses.questions)) {
          return null;
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
            compactHeading={isTreatmentDetailStep && index > 0}
          />
        );
      })}

      {(!isSingleRadioStep || isAnswered) && (
        <div className="mt-6">
          <button
            onClick={onContinue}
            disabled={!enableButton || isSubmitting}
            className="w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
          >
            {isSubmitting ? "Processing" : continueLabel}
          </button>
        </div>
      )}
      </div>
      </main>
    </>
  );
};
