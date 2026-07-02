"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsAuthenticated, useUser } from "@/store";
import { useRetakePending } from "@/api/hooks/useRetakeQueries";
import { useOpenChat } from "@/features/chat/hooks/useChat";
import { RetakeModal } from "@/features/retake/components/RetakeModal";
import { ROUTES } from "@/constants/routes";

// Once handled this session we don't re-redirect (so later navigation isn't yanked).
const SESSION_KEY = "retake_prompt_handled";

// Don't interrupt an in-progress flow (auth, token exchange, checkout, upsell) or
// the retake flow itself — prompting there would derail the patient mid-task.
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
 * Mounted globally: when a signed-in patient has photos flagged for re-take, sends
 * them to the homepage and shows the retake prompt (once per session). Dismissing
 * hides it; "Re-take photos" opens the retake flow.
 */
export const RetakeGate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const hasPocketmed = !!useUser()?.pocketmedUuid;
  const openChat = useOpenChat();
  const { data } = useRetakePending(isAuthenticated);
  const [dismissed, setDismissed] = useState(false);

  // Don't prompt while they're in the middle of another flow.
  const onFlowPage = FLOW_PREFIXES.some((p) => pathname.startsWith(p));
  const pending = !!data?.retake_pending && !onFlowPage;

  useEffect(() => {
    if (!pending || sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    if (pathname !== ROUTES.HOME) router.replace(ROUTES.HOME);
  }, [pending, pathname, router]);

  const open = pending && !dismissed;
  if (!open) return null;

  return (
    <RetakeModal
      isOpen={open}
      onClose={() => setDismissed(true)}
      onRetake={() => {
        setDismissed(true);
        router.push(ROUTES.RETAKE_PHOTOS);
      }}
      onOpenChat={() => {
        setDismissed(true);
        // Retake users are in the telemedicine branch and normally have a chat;
        // guard so a rare non-pocketmed user's "here" click doesn't fire mark-read.
        if (hasPocketmed) openChat();
      }}
    />
  );
};
