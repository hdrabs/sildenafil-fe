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

export interface CheckoutNavigation {
  current_step: string;
  previous: CheckoutNavLink | null;
  next: CheckoutNavLink | null;
  furthest_step: string;
  steps: CheckoutNavStep[];
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
