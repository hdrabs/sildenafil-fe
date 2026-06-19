import { useQuery } from "@tanstack/react-query";
import { checkoutService } from "@/api/services/checkoutService";
import { checkoutKeys } from "@/constants/queryKeys";
import { CheckoutNavigationParams } from "@/types/checkout";

export const useCheckoutNavigation = (params: CheckoutNavigationParams, enabled = true) =>
  useQuery({
    queryKey: checkoutKeys.navigation(params.step, params.cart_id),
    queryFn: () => checkoutService.getNavigation(params),
    enabled: enabled && params.cart_id > 0,
    staleTime: 60_000,
  });
