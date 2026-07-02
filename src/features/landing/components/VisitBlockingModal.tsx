"use client";

import { useRouter } from "next/navigation";
import { RetakeModal } from "@/features/retake/components/RetakeModal";
import { UnderReviewModal } from "./UnderReviewModal";
import { OrderProcessingModal } from "./OrderProcessingModal";
import { useOpenChat } from "@/features/chat/hooks/useChat";
import { useUser } from "@/store";
import { ROUTES } from "@/constants/routes";
import { VisitEligibilityModal } from "@/types/visit";

interface Props {
  modal: VisitEligibilityModal | null;
  onDismiss: () => void;
}

// The `visit_eligibility` "show_modal" block. Each blocking reason maps to its
// AUM-faithful modal: `retake` reuses the RetakeModal (matches the global
// RetakeGate prompt), `under_review` the UnderReviewModal, `order_processing`
// the OrderProcessingModal. Renders nothing when not blocked.
export const VisitBlockingModal = ({ modal, onDismiss }: Props) => {
  const router = useRouter();
  const openChat = useOpenChat();
  const hasPocketmed = !!useUser()?.pocketmedUuid;

  if (modal === "retake") {
    return (
      <RetakeModal
        isOpen
        onClose={onDismiss}
        onRetake={() => {
          onDismiss();
          router.push(ROUTES.RETAKE_PHOTOS);
        }}
        onOpenChat={() => {
          onDismiss();
          // Guard so a rare non-pocketmed user's "here" click doesn't fire mark-read.
          if (hasPocketmed) openChat();
        }}
      />
    );
  }

  if (modal === "under_review") {
    return <UnderReviewModal isOpen onClose={onDismiss} />;
  }

  if (modal === "order_processing") {
    return (
      <OrderProcessingModal
        isOpen
        onClose={onDismiss}
        onGoToDashboard={() => {
          onDismiss();
          router.push(ROUTES.ORDERS);
        }}
      />
    );
  }

  return null;
};
