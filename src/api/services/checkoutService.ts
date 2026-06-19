import api from "@/api/baseAPI";
import { CheckoutNavigation, CheckoutNavigationParams } from "@/types/checkout";
import { CartV2Response } from "@/types/cart";

const buildQuery = ({ step, cart_id, cart_token }: CheckoutNavigationParams): string => {
  const qs = new URLSearchParams({ step, cart_id: String(cart_id) });
  if (cart_token) qs.set("cart_token", cart_token);
  return `?${qs.toString()}`;
};

interface CartScoped {
  cart_id: number;
  cart_token?: string;
}

export const checkoutService = {
  // GET /v2/checkout/navigation — backend-owned back/forward targets + progress steps.
  getNavigation: (params: CheckoutNavigationParams): Promise<CheckoutNavigation> =>
    api.get<CheckoutNavigation>(`/v2/checkout/navigation${buildQuery(params)}`),

  // PUT /v2/checkout/shipping_address — attach the chosen address to the cart.
  // Does NOT advance the step (cart stays at shipping_address_info → delivery view).
  attachShippingAddress: (
    params: CartScoped & { shipping_address_id: number },
  ): Promise<CartV2Response> =>
    api.put<CartV2Response>("/v2/checkout/shipping_address", params),

  // PUT /v2/checkout/delivery — record delivery_type and advance out of the shipping step.
  continueDelivery: (
    params: CartScoped & { delivery_type: string },
  ): Promise<CartV2Response> => api.put<CartV2Response>("/v2/checkout/delivery", params),
};
