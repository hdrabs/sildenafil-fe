import api from "@/api/baseAPI";
import { ChatResponse } from "@/types/chat";

export const chatService = {
  // GET /v2/chat — iframe URL + unread flag.
  getChat: (): Promise<ChatResponse> => api.get<ChatResponse>("/v2/chat"),

  // PUT /v2/chat — mark the caller's messages read.
  markRead: (): Promise<{ unread: boolean }> => api.put<{ unread: boolean }>("/v2/chat", {}),
};
