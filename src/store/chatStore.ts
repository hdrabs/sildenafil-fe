import { create } from "zustand";

interface ChatState {
  isOpen: boolean;
  // null = defer to the server's unread flag; true = a live postMessage set it;
  // false = marked read this session.
  overrideUnread: boolean | null;
  open: () => void;
  close: () => void;
  setUnread: (unread: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  overrideUnread: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setUnread: (unread) => set({ overrideUnread: unread }),
}));
