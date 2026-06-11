import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";

export const OrdersPage = () => (
  <EmptyState
    illustrationSrc="/illustrations/order-history.svg"
    title="Order History"
    description="Nothing to see now, but your past orders will be seen here."
    cta={<StartVisitButton />}
  />
);
