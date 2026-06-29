import api from "@/api/baseAPI";
import { OrderDetail, UpdateOrderRequest, PayOrderRequest } from "@/types/order";
import { OrderHistoryFeed } from "@/types/orderHistory";

/**
 * Patient-facing order payment flow. The order is created on the admin/CRM panel
 * after the doctor approves; this service drives the patient's part: view the
 * order, edit shipping/delivery, and pay. baseAPI unwraps the { data } envelope,
 * so each call returns the inner { order } payload.
 */
export const orderService = {
  // GET /api/v2/orders — the Order History feed (orders + loose in-progress carts).
  getOrdersHistory: (): Promise<OrderHistoryFeed> => api.get<OrderHistoryFeed>("/v2/orders"),

  // GET /api/v2/current_order — the patient's current active order to pay, or null.
  getCurrentOrder: async (): Promise<OrderDetail | null> => {
    const res = await api.get<{ order: OrderDetail | null }>("/v2/current_order");
    return res.order;
  },

  // GET /api/v2/orders/:id
  getOrder: async (id: number): Promise<OrderDetail> => {
    const res = await api.get<{ order: OrderDetail }>(`/v2/orders/${id}`);
    return res.order;
  },

  // PATCH /api/v2/orders/:id — set shipping address + delivery option (recomputes pricing).
  updateOrder: async (id: number, data: UpdateOrderRequest): Promise<OrderDetail> => {
    const res = await api.patch<{ order: OrderDetail }>(`/v2/orders/${id}`, data);
    return res.order;
  },

  // POST /api/v2/orders/:id/payment — pay (charge) the order; paying = creating a payment.
  payOrder: async (id: number, data: PayOrderRequest = {}): Promise<OrderDetail> => {
    const res = await api.post<{ order: OrderDetail }>(`/v2/orders/${id}/payment`, data);
    return res.order;
  },

  // PATCH /api/v2/orders/:orderId/carts/:cartId — change a line item's quantity
  // (drug/dosage are doctor-approved and locked); the server re-validates + recomputes.
  updateCartQuantity: async (orderId: number, cartId: number, quantity: number): Promise<OrderDetail> => {
    const res = await api.patch<{ order: OrderDetail }>(`/v2/orders/${orderId}/carts/${cartId}`, { quantity });
    return res.order;
  },

  // POST /api/v2/orders/:orderId/discount — apply a coupon to the order.
  applyDiscount: async (orderId: number, code: string): Promise<OrderDetail> => {
    const res = await api.post<{ order: OrderDetail }>(`/v2/orders/${orderId}/discount`, { code });
    return res.order;
  },

  // DELETE /api/v2/orders/:orderId/discount — remove the order's coupon.
  removeDiscount: async (orderId: number): Promise<OrderDetail> => {
    const res = await api.delete<{ order: OrderDetail }>(`/v2/orders/${orderId}/discount`);
    return res.order;
  },
};
