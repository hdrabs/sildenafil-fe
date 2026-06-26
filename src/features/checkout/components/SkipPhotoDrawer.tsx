"use client";

import { Drawer } from "@/components/ui/Drawer";
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
  <Drawer
    open={show}
    onClose={onClose}
    size="wide"
    title="Ok, you can skip for now and submit your photos later."
    titleClassName="text-2xl font-medium leading-snug min-[1040px]:text-2xl"
  >
    <p className="mb-4 text-base leading-relaxed text-text-primary">
      Remember: your provider will have to verify your identity in order to prescribe treatment. After
      you complete your visit, you can upload your ID and selfie in your account.
    </p>

    <div className="flex flex-col">
      <Button
        variant="coral"
        size="lg"
        fullWidth
        loading={isSkipping}
        onClick={onConfirm}
        className="font-normal"
      >
        Skip and submit later
      </Button>
      <button
        type="button"
        onClick={onClose}
        disabled={isSkipping}
        className="mt-6 cursor-pointer text-center text-base font-normal text-text-primary transition-opacity hover:opacity-80 disabled:opacity-60"
      >
        Cancel Skip
      </button>
    </div>
  </Drawer>
);
