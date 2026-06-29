"use client";

import { ShippingConfirmationView } from "@/features/checkout/components/shipping/ShippingConfirmationView";
import { useOrderShippingConfirmation } from "@/features/orders/hooks/useOrderShippingConfirmation";

/**
 * Order-scoped `/order-shipping-confirmation`. Renders the same UI as the checkout
 * confirmation step (via the shared ShippingConfirmationView), wired to the current
 * order. Patient info is read-only (no "Change") and there's no funnel progress bar.
 */
export const OrderShippingConfirmationPage = () => {
  const { me, address, deliveryOption, cutoff, isLoading, back, changeShipping, changeDelivery, onContinue } =
    useOrderShippingConfirmation();

  return (
    <ShippingConfirmationView
      me={me}
      address={address}
      deliveryOption={deliveryOption}
      cutoff={cutoff}
      isLoading={isLoading}
      back={back}
      onContinue={onContinue}
      onChangeShipping={changeShipping}
      onChangeDelivery={changeDelivery}
      subtitle="Review your shipping and delivery before paying"
    />
  );
};
