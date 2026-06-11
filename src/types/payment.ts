/**
 * Matches orders/_payment.json.jbuilder
 *
 * NOTE: The model has more columns (value, state, credit_card_type, requested_at,
 * transaction_id, authorize_status) but NONE of those are exposed in the v1 API partial.
 * Only these 6 fields are returned.
 */
export interface Payment {
  id: number;
  paymentProfileId: string | null;
  orderId: number;
  paymentMethod: string;
  errors: Record<string, string[]>;
  creditCardEnding: string | null;
}
