import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SignupPage } from "@/features/auth/components/SignupPage";

const Page = () => (
  <ErrorBoundary>
    <SignupPage />
  </ErrorBoundary>
);

export default Page;
