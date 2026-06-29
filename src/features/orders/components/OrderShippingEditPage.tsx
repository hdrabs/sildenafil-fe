"use client";

import { ShippingAddressView } from "@/features/checkout/components/shipping/ShippingAddressView";
import { useOrderShippingEdit } from "@/features/orders/hooks/useOrderShippingEdit";

/**
 * Order-scoped `/edit/shipping`. Renders the exact same UI as the checkout
 * `/checkout/shipping` step (via the shared ShippingAddressView) but wired to the
 * patient's current order, and without the funnel progress bar.
 */
export const OrderShippingEditPage = ({
  initialView,
}: {
  initialView?: "address" | "delivery";
}) => {
  const { isPageLoading, ...rest } = useOrderShippingEdit({ initialView });

  // Map the hook's combined loader to the view's `isLoading` (it hides the
  // progress bar, so the page-level loader covers addresses + delivery options).
  return <ShippingAddressView {...rest} isLoading={isPageLoading} />;
};
