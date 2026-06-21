import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useAttachShippingAddress = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; shipping_address_id: number }) =>
      checkoutService.attachShippingAddress(params),
  });

export const useContinueDelivery = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; delivery_type: string }) =>
      checkoutService.continueDelivery(params),
  });

export const useVerifyIdentitySsn = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; ssn_code: string }) =>
      checkoutService.verifyIdentitySsn(params),
  });

export const useUploadIdInstead = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.uploadIdInstead(params),
  });

export const useUploadIdPhoto = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; photo: File }) =>
      checkoutService.uploadIdPhoto(params),
  });

export const useUploadSelfiePhoto = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string; photo: File }) =>
      checkoutService.uploadSelfiePhoto(params),
  });

export const useSkipIdUpload = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.skipIdUpload(params),
  });

export const useSkipSelfieUpload = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.skipSelfieUpload(params),
  });

export const useContinueShippingConfirmation = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.continueShippingConfirmation(params),
  });
