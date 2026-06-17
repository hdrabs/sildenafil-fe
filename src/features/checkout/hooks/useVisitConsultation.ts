"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useGetQuestionaireStep,
  useSaveQuestionaireStep,
  useGoBackQuestionaire,
  useAdvanceVisitConsultation,
} from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart } from "@/store";
import { questionnaireReducer } from "./questionnaireReducer";
import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/questionnaire";

export const useVisitConsultation = (slug: string) => {
  const router = useRouter();
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
    const requiredQuestions = currentStep.questions.filter(
      (q: Question) =>
        !["medication_search", "allergy_search", "statement"].includes(q.question_type),
    );
    return requiredQuestions.every((q: Question) =>
      Object.keys(responses.questions).includes(q.id.toString()),
    );
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
      const prevStep = await goBackMutation(cartAuth);
      router.push(ROUTES.VISIT_CONSULTATION_STEP(prevStep.label));
    } catch {
      // stay on page
    }
  }, [goBackMutation, cartAuth, router]);

  // Auto-advance for single radio steps
  useEffect(() => {
    if (!responses.hasInteracted || !enableButton) return;
    onContinue();
  }, [enableButton, responses.hasInteracted, onContinue]);

  const isSingleRadioStep =
    currentStep?.questions.length === 1 &&
    currentStep.questions[0].question_type === "radio";

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
