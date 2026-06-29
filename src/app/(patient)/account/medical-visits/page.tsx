import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MedicalVisitsPage } from "@/features/medical-visits/components/MedicalVisitsPage";

const Page = () => (
  <ErrorBoundary>
    <Suspense>
      <MedicalVisitsPage />
    </Suspense>
  </ErrorBoundary>
);

export default Page;
