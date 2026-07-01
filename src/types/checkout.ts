import { CartV2 } from "@/types/cart";

export interface CheckoutNavLink {
  step: string;
  path: string;
}

export type CheckoutStepStatus = "complete" | "current" | "upcoming";

export interface CheckoutNavStep {
  step: string;
  label: string;
  path: string;
  status: CheckoutStepStatus;
}

// Progress-bar milestone for a step. `to` (questionnaire steps only) is the band end
// the FE interpolates toward by (answered / total). Null = pre-funnel, no bar.
export interface CheckoutProgress {
  value: number;
  to?: number;
}

// Backend-owned funnel guard decision for the viewed step. The guard follows this
// verbatim — it never computes step order or redirect targets itself.
export type CheckoutAccessReason =
  | "current"
  | "complete"
  | "upcoming"
  | "no_cart"
  | "missing_precondition"
  | "has_order"
  | "retake";

export interface CheckoutAccess {
  allowed: boolean;
  reason: CheckoutAccessReason;
  redirect_path: string | null;
}

export interface CheckoutNavigation {
  current_step: string;
  previous: CheckoutNavLink | null;
  next: CheckoutNavLink | null;
  progress: CheckoutProgress | null;
  furthest_step: string | null;
  steps: CheckoutNavStep[];
  access: CheckoutAccess;
}

export interface CheckoutNavigationParams {
  step: string;
  cart_id: number;
  cart_token?: string;
}

// ── Identity verification (SSN → Plaid) ──────────────────────────────────────

// Which verification method the user picked on the identity choice screen.
export type IdentityOption = "last_4_ssn" | "id_review" | "";

export interface IdentityVerificationStatus {
  plaid_status: boolean;
  limit_exceeded: boolean;
}

// POST /v2/checkout/identity_verification — adds the verification status block on
// top of the standard { cart, redirect_path } envelope.
export interface SsnVerifyResponse {
  cart: CartV2;
  redirect_path: string;
  identity_verification: IdentityVerificationStatus;
}

// GET /v2/checkout/{id_upload,selfie_upload} — the already-uploaded photo URL, or null.
export interface ExistingPhotoResponse {
  photo_url: string | null;
}
