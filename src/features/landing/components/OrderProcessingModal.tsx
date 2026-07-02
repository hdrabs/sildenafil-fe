"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
}

// Pixel port of AUM's #duplicate-cart-modal (DuplicateCartModal): shares the
// 580px / 5px-radius / 40-30 padding shell and absolute close glyph with the
// under-review modal, then a centered 18px/600 title, 14px body with the inline
// blue phone link, and a full-width coral (#ec534b) pill CTA to the dashboard.
export const OrderProcessingModal = ({ isOpen, onClose, onGoToDashboard }: Props) => (
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
        Your Prescription is Being Processed
      </h5>
      <p className="mb-6 text-[14px] text-text-primary">
        Your healthcare provider has approved a medication for you and the AUM Pharmacy team is
        diligently processing your order. For any additional details, kindly give us a call at{" "}
        <a href="tel:+17142762040" className="text-[#1B53AF] hover:underline">
          (714) 276-2040
        </a>
        .
      </p>
      <Button
        variant="coral"
        size="md"
        fullWidth
        className="h-auto whitespace-normal py-2.5 font-normal tracking-normal"
        onClick={onGoToDashboard}
      >
        Go to Your Dashboard for Status Updates
      </Button>
    </div>
  </Modal>
);
