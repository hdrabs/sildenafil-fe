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
};
