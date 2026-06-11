import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ResetPasswordPage } from "@/features/auth/components/ResetPasswordPage";

const Page = () => (
  <ErrorBoundary>
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  </ErrorBoundary>
);

export default Page;
