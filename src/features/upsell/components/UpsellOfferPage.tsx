"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useUpsellOfferFlow } from "@/features/upsell/hooks/useUpsellOfferFlow";
import { UpsellOfferView } from "@/features/upsell/components/UpsellOfferView";

export const UpsellOfferPage = () => {
  const { offer, firstName, isLoading, secondsLeft, videoSrc, purchase, decline, isSubmitting } =
    useUpsellOfferFlow();

  // Loading, or redirecting out (no cart / no upsell tier).
  if (isLoading || !offer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-upsell-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <UpsellOfferView
      offer={offer}
      firstName={firstName}
      secondsLeft={secondsLeft}
      videoSrc={videoSrc}
      purchase={purchase}
      decline={decline}
      isSubmitting={isSubmitting}
    />
  );
};
