import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RefillPage } from "@/features/refills/components/RefillPage";

const Page = () => (
  <ErrorBoundary>
    <RefillPage />
  </ErrorBoundary>
);

export default Page;
