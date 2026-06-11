import api from "@/api/baseAPI";
import {
  Cart,
  Order,
  CartListParams,
  OrderListParams,
  CreateCartRequest,
  OrdersListResponse,
} from "@/types/cart";

export const cartService = {
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
};
