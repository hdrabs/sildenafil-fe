import api from "@/api/baseAPI";
import { CartSummaryResponse } from "@/types/orderSummary";

interface CartScoped {
  cart_id: number;
  cart_token?: string;
}

export const discountService = {
  // POST /v2/discount — apply a coupon code; returns the recomputed cart summary.
  apply: (params: CartScoped & { code: string }): Promise<CartSummaryResponse> =>
    api.post<CartSummaryResponse>("/v2/discount", params),

  // DELETE /v2/discount — remove the cart's coupon; returns the recomputed cart summary.
  remove: (params: CartScoped): Promise<CartSummaryResponse> =>
    api.delete<CartSummaryResponse>("/v2/discount", params),
};
