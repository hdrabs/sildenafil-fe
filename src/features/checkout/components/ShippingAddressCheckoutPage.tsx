"use client";

import { ShippingAddressView } from "@/features/checkout/components/shipping/ShippingAddressView";
import { useShippingCheckout } from "@/features/checkout/hooks/useShippingCheckout";

interface Props {
  returnTo?: string;
  initialView?: "address" | "delivery";
}

export const ShippingAddressCheckoutPage = ({ returnTo, initialView }: Props = {}) => {
  const { isPageLoading, ...rest } = useShippingCheckout({ returnTo, initialView });

  return <ShippingAddressView {...rest} isLoading={isPageLoading} showProgressBar />;
};
