"use client";

import { Spinner } from "@/components/ui/Spinner";
import { PhotoCaptureStep } from "@/features/checkout/components/PhotoCaptureStep";
import { useRetakePhotos } from "@/features/retake/hooks/useRetakePhotos";

export const RetakePhotosPage = () => {
  const { isLoading, currentKind, submit, isUploading, error } = useRetakePhotos();

  // Loading, or redirecting out (nothing to re-take).
  if (isLoading || !currentKind) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <Spinner size="lg" />
      </div>
    );
  }

  // Same capture UI as the checkout ID/selfie steps — no checkout chrome, no skip
  // (retake is mandatory), no existing-photo review (always a fresh re-upload).
  const uiKind = currentKind === "id_card" ? "id" : "selfie";

  // key by kind so the capture state resets between the selfie and ID steps.
  return (
    <PhotoCaptureStep
      key={uiKind}
      kind={uiKind}
      onSubmit={submit}
      isSubmitting={isUploading}
      error={error}
    />
  );
};
