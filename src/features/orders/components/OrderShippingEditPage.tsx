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
  const data = useOrderShippingEdit({ initialView });

  return <ShippingAddressView {...data} />;
};
