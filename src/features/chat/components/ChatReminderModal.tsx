"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

// Styled to match the legacy AUM #chat-remainder-modal: borderless header with a
// bare close glyph, big centered title, centered body copy with the inline "here"
// chat link, and the coral/grey-outline pill pair (stacked on mobile, side-by-side
// on desktop). The coral variant CSS-uppercases the label → "OPEN CHAT MESSAGES".
export const ChatReminderModal = ({ isOpen, onClose, onOpenChat }: Props) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="lg"
    className="rounded-[5px] max-w-[800px]"
    bodyClassName="p-[30px]"
  >
    <div className="mb-2 flex justify-end">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="-mr-2 -mt-2 text-2xl font-bold leading-none text-black opacity-50 transition-opacity hover:opacity-75"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h5 className="mb-[15px] px-2 text-center text-[25px] font-semibold leading-[46px] text-text-primary">
      There is a chat message.
    </h5>
    <p className="px-2 pb-[25px] text-center text-base text-text-primary">
      If you have any questions please contact us by phone at (714) 276-2040 or start a chat by
      clicking{" "}
      <button
        type="button"
        onClick={onOpenChat}
        className="text-link-blue underline-offset-2 hover:underline"
      >
        here
      </button>
    </p>
    <div className="mt-6 flex flex-col gap-2 md:flex-row md:gap-4">
      <Button variant="outline-muted" size="lg" fullWidth onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="coral"
        size="lg"
        fullWidth
        className="font-normal tracking-normal"
        onClick={onOpenChat}
      >
        Open chat messages
      </Button>
    </div>
  </Modal>
);
