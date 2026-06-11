"use client";

import { useRouter } from "next/navigation";
import { ProductSidebar, ProductConfigurator, LandingTheme } from "./ProductConfigurator";
import { ProcessSection } from "@/features/home/components/ProcessSection";
import { RealResultsSection } from "@/features/home/components/RealResultsSection";
import { WhatsIncludedSection } from "@/features/home/components/WhatsIncludedSection";
import { FaqSection } from "@/features/home/components/FaqSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { ROUTES } from "@/constants/routes";

interface ProductLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  theme: LandingTheme;
}

export const ProductLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  theme,
}: ProductLandingPageProps) => {
  const router = useRouter();
  const { variants, contextVariant, activeVariant, activeDrug, effectiveQty, isLoading, handleQtyChange, handleStrengthChange, handleDrugChange } =
    useProductConfigurator({ slug, initialQty, discountCode, landingContext });

  const handleAddToCart = (qty: number) => {
    const params = new URLSearchParams();
    const variantSlug = (activeVariant ?? contextVariant)?.product.slug ?? slug;
    if (variantSlug) params.set("slug", variantSlug);
    params.set("qty", String(qty));
    if (discountCode) params.set("discount", discountCode);
    if (landingContext) params.set("landing_context", landingContext);
    router.push(`${ROUTES.PRODUCT_DETAIL}?${params.toString()}`);
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
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <ProductSidebar
          theme={theme}
          productName={(activeVariant ?? contextVariant)?.product.display_name ?? "Sildenafil"}
          dosage={(activeVariant ?? contextVariant)?.product.dosage ?? ""}
        />
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
        />
      </div>

      <RealResultsSection />
      <ProcessSection />
      <WhatsIncludedSection />
      <FaqSection />
      <CtaSection />
    </>
  );
};
