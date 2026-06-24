"use client";

import { ProductSidebar, ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { BottleSection } from "./BottleSection";
import { ProcessSection } from "@/features/home/components/ProcessSection";
import { RealResultsSection } from "@/features/home/components/RealResultsSection";
import { WhatsIncludedSection } from "@/features/home/components/WhatsIncludedSection";
import { FaqSection } from "@/features/home/components/FaqSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useCartToken } from "@/store";
import { Modal } from "@/components/ui/Modal";

interface ProductLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  theme: LandingTheme;
  /** Left column: "sidebar" (default, shared) or "bottle" (dedicated /product-selection design). */
  leftVariant?: "sidebar" | "bottle";
  /** Marketing sections below the fold — off for the bare /product-selection page. */
  showMarketingSections?: boolean;
}

export const ProductLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  theme,
  leftVariant = "sidebar",
  showMarketingSections = true,
}: ProductLandingPageProps) => {
  const {
    variants,
    contextVariant,
    activeVariant,
    activeDrug,
    effectiveQty,
    isLoading,
    handleQtyChange,
    handleStrengthChange,
    handleDrugChange,
  } = useProductConfigurator({ slug, initialQty, discountCode, landingContext });

  // Derive theme from the resolved drug so routes that hardcode theme="sildenafil"
  // still render correctly when a tadalafil slug is passed.
  const effectiveTheme: LandingTheme = activeDrug === "tadalafil" ? "tadalafil" : theme;

  // The bottle/heading must follow the ACTUAL product drug, never the page's
  // hardcoded `theme` fallback (which would show tadalafil for a sildenafil slug).
  const resolvedDrug = (activeVariant ?? contextVariant)?.product.drug;
  const bottleTheme: LandingTheme = resolvedDrug === "tadalafil" ? "tadalafil" : "sildenafil";

  const cartToken = useCartToken();

  const { startVisit, isPending, blockingModal, blockingModalContent, dismissModal } =
    useStartVisit({ landingContext, cartToken: cartToken ?? undefined });

  const handleAddToCart = (qty: number) => {
    const activeSlug = (activeVariant ?? contextVariant)?.product.slug ?? slug;
    const v = activeVariant ?? contextVariant;
    const variantLabel = v
      ? `${v.product.drug.charAt(0).toUpperCase()}${v.product.drug.slice(1)} ${v.product.dosage}`
      : "ED Medication";
    startVisit({ slug: activeSlug, quantity: qty, variantLabel });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid min-h-screen grid-cols-1 ${
          leftVariant === "bottle" ? "min-[990px]:grid-cols-2" : "md:grid-cols-2"
        }`}
      >
        {leftVariant === "bottle" ? (
          <BottleSection
            theme={bottleTheme}
            dosage={(activeVariant ?? contextVariant)?.product.dosage ?? ""}
          />
        ) : (
          <ProductSidebar
            theme={effectiveTheme}
            productName={(activeVariant ?? contextVariant)?.product.display_name ?? "Sildenafil"}
            dosage={(activeVariant ?? contextVariant)?.product.dosage ?? ""}
          />
        )}
        <div className={leftVariant === "bottle" ? "bg-white pt-[20px]" : "bg-white pt-[90px]"}>
        <ProductConfigurator
          contextVariant={contextVariant}
          activeVariant={activeVariant}
          allVariants={variants}
          activeDrug={activeDrug}
          selectedQty={effectiveQty}
          onQtyChange={handleQtyChange}
          onStrengthChange={handleStrengthChange}
          onDrugChange={handleDrugChange}
          onAddToCart={handleAddToCart}
          isSubmitting={isPending}
          allowDrugSwitch={leftVariant === "bottle"}
          className="w-full xl:w-[75%]"
        />
        </div>
      </div>

      {showMarketingSections && (
        <>
          <RealResultsSection />
          <ProcessSection />
          <WhatsIncludedSection />
          <FaqSection />
          <CtaSection />
        </>
      )}

      {blockingModalContent && (
        <Modal
          isOpen={!!blockingModal}
          onClose={dismissModal}
          title={blockingModalContent.title}
          size="sm"
        >
          <p className="text-sm text-text-muted">{blockingModalContent.body}</p>
          <button
            onClick={dismissModal}
            className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </Modal>
      )}
    </>
  );
};
