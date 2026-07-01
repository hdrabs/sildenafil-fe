"use client";

import { useUser } from "@/store";
import { useChatData, useMarkChatRead } from "@/api/hooks/useChatQueries";
import { useChatStore } from "@/store/chatStore";

// The unread dot: a live postMessage override wins, else the server's flag.
export const useChatUnread = (): boolean => {
  const hasPocketmed = !!useUser()?.pocketmedUuid;
  const { data } = useChatData(hasPocketmed);
  const override = useChatStore((s) => s.overrideUnread);
  return override ?? data?.unread ?? false;
};

// Opening the Message Center marks everything read + clears the dot.
export const useOpenChat = () => {
  const open = useChatStore((s) => s.open);
  const setUnread = useChatStore((s) => s.setUnread);
  const markRead = useMarkChatRead();
  return () => {
    open();
    markRead.mutate();
    setUnread(false);
  };
};

export const useCloseChat = () => {
  const close = useChatStore((s) => s.close);
  const setUnread = useChatStore((s) => s.setUnread);
  const markRead = useMarkChatRead();
  return () => {
    close();
    markRead.mutate();
    setUnread(false);
  };
};
