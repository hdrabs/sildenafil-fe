"use client";

import { useState, useMemo } from "react";
import { useCatalog } from "@/api/hooks/useCatalogQueries";

const DEFAULT_SLUG = "sildenafil-citrate-20-mg";

// Variants only shown when the URL slug explicitly requests them
const GATED_SLUGS = ["sildenafil-citrate-20-mg"];

// The API slug uses "tadalafi" (missing trailing 'l') — accept either spelling in the URL
// so /try/tadalafil-generic-10-mg and /try/tadalafi-generic-10-mg both resolve correctly.
const normalizeSlug = (s: string) => s.replace("tadalafil-generic", "tadalafi-generic");

// The API occasionally returns drug: "tadalafi" — normalise to the canonical "tadalafil"
// so all downstream comparisons (theme, display names, image paths) work consistently.
const normalizeDrug = (drug: string) => (drug === "tadalafi" ? "tadalafil" : drug);

interface UseProductConfiguratorOptions {
  slug?: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  autoSelectPopular?: boolean;
  autoSelectDosage?: boolean;
}

export const useProductConfigurator = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  autoSelectPopular = true,
  autoSelectDosage = true,
}: UseProductConfiguratorOptions) => {
  const catalogSlug = normalizeSlug(slug ?? DEFAULT_SLUG);

  const { data: rawVariants, isLoading } = useCatalog({
    slug: catalogSlug,
    ...(discountCode && { discount: discountCode }),
    ...(initialQty && { custom_quantity: [initialQty] }),
    ...(landingContext && { landing_context: landingContext }),
  });

  const normalizedVariants = rawVariants?.map((v) => ({
    ...v,
    product: { ...v.product, drug: normalizeDrug(v.product.drug) },
  }));

  const variants = normalizedVariants?.filter(
    (v) => !GATED_SLUGS.includes(v.product.slug) || v.product.slug === catalogSlug,
  );

  // Drug selected by user — null means derive from the initial slug
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  // null = no explicit user selection yet; a value = user has picked this dosage/qty
  const [selectedDosage, setSelectedDosage] = useState<string | null>(null);
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

  // API-seeded dosage: derived from the slug-matched variant when user hasn't picked yet
  const apiDosage = useMemo(() => {
    if (!autoSelectDosage || !variants) return null;
    return variants.find((v) => v.product.slug === catalogSlug)?.product.dosage ?? null;
  }, [variants, catalogSlug, autoSelectDosage]);

  const activeDosage = selectedDosage ?? apiDosage;

  // Variant used for highlighting — null = nothing highlighted
  const activeVariant = useMemo(() => {
    if (!activeDosage) return null;
    return (
      variants?.find(
        (v) => v.product.drug === activeDrug && v.product.dosage === activeDosage,
      ) ?? contextVariant
    );
  }, [activeDosage, variants, activeDrug, contextVariant]);

  const packages = (activeVariant ?? contextVariant)?.packages ?? [];

  // API-seeded qty: only derived when auto-selection is allowed
  const apiQty = useMemo(() => {
    if (!autoSelectPopular || !activeVariant) return 0;
    const defaultQty = activeVariant.default_package?.quantity;
    const popularQty = activeVariant.packages.find((p) => p.is_popular)?.quantity ?? 0;
    return defaultQty ?? popularQty ?? 0;
  }, [activeVariant, autoSelectPopular]);

  const effectiveQty = useMemo(() => {
    const qty = selectedQty > 0 ? selectedQty : apiQty;
    const validQtys = packages.map((p) => p.quantity);
    return validQtys.includes(qty) ? qty : 0;
  }, [selectedQty, apiQty, packages]);

  const handleQtyChange = (qty: number) => setSelectedQty(qty);

  const handleStrengthChange = (dosage: string) => {
    setSelectedDosage(dosage);
    const newVariantPackages =
      variants?.find((v) => v.product.drug === activeDrug && v.product.dosage === dosage)
        ?.packages ?? [];
    // Use the raw selectedQty (not effectiveQty) to avoid stale closure on the derived memo
    const currentQty = selectedQty > 0 ? selectedQty : apiQty;
    const qtyExistsInNewStrength = newVariantPackages.some((p) => p.quantity === currentQty);
    if (!qtyExistsInNewStrength) setSelectedQty(0);
  };

  const handleDrugChange = (drug: string) => {
    setSelectedDrug(drug);
    setSelectedDosage(null);
    setSelectedQty(0);
  };

  return {
    variants: variants ?? normalizedVariants ?? [],
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
