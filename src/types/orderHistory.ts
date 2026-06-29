/**
 * GET /v2/orders — the Order History feed. The backend owns ALL conditional
 * logic (status text, which buttons, where they go); the FE renders this verbatim.
 */

export type OrderHistoryActionType =
  | "proceed_to_checkout"
  | "track_package"
  | "resume_visit"
  | "view_visit"
  | "buy_again";

export interface OrderHistoryAction {
  type: OrderHistoryActionType;
  label: string;
  href?: string;
  external?: boolean;
}

export interface OrderHistoryPresentation {
  heading: string | null;
  status: string | null;
  detail: string | null;
  tone: "info" | "success" | "warning" | "pending";
  timeline: string | null;       // "Delivered June 12" / "Shipped on June 10"
  support_phone: string | null;  // when the "Please call … for any questions" note shows
  actions: OrderHistoryAction[];
}

export interface OrderHistoryLineItem {
  drug_name: string;             // "Sildenafil 100 mg"
  drug: string;                  // basic_drug_name → bottle image
  quantity_label: string;        // "12 tablets" / "24 tablets + 2 FREE"
  price: number;
  reorder: { slug: string; quantity: number } | null; // present on delivered orders
}

export interface OrderHistorySummary {
  sub_total: number;
  discount: number | null;
  shipping: number;              // 0 → render "Free"
  grand_total: number;
}

export interface OrderHistoryCard {
  id: number;
  type: "order" | "cart";
  created_at: string;
  order_id: string | null;       // invoice_number (orders only)
  amount: number;
  presentation: OrderHistoryPresentation;
  line_items: OrderHistoryLineItem[];
  shipping_type: string | null;
  ship_to: string | null;
  payment_method: string | null;
  summary: OrderHistorySummary;
}

export interface OrderHistoryFeed {
  orders: OrderHistoryCard[];
  carts: OrderHistoryCard[];
}
