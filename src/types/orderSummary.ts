// Rich cart summary for the order-verification page — mirrors v2 CartSummaryBlueprint.

export interface CartSummaryDiscount {
  id: number;
  code: string | null;
  name: string;
  type: string;
  percent: number | null;
  price: number | null;
  shipping_cost: number | null;
}

export interface CartSummaryVariant {
  id: number;
  slug: string;
  dosage_value: number;
  min_order_quantity: number;
  dosage: string;
  product: { drug: string; name: string };
}

export interface CartSummary {
  id: number;
  token?: string;
  branch: string;
  step: string;
  stage: string;
  quantity: number;
  final_quantity: number;
  max_quantity: number | null;
  product_variant_id: number;
  delivery_type: string | null;
  shipping_address_id: number | null;
  converted_from_refill: boolean;
  rx_id: string | null;
  product_name_with_brand: string;
  price: number;
  final_price: number;
  delivery_price: number;
  final_delivery_price: number;
  total_price: number;
  provider_fee: number;
  non_discounted_price: number;
  per_tablet_cost: number;
  product_variant: CartSummaryVariant;
  discounts: CartSummaryDiscount[];
}

export interface CartSummaryResponse {
  cart: CartSummary;
}
