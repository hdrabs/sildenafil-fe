"use client";

import { useState, useMemo } from "react";
import { useCatalog } from "@/api/hooks/useCatalogQueries";
import { DEFAULT_SLUG, normalizeSlug, buildCatalogParams } from "@/features/landing/catalogParams";
import { CatalogVariant } from "@/types/catalog";

// Variants only shown when the URL slug explicitly requests them
const GATED_SLUGS = ["sildenafil-citrate-20-mg"];

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
  // Landing pages gate certain variants (e.g. 20mg); the edit modal needs all of them.
  includeGated?: boolean;
  // An in-progress cart to resume — preselects its drug/strength/quantity by matching the
  // variant fullname (the active cart's variantLabel, "<qty> x <fullname>", stripped).
  // Auth-independent: matches the catalog variant list, not a server-resolved
  // default_package. Ignored when the cart's variant isn't in the catalog.
  resumeCart?: { label: string; quantity: number } | null;
  // Server-prefetched variants → seed the catalog query so SSR renders real content
  // (not the loading spinner) and the server/client trees match. See useCatalog.
  initialVariants?: CatalogVariant[];
}

export const useProductConfigurator = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  autoSelectPopular = true,
  autoSelectDosage = true,
  includeGated = false,
  resumeCart = null,
  initialVariants,
}: UseProductConfiguratorOptions) => {
  const catalogSlug = normalizeSlug(slug ?? DEFAULT_SLUG);

  const { data: rawVariants, isLoading } = useCatalog(
    buildCatalogParams({ slug, discountCode, initialQty, landingContext }),
    { initialData: initialVariants },
  );

  const normalizedVariants = rawVariants?.map((v) => ({
    ...v,
    product: { ...v.product, drug: normalizeDrug(v.product.drug) },
  }));

  const variants = includeGated
    ? normalizedVariants
    : normalizedVariants?.filter(
        (v) =>
          !GATED_SLUGS.includes(v.product.slug) ||
          v.product.slug === catalogSlug ||
          // Keep the open cart's variant even when gated (e.g. a 20mg cart on the
          // /product-selection/sildenafil page), so its strength resumes and shows.
          v.product.display_name === resumeCart?.label,
      );

  // Match the open cart to a catalog variant by fullname (the variant list is always
  // present regardless of auth), so the resume works even before the catalog request
  // resolves the cart server-side.
  const cartVariant = useMemo(() => {
    if (!resumeCart || !variants) return undefined;
    const match = variants.find((v) => v.product.display_name === resumeCart.label);
    if (!match) return undefined;
    // On a drug-name page (e.g. /product-selection/sildenafil from the drawer), only resume
    // a cart of THAT drug. A different-drug cart (tadalafil cart on the sildenafil page)
    // leaves the drug selected from the slug but its strength/quantity unpopulated.
    const isDrugSlug = variants.some((v) => v.product.drug === catalogSlug);
    if (isDrugSlug && match.product.drug !== catalogSlug) return undefined;
    return match;
  }, [resumeCart, variants, catalogSlug]);

  // Resume the cart's variant; otherwise fall back to the catalog's default_package signal
  // for slug-less callers. (Marketing-URL precedence is handled by the caller, which only
  // passes resumeCart for non-marketing entries.) Drug + strength + quantity derive below.
  const resumeVariant = useMemo(
    () => cartVariant ?? (slug ? undefined : variants?.find((v) => v.default_package)),
    [cartVariant, slug, variants],
  );

  const resumeQty = cartVariant ? resumeCart!.quantity : null;

  // Drug selected by user — null means derive from the initial slug
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  // null = no explicit user selection yet; a value = user has picked this dosage/qty
  const [selectedDosage, setSelectedDosage] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(initialQty ?? 0);

  // Resolved drug: explicit selection > slug-derived > first variant
  const activeDrug = useMemo(() => {
    if (selectedDrug) return selectedDrug;
    if (resumeVariant) return resumeVariant.product.drug;
    return (
      variants?.find((v) => v.product.slug === catalogSlug)?.product.drug ??
      // A drug-name slug ("sildenafil" / "tadalafil") selects that drug with no strength
      // preselected — used by the /product-selection drug pages.
      variants?.find((v) => v.product.drug === catalogSlug)?.product.drug ??
      variants?.[0]?.product.drug ??
      null
    );
  }, [selectedDrug, resumeVariant, variants, catalogSlug]);

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
    // Resume the cart's strength only while the cart's drug is the active one — don't carry
    // it onto a different drug the user switched to.
    if (resumeVariant && resumeVariant.product.drug === activeDrug) return resumeVariant.product.dosage;
    if (!autoSelectDosage || !variants) return null;
    return variants.find((v) => v.product.slug === catalogSlug)?.product.dosage ?? null;
  }, [resumeVariant, activeDrug, variants, catalogSlug, autoSelectDosage]);

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
    // The open cart's quantity wins — but only on the cart's own drug, so switching to a
    // different drug doesn't carry the cart's quantity over.
    if (resumeVariant && resumeVariant.product.drug === activeDrug) {
      if (resumeQty != null) return resumeQty;
      if (resumeVariant.default_package) return resumeVariant.default_package.quantity;
    }
    if (!autoSelectPopular || !activeVariant) return 0;
    const defaultQty = activeVariant.default_package?.quantity;
    const popularQty = activeVariant.packages.find((p) => p.is_popular)?.quantity ?? 0;
    return defaultQty ?? popularQty ?? 0;
  }, [resumeQty, resumeVariant, activeDrug, activeVariant, autoSelectPopular]);

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
