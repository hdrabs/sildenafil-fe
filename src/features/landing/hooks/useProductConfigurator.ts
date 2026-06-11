"use client";

import { useState, useMemo } from "react";
import { useCatalog } from "@/api/hooks/useCatalogQueries";

const DEFAULT_SLUG = "sildenafil-citrate-20-mg";

interface UseProductConfiguratorOptions {
  slug?: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
}

export const useProductConfigurator = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
}: UseProductConfiguratorOptions) => {
  const catalogSlug = slug ?? DEFAULT_SLUG;

  const { data: variants, isLoading } = useCatalog({
    slug: catalogSlug,
    ...(discountCode && { discount: discountCode }),
    ...(initialQty && { custom_quantity: [initialQty] }),
    ...(landingContext && { landing_context: landingContext }),
  });

  // Drug selected by user — null means derive from the initial slug
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  // Dosage and qty reset whenever drug changes
  const [selectedDosage, setSelectedDosage] = useState<string | null>(
    slug ? (variants?.find((v) => v.product.slug === slug)?.product.dosage ?? null) : null,
  );
  const [selectedQty, setSelectedQty] = useState<number>(initialQty ?? 0);

  // Resolved drug: explicit selection > slug-derived > first variant
  const activeDrug = useMemo(() => {
    if (selectedDrug) return selectedDrug;
    return (
      variants?.find((v) => v.product.slug === catalogSlug)?.product.drug ??
      variants?.[0]?.product.drug ??
      null
    );
  }, [selectedDrug, variants, catalogSlug]);

  // Context variant: first variant for the active drug (drives packages + strength list)
  const contextVariant = useMemo(() => {
    if (!variants) return null;
    if (activeDrug) {
      return variants.find((v) => v.product.drug === activeDrug) ?? variants[0] ?? null;
    }
    return variants.find((v) => v.product.slug === catalogSlug) ?? variants[0] ?? null;
  }, [variants, activeDrug, catalogSlug]);

  // Variant used for highlighting — null = nothing highlighted
  const activeVariant = useMemo(() => {
    if (!selectedDosage) return null;
    return (
      variants?.find(
        (v) => v.product.drug === activeDrug && v.product.dosage === selectedDosage,
      ) ?? contextVariant
    );
  }, [selectedDosage, variants, activeDrug, contextVariant]);

  const packages = contextVariant?.packages ?? [];
  const packageQtys = packages.map((p) => p.quantity);
  const effectiveQty =
    selectedQty > 0 && packageQtys.includes(selectedQty) ? selectedQty : 0;

  const handleQtyChange = (qty: number) => setSelectedQty(qty);

  const handleStrengthChange = (dosage: string) => {
    setSelectedDosage(dosage);
    setSelectedQty(0);
  };

  const handleDrugChange = (drug: string) => {
    setSelectedDrug(drug);
    setSelectedDosage(null);
    setSelectedQty(0);
  };

  return {
    variants: variants ?? [],
    contextVariant,
    activeVariant,
    activeDrug,
    effectiveQty,
    isLoading,
    handleQtyChange,
    handleStrengthChange,
    handleDrugChange,
  };
};
