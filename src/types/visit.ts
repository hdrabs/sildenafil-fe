/**
 * Visit / consultation types for the cart checkout flow.
 *
 * The backend handles consultations through the checkout controllers:
 *   GET /api/v1/checkout/welcomes
 *   GET /api/v1/checkout/visit_intro
 *   GET /api/v1/checkout/visit_consultation
 *   GET /api/v1/checkout/visit_consents
 *
 * The UserInterview model stores consultation answers attached to a cart.
 * Exact Jbuilder shapes for these endpoints are TBD — this file will be
 * updated when the checkout flow is wired to v1.
 */

export interface UserInterview {
  consultationWithinLastYear: boolean | null;
  dysfunctionConsulted: boolean | null;
  previousDrugs: string | null;
  cartId: number;
}
