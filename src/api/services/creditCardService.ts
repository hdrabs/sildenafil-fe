import api from "@/api/baseAPI";
import {
  CreditCard,
  CreditCardsResponse,
  CreateCreditCardPayload,
  SetDefaultCardPayload,
} from "@/types/creditCard";
import { GetUserResponse } from "@/types/shippingAddress";

export const creditCardService = {
  /**
   * Credit cards are embedded in the user object from GET /v1/users/get_user.
   * default_payment_profile_id is also on the user object.
   */
  getAll: async (): Promise<CreditCardsResponse> => {
    const response = await api.get<GetUserResponse>("/v1/users/get_user");
    return {
      credit_cards: response.user.credit_cards ?? [],
      default_payment_profile_id: response.user.default_payment_profile_id ?? null,
    };
  },

  create: (payload: CreateCreditCardPayload): Promise<CreditCard> =>
    api.post<CreditCard>("/v1/credit_cards", payload),

  /**
   * Controller: params.require(:select_card).permit(:payment_profile_id)
   */
  setDefault: (payload: SetDefaultCardPayload): Promise<void> =>
    api.put<void>("/v1/select_cards", payload),

  remove: (paymentProfileId: string): Promise<void> =>
    api.delete<void>(`/v1/credit_cards/${paymentProfileId}`),

  // ── v2 (checkout payment step) ─────────────────────────────────────────────
  // GET /v2/credit_cards — saved cards + default profile id, in one call.
  listV2: (): Promise<CreditCardsResponse> => api.get<CreditCardsResponse>("/v2/credit_cards"),

  createV2: (payload: CreateCreditCardPayload): Promise<CreditCardsResponse> =>
    api.post<CreditCardsResponse>("/v2/credit_cards", payload),

  // PUT /v2/credit_cards/select — set the default card (takes a bare payment_profile_id).
  setDefaultV2: (paymentProfileId: string): Promise<CreditCardsResponse> =>
    api.put<CreditCardsResponse>("/v2/credit_cards/select", { payment_profile_id: paymentProfileId }),

  removeV2: (paymentProfileId: string): Promise<CreditCardsResponse> =>
    api.delete<CreditCardsResponse>(`/v2/credit_cards/${paymentProfileId}`),
};
