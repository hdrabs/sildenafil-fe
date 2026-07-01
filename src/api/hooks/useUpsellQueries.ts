import { useMutation, useQuery } from "@tanstack/react-query";
import { upsellService } from "@/api/services/upsellService";
import { upsellKeys } from "@/constants/queryKeys";
import { UpsellDecision } from "@/types/upsell";

// The offer-load endpoint is POST (it get-or-creates the upsell record), but it
// is idempotent and its job on the page is to read the computed offer, so it is
// modelled as a query for loading/error/caching.
export const useUpsellOffer = (cartId: number, cartToken?: string) =>
  useQuery({
    queryKey: upsellKeys.offer(cartId),
    queryFn: () =>
      upsellService.createOffer({ cart_id: cartId, cart_token: cartToken }),
    enabled: cartId > 0,
  });

export const useSubmitUpsellDecision = () =>
  useMutation({
    mutationFn: (params: {
      cart_id: number;
      cart_token?: string;
      decision: UpsellDecision;
    }) => upsellService.submitDecision(params),
  });
