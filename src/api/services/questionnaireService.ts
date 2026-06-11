import api from "@/api/baseAPI";
import { UserInterview } from "@/types/visit";

/**
 * Visit / consultation endpoints — part of the cart checkout flow.
 *
 * Confirmed v1 routes:
 *   GET /api/v1/checkout/welcomes
 *   GET /api/v1/checkout/visit_intro
 *   GET /api/v1/checkout/visit_consultation
 *   GET /api/v1/checkout/visit_consents
 *
 * Exact request/response shapes are TBD until the checkout flow is mapped.
 * This service will be expanded when those views are audited.
 */
export const visitService = {
  getConsultation: (cartId: number): Promise<UserInterview> =>
    api.get<UserInterview>(`/v1/checkout/visit_consultation?cart_id=${cartId}`),
};
