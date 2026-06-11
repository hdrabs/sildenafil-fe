import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ForgotPasswordPage } from "@/features/auth/components/ForgotPasswordPage";

const Page = () => (
  <ErrorBoundary>
    <ForgotPasswordPage />
  </ErrorBoundary>
);

export default Page;
