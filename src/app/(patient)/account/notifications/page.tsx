import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotificationsPage } from "@/features/notifications/components/NotificationsPage";

const Page = () => (
  <ErrorBoundary>
    <NotificationsPage />
  </ErrorBoundary>
);

export default Page;
