import api from "@/api/baseAPI";
import {
  Cart,
  CartV2,
  CartV2Response,
  Order,
  CartListParams,
  OrderListParams,
  CreateCartRequest,
  CreateCartV2Request,
  UpdateCartV2Request,
  OrdersListResponse,
  ActiveCartEntry,
  ActiveCartLine,
} from "@/types/cart";
import { VisitEligibilityResponse } from "@/types/visit";

export const cartService = {
  // ── V1 ──────────────────────────────────────────────────────────────────────

  listCarts: (params?: CartListParams): Promise<Cart[]> =>
    api.get<Cart[]>("/v1/carts", params as RequestInit),

  getCart: (id: number): Promise<Cart> =>
    api.get<Cart>(`/v1/carts/${id}`),

  createCart: (data: CreateCartRequest): Promise<Cart> =>
    api.post<Cart>("/v1/carts", data),

  listOrders: async (params?: OrderListParams): Promise<Order[]> => {
    const res = await api.get<OrdersListResponse>("/v1/orders", params as RequestInit);
    return res.orders;
  },

  getOrder: (id: number): Promise<Order> =>
    api.get<Order>(`/v1/orders/${id}`),

  // ── V2 ──────────────────────────────────────────────────────────────────────

  /**
   * GET /api/v2/visit_eligibility
   * Pre-cart gate — call before creating or updating a cart.
   * Pass cart_token for guest sessions to check for an existing open cart.
   */
  visitEligibility: (params?: { cart_token?: string }): Promise<VisitEligibilityResponse> => {
    const qs = params?.cart_token ? `?cart_token=${encodeURIComponent(params.cart_token)}` : "";
    return api.get<VisitEligibilityResponse>(`/v2/visit_eligibility${qs}`);
  },

  /**
   * POST /api/v2/carts
   * Creates a new cart and returns the cart + a redirect_path.
   * Guest-friendly — no JWT required; pass cart_token to claim a guest cart.
   */
  createCartV2: (data: CreateCartV2Request): Promise<CartV2Response> =>
    api.post<CartV2Response>("/v2/carts", data),

  /**
   * PATCH /api/v2/carts/:id
   * Updates an existing open cart (quantity / slug / context change).
   * Guest carts are authorised via cart_token in the request body.
   */
  updateCartV2: (id: number, data: UpdateCartV2Request & { cart_token?: string }): Promise<CartV2Response> =>
    api.patch<CartV2Response>(`/v2/carts/${id}`, data),

  getCartV2: (id: number): Promise<CartV2> =>
    api.get<CartV2>(`/v2/carts/${id}`),

  deleteCartV2: (id: number, cartToken?: string): Promise<void> =>
    api.delete<void>(`/v2/carts/${id}${cartToken ? `?cart_token=${encodeURIComponent(cartToken)}` : ""}`),

  /**
   * PATCH /api/v2/carts/:id with { advance: true }
   * Moves the cart from product_detail → intro_questions without changing variant or quantity.
   */
  advanceCartStep: (id: number, cartToken?: string): Promise<CartV2Response> =>
    api.patch<CartV2Response>(`/v2/carts/${id}`, {
      advance: true,
      ...(cartToken && { cart_token: cartToken }),
    }),

  /**
   * GET /api/v2/active_cart
   * Returns the authenticated user's most recent in-progress cart, mapped into
   * the client-side ActiveCartEntry shape, or null when there is no active cart.
   * Used to restore cart state on page load / cross-browser sessions.
   */
  getActiveCart: async (): Promise<ActiveCartEntry | null> => {
    const res = await api.get<
      | {
          cart: CartV2;
          carts: ActiveCartLine[];
          order_id: number | null;
          variant_label: string;
          redirect_path: string;
        }
      | { cart: null; carts: [] }
    >("/v2/active_cart");

    if (!res.cart) return null;

    return {
      cart: res.cart,
      carts: res.carts ?? [],
      orderId: res.order_id ?? null,
      variantLabel: res.variant_label,
      redirectPath: res.redirect_path,
    };
  },
};
