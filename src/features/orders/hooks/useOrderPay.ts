"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useOrder,
  usePayOrder,
  useApplyOrderDiscount,
  useRemoveOrderDiscount,
} from "@/api/hooks/useOrderQueries";
import { useCreditCardsV2, useSetDefaultCardV2 } from "@/api/hooks/useCreditCardQueries";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { useRedirectGuard } from "@/hooks/useRedirectGuard";
import { APIError } from "@/api/baseAPI";
import { ROUTES } from "@/constants/routes";

/**
 * Drives the `/order/:id` pay page: the (multi-item) order, the selected delivery
 * option, the saved-card selector, line-item edit state, and the charge.
 */
export const useOrderPay = (id: number) => {
  const router = useRouter();
  const { data: order, isLoading, isError } = useOrder(id);

  // The pay page is only for an unpaid order the user owns. Already paid, missing, or a
  // foreign/invalid id (useOrder 404s) → order history; there's nothing to pay. The
  // guard keeps the page on its loader (isLoading below) so it never flashes first.
  const redirecting = useRedirectGuard(!isLoading && (isError || !order || order.paid), ROUTES.ORDERS);

  const { data: cardsData } = useCreditCardsV2();
  const selectCard = useSetDefaultCardV2();
  const pay = usePayOrder(id);

  const [editingCartId, setEditingCartId] = useState<number | null>(null);

  const cartId = order?.carts[0]?.id ?? 0;
  const destinationZip = order?.shipping_address?.zip ?? "";
  const { data: deliveryData } = useDeliveryOptions(
    { cartId, addressId: order?.shipping_address_id ?? 0, destinationZip },
    cartId > 0,
  );
  const deliveryOption =
    deliveryData?.delivery_options.find((option) => option.delivery_type === order?.delivery_type) ??
    null;

  const cards = cardsData?.credit_cards ?? [];
  const defaultCardId = cardsData?.default_payment_profile_id ?? null;

  const applyDiscount = useApplyOrderDiscount(id);
  const removeDiscount = useRemoveOrderDiscount(id);
  const [couponError, setCouponError] = useState<string | null>(null);

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      await applyDiscount.mutateAsync(code);
      return true;
    } catch (error) {
      setCouponError(error instanceof APIError ? error.message : "Could not apply this code.");
      return false;
    }
  };

  const completeOrder = () =>
    pay.mutate(
      {},
      {
        onSuccess: () => {
          toast.success("Payment complete!");
          router.push(ROUTES.ORDERS);
        },
        onError: (error) =>
          toast.error((error as { message?: string })?.message ?? "Payment could not be completed."),
      },
    );

  return {
    order,
    isLoading: isLoading || redirecting,
    deliveryOption,
    cutoff: deliveryData?.cutoff_time_remaining ?? null,
    cards,
    defaultCardId,
    selectCard: selectCard.mutate,
    isSelectingCard: selectCard.isPending,
    hasSelectedCard: !!defaultCardId || cards.length > 0,
    completeOrder,
    isCompleting: pay.isPending,
    discounts: order?.carts.flatMap((cart) => cart.discounts) ?? [],
    discountAmount: order
      ? order.carts.reduce((sum, cart) => sum + Math.max(0, cart.price - cart.final_price), 0)
      : 0,
    applyCoupon,
    removeCoupon: () => removeDiscount.mutate(),
    couponError,
    clearCouponError: () => setCouponError(null),
    isApplyingCoupon: applyDiscount.isPending,
    isRemovingCoupon: removeDiscount.isPending,
    editingCart: order?.carts.find((cart) => cart.id === editingCartId) ?? null,
    openEdit: (cartId: number) => setEditingCartId(cartId),
    closeEdit: () => setEditingCartId(null),
  };
};
