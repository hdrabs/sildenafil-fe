"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import {
  useUploadIdPhoto,
  useUploadSelfiePhoto,
  useSkipIdUpload,
  useSkipSelfieUpload,
  useExistingIdPhoto,
  useExistingSelfiePhoto,
  useContinueIdUpload,
  useContinueSelfieUpload,
} from "@/api/hooks/useCheckoutQueries";
import { APIError } from "@/api/baseAPI";

type PhotoKind = "id" | "selfie";

/**
 * Drives the ID / selfie upload steps: capture/upload a real photo (sent to
 * PocketMed) or skip. Also surfaces a previously-uploaded photo (fetched back from
 * PocketMed) so returning to the step shows it with a "Continue" instead of forcing
 * a re-upload. Every action advances the cart server-side and the page follows the
 * returned redirect_path.
 */
export const usePhotoUpload = (kind: PhotoKind) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;
  const isId = kind === "id";

  const step = isId ? "visit_id_upload" : "visit_selfie_upload";
  const { back, steps } = useStepNavigation(step);

  // Hooks must run unconditionally; the per-kind variant is selected after.
  const uploadId = useUploadIdPhoto();
  const uploadSelfie = useUploadSelfiePhoto();
  const skipId = useSkipIdUpload();
  const skipSelfie = useSkipSelfieUpload();
  const continueId = useContinueIdUpload();
  const continueSelfie = useContinueSelfieUpload();
  const idPhoto = useExistingIdPhoto(cartId, cartToken, isId);
  const selfiePhoto = useExistingSelfiePhoto(cartId, cartToken, !isId);

  const uploadMutation = isId ? uploadId : uploadSelfie;
  const skipMutation = isId ? skipId : skipSelfie;
  const continueMutation = isId ? continueId : continueSelfie;
  const photoQuery = isId ? idPhoto : selfiePhoto;

  const [error, setError] = useState<string | null>(null);

  const upload = async (photo: File) => {
    if (cartId <= 0) return;
    setError(null);
    try {
      const { redirect_path } = await uploadMutation.mutateAsync({
        cart_id: cartId,
        cart_token: cartToken,
        photo,
      });
      router.push(redirect_path);
    } catch (e) {
      setError(e instanceof APIError ? e.message : "We couldn't upload your photo. Please try again.");
    }
  };

  const skip = async () => {
    if (cartId <= 0) return;
    const { redirect_path } = await skipMutation.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  // Advance with the already-uploaded photo — no re-upload.
  const confirmExisting = async () => {
    if (cartId <= 0) return;
    const { redirect_path } = await continueMutation.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  return {
    back,
    steps,
    upload,
    skip,
    isUploading: uploadMutation.isPending,
    isSkipping: skipMutation.isPending,
    error,
    existingPhotoUrl: photoQuery.data?.photo_url ?? null,
    isLoadingExisting: photoQuery.isLoading,
    confirmExisting,
    isConfirming: continueMutation.isPending,
  };
};
