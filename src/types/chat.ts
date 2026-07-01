// GET /v2/chat — the PocketMed chat iframe URL + the unread-messages flag.
export interface ChatResponse {
  url: string | null;
  unread: boolean;
}
