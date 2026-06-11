import api from "@/api/baseAPI";
import {
  ShippingAddress,
  ShippingAddressPayload,
  ShippingAddressesResponse,
  GetUserResponse,
} from "@/types/shippingAddress";

export const shippingAddressService = {
  /**
   * Shipping addresses have no standalone index route in v1.
   * They are embedded in the user object from GET /v1/users/get_user.
   */
  getAll: async (): Promise<ShippingAddressesResponse> => {
    const response = await api.get<GetUserResponse>("/v1/users/get_user");
    return { shipping_addresses: response.user.shipping_addresses };
  },

  create: (payload: ShippingAddressPayload): Promise<ShippingAddress> =>
    api.post<ShippingAddress>("/v1/shipping_addresses", payload),

  update: (id: number, payload: ShippingAddressPayload): Promise<ShippingAddress> =>
    api.put<ShippingAddress>(`/v1/shipping_addresses/${id}`, payload),

  remove: (id: number): Promise<void> =>
    api.delete<void>(`/v1/shipping_addresses/${id}`),
};
