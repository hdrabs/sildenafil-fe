"use client";

import { ProductSidebar, ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { BottleSection } from "./BottleSection";
import { ProductHeroSection } from "./ProductHeroSection";
import dynamic from "next/dynamic";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useCartToken } from "@/store";
import { Modal } from "@/components/ui/Modal";

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

interface ProductLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  theme: LandingTheme;
  /** Left column: "sidebar" (default), "bottle" (/product-selection), or "hero" (dark jar hero). */
  leftVariant?: "sidebar" | "bottle" | "hero";
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
          allowDrugSwitch={leftVariant === "bottle"}
          className={
            leftVariant === "hero"
              ? "w-full md:mx-auto xl:w-[80%]"
              : "w-full xl:w-[80%]"
          }
        />
        </div>
      </div>

      {showMarketingSections && (
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
