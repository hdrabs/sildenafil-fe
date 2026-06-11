import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProfilePage } from "@/features/profile/components/ProfilePage";

const Page = () => (
  <ErrorBoundary>
    <ProfilePage />
  </ErrorBoundary>
);

export default Page;
