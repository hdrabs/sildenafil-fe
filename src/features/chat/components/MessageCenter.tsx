"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/store";
import { useChatData } from "@/api/hooks/useChatQueries";
import { useChatStore } from "@/store/chatStore";
import { useCloseChat } from "@/features/chat/hooks/useChat";

/**
 * The chat "Message Center" — a slide-over drawer embedding the PocketMed chat
 * iframe. The panel stays MOUNTED (slid off-screen when closed) so the iframe
 * keeps emitting its unread `{ read: false }` postMessage even while closed,
 * driving the real-time unread dot. Rendered once (root layout).
 */
export const MessageCenter = () => {
  const hasPocketmed = !!useUser()?.pocketmedUuid;
  const { data } = useChatData(hasPocketmed);
  const url = data?.url ?? null;
  const origin = url ? new URL(url).origin : null;

  const isOpen = useChatStore((s) => s.isOpen);
  const setUnread = useChatStore((s) => s.setUnread);
  const closeChat = useCloseChat();

  // The pocket_med iframe posts { read: false } on a new message — validate the
  // origin (the legacy listener did not) before lighting the dot.
  useEffect(() => {
    if (!origin) return;
    const handler = (e: MessageEvent) => {
      if (e.origin === origin && (e.data as { read?: boolean })?.read === false) setUnread(true);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [origin, setUnread]);

  if (!hasPocketmed || !url) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={closeChat} aria-hidden />
      )}
      <div
        className={cn(
          // Rounded left edge matches the burger-menu / shared Drawer (rounded-l-2xl);
          // overflow-hidden clips the iframe to the corner, and it drops to square once
          // the panel is full-width on phones (breakpoint tracks max-w-lg = 512px).
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-hidden rounded-l-2xl bg-bg-card shadow-xl transition-transform duration-300 max-[512px]:rounded-none",
          isOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="mr-2 flex-1 font-sans text-[18px] font-semibold leading-[172.5%] text-[#152E56] md:text-[24px]">
            Message Center
          </h2>
          <button
            type="button"
            onClick={closeChat}
            aria-label="Close"
            className="text-2xl leading-none text-text-muted transition-colors hover:text-text-primary"
          >
            &times;
          </button>
        </div>
        <iframe src={url} title="Message Center" className="w-full flex-1 border-0" />
      </div>
    </>
  );
};
