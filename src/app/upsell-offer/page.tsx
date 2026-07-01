import { Suspense } from "react";
import { UpsellOfferPage } from "@/features/upsell/components/UpsellOfferPage";

// The page reads ?redirect_path= via useSearchParams, which requires a Suspense
// boundary in the App Router.
const UpsellOfferRoute = () => (
  <Suspense>
    <UpsellOfferPage />
  </Suspense>
);

export default UpsellOfferRoute;
