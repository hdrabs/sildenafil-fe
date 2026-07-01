"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@/store";
import { useChatStore } from "@/store/chatStore";
import { useChatUnread, useOpenChat } from "@/features/chat/hooks/useChat";
import { ChatReminderModal } from "@/features/chat/components/ChatReminderModal";

// Don't interrupt an in-progress flow (auth/token exchange/checkout/upsell/retake).
const FLOW_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/users/become",
  "/magic-link",
  "/confirmation",
  "/upsell-offer",
  "/checkout",
  "/retake-photos",
];

/**
 * Mounted globally. Two entry points to the chat, mirroring the legacy:
 *  - the email/SMS deep-link (`?chat=true`, also `?show_chat`) opens the Message
 *    Center directly;
 *  - otherwise, when there are unread messages, a reminder modal prompts them.
 */
export const ChatGate = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasPocketmed = !!useUser()?.pocketmedUuid;
  const unread = useChatUnread();
  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useOpenChat();
  const [dismissed, setDismissed] = useState(false);

  const wantsChat = searchParams.get("chat") === "true" || searchParams.get("show_chat") !== null;

  // Deep-link → open chat directly (and mark read via openChat).
  useEffect(() => {
    if (wantsChat && hasPocketmed) openChat();
    // openChat identity is stable enough; only re-run when the intent/eligibility changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsChat, hasPocketmed]);

  const onFlowPage = FLOW_PREFIXES.some((p) => pathname.startsWith(p));
  const showReminder = hasPocketmed && unread && !wantsChat && !isOpen && !dismissed && !onFlowPage;

  if (!showReminder) return null;

  return (
    <ChatReminderModal
      isOpen={showReminder}
      onClose={() => setDismissed(true)}
      onOpenChat={() => {
        setDismissed(true);
        openChat();
      }}
    />
  );
};
