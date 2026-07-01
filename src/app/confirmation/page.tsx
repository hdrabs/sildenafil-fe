import { Suspense } from "react";
import { ConfirmationPage } from "@/features/auth/components/ConfirmationPage";

// Reads ?confirmation_token= via useSearchParams, which requires a Suspense boundary.
const ConfirmationRoute = () => (
  <Suspense>
    <ConfirmationPage />
  </Suspense>
);

export default ConfirmationRoute;
