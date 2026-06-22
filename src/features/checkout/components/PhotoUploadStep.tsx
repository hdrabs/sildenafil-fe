"use client";

import { useRef, useState, ChangeEvent } from "react";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { CameraCaptureModal } from "@/features/checkout/components/CameraCaptureModal";
import { WhyNeedPhotoModal } from "@/features/checkout/components/WhyNeedPhotoModal";
import { PhotoTroubleModal } from "@/features/checkout/components/PhotoTroubleModal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePhotoUpload } from "@/features/checkout/hooks/usePhotoUpload";

type PhotoKind = "id" | "selfie";

const COPY = {
  id: {
    landingTitle: "Upload a photo of your ID?",
    intro: "Due to telemedicine regulations, we need to verify your identity with a government issued ID.",
    onlyNeed: "We only need your Name, Date of Birth, and Picture. Any other information is optional.",
    note: "Note: Your ID should match the name and birthdate previously provided.",
    reviewTitle: "Review and confirm photo of your ID",
    emphasis: "Your driver’s license, passport, or a government issued ID that included a picture of you.",
    checklist: [
      "The photo is not blurry or dark",
      "Your ID is not cutoff",
      "Your ID is government issued and not expired",
    ],
    facingMode: "environment" as const,
  },
  selfie: {
    landingTitle: "Upload a photo of your face",
    intro: "Due to telemedicine regulations, we need to verify your identity with a photo of your face.",
    onlyNeed: null as string | null,
    note: null as string | null,
    reviewTitle: "Review and confirm photo of your Selfie",
    emphasis: "A clear selfie that shows your face.",
    checklist: [
      "The photo is not blurry or dark",
      "You are the only person in your photo",
      "The photo has not been edited/filtered",
    ],
    facingMode: "user" as const,
  },
};

const CheckItem = ({ children }: { children: string }) => (
  <li className="flex items-center gap-2 text-text-primary">
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-primary" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4.4-4.4z"
        clipRule="evenodd"
      />
    </svg>
    {children}
  </li>
);

const TroubleFooter = ({ onTrouble }: { onTrouble: () => void }) => (
  <div className="mt-8 flex flex-col items-center gap-3">
    <button
      type="button"
      onClick={onTrouble}
      className="cursor-pointer text-sm font-medium text-text-primary underline transition-opacity hover:opacity-80"
    >
      Having trouble with your photo?
    </button>
    <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-text-muted">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
      </svg>
      128-Bit TLS Security
    </span>
  </div>
);

// ID / selfie step matching the legacy aum flow: pick or capture a real photo
// (live camera via getUserMedia, or choose a file), review it against a checklist,
// then upload — or skip. If a photo is already on file (returning to the step), it
// is shown for review with a "Continue" that advances without re-uploading.
export const PhotoUploadStep = ({ kind }: { kind: PhotoKind }) => {
  const c = COPY[kind];
  const {
    back,
    steps,
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [retaken, setRetaken] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);

  // A freshly captured/selected photo wins; otherwise show the already-uploaded one
  // (until the user chooses to re-take).
  const showExisting = !!existingPhotoUrl && !retaken;
  const displayUrl = previewUrl ?? (showExisting ? existingPhotoUrl : null);

  const setCaptured = (f: File) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setFile(f);
    setCameraOpen(false);
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCaptured(f);
    e.target.value = ""; // allow re-selecting the same file
  };

  const retake = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    setRetaken(true);
  };

  const showLoader = isLoadingExisting && !previewUrl && !retaken;

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isUploading || isSkipping || isConfirming} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />

          {showLoader ? (
            <div className="flex justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : !displayUrl ? (
            <>
              <button
                type="button"
                onClick={skip}
                disabled={isSkipping}
                className="cursor-pointer text-sm font-medium text-link-blue underline transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                Skip this step for now
              </button>

              <h1 className="mt-4 text-2xl font-bold text-text-primary">{c.landingTitle}</h1>
              <p className="mt-3 text-text-primary">{c.intro}</p>
              {c.onlyNeed && <p className="mt-3 font-medium text-coral">{c.onlyNeed}</p>}
              {c.note && <p className="mt-3 text-sm text-text-muted">{c.note}</p>}

              <button
                type="button"
                onClick={() => setWhyOpen(true)}
                className="mt-4 block cursor-pointer text-sm font-medium text-link-blue underline transition-opacity hover:opacity-80"
              >
                Why do you need this?
              </button>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="coral" size="lg" fullWidth onClick={() => fileInputRef.current?.click()}>
                  Select Photo
                </Button>
                <Button variant="coral" size="lg" fullWidth onClick={() => setCameraOpen(true)}>
                  Take Photo
                </Button>
              </div>

              <TroubleFooter onTrouble={() => setTroubleOpen(true)} />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-text-primary">{c.reviewTitle}</h1>
              <p className="mt-3 text-text-primary">
                {c.intro} <span className="font-bold">{c.emphasis}</span>
              </p>
              <button
                type="button"
                onClick={() => setWhyOpen(true)}
                className="mt-4 block cursor-pointer text-sm font-medium text-link-blue underline transition-opacity hover:opacity-80"
              >
                Why do you need this?
              </button>

              <div className="relative mt-6 overflow-hidden rounded-2xl bg-black">
                {/* Remote (PocketMed) or object-URL preview — next/image can't optimize either here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayUrl} alt="ID photo" className="mx-auto max-h-[420px] w-full object-contain" />
                <button
                  type="button"
                  onClick={retake}
                  className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black/75"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M9 3l-1.8 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.2L15 3H9zm3 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                  Re-take
                </button>
              </div>

              <p className="mt-6 font-bold text-text-primary">Ensure that:</p>
              <ul className="mt-2 space-y-2">
                {c.checklist.map((t) => (
                  <CheckItem key={t}>{t}</CheckItem>
                ))}
              </ul>

              {error && <p className="mt-3 text-sm text-text-error">{error}</p>}

              {previewUrl ? (
                <Button
                  variant="coral"
                  size="lg"
                  fullWidth
                  loading={isUploading}
                  disabled={!file}
                  onClick={() => file && upload(file)}
                  className="mt-6"
                >
                  Upload
                </Button>
              ) : (
                <Button
                  variant="coral"
                  size="lg"
                  fullWidth
                  loading={isConfirming}
                  onClick={confirmExisting}
                  className="mt-6"
                >
                  Continue
                </Button>
              )}

              <TroubleFooter onTrouble={() => setTroubleOpen(true)} />
            </>
          )}
        </div>
      </main>

      {cameraOpen && (
        <CameraCaptureModal
          facingMode={c.facingMode}
          fileName={`${kind}-photo.jpg`}
          onCapture={setCaptured}
          onClose={() => setCameraOpen(false)}
        />
      )}
      {whyOpen && <WhyNeedPhotoModal kind={kind} onClose={() => setWhyOpen(false)} />}
      {troubleOpen && <PhotoTroubleModal onClose={() => setTroubleOpen(false)} />}
    </>
  );
};
