"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import Image from "next/image";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { CameraCaptureModal } from "@/features/checkout/components/CameraCaptureModal";
import { WhyNeedPhotoModal } from "@/features/checkout/components/WhyNeedPhotoModal";
import { PhotoTroubleModal } from "@/features/checkout/components/PhotoTroubleModal";
import { SkipPhotoDrawer } from "@/features/checkout/components/SkipPhotoDrawer";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePhotoUpload } from "@/features/checkout/hooks/usePhotoUpload";

type PhotoKind = "id" | "selfie";

const COPY = {
  id: {
    landingTitle: "Upload a photo of your ID?",
    whyLong: "Why do you need a photo of my ID?",
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
    illustration: "/images/id-upload.png",
  },
  selfie: {
    landingTitle: "Upload a photo of your face",
    whyLong: "Why do you need a photo of me?",
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
    illustration: "/images/selfie-upload.png",
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
  <div className="mt-[50px] flex flex-col items-center gap-6">
    <button
      type="button"
      onClick={onTrouble}
      className="cursor-pointer text-base font-normal text-text-primary underline transition-opacity hover:opacity-80"
    >
      Having trouble with your photo?
    </button>
    <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#909090]">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
      </svg>
      128-Bit TLS Security
    </span>
  </div>
);

// Phones/tablets use the OS camera (file input + `capture`), which is far more
// reliable than getUserMedia in mobile browsers/webviews; desktop uses the live
// webcam modal. iPadOS 13+ masquerades as desktop Safari, so fall back to touch.
const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPod|Mobile|iPad/i.test(ua)) return true;
  return navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua);
};

// ID / selfie step matching the legacy aum flow: pick or capture a real photo
// (live camera via getUserMedia, or choose a file), review it against a checklist,
// then upload — or skip. If a photo is already on file (returning to the step), it
// is shown for review with a "Continue" that advances without re-uploading.
export const PhotoUploadStep = ({ kind }: { kind: PhotoKind }) => {
  const c = COPY[kind];
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  // Lazy init (not an effect) — only drives the Take Photo handler, never the DOM,
  // so the SSR=false / client value difference can't cause a hydration mismatch.
  const [isMobile] = useState(() => isMobileDevice());
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [retaken, setRetaken] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);

  // A freshly captured/selected photo wins; otherwise show the already-uploaded one
  // (until the user chooses to re-take).
  const showExisting = !!existingPhotoUrl && !retaken;
  const displayUrl = previewUrl ?? (showExisting ? existingPhotoUrl : null);

  // Revoke the preview's object URL when it's replaced or the step unmounts, so
  // a captured-but-not-uploaded photo doesn't leak its blob URL.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const setCaptured = (f: File) => {
    setPreviewUrl(URL.createObjectURL(f));
    setFile(f);
    setCameraOpen(false);
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setCaptured(f);
    e.target.value = ""; // allow re-selecting the same file
  };

  const retake = () => {
    setPreviewUrl(null);
    setFile(null);
    setRetaken(true);
  };

  const showLoader = isLoadingExisting && !previewUrl && !retaken;

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isUploading || isSkipping || isConfirming} />
      <CheckoutProgressBar step={kind === "id" ? "visit_id_upload" : "visit_selfie_upload"} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />
          {/* Mobile "Take Photo" → OS camera (rear for ID, front for selfie). */}
          <input
            ref={captureInputRef}
            type="file"
            accept="image/*"
            capture={c.facingMode}
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
                onClick={() => setSkipOpen(true)}
                className="cursor-pointer text-base font-normal text-text-link underline transition-opacity hover:opacity-80"
              >
                Skip this step for now
              </button>

              <h1 className="mt-6 text-2xl font-semibold text-text-primary">{c.landingTitle}</h1>
              <p className={`text-text-primary ${kind === "selfie" ? "mt-2" : "mt-2.5"}`}>{c.intro}</p>
              {/* Red callout + ID illustration share one relative box so the legacy
                  connector line runs from the callout's right margin down into the
                  ID's name area (id step only). */}
              <div className="relative my-5 flex flex-col items-center">
                {/* Constrained + left-aligned so the callout text never runs under the
                    connector line on the right. */}
                {c.onlyNeed && <p className="max-w-[80%] self-start text-coral">{c.onlyNeed}</p>}

                <Image
                  src={c.illustration}
                  alt=""
                  width={276}
                  height={180}
                  unoptimized
                  className={`${c.onlyNeed ? "mt-6 " : ""}block h-auto w-full max-w-[276px]`}
                />

                {kind === "id" && (
                  <>
                    {/* vertical drop starting at the callout ("…any other") line. The
                        callout wraps taller on phones, so drop further there. */}
                    <span className="absolute right-[2%] top-[5%] h-[40%] w-[34px] border-r border-t border-[#e05c4b] max-xs:h-[45%] max-xs:w-[28px]" />
                    {/* shorter horizontal run so the arrow lands on the small ID photo (right side) */}
                    <span className="absolute right-[2%] top-[45%] w-[25%] border-t border-[#e05c4b] max-xs:top-[50%] max-xs:w-[22%] max-[460px]:w-[18%]">
                      <span className="absolute left-[-4px] top-[-4px] inline-block rotate-[135deg] border-b border-r border-[#e05c4b] p-[3px]" />
                    </span>
                  </>
                )}
              </div>

              {c.note && <p className="mt-3 text-sm text-text-primary">{c.note}</p>}

              {/* Landing "why" link is ID-only (the selfie step has none in aum). */}
              {kind === "id" && (
                <button
                  type="button"
                  onClick={() => setWhyOpen(true)}
                  className="mt-4 block cursor-pointer text-sm font-normal text-text-link underline transition-opacity hover:opacity-80"
                >
                  <span className="md:hidden">Why do you need this?</span>
                  <span className="hidden md:inline">{c.whyLong}</span>
                </button>
              )}

              <div className="mt-8 flex gap-2.5 sm:gap-4">
                <Button
                  variant="coral"
                  size="lg"
                  fullWidth
                  className="px-2 text-sm font-normal transition-all hover:shadow-md sm:px-6 sm:text-base"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Photo
                </Button>
                <Button
                  variant="coral"
                  size="lg"
                  fullWidth
                  className="px-2 text-sm font-normal transition-all hover:shadow-md sm:px-6 sm:text-base"
                  onClick={() => (isMobile ? captureInputRef.current?.click() : setCameraOpen(true))}
                >
                  Take Photo
                </Button>
              </div>

              <TroubleFooter onTrouble={() => setTroubleOpen(true)} />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-text-primary">{c.reviewTitle}</h1>
              <p className="mt-2.5 text-text-primary">
                {c.intro} <span className="font-bold">{c.emphasis}</span>
              </p>
              <button
                type="button"
                onClick={() => setWhyOpen(true)}
                className="mt-4 block cursor-pointer text-sm font-normal text-text-primary underline transition-opacity hover:opacity-80"
              >
                Why do you need this?
              </button>

              <div className="relative mt-12 overflow-hidden rounded-2xl bg-black">
                {/* Remote (PocketMed) or object-URL preview — next/image can't optimize either here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayUrl} alt="ID photo" className="mx-auto max-h-[400px] w-full object-contain" />
                <button
                  type="button"
                  onClick={retake}
                  className="absolute bottom-2.5 right-2.5 flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/50 px-[35px] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-100 max-[430px]:px-2.5 max-[430px]:text-xs"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M9 3l-1.8 2H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.2L15 3H9zm3 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                  Re-take
                </button>
              </div>

              <p className="mt-8 font-bold text-text-primary">Ensure that:</p>
              <ul className="mt-2.5 space-y-2.5">
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
                  className="mt-10"
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
                  className="mt-10"
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
          onUploadInstead={() => {
            setCameraOpen(false);
            fileInputRef.current?.click();
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
      {whyOpen && <WhyNeedPhotoModal kind={kind} onClose={() => setWhyOpen(false)} />}
      {troubleOpen && <PhotoTroubleModal onClose={() => setTroubleOpen(false)} />}
      <SkipPhotoDrawer
        show={skipOpen}
        onClose={() => setSkipOpen(false)}
        onConfirm={skip}
        isSkipping={isSkipping}
      />
    </>
  );
};
