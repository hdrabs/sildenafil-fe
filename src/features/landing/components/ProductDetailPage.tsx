"use client";

import { ProductConfigurator } from "./ProductConfigurator";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useStartVisit } from "@/features/landing/hooks/useStartVisit";
import { useCartToken } from "@/store";
import { Modal } from "@/components/ui/Modal";

interface ProductDetailPageProps {
  slug?: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  // Entry id persisted on the cart for "back" navigation (e.g. "product-detail",
  // "refill-product-detail"). Distinct from landingContext (price tier).
  landingUrl?: string;
  // Refill flows preselect the drug/strength/quantity from the slug; the fresh
  // "start a new order" flow leaves them unselected.
  autoSelectDosage?: boolean;
  autoSelectPopular?: boolean;
}

export const ProductDetailPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  landingUrl,
  autoSelectDosage = false,
  autoSelectPopular = false,
}: ProductDetailPageProps) => {
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
  });

  const cartToken = useCartToken();

  const { startVisit, isPending, blockingModal, blockingModalContent, dismissModal } =
    useStartVisit({ landingContext, landingUrl, cartToken: cartToken ?? undefined, discountCode });

  const handleAddToCart = (qty: number) => {
    const activeSlug = (activeVariant ?? contextVariant)?.product.slug ?? slug;
    if (!activeSlug) return;
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
      <div className="flex-1 bg-white">
          <div className="mx-auto max-w-2xl pt-5 sm:pt-[60px]">
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
            allowDrugSwitch
            className="w-full sm:w-[90%]"
          />
        </div>
      </div>

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
