"use client";

import { Modal } from "@/components/ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Pixel port of AUM's #resume-visit-modal (UnderReviewVisitModal): 580px white
// dialog with 5px radius, 30px side / 40px vertical body padding, an absolute
// top-right close glyph (modal-close.svg), a centered 18px/600 title, 14px body
// copy on an airy 27px line-height, and the #1B53AF phone-contact line.
export const UnderReviewModal = ({ isOpen, onClose }: Props) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-[580px] rounded-[5px] bg-white"
    bodyClassName="px-[30px] py-10"
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-4 top-4 z-[300] leading-none"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M.456 14.559a1.5 1.5 0 002.116 0l4.916-4.937 4.927 4.937a1.496 1.496 0 002.502-1.074 1.5 1.5 0 00-.387-1.044L9.603 7.505l4.927-4.933A1.5 1.5 0 0012.9.097a1.497 1.497 0 00-.485.357L7.488 5.387 2.56.454A1.497 1.497 0 10.442 2.572l4.93 4.933-4.92 4.95a1.504 1.504 0 000 2.118l.004-.014z"
          fill="#000"
        />
      </svg>
    </button>

    <div className="my-2 text-center text-[18px] leading-[27px]">
      <h5 className="mb-5 text-[18px] font-semibold leading-[1.2] text-text-primary">
        Your visit for Erectile Dysfunction (ED) is currently under review
      </h5>
      <p className="mb-1 text-[14px] text-text-primary">
        We will contact you as soon as there is an update. If you have any questions please contact
        us by phone.
      </p>
      <p className="mb-0 text-center text-[14px]">
        <a href="tel:+17142762040" className="inline-flex items-center text-[#1B53AF]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
            aria-hidden="true"
          >
            <path
              d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z"
              fill="#1B53AF"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          (714) 276-2040
        </a>
      </p>
    </div>
  </Modal>
);
