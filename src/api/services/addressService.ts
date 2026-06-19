import api from "@/api/baseAPI";
import {
  AddressFields,
  AddressValidationResult,
  AddressSuggestion,
} from "@/types/shippingAddress";

export const addressService = {
  // POST /v2/address_validations — Smarty decision (ok | suggestion | … | undeliverable).
  validate: (address: AddressFields): Promise<AddressValidationResult> =>
    api.post<AddressValidationResult>("/v2/address_validations", { address }),

  // GET /v2/address_suggestions — Smarty autocomplete for the street field.
  suggest: async (prefix: string, selected = ""): Promise<AddressSuggestion[]> => {
    const qs = new URLSearchParams({ prefix });
    if (selected) qs.set("selected", selected);
    const res = await api.get<{ suggestions: AddressSuggestion[] }>(
      `/v2/address_suggestions?${qs.toString()}`,
    );
    return res.suggestions;
  },
};
