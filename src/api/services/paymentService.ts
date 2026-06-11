import api from "@/api/baseAPI";
import { Payment } from "@/types/payment";

/**
 * Payments in v1 are nested inside orders — there is no standalone GET /v1/payments.
 * Payments are accessed via orders/show or orders/index (inside order.payments[]).
 *
 * This service exposes only the operations that have a confirmed v1 endpoint.
 */
export const paymentService = {
  /**
   * GET /api/v1/account/current_orders
   * Returns orders with embedded payment objects.
   * Payment shape: orders/_payment.json.jbuilder
   */
  getPaymentsForOrder: (orderId: number): Promise<Payment[]> =>
    api.get<Payment[]>(`/v1/orders/${orderId}`),
};
