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
