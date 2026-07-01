import { CheckoutStepGuard } from "@/features/checkout/components/CheckoutStepGuard";

// One mount point for the funnel access guard, covering every /checkout/* and
// /intro-questions/* page. The product-detail sub-layout (SecondaryNav) composes within.
const CheckoutLayout = ({ children }: { children: React.ReactNode }) => (
  <CheckoutStepGuard>{children}</CheckoutStepGuard>
);

export default CheckoutLayout;
