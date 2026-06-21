"use client";

import { useState } from "react";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { PhotoCaptureField } from "@/features/checkout/components/PhotoCaptureField";
import { Button } from "@/components/ui/Button";
import { usePhotoUpload } from "@/features/checkout/hooks/usePhotoUpload";

interface Props {
  kind: "id" | "selfie";
  title: string;
  description: string;
}

// ID / selfie capture step: take or upload a real photo (sent to PocketMed) and
// continue, or skip for now. Both actions advance the cart server-side.
export const PhotoUploadStep = ({ kind, title, description }: Props) => {
  const { back, steps, upload, skip, isUploading, isSkipping, error } = usePhotoUpload(kind);
  const [file, setFile] = useState<File | null>(null);

  const captureMode = kind === "id" ? "environment" : "user";
  const prompt = kind === "id" ? "Front of your government ID" : "A clear photo of your face";

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isUploading || isSkipping} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          <p className="mt-1 text-text-muted">{description}</p>

          <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
            <PhotoCaptureField capture={captureMode} prompt={prompt} onSelect={setFile} />

            {error && <p className="mt-3 text-sm text-text-error">{error}</p>}

            <Button
              variant="coral"
              size="lg"
              fullWidth
              disabled={!file}
              loading={isUploading}
              onClick={() => file && upload(file)}
              className="mt-6"
            >
              Continue
            </Button>

            <button
              type="button"
              onClick={skip}
              disabled={isSkipping || isUploading}
              className="mt-4 w-full cursor-pointer text-sm font-medium text-text-muted underline transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              Skip for now
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
