/**
 * GET /v2/refills — the Order Refill tab feed. The backend (RefillHistoryPresenter)
 * owns ALL bucketing, merging, dedup, badges, descriptions and CTAs; the FE renders
 * these two ready-made sections of cards.
 */

export type RefillActionType =
  | "order_refill"
  | "get_more_refills"
  | "complete_order"
  | "proceed_to_checkout"
  | "view_order_details"
  | "continue_process"
  | "remove_from_cart"
  | "start_new_visit";

export interface RefillAction {
  type: RefillActionType;
  label: string;
  href?: string;
  cart_id?: number;
  external?: boolean;
}

export interface RefillLineItem {
  name: string;
  quantity_label: string;
}

export interface RefillPresentation {
  badge: string | null;
  badge_tone: "warning" | "info" | "success" | null;
  description: string | null;
  actions: RefillAction[];
}

export interface RefillCard {
  id: number;
  source: "prescription" | "order" | "cart";
  drug: string;
  medication_name: string;
  subtitle: string | null;
  line_items: RefillLineItem[] | null;
  presentation: RefillPresentation;
}

export interface RefillsResponse {
  active: RefillCard[];
  needs_action: RefillCard[];
}
