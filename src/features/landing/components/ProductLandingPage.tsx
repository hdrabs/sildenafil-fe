"use client";

import { useEffect, useMemo } from "react";
import { ProductSidebar, ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { BottleSection } from "./BottleSection";
import { ProductHeroSection } from "./ProductHeroSection";
import dynamic from "next/dynamic";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { CatalogVariant } from "@/types/catalog";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useGetActiveCart } from "@/api/hooks/useCartQueries";
import { useActiveCart, useCartToken, useSetConfiguratorDrug, useUser } from "@/store";
import { VisitBlockingModal } from "./VisitBlockingModal";

// Below-the-fold marketing sections — code-split so they stay out of the initial
// client bundle; the configurator above the fold is what must be interactive first.
const ReviewVideosSection = dynamic(() =>
  import("@/features/home/components/ReviewVideosSection").then((m) => m.ReviewVideosSection),
);
const ProcessSection = dynamic(() =>
  import("@/features/home/components/ProcessSection").then((m) => m.ProcessSection),
);
const WhyLoveSection = dynamic(() =>
  import("@/features/home/components/WhyLoveSection").then((m) => m.WhyLoveSection),
);
const HowItWorksSection = dynamic(() =>
  import("@/features/home/components/HowItWorksSection").then((m) => m.HowItWorksSection),
);
const WhatsIncludedSection = dynamic(() =>
  import("@/features/home/components/WhatsIncludedSection").then((m) => m.WhatsIncludedSection),
);
const BrandComparisonSection = dynamic(() =>
  import("@/features/home/components/BrandComparisonSection").then((m) => m.BrandComparisonSection),
);
const FaqSection = dynamic(() =>
  import("@/features/home/components/FaqSection").then((m) => m.FaqSection),
);
const CtaSection = dynamic(() =>
  import("@/features/home/components/CtaSection").then((m) => m.CtaSection),
);
const Footer = dynamic(() => import("@/components/Footer/Footer").then((m) => m.Footer));

// The /best-value page swaps the default home sections for its own AUM-faithful set.
const BestValueSections = dynamic(() =>
  import("@/features/best-value/components/BestValueSections").then((m) => m.BestValueSections),
);

interface ProductLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  theme: LandingTheme;
  /** Left column: "sidebar" (default), "bottle" (/checkout/product-detail), or "hero" (dark jar hero). */
  leftVariant?: "sidebar" | "bottle" | "hero";
  /** Marketing sections below the fold — off for the bare /checkout/product-detail page. */
  showMarketingSections?: boolean;
  /** Which below-the-fold section set to render. "best-value" uses the AUM-faithful best-value set. */
  marketingVariant?: "default" | "best-value";
  /** Preselect the slug's strength on load (default true). Off → "pick your strength" with nothing selected. */
  autoSelectDosage?: boolean;
  /** Preselect the popular/default quantity on load (default true). */
  autoSelectPopular?: boolean;
  /** When an in-progress cart is open, preselect its drug/strength/quantity. */
  resumeFromActiveCart?: boolean;
  /** Show the drug switcher in the configurator. Defaults to the "bottle" layout only. */
  allowDrugSwitch?: boolean;
  /** Variants prefetched on the server → seed the catalog query so SSR renders the real
   *  page (not the loading spinner) and hydration matches. See useCatalog / prefetchCatalog. */
  initialVariants?: CatalogVariant[];
}

export const ProductLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  theme,
  leftVariant = "sidebar",
  showMarketingSections = true,
  marketingVariant = "default",
  autoSelectDosage = true,
  autoSelectPopular = true,
  resumeFromActiveCart = false,
  allowDrugSwitch,
  initialVariants,
}: ProductLandingPageProps) => {
  // Resume the open cart only for non-marketing entries (the drawer drug-name pages). A URL
  // carrying an explicit ?qty / ?discount is a marketing link — its slug/qty/discount win.
  // For a logged-in user we fetch /active_cart directly (authenticated, reliable); guests
  // fall back to the persisted cart-restore store.
  const user = useUser();
  const storeCart = useActiveCart();
  const { data: fetchedCart } = useGetActiveCart(resumeFromActiveCart && !!user);
  const activeCart = user ? fetchedCart : storeCart;
  const isMarketingUrl = initialQty != null || !!discountCode;
  const resumeCart = useMemo(
    () =>
      resumeFromActiveCart && !isMarketingUrl && activeCart
        ? {
            label: activeCart.variantLabel.replace(/^\s*\d+\s*x\s*/i, "").trim(),
            quantity: activeCart.cart.quantity,
          }
        : null,
    [resumeFromActiveCart, isMarketingUrl, activeCart],
  );

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
  } = useProductConfigurator({
    slug,
    initialQty,
    discountCode,
    landingContext,
    autoSelectDosage,
    autoSelectPopular,
    resumeCart,
    initialVariants,
  });

  // Publish the configurator's active drug so the marketing navbar's banner + theme follow
  // the in-page drug selector (a separate component); clear it when leaving the page.
  const setConfiguratorDrug = useSetConfiguratorDrug();
  useEffect(() => {
    setConfiguratorDrug(activeDrug);
    return () => setConfiguratorDrug(null);
  }, [activeDrug, setConfiguratorDrug]);

  // Derive theme from the resolved drug so routes that hardcode theme="sildenafil"
  // still render correctly when a tadalafil slug is passed.
  const effectiveTheme: LandingTheme = activeDrug === "tadalafil" ? "tadalafil" : theme;

  // The bottle/heading must follow the ACTUAL product drug, never the page's
  // hardcoded `theme` fallback (which would show tadalafil for a sildenafil slug).
  const resolvedDrug = (activeVariant ?? contextVariant)?.product.drug;
  const bottleTheme: LandingTheme = resolvedDrug === "tadalafil" ? "tadalafil" : "sildenafil";

  const cartToken = useCartToken();

  const { startVisit, isPending, blockingModal, dismissModal } = useStartVisit({
    landingContext,
    cartToken: cartToken ?? undefined,
    discountCode,
  });

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
          leftVariant === "bottle"
            ? "min-[990px]:grid-cols-2"
            : leftVariant === "hero"
              ? "min-[992px]:grid-cols-2"
              : "md:grid-cols-2"
        }`}
      >
        {leftVariant === "hero" ? (
          <ProductHeroSection
            theme={bottleTheme}
            dosage={(activeVariant ?? contextVariant)?.product.dosage ?? ""}
            drugInfo={(activeVariant ?? contextVariant)?.drug_info ?? null}
          />
        ) : leftVariant === "bottle" ? (
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
        <div
          className={
            leftVariant === "bottle"
              ? "h-full bg-white pt-[20px]"
              : leftVariant === "hero"
                ? "h-full bg-white pt-[40px] min-[992px]:pt-[45px]"
                : "h-full bg-white pt-[90px]"
          }
        >
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
          allowDrugSwitch={(allowDrugSwitch ?? leftVariant === "bottle") && !isMarketingUrl}
          selectedColor={marketingVariant === "best-value" ? "#ec534b" : undefined}
          className={
            leftVariant === "hero"
              ? "w-full md:mx-auto xl:w-[80%]"
              : "w-full xl:w-[80%]"
          }
        />
        </div>
      </div>

      {showMarketingSections && marketingVariant === "best-value" && (
        <BestValueSections
          theme={bottleTheme}
          onGetStarted={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      )}

      {showMarketingSections && marketingVariant === "default" && (
        <>
          <ReviewVideosSection theme={bottleTheme} />
          <ProcessSection theme={bottleTheme} />
          <WhyLoveSection
            theme={bottleTheme}
            cta={{
              label: "Get Started",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            }}
          />
          <HowItWorksSection theme={bottleTheme} />
          <WhatsIncludedSection theme={bottleTheme} />
          <BrandComparisonSection theme={bottleTheme} />
          <FaqSection theme={bottleTheme} />
          <CtaSection
            theme={bottleTheme}
            cta={{
              label: "Learn More",
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            }}
          />
          <Footer theme={bottleTheme} />
        </>
      )}

      <VisitBlockingModal modal={blockingModal} onDismiss={dismissModal} />
    </>
  );
};
