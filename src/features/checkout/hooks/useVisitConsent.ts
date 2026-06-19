"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetEligibleStates,
  useGetVisitState,
  useSubmitVisitConsent,
} from "@/api/hooks/useQuestionnaireQueries";
import {
  useActiveCart,
  useIntroResponses,
  useClearIntroResponses,
  useVisitConsentState,
  useSetVisitConsentState,
} from "@/store";
import { visitConsentSchema, VisitConsentFormValues } from "../schemas/visitConsentSchema";
import type { EligibleState } from "@/types/visit";

export const useVisitConsent = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const introResponses = useIntroResponses();
  const clearIntroResponses = useClearIntroResponses();
  const savedConsentState = useVisitConsentState();
  const setVisitConsentState = useSetVisitConsentState();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { data: statesData, isLoading: isLoadingStates } = useGetEligibleStates(cartId > 0);
  const { data: edVisitData, isLoading: isLoadingVisit } = useGetVisitState(cartId, cartToken);
  const { mutateAsync: submitVisitConsent, isPending, error } = useSubmitVisitConsent();

  // Backend state takes priority (works cross-browser); fall back to localStorage for same cart
  const localState = savedConsentState?.cartId === cartId ? savedConsentState.state : "";
  const initialState = edVisitData?.state || localState;

  const form = useForm<VisitConsentFormValues>({
    resolver: zodResolver(visitConsentSchema),
    defaultValues: {
      state: initialState,
      terms: edVisitData?.terms ?? false,
      state_ack: edVisitData?.state_ack ?? false,
    },
  });

  // When backend data arrives, apply each field if the user hasn't touched it yet
  useEffect(() => {
    if (!edVisitData) return;
    if (edVisitData.state && !form.getValues("state")) {
      form.setValue("state", edVisitData.state);
    }
    if (edVisitData.terms && !form.getValues("terms")) {
      form.setValue("terms", true);
    }
    if (edVisitData.state_ack && !form.getValues("state_ack")) {
      form.setValue("state_ack", true);
    }
  }, [edVisitData, form]);

  const [selectedState, watchedTerms, watchedStateAck] = form.watch(["state", "terms", "state_ack"]);
  const canSubmit = !!selectedState && watchedTerms === true && watchedStateAck === true;

  const submit = form.handleSubmit(async (values) => {
    try {
      setVisitConsentState(cartId, values.state);

      // One server-side call creates the visit, persists the intro responses the
      // user answered before the visit existed, and advances the cart step
      // (backend returns redirect_path: "/checkout/patient-info").
      const { redirect_path } = await submitVisitConsent({
        cart_id: cartId,
        cart_token: cartToken,
        visit: {
          state: values.state,
          terms: values.terms,
          state_ack: values.state_ack,
        },
        intro_responses: introResponses.map((r) => ({ responses: r.responses })),
      });

      clearIntroResponses();
      router.push(redirect_path);
    } catch {
      // error surfaced via mutation error state
    }
  });

  const eligibleStates: EligibleState[] = statesData?.states ?? [];
  const submitError = (error as { message?: string } | null)?.message ?? null;

  return {
    form,
    submit,
    eligibleStates,
    isLoadingStates: isLoadingStates || isLoadingVisit,
    isPending,
    submitError,
    selectedState,
    canSubmit,
  };
};
