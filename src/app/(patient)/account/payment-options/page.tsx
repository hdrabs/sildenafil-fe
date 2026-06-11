import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PaymentHistoryPage } from "@/features/payments/components/PaymentHistoryPage";

const Page = () => (
  <ErrorBoundary>
    <PaymentHistoryPage />
  </ErrorBoundary>
);

export default Page;
