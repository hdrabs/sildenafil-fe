import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PrescriptionsPage } from "@/features/prescriptions/components/PrescriptionsPage";

const Page = () => (
  <ErrorBoundary>
    <PrescriptionsPage />
  </ErrorBoundary>
);

export default Page;
