"use client";

import { useRouter } from "next/navigation";
import { useActiveCart } from "@/store";
import { useGetMe } from "@/api/hooks/useAuthQueries";
import { useShippingAddressesV2 } from "@/api/hooks/useShippingAddressQueries";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useContinueShippingConfirmation } from "@/api/hooks/useCheckoutQueries";

/**
 * Gathers the read-only data for the "confirm your delivery info" page: patient
 * (from /me), the cart's shipping address, and the chosen delivery option. The
 * backend is the source of truth; this only renders. Continue advances the cart.
 */
export const useShippingConfirmation = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;
  const enabled = cartId > 0;

  const { back, steps } = useStepNavigation("shipping_confirmation");
  const { data: me } = useGetMe(enabled);

  const { data: addresses = [] } = useShippingAddressesV2(enabled);
  const address = addresses.find((a) => a.id === activeCart?.cart.shipping_address_id) ?? null;

  const { data: delivery } = useDeliveryOptions(
    { cartId, addressId: address?.id ?? 0, cartToken, destinationZip: address?.zip ?? "" },
    enabled && !!address,
  );
  const deliveryType = activeCart?.cart.delivery_type ?? null;
  const deliveryOption =
    delivery?.delivery_options.find((o) => o.delivery_type === deliveryType) ?? null;
  const cutoff = delivery?.cutoff_time_remaining ?? null;

  const continueMutation = useContinueShippingConfirmation();

  const onContinue = async () => {
    if (!enabled) return;
    const { redirect_path } = await continueMutation.mutateAsync({
      cart_id: cartId,
      cart_token: cartToken,
    });
    router.push(redirect_path);
  };

  return {
    me,
    address,
    deliveryOption,
    cutoff,
    back,
    steps,
    onContinue,
    isSubmitting: continueMutation.isPending,
    // Hold the loader until all three cards have their data: patient (/me), the
    // shipping address, and the delivery-options response (the card here mirrors
    // the option selected on /checkout/shipping). `!delivery` covers the
    // settled-but-empty case too, so it never spins forever.
    isLoading: !me || !address || !delivery,
  };
};
