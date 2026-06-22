"use client";

import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";

interface Props {
  kind: "id" | "selfie";
  onClose: () => void;
}

const IdIllustration = () => (
  <svg viewBox="0 0 240 150" className="h-auto w-full" role="img" aria-hidden="true">
    <rect x="0" y="0" width="240" height="150" rx="10" fill="#bfd9e4" />
    <rect x="0" y="0" width="240" height="34" rx="10" fill="#8fb8cc" />
    <rect x="18" y="52" width="62" height="74" rx="8" fill="#fff" />
    <circle cx="49" cy="78" r="15" fill="#8090ae" />
    <path d="M30 120c0-12 8-20 19-20s19 8 19 20z" fill="#8090ae" />
    <rect x="96" y="58" width="120" height="12" rx="6" fill="#fff" />
    <rect x="96" y="82" width="120" height="12" rx="6" fill="#fff" />
    <rect x="96" y="106" width="84" height="12" rx="6" fill="#fff" />
  </svg>
);

export const WhyNeedPhotoModal = ({ kind, onClose }: Props) => {
  const title = kind === "id" ? "Why do you need a photo of my ID?" : "Why do you need a photo of me?";
  const body =
    kind === "id"
      ? "We use your ID photo to verify your identity — for example your name and date of birth. Telemedicine laws require us to confirm this information before prescribing medication."
      : "We use your selfie to confirm the photo ID belongs to you. Telemedicine laws require us to verify your identity before prescribing medication.";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex items-center justify-center rounded-full p-1 text-text-primary transition-colors hover:bg-bg-input"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h2 className="pr-8 text-xl font-bold text-text-primary">{title}</h2>

        <div className="mx-auto mt-5 w-full max-w-[300px]">
          <IdIllustration />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-text-primary">{body}</p>

        <h3 className="mt-5 text-sm font-bold text-text-primary">Who sees this</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-primary">
          The photo will be stored securely and is only shared with the patient support team and our
          identity-verification platform.
        </p>

        <Button variant="coral" size="lg" fullWidth onClick={onClose} className="mt-6">
          I Understand
        </Button>
      </div>
    </div>,
    document.body,
  );
};
