"use client";

import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { PhotoCaptureStep, PhotoKind } from "@/features/checkout/components/PhotoCaptureStep";
import { usePhotoUpload } from "@/features/checkout/hooks/usePhotoUpload";

// The checkout ID / selfie step: the shared capture UI plus checkout chrome
// (back nav + progress bar), the "skip this step" affordance, and the
// already-uploaded-photo review. See PhotoCaptureStep for the capture UI itself.
export const PhotoUploadStep = ({ kind }: { kind: PhotoKind }) => {
  const {
    back,
    upload,
    skip,
    isUploading,
    isSkipping,
    error,
    existingPhotoUrl,
    isLoadingExisting,
    confirmExisting,
    isConfirming,
  } = usePhotoUpload(kind);

  return (
    <PhotoCaptureStep
      kind={kind}
      onSubmit={upload}
      isSubmitting={isUploading}
      error={error}
      chrome={
        <>
          <SecondaryNav onBack={back} isLoading={isUploading || isSkipping || isConfirming} />
          <CheckoutProgressBar step={kind === "id" ? "visit_id_upload" : "visit_selfie_upload"} />
        </>
      }
      skip={{ onConfirm: skip, isSkipping }}
      existing={{
        photoUrl: existingPhotoUrl,
        isLoading: isLoadingExisting,
        onConfirm: confirmExisting,
        isConfirming,
      }}
    />
  );
};
