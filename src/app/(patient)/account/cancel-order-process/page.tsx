import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CancelOrderPage } from "@/features/cancel-order/components/CancelOrderPage";

const Page = () => (
  <ErrorBoundary>
    <CancelOrderPage />
  </ErrorBoundary>
);

export default Page;
