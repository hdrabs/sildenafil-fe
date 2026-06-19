"use client";

import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useSkipIdUpload, useSkipSelfieUpload } from "@/api/hooks/useCheckoutQueries";

type PhotoKind = "id" | "selfie";

/**
 * Drives the ID / selfie upload steps. Real photo capture (IDV) is out of scope
 * for this milestone, so the only action is "skip" — which records the skip with
 * PocketMed, advances the cart server-side, and routes to the returned next step.
 */
export const useSkipPhotoStep = (kind: PhotoKind) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;

  const step = kind === "id" ? "visit_id_upload" : "visit_selfie_upload";
  const { back, steps } = useStepNavigation(step);

  const skipId = useSkipIdUpload();
  const skipSelfie = useSkipSelfieUpload();
  const mutation = kind === "id" ? skipId : skipSelfie;

  const skip = async () => {
    if (cartId <= 0) return;
    const { redirect_path } = await mutation.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  return { back, steps, skip, isSkipping: mutation.isPending };
};
