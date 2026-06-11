import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OrdersPage } from "@/features/orders/components/OrdersPage";

const Page = () => (
  <ErrorBoundary>
    <OrdersPage />
  </ErrorBoundary>
);

export default Page;
