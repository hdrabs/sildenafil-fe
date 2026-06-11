import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";

export const ProductsPage = () => (
  <EmptyState
    illustrationSrc="/illustrations/order-refill.svg"
    title="Order Refill"
    description="Ready to reorder? This section is where you can quickly refill past orders."
    cta={<StartVisitButton />}
  />
);
