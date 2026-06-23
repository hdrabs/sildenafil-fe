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

export const useOrderSummary = (cartId: number, cartToken?: string) =>
  useQuery({
    queryKey: checkoutKeys.orderSummary(cartId),
    queryFn: () => checkoutService.getOrderSummary({ cart_id: cartId, cart_token: cartToken }),
    enabled: cartId > 0,
  });

export const useCompleteOrderVerification = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.completeOrderVerification(params),
  });

export const useExistingIdPhoto = (cartId: number, cartToken: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: checkoutKeys.idPhoto(cartId),
    queryFn: () => checkoutService.getIdPhoto({ cart_id: cartId, cart_token: cartToken }),
    enabled: enabled && cartId > 0,
    staleTime: 0,
  });

export const useExistingSelfiePhoto = (cartId: number, cartToken: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: checkoutKeys.selfiePhoto(cartId),
    queryFn: () => checkoutService.getSelfiePhoto({ cart_id: cartId, cart_token: cartToken }),
    enabled: enabled && cartId > 0,
    staleTime: 0,
  });

export const useContinueIdUpload = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.continueIdUpload(params),
  });

export const useContinueSelfieUpload = () =>
  useMutation({
    mutationFn: (params: { cart_id: number; cart_token?: string }) =>
      checkoutService.continueSelfieUpload(params),
  });
