import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { ROUTES } from "@/constants/routes";

// Mirror of /product-detail — the secondary (slim) navbar above the configurator.
// Back always returns to Order Refill (the only entry point into this flow).
const RefillProductDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-bg-main">
    <SecondaryNav backHref={ROUTES.ORDER_REFILL} />
    {children}
  </div>
);

export default RefillProductDetailLayout;
