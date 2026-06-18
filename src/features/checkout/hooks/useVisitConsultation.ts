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
import { useActiveCart } from "@/store";
import { questionnaireReducer } from "./questionnaireReducer";
import { ROUTES } from "@/constants/routes";
import { questionnaireKeys } from "@/constants/queryKeys";
import { Question } from "@/types/questionnaire";

export const useVisitConsultation = (slug: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeCart = useActiveCart();

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
  };
};
