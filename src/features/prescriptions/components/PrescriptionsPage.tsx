import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";

export const PrescriptionsPage = () => (
  <EmptyState
    illustrationSrc="/illustrations/medical-visits.svg"
    title="Medical Visits"
    description="Access your current and past ED medical visits details right here. Click 'Get Started' to initiate an online ED visit."
    cta={<StartVisitButton />}
  />
);
