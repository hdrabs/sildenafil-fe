import { CartSummary } from "@/types/orderSummary";
import { ShippingAddress } from "@/types/shippingAddress";

export type OrderDetailState =
  | "draft"
  | "pending"
  | "submitted"
  | "awaiting_shipment"
  | "shipped"
  | "delivered";

/**
 * Full order payload from GET /api/v2/orders/:id and GET /api/v2/current_order
 * (Api::V2::OrderDetailBlueprint). One order groups one-or-many carts.
 */
export interface OrderDetail {
  id: number;
  state: OrderDetailState;
  invoice_number: string | null;
  submitted_at: string | null;
  created_at: string;
  shipping_address_id: number | null;
  delivery_type: string | null;
  final_price: number;
  total_price: number;
  delivery_price: number;
  final_delivery_price: number;
  paid: boolean;
  carts: CartSummary[];
  shipping_address: ShippingAddress | null;
}

export interface UpdateOrderRequest {
  shipping_address_id?: number;
  delivery_type?: string;
}

export interface PayOrderRequest {
  payment_profile_id?: string;
}
