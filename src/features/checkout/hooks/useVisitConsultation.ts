"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
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
import { Question } from "@/types/questionnaire";

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

  // Server is authoritative on slug — correct URL if it drifts
  useEffect(() => {
    if (!currentStep) return;
    if (currentStep.label !== slug) {
      router.replace(ROUTES.VISIT_CONSULTATION_STEP(currentStep.label));
    }
  }, [currentStep, slug, router]);

  const enableButton = useMemo(() => {
    if (!currentStep) return false;

    return currentStep.questions.every((q: Question) => {
      if (q.question_type === "statement") return true;

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
          const entry = qResponse[selectedId] as import("@/types/questionnaire").AnswerResponseEntry;
          return (entry?.metadata?.[searchKey]?.length ?? 0) > 0;
        }
      }

      return true;
    });
  }, [responses.questions, currentStep]);

  const onContinue = useCallback(async () => {
    if (!currentStep || isContinuing.current) return;
    isContinuing.current = true;

    try {
      const nextStep = await saveStep({ ...cartAuth, responses: responses.questions });

      if (nextStep.rejection_type) {
        router.push(
          nextStep.rejection_type === "no_checkup"
            ? ROUTES.CHECKOUT_NO_CHECKUP
            : ROUTES.CHECKOUT_NO_BLOOD_PRESSURE,
        );
        return;
      }

      if (nextStep.completed) {
        const result = await advanceVisitConsultation(cartAuth);
        router.push(result.redirect_path);
        return;
      }

      router.push(ROUTES.VISIT_CONSULTATION_STEP(nextStep.label));
    } catch {
      isContinuing.current = false;
    }
  }, [currentStep, responses.questions, saveStep, advanceVisitConsultation, cartAuth, router]);

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

  const isSingleRadioStep =
    currentStep?.questions.length === 1 &&
    currentStep.questions[0].question_type === "radio";

  // Auto-advance only for single-radio steps (not allergy/medication search or multi-question steps)
  useEffect(() => {
    if (!isSingleRadioStep || !responses.hasInteracted || !enableButton) return;
    onContinue();
  }, [isSingleRadioStep, enableButton, responses.hasInteracted, onContinue]);

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
    isSubmitting: isSaving || isAdvancing,
    isGoingBack,
    isSingleRadioStep,
    progressFraction,
  };
};
