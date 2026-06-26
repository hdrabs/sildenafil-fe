"use client";

import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface Props {
  onClose: () => void;
}

// Legacy aum `sample-photo-icon.svg` — person silhouette in a soft circle with a red error badge.
const SamplePhotoIcon = () => (
  <svg width="120" height="120" viewBox="0 0 130 130" fill="none" aria-hidden="true">
    <circle cx="65" cy="65" r="65" fill="#F2F8FB" />
    <g clipPath="url(#tm_clip0)">
      <path
        d="M75.94 82.1c-3.127-1.684-1.453-4.83 0-6.303 1.885-1.886 4.18-8.401 4.18-8.401 3.759-1.684 4.18-4.407 4.591-6.303 1.674-5.467-2.506-6.304-2.506-6.304s3.338-9.076.632-15.965c-3.559-9.076-17.963-12.394-20.47-4.034-17.12-3.782-13.572 19.959-13.572 19.959s-4.18.837-2.506 6.303c.411 1.886.832 4.62 4.591 6.304 0 0 2.295 6.505 4.18 8.4 1.453 1.473 3.127 4.62 0 6.304C48.795 85.418 30 86.265 30 100.97h71c0-14.664-18.795-15.511-25.06-18.87z"
        fill="#B0CCDA"
      />
    </g>
    <circle cx="110.5" cy="19.5" r="12.5" fill="#EC534B" />
    <g clipPath="url(#tm_clip1)">
      <path
        d="M105.364 25.647a1.2 1.2 0 001.692 0l3.933-3.95 3.942 3.95a1.196 1.196 0 002.001-.86 1.2 1.2 0 00-.309-.834l-3.942-3.95 3.942-3.946a1.21 1.21 0 00.393-.859 1.206 1.206 0 00-.35-.878 1.2 1.2 0 00-1.735.043l-3.942 3.947-3.942-3.947a1.193 1.193 0 00-1.717-.025 1.198 1.198 0 00.022 1.72l3.945 3.946-3.936 3.96a1.205 1.205 0 000 1.695l.003-.012z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="tm_clip0">
        <path fill="#fff" transform="translate(30 30)" d="M0 0h71v71H0z" />
      </clipPath>
      <clipPath id="tm_clip1">
        <path fill="#fff" transform="translate(105 14)" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);

// Legacy aum `phone.svg` (stroke icon; inherits the button's white via currentColor).
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PhotoTroubleModal = ({ onClose }: Props) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] rounded-[5px] bg-white p-6 shadow-xl sm:p-8"
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

        <div className="flex justify-center">
          <SamplePhotoIcon />
        </div>

        <h5 className="mt-4 text-center text-xl font-semibold text-text-primary">
          Having trouble saving your picture
        </h5>
        <p className="mx-auto mt-2 max-w-[320px] text-center text-sm leading-relaxed text-text-primary">
          Give us a call we are available to assist you Monday - Friday 9:00am to 6:00pm
        </p>

        <a
          href="tel:8447453362"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-coral py-3 text-base font-normal text-white transition-colors hover:bg-coral-hover"
        >
          <PhoneIcon />
          (844) 745-3362
        </a>
      </div>
    </div>,
    document.body,
  );
