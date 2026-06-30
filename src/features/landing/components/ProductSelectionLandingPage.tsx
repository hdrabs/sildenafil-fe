"use client";

import dynamic from "next/dynamic";
import { ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { ProductSelectionHero } from "./ProductSelectionHero";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useCartToken } from "@/store";
import { Modal } from "@/components/ui/Modal";

// aum FreeTierProductSelection sections (below the configurator), code-split.
const WhatsIncludedSection = dynamic(() =>
  import("@/features/home/components/WhatsIncludedSection").then((m) => m.WhatsIncludedSection),
);
const RightStrengthSection = dynamic(() =>
  import("@/features/home/components/RightStrengthSection").then((m) => m.RightStrengthSection),
);
const HowItWorksSection = dynamic(() =>
  import("@/features/home/components/HowItWorksSection").then((m) => m.HowItWorksSection),
);
const DrugInfoCardSection = dynamic(() =>
  import("@/features/home/components/DrugInfoCardSection").then((m) => m.DrugInfoCardSection),
);
const ImportantSafetySection = dynamic(() =>
  import("@/features/home/components/ImportantSafetySection").then((m) => m.ImportantSafetySection),
);
const CtaSection = dynamic(() =>
  import("@/features/home/components/CtaSection").then((m) => m.CtaSection),
);
const Footer = dynamic(() => import("@/components/Footer/Footer").then((m) => m.Footer));

interface ProductSelectionLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  theme: LandingTheme;
}

// Page 2 (aum FreeTierProductSelection): configurator LEFT + dark bottle hero RIGHT,
// then the aum product-selection section set. Self-contained (does not touch
// the shared ProductLandingPage).
export const ProductSelectionLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
}: ProductSelectionLandingPageProps) => {
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

  const resolved = activeVariant ?? contextVariant;
  const bottleTheme: LandingTheme = resolved?.product.drug === "tadalafil" ? "tadalafil" : "sildenafil";
  const dosage = resolved?.product.dosage ?? "";

  const cartToken = useCartToken();
  const { startVisit, isPending, blockingModal, blockingModalContent, dismissModal } = useStartVisit({
    landingContext,
    cartToken: cartToken ?? undefined,
  });

  const handleAddToCart = (qty: number) => {
    const activeSlug = resolved?.product.slug ?? slug;
    const variantLabel = resolved
      ? `${resolved.product.drug.charAt(0).toUpperCase()}${resolved.product.drug.slice(1)} ${resolved.product.dosage}`
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
      {/* Configurator (left) + bottle hero (right) */}
      <div className="grid min-h-screen grid-cols-1 min-[992px]:grid-cols-2">
        <div className="h-full bg-white pt-[40px] min-[992px]:pt-[45px]">
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
            allowDrugSwitch={false}
            className="w-full md:mx-auto xl:w-[80%]"
          />
        </div>
        <div className="hidden h-full bg-white p-4 min-[992px]:block min-[992px]:p-6">
          <ProductSelectionHero theme={bottleTheme} dosage={dosage} />
        </div>
      </div>

      {/* aum product-selection sections */}
      <WhatsIncludedSection theme={bottleTheme} />
      <RightStrengthSection theme={bottleTheme} dosage={dosage} />
      <HowItWorksSection theme={bottleTheme} />
      <DrugInfoCardSection theme={bottleTheme} drugInfo={resolved?.drug_info ?? null} />
      <ImportantSafetySection theme={bottleTheme} />
      <CtaSection
        theme={bottleTheme}
        cta={{ label: "Learn More", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) }}
      />
      <Footer theme={bottleTheme} />

      {blockingModalContent && (
        <Modal isOpen={!!blockingModal} onClose={dismissModal} title={blockingModalContent.title} size="sm">
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
