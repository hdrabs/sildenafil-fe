"use client";

import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface Props {
  onClose: () => void;
}

const AvatarBadge = () => (
  <div className="relative mx-auto h-[120px] w-[120px]">
    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e8f4f8]">
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-hidden="true">
        <circle cx="32" cy="24" r="13" fill="#9db8c9" />
        <path d="M10 58c0-13 10-22 22-22s22 9 22 22z" fill="#9db8c9" />
      </svg>
    </div>
    <span className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-coral text-white">
      <CloseIcon className="h-5 w-5" />
    </span>
  </div>
);

export const PhotoTroubleModal = ({ onClose }: Props) => (
  createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex items-center justify-center rounded-full p-1 text-text-primary transition-colors hover:bg-bg-input"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <AvatarBadge />

        <h2 className="mt-6 text-2xl font-bold text-text-primary">Having trouble saving your picture</h2>
        <p className="mt-3 text-base leading-relaxed text-text-primary">
          Give us a call — we&apos;re available to assist you Monday–Friday, 9:00am to 6:00pm.
        </p>

        <a
          href="tel:8447453362"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-coral py-3 text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.58 3.6 1 1 0 01-.24 1l-2.24 2.2z" />
          </svg>
          (844) 745-3362
        </a>
      </div>
    </div>,
    document.body,
  )
);
