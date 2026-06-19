"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutNavigation } from "@/api/hooks/useCheckoutQueries";
import { useActiveCart, useLastIntroStep } from "@/store";
import { ROUTES } from "@/constants/routes";
import { CheckoutNavStep } from "@/types/checkout";

const INTRO_FALLBACK_STEP = "ed_problem";

/**
 * Drives back navigation + progress for a checkout step from the backend
 * (GET /v2/checkout/navigation) — the single source of step order. The page
 * holds no hardcoded prev/next routes.
 */
export const useStepNavigation = (step: string) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const lastIntroStep = useLastIntroStep();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { data: navigation } = useCheckoutNavigation(
    { step, cart_id: cartId, cart_token: cartToken },
    cartId > 0,
  );

  const back = useCallback(() => {
    const previous = navigation?.previous;
    if (!previous) {
      router.back();
      return;
    }
    // The intro questions are a client-driven sub-flow with no single route;
    // resume the user's last intro step rather than restarting it.
    if (previous.step === "intro_questions") {
      router.push(ROUTES.INTRO_QUESTIONS(lastIntroStep ?? INTRO_FALLBACK_STEP));
      return;
    }
    router.push(previous.path);
  }, [navigation, lastIntroStep, router]);

  const steps: CheckoutNavStep[] = navigation?.steps ?? [];

  return { back, steps, navigation };
};
