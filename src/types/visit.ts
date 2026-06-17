import { CartBranch } from "@/types/cart";

export type VisitEligibilityAction = "create_cart" | "update_cart" | "show_modal";

export type VisitEligibilityModal = "retake" | "under_review" | "order_processing";

/**
 * Matches GET /api/v2/visit_eligibility response contract.
 *
 * action:
 *   create_cart  — no open cart, proceed to POST /api/v2/carts
 *   update_cart  — an open cart exists, proceed to PATCH /api/v2/carts/:cart_id
 *   show_modal   — user is blocked; display the named modal and stop
 *
 * cart_id / cart_step / cart_branch are populated when action === update_cart.
 */
export interface VisitEligibilityResponse {
  action: VisitEligibilityAction;
  modal: VisitEligibilityModal | null;
  cart_id: number | null;
  cart_step: string | null;
  cart_branch: CartBranch | null;
}

export interface EligibleState {
  name: string;
  code: string;
}

export interface VisitEligibleStatesResponse {
  states: EligibleState[];
}
