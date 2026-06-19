import { PatientInfoPage } from "@/features/checkout/components/PatientInfoPage";
import { ROUTES } from "@/constants/routes";

// `?return=confirmation` (set by the shipping-confirmation "Change" links) makes
// the page's Continue go straight back to confirmation instead of advancing.
const PatientInfoRoute = async ({
  searchParams,
}: {
  searchParams: Promise<{ return?: string }>;
}) => {
  const { return: ret } = await searchParams;
  const returnTo = ret === "confirmation" ? ROUTES.SHIPPING_CONFIRMATION : undefined;
  return <PatientInfoPage returnTo={returnTo} />;
};

export default PatientInfoRoute;
