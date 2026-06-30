import { CatalogParams } from "@/types/catalog";

export const DEFAULT_SLUG = "sildenafil-citrate-20-mg";

// The API slug uses "tadalafi" (missing trailing 'l') — accept either spelling in the URL
// so /try/tadalafil-generic-10-mg and /try/tadalafi-generic-10-mg both resolve correctly.
export const normalizeSlug = (s: string) => s.replace("tadalafil-generic", "tadalafi-generic");

interface BuildCatalogParamsInput {
  slug?: string;
  discountCode?: string;
  initialQty?: number;
  landingContext?: string;
}

// Single source of truth for the catalog query params, shared by the client hook
// (useProductConfigurator) and the server prefetch (prefetchCatalog) so their
// TanStack query keys hash identically and the SSR cache hydrates without a refetch.
export const buildCatalogParams = ({
  slug,
  discountCode,
  initialQty,
  landingContext,
}: BuildCatalogParamsInput): CatalogParams => ({
  slug: normalizeSlug(slug ?? DEFAULT_SLUG),
  ...(discountCode && { discount: discountCode }),
  ...(initialQty && { custom_quantity: [initialQty] }),
  ...(landingContext && { landing_context: landingContext }),
});
