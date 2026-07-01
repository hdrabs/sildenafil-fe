"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAuthenticated } from "@/store";
import { useRetakeStatus, useUploadRetakePhoto } from "@/api/hooks/useRetakeQueries";
import { retakeKeys } from "@/constants/queryKeys";
import { RetakeKind } from "@/types/retake";
import { ROUTES } from "@/constants/routes";

/**
 * Drives /retake-photos: fetches the outstanding retake flags (the cart is
 * resolved server-side from the patient's visit under review — no cart_id needed),
 * walks them through re-uploading selfie-first, and returns to orders once nothing
 * remains (the backend finalizes with PocketMed and the visit goes back to review).
 * Each upload seeds the refreshed flags into the query cache, so the current step
 * is always derived from it.
 */
export const useRetakePhotos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();

  const { data: status, isLoading } = useRetakeStatus(isAuthenticated);
  const uploadMutation = useUploadRetakePhoto();
  const [error, setError] = useState<string | null>(null);

  // Must be signed in to retake.
  useEffect(() => {
    if (!isAuthenticated) router.replace(ROUTES.LOGIN);
  }, [isAuthenticated, router]);

  // Nothing (left) to re-take → back to the orders page.
  useEffect(() => {
    if (status && !status.selfie_retake && !status.id_retake) router.replace(ROUTES.ORDERS);
  }, [status, router]);

  // Selfie first, then ID.
  const currentKind: RetakeKind | null = status?.selfie_retake
    ? "selfie"
    : status?.id_retake
      ? "id_card"
      : null;

  const submit = async (photo: File) => {
    if (!currentKind) return;
    setError(null);
    try {
      const res = await uploadMutation.mutateAsync({ kind: currentKind, photo });
      queryClient.setQueryData(retakeKeys.status(), {
        selfie_retake: res.selfie_retake,
        id_retake: res.id_retake,
      });
    } catch {
      setError("We couldn't upload your photo. Please try again.");
    }
  };

  return {
    isLoading,
    currentKind,
    submit,
    isUploading: uploadMutation.isPending,
    error,
  };
};
