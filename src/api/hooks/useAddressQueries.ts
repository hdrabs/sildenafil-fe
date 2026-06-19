import { useMutation, useQuery } from "@tanstack/react-query";
import { addressService } from "@/api/services/addressService";
import { addressKeys } from "@/constants/queryKeys";
import { AddressFields } from "@/types/shippingAddress";

export const useValidateAddress = () =>
  useMutation({
    mutationFn: (address: AddressFields) => addressService.validate(address),
  });

export const useAddressSuggestions = (prefix: string, selected = "", enabled = true) =>
  useQuery({
    queryKey: addressKeys.suggestions(prefix, selected),
    queryFn: () => addressService.suggest(prefix, selected),
    enabled: enabled && prefix.trim().length > 3,
    staleTime: 30_000,
  });
