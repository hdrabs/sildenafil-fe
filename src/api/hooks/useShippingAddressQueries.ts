import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shippingAddressService } from "@/api/services/shippingAddressService";
import {
  ShippingAddressPayload,
  ShippingAddressV2Payload,
  ShippingAddressesResponse,
} from "@/types/shippingAddress";
import { shippingAddressKeys, shippingAddressV2Keys } from "@/constants/queryKeys";

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

// ── v2 (checkout shipping step) ──────────────────────────────────────────────

export const useShippingAddressesV2 = (enabled = true) =>
  useQuery({
    queryKey: shippingAddressV2Keys.list(),
    queryFn: () => shippingAddressService.listV2(),
    enabled,
  });

export const useCreateShippingAddressV2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShippingAddressV2Payload) => shippingAddressService.createV2(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingAddressV2Keys.list() }),
  });
};

export const useUpdateShippingAddressV2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ShippingAddressV2Payload }) =>
      shippingAddressService.updateV2(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shippingAddressV2Keys.list() }),
  });
};
