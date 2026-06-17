"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetEligibleStates,
  useCreateVisit,
  useAdvanceVisitConsent,
} from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart, useIntroResponses, useClearIntroResponses } from "@/store";
import { visitConsentSchema, VisitConsentFormValues } from "../schemas/visitConsentSchema";
import { questionnaireService } from "@/api/services/questionnaireService";
import type { EligibleState } from "@/types/visit";

export const useVisitConsent = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const introResponses = useIntroResponses();
  const clearIntroResponses = useClearIntroResponses();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;
  const cartAuth = { cart_id: cartId, cart_token: cartToken };

  const { data: statesData, isLoading: isLoadingStates } = useGetEligibleStates(cartId > 0);
  const { mutateAsync: createVisit, isPending, error } = useCreateVisit();
  const { mutateAsync: advanceVisitConsent, isPending: isAdvancing } = useAdvanceVisitConsent();

  const form = useForm<VisitConsentFormValues>({
    resolver: zodResolver(visitConsentSchema),
    defaultValues: { state: "", terms: false, state_ack: false },
  });

  const selectedState = form.watch("state");

  const submit = form.handleSubmit(async (values) => {
    try {
      await createVisit({
        cart_id: cartId,
        cart_token: cartToken,
        visit: {
          state: values.state,
          terms: values.terms,
          state_ack: values.state_ack,
        },
      });

      // Bulk-save accumulated intro responses into the questionnaire now that
      // the visit exists. These must be persisted before the questionnaire starts.
      for (const response of introResponses) {
        await questionnaireService.saveStep({
          ...cartAuth,
          responses: response.responses,
        });
      }
      clearIntroResponses();

      // Advance visit_consent cart step → backend returns redirect_path: "/checkout/patient-info"
      const { redirect_path } = await advanceVisitConsent(cartAuth);
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
    isLoadingStates,
    isPending: isPending || isAdvancing,
    submitError,
    selectedState,
  };
};
