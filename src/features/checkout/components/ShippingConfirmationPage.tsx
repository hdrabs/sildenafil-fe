"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ShippingConfirmationView } from "@/features/checkout/components/shipping/ShippingConfirmationView";
import { useShippingConfirmation } from "@/features/checkout/hooks/useShippingConfirmation";

export const ShippingConfirmationPage = () => {
  const router = useRouter();
  const { me, address, deliveryOption, cutoff, back, onContinue, isSubmitting, isLoading } =
    useShippingConfirmation();

  return (
    <ShippingConfirmationView
      me={me}
      address={address}
      deliveryOption={deliveryOption}
      cutoff={cutoff}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      back={back}
      onContinue={onContinue}
      onChangePatient={() => router.push(`${ROUTES.PATIENT_INFO}?return=confirmation`)}
      onChangeShipping={() => router.push(`${ROUTES.SHIPPING}?return=confirmation`)}
      onChangeDelivery={() => router.push(`${ROUTES.SHIPPING}?return=confirmation&view=delivery`)}
      showProgressBar
    />
  );
};
