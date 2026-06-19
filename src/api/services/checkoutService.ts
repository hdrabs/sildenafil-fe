import api from "@/api/baseAPI";
import { CheckoutNavigation, CheckoutNavigationParams } from "@/types/checkout";

const buildQuery = ({ step, cart_id, cart_token }: CheckoutNavigationParams): string => {
  const qs = new URLSearchParams({ step, cart_id: String(cart_id) });
  if (cart_token) qs.set("cart_token", cart_token);
  return `?${qs.toString()}`;
};

export const checkoutService = {
  // GET /v2/checkout/navigation — backend-owned back/forward targets + progress steps.
  getNavigation: (params: CheckoutNavigationParams): Promise<CheckoutNavigation> =>
    api.get<CheckoutNavigation>(`/v2/checkout/navigation${buildQuery(params)}`),
};
