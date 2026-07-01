"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

// Mirrors the legacy ChatReminderModal copy.
export const ChatReminderModal = ({ isOpen, onClose, onOpenChat }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} title="There is a chat message.">
    <div className="space-y-5">
      <p className="text-text-muted">
        If you have any questions please contact us by phone at (714) 276-2040, or start a chat.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button fullWidth onClick={onOpenChat}>
          Open chat messages
        </Button>
        <Button fullWidth variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  </Modal>
);
