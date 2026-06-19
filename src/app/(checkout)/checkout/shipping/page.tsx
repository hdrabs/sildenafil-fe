import { ShippingAddressCheckoutPage } from "@/features/checkout/components/ShippingAddressCheckoutPage";
import { ROUTES } from "@/constants/routes";

// `?return=confirmation` (+ optional `?view=delivery`) is set by the
// shipping-confirmation "Change" links: edits persist but return there instead
// of advancing the funnel.
const ShippingRoute = async ({
  searchParams,
}: {
  searchParams: Promise<{ return?: string; view?: string }>;
}) => {
  const { return: ret, view } = await searchParams;
  const returnTo = ret === "confirmation" ? ROUTES.SHIPPING_CONFIRMATION : undefined;
  const initialView = view === "delivery" ? "delivery" : "address";
  return <ShippingAddressCheckoutPage returnTo={returnTo} initialView={initialView} />;
};

export default ShippingRoute;
