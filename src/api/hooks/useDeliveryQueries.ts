import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/api/services/deliveryService";
import { deliveryKeys } from "@/constants/queryKeys";

interface Params {
  cartId: number;
  addressId: number;
  cartToken?: string;
  destinationZip?: string;
}

export const useDeliveryOptions = (params: Params, enabled = true) =>
  useQuery({
    queryKey: deliveryKeys.list(params.cartId, params.addressId, params.destinationZip ?? ""),
    queryFn: () => deliveryService.getOptions(params),
    enabled: enabled && params.cartId > 0,
    staleTime: 60_000,
  });
