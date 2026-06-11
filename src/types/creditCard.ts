/**
 * Authorize.Net opaque data returned by Accept.js after tokenizing card details.
 */
export interface AuthorizeNetOpaqueData {
  dataDescriptor: string;
  dataValue: string;
}

/**
 * Returned by user.credit_cards — fetched live from Authorize.Net customer profile.
 * card_number is masked (e.g. "XXXX1111"), expiration_date is in "YYYY-MM" format.
 */
export interface CreditCard {
  first_name: string;
  last_name: string;
  payment_profile_id: string;
  card_number: string;       // masked: "XXXX1111"
  expiration_date: string;   // "YYYY-MM" or "XXXX"
  card_type: string;         // "Visa", "MasterCard", "AmericanExpress", "Discover"
}

export interface CreditCardsResponse {
  credit_cards: CreditCard[];
  default_payment_profile_id: string | null;
}

/**
 * POST /api/v1/credit_cards
 * billing_address + Accept.js opaque token (never raw card data)
 */
export interface CreateCreditCardPayload {
  billing_address: {
    first_name: string;
    last_name: string;
    zip: string;
  };
  opaque_data: AuthorizeNetOpaqueData;
}

/**
 * PUT /api/v1/select_cards
 * Controller: params.require(:select_card).permit(:payment_profile_id)
 */
export interface SetDefaultCardPayload {
  select_card: {
    payment_profile_id: string;
  };
}
