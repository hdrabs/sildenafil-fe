import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingAddressService } from "@/api/services/shippingAddressService";
import { ShippingAddressPayload, ShippingAddressesResponse } from "@/types/shippingAddress";
import { shippingAddressKeys } from "@/constants/queryKeys";

export const useShippingAddresses = () =>
  useQuery<ShippingAddressesResponse>({
    queryKey: shippingAddressKeys.list(),
    queryFn:  () => shippingAddressService.getAll(),
  });

export const useAddShippingAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShippingAddressPayload) =>
      shippingAddressService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingAddressKeys.list() }),
  });
};

export const useUpdateShippingAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ShippingAddressPayload }) =>
      shippingAddressService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingAddressKeys.list() }),
  });
};

export const useDeleteShippingAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => shippingAddressService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingAddressKeys.list() }),
  });
};
