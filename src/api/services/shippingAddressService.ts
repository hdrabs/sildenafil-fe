import api from "@/api/baseAPI";
import {
  ShippingAddress,
  ShippingAddressPayload,
  ShippingAddressV2Payload,
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

  // ── v2 (checkout shipping step) ────────────────────────────────────────────

  // GET /v2/shipping_addresses — the user's active addresses.
  listV2: async (): Promise<ShippingAddress[]> => {
    const res = await api.get<{ shipping_addresses: ShippingAddress[] }>("/v2/shipping_addresses");
    return res.shipping_addresses;
  },

  createV2: async (payload: ShippingAddressV2Payload): Promise<ShippingAddress> => {
    const res = await api.post<{ shipping_address: ShippingAddress }>("/v2/shipping_addresses", payload);
    return res.shipping_address;
  },

  updateV2: async (id: number, payload: ShippingAddressV2Payload): Promise<ShippingAddress> => {
    const res = await api.patch<{ shipping_address: ShippingAddress }>(`/v2/shipping_addresses/${id}`, payload);
    return res.shipping_address;
  },
};
