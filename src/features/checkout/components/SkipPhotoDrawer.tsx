"use client";

import { LegalDrawer } from "@/components/legal/LegalDrawer";
import { Button } from "@/components/ui/Button";

interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSkipping: boolean;
}

// Confirmation drawer for "Skip this step for now" — the photo can be uploaded
// later from the account, but the provider can't verify identity until then.
export const SkipPhotoDrawer = ({ show, onClose, onConfirm, isSkipping }: Props) => (
  <LegalDrawer show={show} onClose={onClose} title="Ok, you can skip for now and submit your photos later.">
    <p>
      Remember: your provider will have to verify your identity in order to prescribe treatment. After
      you complete your visit, you can upload your ID and selfie in your account.
    </p>

    <div className="mt-6 flex flex-col">
      <Button variant="coral" size="lg" fullWidth loading={isSkipping} onClick={onConfirm}>
        Skip and submit later
      </Button>
      <button
        type="button"
        onClick={onClose}
        disabled={isSkipping}
        className="mt-4 cursor-pointer text-center text-sm font-medium text-text-primary transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        Cancel Skip
      </button>
    </div>
  </LegalDrawer>
);
