"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";

interface Props {
  kind: "id" | "selfie";
  onClose: () => void;
}

export const WhyNeedPhotoModal = ({ kind, onClose }: Props) => {
  const title = kind === "id" ? "Why do you need a photo of my ID?" : "Why do you need a photo of me?";
  const body =
    kind === "id"
      ? "We use your ID photo to verify your identity, for example your name and date of birth. Telemedicine laws require us to verify this information before prescribing medication."
      : "We use your selfie to confirm the photo ID belongs to you. Telemedicine laws require us to verify your identity before prescribing medication.";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] rounded-[5px] bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex cursor-pointer items-center justify-center rounded-full p-1 text-text-primary transition-colors hover:bg-bg-input"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        {/* Header — title above, ID illustration centered below. */}
        <h5 className="pr-8 text-xl font-semibold leading-snug text-text-primary">{title}</h5>
        <div className="mt-5 flex justify-center">
          <Image
            src="/images/id-card.png"
            alt=""
            width={300}
            height={160}
            unoptimized
            className="h-auto w-[180px]"
          />
        </div>

        <p className="mt-6 text-sm leading-relaxed text-text-primary">{body}</p>

        <strong className="mt-4 block text-sm font-bold text-text-primary">Who sees this</strong>
        <p className="mt-1 text-sm leading-relaxed text-text-primary">
          The photo of your ID will be stored securely and will only be shared with the patient
          support team and our identity verification platform.
        </p>

        <div className="mt-6 flex justify-center">
          <Button variant="coral" size="lg" onClick={onClose} className="w-[250px] max-w-full font-normal">
            I Understand
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
