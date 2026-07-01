import { AuthGuard } from "@/components/AuthGuard";

// Order-scoped routes (/edit/shipping, /order-shipping-confirmation, /order/[id],
// /upsell-offer) require authentication — they were at app root outside any AuthGuard.
// It's a route group, so the URLs are unchanged. Per-route "requires an order"
// redirects live in each route's data hook (editable vs active order).
const OrderLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth>{children}</AuthGuard>
);

export default OrderLayout;
