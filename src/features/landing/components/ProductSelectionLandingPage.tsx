"use client";

import dynamic from "next/dynamic";
import { ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { ProductSelectionHero } from "./ProductSelectionHero";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useCartToken } from "@/store";
import { VisitBlockingModal } from "./VisitBlockingModal";
import { CatalogVariant } from "@/types/catalog";

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
  /** Server-prefetched variants → seed the catalog query so SSR renders the real page
   *  (not the loading spinner) and hydration matches. See useCatalog / prefetchCatalog. */
  initialVariants?: CatalogVariant[];
}

// Page 2 (aum FreeTierProductSelection): configurator LEFT + dark bottle hero RIGHT,
// then the aum product-selection section set. Self-contained (does not touch
// the shared ProductLandingPage).
export const ProductSelectionLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  initialVariants,
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
  } = useProductConfigurator({ slug, initialQty, discountCode, landingContext, initialVariants });

  const resolved = activeVariant ?? contextVariant;
  const bottleTheme: LandingTheme = resolved?.product.drug === "tadalafil" ? "tadalafil" : "sildenafil";
  const dosage = resolved?.product.dosage ?? "";

  const cartToken = useCartToken();
  const { startVisit, isPending, blockingModal, dismissModal } = useStartVisit({
    landingContext,
    cartToken: cartToken ?? undefined,
    // Forward the URL ?discount= onto the created cart so the free-tier promo (fee +
    // free tablets) is applied — matches ProductLandingPage / ProductDetailPage.
    discountCode,
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
      {/* Top section (aum): configurator (left 46%) + bottle hero (right 46%),
          centered max-w 1380, padding 50/0/60, space-between. Full-bleed white bg. */}
      <div className="bg-white">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col px-4 pt-[50px] pb-[60px] min-[992px]:flex-row min-[992px]:justify-between min-[992px]:px-0">
          <div className="w-full min-[992px]:w-[46%]">
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
              className="w-full"
            />
          </div>
          <div className="hidden w-full min-[992px]:block min-[992px]:w-[46%]">
            <ProductSelectionHero theme={bottleTheme} dosage={dosage} />
          </div>
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

      <VisitBlockingModal modal={blockingModal} onDismiss={dismissModal} />
    </>
  );
};
