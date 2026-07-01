import api from "@/api/baseAPI";
import {
  UpsellDecision,
  UpsellDecisionResponse,
  UpsellOfferResponse,
} from "@/types/upsell";

interface CartScoped {
  cart_id: number;
  cart_token?: string;
}

export const upsellService = {
  // POST /v2/upsell — get-or-create the cart's one-time upsell and return the
  // server-computed offer (idempotent: returns the same upsell on re-fetch).
  createOffer: (params: CartScoped): Promise<UpsellOfferResponse> =>
    api.post<UpsellOfferResponse>("/v2/upsell", params),

  // PUT /v2/upsell — record the patient's decision (purchased / not_interested).
  submitDecision: (
    params: CartScoped & { decision: UpsellDecision },
  ): Promise<UpsellDecisionResponse> =>
    api.put<UpsellDecisionResponse>("/v2/upsell", params),
};
