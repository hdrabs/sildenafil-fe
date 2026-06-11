import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginPage } from "@/features/auth/components/LoginPage";

const Page = () => (
  <ErrorBoundary>
    <Suspense>
      <LoginPage />
    </Suspense>
  </ErrorBoundary>
);

export default Page;
