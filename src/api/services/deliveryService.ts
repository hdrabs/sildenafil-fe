import api from "@/api/baseAPI";
import { DeliveryOptionsResponse } from "@/types/delivery";

interface DeliveryOptionsParams {
  cartId: number;
  cartToken?: string;
  destinationZip?: string;
}

export const deliveryService = {
  // GET /v2/delivery_options — cart-priced option list + cutoff countdown (+ estimates
  // and pickup filtering by destination zip).
  getOptions: ({ cartId, cartToken, destinationZip }: DeliveryOptionsParams): Promise<DeliveryOptionsResponse> => {
    const qs = new URLSearchParams({ cart_id: String(cartId) });
    if (cartToken) qs.set("cart_token", cartToken);
    if (destinationZip) qs.set("destination_zip", destinationZip);
    return api.get<DeliveryOptionsResponse>(`/v2/delivery_options?${qs.toString()}`);
  },
};
