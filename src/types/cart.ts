import { ProductVariantRich } from "@/types/product";
import { ShippingAddress } from "@/types/shippingAddress";

export type CartBranch =
  | "root"
  | "mailed"
  | "transfer"
  | "patient_request"
  | "refill_request"
  | "pharmacy_request"
  | "no_doctor"
  | "telemedicine";

export type CartDeliveryType = "express" | "standard" | "personal" | "grounded";

export type CartRxType = "fresh" | "refill";

export type CartWhenNeeded = "now" | "hold";

export interface CartDiscount {
  id: number;
  code: string | null;
  name: string;
  type: string;
  percent: number | null;
  price: number | null;
  shippingCost: number | null;
}

export interface DeliveryOption {
  id: number;
  deliveryType: CartDeliveryType;
  priceValue: number;
  label: string;
  labelInfo: string;
  deliveryDaysLabel: string;
  estimatedDeliveryDate: string;
  freeAmountLevel: number | null;
  discountAmountLabel: string | null;
}

/**
 * Matches shared/_cart.json.jbuilder
 * step is a string (e.g. "base"), not a number.
 */
export interface Cart {
  id: number;
  branch: CartBranch;
  userId: number | null;
  step: string;
  stage: string;
  quantity: number;
  price: number;
  productVariantId: number;
  shippingAddressId: number | null;
  doctorId: number | null;
  pharmacyId: number | null;
  orderId: number | null;
  deliveryType: CartDeliveryType | null;
  finalPrice: number;
  finalQuantity: number;
  maxQuantity: number | null;
  deliveryPrice: number;
  finalDeliveryPrice: number;
  totalPrice: number;
  standardDeliveryPrice: number;
  expressDeliveryPrice: number;
  groundedDeliveryPrice: number;
  termsOfService: boolean;
  providerFee: number;
  token: string;
  visitUuid: string | null;
  marketing: boolean;
  landingUrl: string;
  convertedFromRefill: boolean;
  rxId: string | null;
  faxesCount: number;
  productNameWithBrand: string;
  productId: number;
  productSimpleName: string;
  perTabletCost: number;
  nonDiscountedPrice: number;
  cartInShowingSteps: boolean;
  discounts: CartDiscount[];
  productVariant: ProductVariantRich;
  shippingAddress: ShippingAddress | null;
  deliveryOption: DeliveryOption | null;
  createdAt: string;
}

export type OrderState =
  | "draft"
  | "pending"
  | "submitted"
  | "awaiting_shipment"
  | "shipped"
  | "delivered";

/**
 * Matches orders/_order.json.jbuilder
 */
export interface Order {
  id: number;
  invoiceNumber: string | null;
  state: OrderState;
  shippingAddressId: number | null;
  deliveryType: CartDeliveryType;
  deliveryPrice: number;
  finalDeliveryPrice: number;
  totalPrice: number;
  finalPrice: number;
  standardDeliveryPrice: number;
  expressDeliveryPrice: number;
  groundedDeliveryPrice: number;
  deliveryLabel: string | null;
  adminId: number | null;
  trackingUrl: string | null;
  shipstationDeliveredAt: string | null;
  shipstationShipmentAt: string | null;
  trackingActive: boolean;
  quantityChanged: boolean;
  paid: boolean;
  shippingAddress: ShippingAddress | null;
  createdAt: string;
}

export interface CartListParams {
  page?: number;
  limit?: number;
  stage?: string;
  branch?: CartBranch;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  state?: OrderState;
}

export interface CreateCartRequest {
  quantity: number;
  productVariantId: number;
  deliveryType: CartDeliveryType;
  rxType?: CartRxType;
}

export interface OrdersListResponse {
  orders: Order[];
}

// ── V2 Cart API ──────────────────────────────────────────────────────────────

export interface CartV2 {
  id: number;
  token: string;
  branch: CartBranch;
  step: string;
  stage: string;
  quantity: number;
  product_variant_id: number;
  converted_from_refill: boolean;
  marketing: boolean;
  final_price: number | string;
  max_quantity: number | null;
  rx_id: string | null;
  visit_uuid: string | null;
  shipping_address_id: number | null;
  delivery_type: string | null;
}

export interface CartV2Response {
  cart: CartV2;
  redirect_path: string;
}

/**
 * The active cart restored from GET /api/v2/active_cart, mapped into the
 * client-side shape held by cartStore. `variantLabel` / `redirectPath` are
 * server-computed presentation hints that sit beside the cart entity.
 */
export interface ActiveCartEntry {
  cart: CartV2;
  variantLabel: string;
  redirectPath: string;
}

export interface CreateCartV2Request {
  slug: string;
  quantity: number;
  cart_token?: string;
  landing_context?: string;
}

export interface UpdateCartV2Request {
  slug: string;
  quantity: number;
  landing_context?: string;
}
