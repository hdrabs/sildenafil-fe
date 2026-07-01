"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRetake: () => void;
}

export const RetakeModal = ({ isOpen, onClose, onRetake }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Action needed on your photos">
    <div className="space-y-5">
      <p className="text-text-muted">
        There was an issue with the quality of your selfie and/or ID photo. Please re-take them so
        we can complete your visit.
      </p>
      <div className="flex flex-col gap-2">
        <Button fullWidth size="lg" onClick={onRetake}>
          Re-take photos
        </Button>
        <Button fullWidth variant="ghost" onClick={onClose}>
          Not now
        </Button>
      </div>
    </div>
  </Modal>
);
