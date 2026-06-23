"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useOrderSummary, useCompleteOrderVerification } from "@/api/hooks/useCheckoutQueries";
import { useApplyDiscount, useRemoveDiscount } from "@/api/hooks/useDiscountQueries";
import { useShippingAddressesV2 } from "@/api/hooks/useShippingAddressQueries";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { useCreditCardsV2, useSetDefaultCardV2 } from "@/api/hooks/useCreditCardQueries";
import { checkoutKeys } from "@/constants/queryKeys";
import { APIError } from "@/api/baseAPI";
import { CartSummaryResponse } from "@/types/orderSummary";

/**
 * Drives the order-verification ("Almost Done!") page: the cart summary, the
 * selected delivery option, and coupon apply/remove. The backend recomputes
 * totals; this just renders and re-seeds the cached summary after a coupon change.
 */
export const useOrderVerification = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;
  const enabled = cartId > 0;

  const { back, steps } = useStepNavigation("order_verification");
  const { data, isLoading } = useOrderSummary(cartId, cartToken);
  const cart = data?.cart ?? null;

  const { data: addresses = [] } = useShippingAddressesV2(enabled);
  const address = addresses.find((a) => a.id === cart?.shipping_address_id) ?? null;

  const { data: delivery } = useDeliveryOptions(
    { cartId, cartToken, destinationZip: address?.zip ?? "" },
    enabled && !!address,
  );
  const deliveryOption =
    delivery?.delivery_options.find((o) => o.delivery_type === cart?.delivery_type) ?? null;
  const cutoff = delivery?.cutoff_time_remaining ?? null;

  const apply = useApplyDiscount();
  const remove = useRemoveDiscount();
  const [couponError, setCouponError] = useState<string | null>(null);

  const seedSummary = (res: CartSummaryResponse) =>
    queryClient.setQueryData(checkoutKeys.orderSummary(cartId), res);

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      seedSummary(await apply.mutateAsync({ cart_id: cartId, cart_token: cartToken, code }));
      return true;
    } catch (e) {
      setCouponError(e instanceof APIError ? e.message : "Could not apply this code.");
      return false;
    }
  };

  const removeCoupon = async () => {
    seedSummary(await remove.mutateAsync({ cart_id: cartId, cart_token: cartToken }));
  };

  const [editing, setEditing] = useState(false);
  const onEditSaved = () => {
    setEditing(false);
    queryClient.invalidateQueries({ queryKey: checkoutKeys.orderSummary(cartId) });
  };

  // Payment method: list saved cards; selecting one sets it as the default (the
  // card that will be charged). Adding a card makes the new one the default.
  const { data: cardsData } = useCreditCardsV2();
  const cards = cardsData?.credit_cards ?? [];
  const defaultCardId = cardsData?.default_payment_profile_id ?? null;
  const setDefault = useSetDefaultCardV2();
  const selectCard = (paymentProfileId: string) => setDefault.mutate(paymentProfileId);

  const complete = useCompleteOrderVerification();
  const completeOrder = async () => {
    if (!enabled || !defaultCardId) return;
    const { redirect_path } = await complete.mutateAsync({ cart_id: cartId, cart_token: cartToken });
    router.push(redirect_path);
  };

  return {
    cart,
    isLoading,
    back,
    steps,
    cartId,
    cartToken,
    deliveryOption,
    cutoff,
    couponError,
    clearCouponError: () => setCouponError(null),
    applyCoupon,
    removeCoupon,
    isApplying: apply.isPending,
    isRemoving: remove.isPending,
    editing,
    openEdit: () => setEditing(true),
    closeEdit: () => setEditing(false),
    onEditSaved,
    cards,
    defaultCardId,
    selectCard,
    isSelectingCard: setDefault.isPending,
    hasSelectedCard: !!defaultCardId,
    completeOrder,
    isCompleting: complete.isPending,
  };
};
