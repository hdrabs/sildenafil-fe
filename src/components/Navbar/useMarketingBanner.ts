"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCatalog } from "@/api/hooks/useCatalogQueries";
import { buildCatalogParams } from "@/features/landing/catalogParams";
import { useConfiguratorDrug } from "@/store";

const DEFAULT_BANNER = "Save Up To 90% + FREE Consultation + FREE Shipping";

/**
 * Funnel discount-banner copy — from the v2 catalog's `discount.banner_text`,
 * falling back to the standard promo. Rebuilds the page's own query params so it
 * reuses the prefetched catalog cache (no extra fetch). Reads `?discount` via
 * useSearchParams, so callers must sit inside a Suspense boundary. Returns the
 * copy plus a `isTadalafil` flag for the slim navbar's drug-themed banner tint.
 */
export const useMarketingBanner = () => {
  const params = useParams<{ slug?: string | string[] }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const configuratorDrug = useConfiguratorDrug();

  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug ?? "");
  const slug = configuratorDrug ?? urlSlug;

  const qtyParam = searchParams.get("qty");
  const { data: variants } = useCatalog(
    buildCatalogParams({
      slug,
      discountCode: searchParams.get("discount") ?? undefined,
      initialQty: qtyParam ? parseInt(qtyParam, 10) : undefined,
      landingContext: searchParams.get("landing_context") ?? pathname.split("/")[1],
    }),
  );

  // The navbar sits in the marketing layout — outside the page's HydrationBoundary — so the
  // catalog isn't resolved during SSR and the discount banner can't be known server-side.
  // Render the default banner for SSR + first paint, then swap in the discount copy after
  // mount, so the server and client trees match (no hydration mismatch on the banner text).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const bannerText = variants
    ?.find((v) => v.discount?.banner_text)
    ?.discount?.banner_text?.trim();
  const text = mounted && bannerText ? bannerText : DEFAULT_BANNER;

  return { text, isTadalafil: slug.includes("tadalafi") };
};
