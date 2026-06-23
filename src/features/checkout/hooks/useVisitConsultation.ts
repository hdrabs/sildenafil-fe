"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetQuestionaireStep,
  useSaveQuestionaireStep,
  useGoBackQuestionaire,
  useAdvanceVisitConsultation,
} from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart, useConsultationSteps, useMarkConsultationStep } from "@/store";
import { questionnaireReducer } from "./questionnaireReducer";
import { ROUTES } from "@/constants/routes";
import { questionnaireKeys } from "@/constants/queryKeys";
import { AnswerResponseEntry, Question, ResponseShape } from "@/types/questionnaire";
import { isQuestionVisible } from "@/features/checkout/lib/questionVisibility";
import {
  answerOptionRequiresText,
  questionHasTextRequiredOption,
} from "@/features/checkout/lib/answerOptionText";

// The PocketMed questionnaire branches on answers, so it has no knowable length. The
// progress bar paces off the user's actual position in it (tracked in questionnaireStore):
// it moves EVENLY across most of the band for a typical-length flow, then — only for
// longer-than-typical flows — eases the final stretch so it keeps inching toward the band
// end instead of freezing, and never overshoots. Going back moves it back in lockstep.
//
// EVEN_STEPS steps of even, linear movement cover EVEN_FILL of the band; beyond that a
// gentle asymptotic creep covers the rest. Tune EVEN_STEPS toward the median flow length.
const EVEN_STEPS = 13;
const EVEN_FILL = 0.88;

const consultationBandFraction = (steps: number): number => {
  if (steps <= 0) return 0;
  if (steps <= EVEN_STEPS) return (steps / EVEN_STEPS) * EVEN_FILL;
  return EVEN_FILL + (1 - EVEN_FILL) * (1 - Math.pow(0.7, steps - EVEN_STEPS));
};

export const useVisitConsultation = (slug: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeCart = useActiveCart();
  const consultationSteps = useConsultationSteps();
  const markConsultationStep = useMarkConsultationStep();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;
  const cartAuth = useMemo(
    () => ({ cart_id: cartId, cart_token: cartToken }),
    [cartId, cartToken],
  );

  const { data: currentStep, isLoading } = useGetQuestionaireStep(
    { step_label: slug, ...cartAuth },
    cartId > 0,
  );

  const { mutateAsync: saveStep, isPending: isSaving } = useSaveQuestionaireStep();
  const { mutateAsync: goBackMutation, isPending: isGoingBack } = useGoBackQuestionaire();
  const { mutateAsync: advanceVisitConsultation, isPending: isAdvancing } =
    useAdvanceVisitConsultation();

  const [responses, dispatch] = useReducer(questionnaireReducer, {
    questions: {},
    hasInteracted: false,
  });
  const isContinuing = useRef(false);
  // Set when Continue is pressed and held until the next step loads (the page
  // remounts per slug, which clears it), so the button stays "Processing" across
  // the navigation instead of flashing back to its ready state the instant the
  // save mutation resolves — before the loader / next step has rendered.
  // Auto-advance steps derive the same state in the page, to keep this setState
  // out of the auto-advance effect.
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!currentStep) return;
    dispatch({ type: "SET_INITIAL", payload: currentStep.responses });
  }, [currentStep]);

  // Count each distinct consultation step reached so the progress bar can advance
  // across its band. currentStep.label is the server-authoritative slug.
  useEffect(() => {
    if (!currentStep || cartId <= 0) return;
    markConsultationStep(cartId, currentStep.label);
  }, [currentStep, cartId, markConsultationStep]);

  // Server is authoritative on slug — correct URL if it drifts (e.g. arriving on
  // the no-slug resolver route). Guard with a ref so React strict-mode's double
  // effect invoke in dev doesn't fire the replace twice (the duplicate q_3_01
  // navigation seen on entry). Resets naturally on the next mount/slug.
  const hasRedirected = useRef(false);
  useEffect(() => {
    if (!currentStep || hasRedirected.current) return;
    if (currentStep.label !== slug) {
      hasRedirected.current = true;
      router.replace(ROUTES.VISIT_CONSULTATION_STEP(currentStep.label));
    }
  }, [currentStep, slug, router]);

  const enableButton = useMemo(() => {
    if (!currentStep) return false;

    return currentStep.questions.every((q: Question, index: number) => {
      // statement = display-only; textfield_disabled = read-only echo of the
      // treatment name (already captured by the parent multi-select). Neither is
      // user-answerable, so they must not gate Continue or it stays disabled forever.
      if (["statement", "textfield_disabled"].includes(q.question_type)) return true;

      // Conditional follow-ups hidden by the renderer (e.g. the side-effects
      // multi when its Yes/No gate is "No") must not be required either.
      if (!isQuestionVisible(currentStep.questions, index, responses.questions)) return true;

      // medication_search (q_16_01) is always satisfiable: zero meds means
      // "I don't take any medications" — a valid answer submitted with the same
      // Continue button — so it never gates on a response being present.
      if (q.question_type === "medication_search") return true;

      const hasResponse = Object.keys(responses.questions).includes(q.id.toString());
      if (!hasResponse) return false;

      if (["allergy_search", "medication_search"].includes(q.question_type)) {
        const qResponse = responses.questions[q.id.toString()];
        const selectedId = Object.keys(qResponse).find(
          (k) => k !== "question_id" && k !== "position",
        );
        if (!selectedId) return false;

        const selectedOption = q.answer_options.find((ao) => ao.id.toString() === selectedId);
        if (selectedOption?.label?.toLowerCase() === "yes") {
          const searchKey =
            q.question_type === "allergy_search" ? "allergy_search" : "medication_search";
          const entry = qResponse[selectedId] as AnswerResponseEntry;
          return (entry?.metadata?.[searchKey]?.length ?? 0) > 0;
        }
      }

      // A text-requiring radio option only counts as answered once its
      // explanation is filled in — keeps Continue disabled on an empty box.
      if (q.question_type === "radio") {
        const qResponse = responses.questions[q.id.toString()];
        const selectedId = Object.keys(qResponse).find(
          (k) => k !== "question_id" && k !== "position",
        );
        const selectedOption = selectedId
          ? q.answer_options.find((ao) => ao.id.toString() === selectedId)
          : undefined;
        if (selectedOption && answerOptionRequiresText(selectedOption)) {
          const entry = qResponse[selectedId!] as AnswerResponseEntry;
          return (entry?.metadata?.text?.trim().length ?? 0) > 0;
        }
      }

      return true;
    });
  }, [responses.questions, currentStep]);

  // The transition itself, kept free of any setState so the auto-advance effect
  // can call it without tripping the no-setState-in-effect rule. Returns true
  // when it navigated, false when it didn't (already in flight, or a save error).
  const advance = useCallback(async () => {
    if (!currentStep || isContinuing.current) return false;
    isContinuing.current = true;

    try {
      // "I don't take any medications": when the patient submits a
      // medication_search with nothing added, send an explicit empty-meds answer
      // (the implicit option selected with an empty list) so the backend records
      // the negative response and advances instead of seeing no answer at all.
      let responsesToSave = responses.questions;
      const medQ = currentStep.questions.find(
        (q) => q.question_type === "medication_search",
      );
      if (medQ && !responsesToSave[medQ.id.toString()]) {
        const opt = medQ.answer_options[0];
        if (opt) {
          const emptyEntry: AnswerResponseEntry = {
            answer_option_id: opt.id,
            position: opt.position,
            solo: opt.solo,
            disqualify: opt.disqualify,
            metadata: { medication_search: [] },
          };
          const emptyMedAnswer = {
            question_id: medQ.id,
            position: medQ.position,
            [opt.id]: emptyEntry,
          } as ResponseShape;
          responsesToSave = { ...responsesToSave, [medQ.id.toString()]: emptyMedAnswer };
        }
      }

      const nextStep = await saveStep({ ...cartAuth, responses: responsesToSave });

      if (nextStep.rejection_type) {
        router.push(
          nextStep.rejection_type === "no_checkup"
            ? ROUTES.CHECKOUT_NO_CHECKUP
            : ROUTES.CHECKOUT_NO_BLOOD_PRESSURE,
        );
        return true;
      }

      if (nextStep.completed) {
        const result = await advanceVisitConsultation(cartAuth);
        router.push(result.redirect_path);
        return true;
      }

      // The destination step may be server-recomputed on fetch (e.g. q_16_01
      // re-derives its prefilled meds from the latest answers). Invalidate its
      // cache so navigating forward refetches instead of showing a stale copy
      // from an earlier visit — mirrors the invalidation onBack already does.
      queryClient.invalidateQueries({
        queryKey: questionnaireKeys.step(nextStep.label, cartId),
      });
      router.push(ROUTES.VISIT_CONSULTATION_STEP(nextStep.label));
      return true;
    } catch {
      isContinuing.current = false;
      return false;
    }
  }, [currentStep, responses.questions, saveStep, advanceVisitConsultation, cartAuth, router, queryClient, cartId]);

  // The button's Continue handler: flag processing (so the button holds its
  // "Processing" state through the navigation) then run the transition. Called
  // only from the click event — never an effect — so this setState is safe.
  const onContinue = useCallback(async () => {
    setIsProcessing(true);
    const navigated = await advance();
    // A (rare) save error returns without navigating, so release the processing
    // hold to re-enable the button; on success the per-slug remount clears it.
    if (!navigated) setIsProcessing(false);
  }, [advance]);

  const onBack = useCallback(async () => {
    try {
      const prevStep = await goBackMutation({ ...cartAuth, step_label: slug });
      // PocketMed returns the SAME step at the start of the questionnaire (no
      // earlier question to go to). That's the boundary — exit back to the
      // previous funnel step instead of looping on the same page.
      if (prevStep.label === slug) {
        router.push(ROUTES.VISIT_INTRO);
        return;
      }
      queryClient.invalidateQueries({
        queryKey: questionnaireKeys.step(prevStep.label, cartId),
      });
      router.push(ROUTES.VISIT_CONSULTATION_STEP(prevStep.label));
    } catch {
      // No previous consultation step — go back to visit intro
      router.push(ROUTES.VISIT_INTRO);
    }
  }, [goBackMutation, cartAuth, slug, cartId, queryClient, router]);

  // A lone radio with a text-requiring option (e.g. q_7_01's "Yes, but there
  // were issues") is NOT a tap-to-advance step: the patient must fill the box
  // and press Continue, so it keeps its button instead of auto-advancing.
  const isSingleRadioStep =
    currentStep?.questions.length === 1 &&
    currentStep.questions[0].question_type === "radio" &&
    !questionHasTextRequiredOption(currentStep.questions[0]);

  // Auto-advance also covers a lone multi (checkbox) step — but only when a
  // `solo` answer ("No"/"None of the above") is picked, mirroring AUM where solo
  // checkbox options behave like radios. The reducer sets `hasInteracted` true
  // ONLY for radio/solo selections, so the effect below advances a radio on any
  // tap and a multi only on its solo option, while a normal multi-select tap
  // leaves the Continue button in place. Kept separate from isSingleRadioStep so
  // multi steps still render their Continue button (for non-solo selections).
  const isAutoAdvanceStep =
    currentStep?.questions.length === 1 &&
    ["radio", "multi"].includes(currentStep.questions[0].question_type) &&
    !questionHasTextRequiredOption(currentStep.questions[0]);

  // On back-navigation the server returns the step with its saved answer. A
  // single-radio step that's already answered keeps its Continue button (AUM
  // behaviour) instead of auto-advancing again the moment it's shown.
  const isAnswered =
    !!currentStep?.responses && Object.keys(currentStep.responses).length > 0;

  // Auto-advance a single radio / solo-checkbox step on the user's TAP
  // (hasInteracted). Mount / back-navigation leaves hasInteracted false, so a
  // revisited answer is shown (with its Continue button) instead of jumping
  // forward — yet tapping a radio (or a solo checkbox) still advances.
  useEffect(() => {
    if (!isAutoAdvanceStep || !responses.hasInteracted || !enableButton) return;
    advance();
  }, [isAutoAdvanceStep, enableButton, responses.hasInteracted, advance]);

  // pos is 0-based; steps reached = pos + 1 (−1 → 0 when this cart has no path yet).
  const pos = consultationSteps?.cartId === cartId ? consultationSteps.pos : -1;
  const progressFraction = consultationBandFraction(pos + 1);

  return {
    currentStep,
    responses,
    dispatch,
    enableButton,
    onContinue,
    onBack,
    isLoading,
    isSubmitting: isSaving || isAdvancing || isProcessing,
    isGoingBack,
    isSingleRadioStep,
    isAutoAdvanceStep,
    isAnswered,
    progressFraction,
  };
};
