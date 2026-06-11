import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ShippingAddressPage } from "@/features/shipping-address/components/ShippingAddressPage";

const Page = () => (
  <ErrorBoundary>
    <ShippingAddressPage />
  </ErrorBoundary>
);

export default Page;
