"use client";

import { ProductConfigurator } from "./ProductConfigurator";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";

interface ProductDetailPageProps {
  slug?: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
}

export const ProductDetailPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
}: ProductDetailPageProps) => {
  const { variants, contextVariant, activeVariant, activeDrug, effectiveQty, isLoading, handleQtyChange, handleStrengthChange, handleDrugChange } =
    useProductConfigurator({ slug, initialQty, discountCode, landingContext });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-default px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border-default bg-bg-card shadow-lg">
        <ProductConfigurator
          contextVariant={contextVariant}
          activeVariant={activeVariant}
          allVariants={variants}
          activeDrug={activeDrug}
          selectedQty={effectiveQty}
          onQtyChange={handleQtyChange}
          onStrengthChange={handleStrengthChange}
          onDrugChange={handleDrugChange}
        />
      </div>
    </div>
  );
};
