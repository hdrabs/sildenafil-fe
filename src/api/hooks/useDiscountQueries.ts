import { useMutation } from "@tanstack/react-query";
import { discountService } from "@/api/services/discountService";

export const useApplyDiscount = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; code: string }) =>
      discountService.apply(params),
  });

export const useRemoveDiscount = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      discountService.remove(params),
  });
