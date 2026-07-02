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
    isAutoAdvanceStep,
    isAnswered,
    textRequiredSelected,
    searchYesSelected,
    progressFraction,
  } = useVisitConsultation(slug);

  // medication_search: with nothing added the Continue button shows the step's
  // custom button_text — q_16_01's "I don't take any medications" (submitting
  // an empty list is a valid answer); once a medication is added it reverts to
  // plain Continue. The other med-search steps (q_11_04, q_11_49) carry no
  // custom text and always read Continue, matching AUM. The label fallback
  // covers question sets seeded before button_text was restored in the data.
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
  const customButtonText =
    currentStep?.button_text && currentStep.button_text !== "Continue"
      ? currentStep.button_text
      : currentStep?.label === "q_16_01"
        ? "I don't take any medications"
        : undefined;
  const continueLabel = medCount === 0 && customButtonText ? customButtonText : "Continue";

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

  // Keep the button in its "Processing" state through the whole transition.
  // `isSubmitting` covers a manual press; the auto-advance case has no press to
  // hook, so derive it: once a radio/solo selection is made on an auto-advance
  // step it's about to navigate, so show "Processing" rather than flashing the
  // enabled button for a frame.
  const busy =
    isSubmitting ||
    (isAutoAdvanceStep &&
      !textRequiredSelected &&
      !searchYesSelected &&
      responses.hasInteracted &&
      enableButton);

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

      {/* A single-radio (or allergy-search) step auto-advances on tap, so its
          Continue button only shows on a back-nav revisit — an already-answered
          step the user hasn't touched yet (isAnswered && !hasInteracted) — or
          when the selected option holds the step open: a text-requiring radio
          option, or "Yes" on an allergy search (fill the box / add the entries,
          then press Continue). Gating on !hasInteracted is what kills the
          flash: the instant the user taps to advance forward, hasInteracted
          flips true, so the button can't appear even if isAnswered momentarily
          becomes true while the step saves/redirects. */}
      {(!isSingleRadioStep ||
        textRequiredSelected ||
        searchYesSelected ||
        (isAnswered && !responses.hasInteracted)) && (
        <div className="mt-6">
          <button
            onClick={onContinue}
            disabled={!enableButton || busy}
            className="w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
          >
            {busy ? "Processing" : continueLabel}
          </button>
        </div>
      )}
      </div>
      </main>
    </>
  );
};
