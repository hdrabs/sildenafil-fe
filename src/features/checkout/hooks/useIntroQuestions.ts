"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useGetIntroStep, useAdvanceIntroQuestions } from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart, useAddIntroResponse, useIntroResponses } from "@/store";
import { questionnaireReducer } from "./questionnaireReducer";
import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/questionnaire";

// Intro step labels live in the ed_* namespace. Any next_step_label outside
// this prefix (e.g. "q_3_01") is PocketMed signalling the first questionnaire
// step — we advance the cart instead of navigating to another intro step.
const isIntroStepLabel = (label: string) => label.startsWith("ed_");

// Static back map — each intro slug knows its predecessor.
// Add entries here as new intro steps are introduced.
const INTRO_PREV_STEP: Record<string, string> = {
  ed_onset: "ed_problem",
};

export const useIntroQuestions = (slug: string) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const addIntroResponse = useAddIntroResponse();
  const introResponses = useIntroResponses();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { data: currentStep, isLoading } = useGetIntroStep(
    { step_label: slug, cart_id: cartId, cart_token: cartToken },
    cartId > 0,
  );

  const { mutateAsync: advanceIntroQuestions, isPending: isAdvancing } =
    useAdvanceIntroQuestions();

  const [responses, dispatch] = useReducer(questionnaireReducer, {
    questions: {},
    hasInteracted: false,
  });

  // Seed reducer when step (or saved responses) change.
  // Prefer the local store — it keeps EVERY answered step keyed by step_id, so
  // back-navigation pre-fills any prior step. The backend's currentStep.responses
  // is only a fallback (e.g. fresh cross-session restore after the store was
  // cleared on visit-consent submit) and may omit earlier steps.
  useEffect(() => {
    if (!currentStep) return;
    const fromStore = introResponses.find((r) => r.step_id === currentStep.id)?.responses;
    dispatch({ type: "SET_INITIAL", payload: fromStore ?? currentStep.responses ?? null });
  }, [currentStep, introResponses]);

  // Derived — no setState in effect needed
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
    if (!currentStep) return;

    addIntroResponse({
      step_id: currentStep.id,
      responses: responses.questions,
    });

    // Determine next_step_label from the selected answer option
    const firstQuestionResponses = Object.values(responses.questions)[0];
    const selectedAnswerId = firstQuestionResponses
      ? Object.keys(firstQuestionResponses).find(
          (k) => k !== "question_id" && k !== "position",
        )
      : undefined;

    const currentQuestion = selectedAnswerId
      ? currentStep.questions.find(
          (q: Question) => q.id === Number(Object.keys(responses.questions)[0]),
        )
      : null;

    const nextStepLabel = currentQuestion?.answer_options.find(
      (ao) => ao.id === Number(selectedAnswerId),
    )?.next_step_label;

    // Only follow next_step_label when it points to another intro step.
    // Questionnaire step labels (e.g. "q_3_01") are PocketMed signalling the
    // first questionnaire step — treat them as "no next intro step" and
    // advance the cart instead.
    if (nextStepLabel && isIntroStepLabel(nextStepLabel)) {
      router.push(ROUTES.INTRO_QUESTIONS(nextStepLabel));
      return;
    }

    // Last intro step — advance cart. Backend returns the correct redirect_path:
    //   authenticated → /visit-consent   guest → /sign-up
    try {
      const result = await advanceIntroQuestions({
        cart_id: cartId,
        cart_token: cartToken,
      });
      router.push(result.redirect_path);
    } catch {
      // stay on page
    }
  }, [currentStep, responses.questions, addIntroResponse, advanceIntroQuestions, cartId, cartToken, router]);

  const onBack = useCallback(() => {
    const prev = INTRO_PREV_STEP[slug];
    if (prev) {
      router.push(ROUTES.INTRO_QUESTIONS(prev));
    } else {
      router.back();
    }
  }, [slug, router]);

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
    isSubmitting: isAdvancing,
    isSingleRadioStep,
  };
};
