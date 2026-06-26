/**
 * Matches shared/_shipping_address.json.jbuilder (snake_case — no conversion in baseAPI)
 */
export interface ShippingAddress {
  id: number;
  first_name: string;
  last_name: string;
  street_1: string;
  street_2: string | null;
  city: string;
  state: string;
  zip: string;
  phone: string;
  user_id: number;
  verified: boolean;
  status: "active" | "inactive";
  is_valid: boolean;
  pick_up_available: boolean;
  has_no_active_carts: boolean;
  used_by_restricted_carts: boolean;
  editable_for_user: boolean;
  // Backend-owned delete eligibility; the FE renders the Delete button off this alone.
  deletable: boolean;
}

export interface ShippingAddressPayload {
  shipping_address: {
    first_name: string;
    last_name: string;
    street_1: string;
    street_2?: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
}

/**
 * Returned by GET /v1/users/get_user
 * Includes shipping addresses, credit cards, and default payment profile.
 */
export interface GetUserResponse {
  user: {
    shipping_addresses: ShippingAddress[];
    credit_cards?: import("@/types/creditCard").CreditCard[];
    default_payment_profile_id?: string | null;
  };
}

export interface ShippingAddressesResponse {
  shipping_addresses: ShippingAddress[];
}

// ── v2 checkout shipping (POST/PATCH /api/v2/shipping_addresses) ──────────────

/** The address fields the user actually fills in the checkout form. */
export interface AddressFields {
  street_1: string;
  street_2?: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * v2 create/update payload. The FE sends ONLY the address fields the user types;
 * first_name/last_name/phone are owned by the backend (sourced from the
 * authenticated user). `verified` reflects the Smarty drawer choice (true =
 * accepted the suggested/clean address).
 */
export interface ShippingAddressV2Payload {
  shipping_address: AddressFields & {
    verified: boolean;
  };
}

// ── Smarty validation (POST /api/v2/address_validations) ─────────────────────

export type AddressValidationStatus =
  | "ok"
  | "suggestion"
  | "missing_secondary"
  | "unrecognized_secondary"
  | "undeliverable";

export interface AddressValidationResult {
  status: AddressValidationStatus;
  suggested_address: AddressFields | null;
  message: string | null;
}

// ── Smarty autocomplete (GET /api/v2/address_suggestions) ────────────────────

export interface AddressSuggestion {
  street_line: string;
  secondary: string;
  city: string;
  state: string;
  zipcode: string;
  entries: number;
}
