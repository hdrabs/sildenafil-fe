import { CartSummary } from "@/types/orderSummary";

// The patient's response to the offer. The backend column is `action`, but the
// API param is `decision` (avoids Rails' reserved params[:action] route key).
export type UpsellDecision = "purchased" | "not_interested";

// Server-computed offer for the cart's package — the frontend only renders it
// (mirrors the Ruby Upsells::Offer). Null when no upsell tier applies.
export interface UpsellOffer {
  product_name: string;
  upsell_quantity: number;
  extra_tablets: number;
  base_price: number;
  upsell_price: number;
  discount_amount: number;
  final_price: number;
  price_difference: number;
  discount_percent: number;
  total_savings: number;
  tablet_display: string;
  discount_display: string;
  show_new_patient_discount: boolean;
  with_free_shipping: boolean;
  shipping_label: string | null;
  bonus_emphasis: string;
  bonus_tail: string;
  video_name: string;
  current_quantity: number;
}

export interface Upsell {
  id: number;
  action: "no_action" | UpsellDecision;
  quantity_from: number | null;
  quantity_to: number | null;
}

export interface UpsellOfferResponse {
  upsell: Upsell;
  offer: UpsellOffer | null;
  cart: CartSummary;
}

export interface UpsellDecisionResponse {
  upsell: Upsell;
  cart: CartSummary;
}
