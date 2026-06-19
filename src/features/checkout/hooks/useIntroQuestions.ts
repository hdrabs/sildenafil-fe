"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useGetIntroStep, useAdvanceIntroQuestions } from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart, useAddIntroResponse, useIntroResponses, useSetLastIntroStep } from "@/store";
import { questionnaireReducer } from "./questionnaireReducer";
import { ROUTES } from "@/constants/routes";
import { Question } from "@/types/questionnaire";

// Static back map — each intro slug knows its predecessor.
// Add entries here as new intro steps are introduced.
// (Intro is pre-visit, so PocketMed offers no server-side "previous" to defer to;
// contrast the post-visit consultation flow, which uses a goBack endpoint.)
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
  const hasVisit = !!activeCart?.cart.visit_uuid;

  // Remember the intro step being viewed so the consent page's back button can
  // resume the intro sub-flow here instead of restarting it.
  const setLastIntroStep = useSetLastIntroStep();
  useEffect(() => {
    setLastIntroStep(slug);
  }, [slug, setLastIntroStep]);

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

  // Seed reducer when the step (or saved responses) change.
  // Before a visit exists, the backend has no saved responses (it only enriches
  // once cart.visit_uuid + pocketmed_uuid are set), so the local store buffer —
  // which keeps EVERY answered step keyed by step_id for back-navigation — is the
  // only source. Once a visit exists, the backend is authoritative (returning to a
  // step cross-session, or answers saved on another device), so prefer it and fall
  // back to the buffer.
  useEffect(() => {
    if (!currentStep) return;
    const fromStore = introResponses.find((r) => r.step_id === currentStep.id)?.responses;
    const payload = hasVisit
      ? currentStep.responses ?? fromStore ?? null
      : fromStore ?? currentStep.responses ?? null;
    dispatch({ type: "SET_INITIAL", payload });
  }, [currentStep, introResponses, hasVisit]);

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

    // Find the selected answer option. The backend tags each option with
    // next_intro_step: a label to navigate to, or null when the answer ends the
    // intro flow — so the FE doesn't decode PocketMed's label convention.
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

    const nextIntroStep = currentQuestion?.answer_options.find(
      (ao) => ao.id === Number(selectedAnswerId),
    )?.next_intro_step;

    if (nextIntroStep) {
      router.push(ROUTES.INTRO_QUESTIONS(nextIntroStep));
      return;
    }

    // No further intro step — advance cart. Backend returns the correct redirect_path:
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
      // First intro step — back exits to the product page.
      router.push(ROUTES.PRODUCT_DETAIL);
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
