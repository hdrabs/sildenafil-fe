import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/api/getQueryClient";
import { catalogService } from "@/api/services/catalogService";
import { catalogKeys } from "@/constants/queryKeys";
import { buildCatalogParams } from "@/features/landing/catalogParams";
import { CatalogVariant } from "@/types/catalog";

interface PrefetchCatalogInput {
  slug?: string;
  discountCode?: string;
  initialQty?: number;
  landingContext?: string;
}

// Server-side: warm the catalog query so the landing hero renders in the initial HTML
// (LCP image present for the preload scanner) instead of behind a client loading spinner.
// prefetchQuery never throws — if the API is unreachable the query simply isn't dehydrated
// and the client fetches as before (graceful).
//
// Returns both the dehydrated cache (for <HydrationBoundary>) AND the raw variants. Pass
// the variants to the page component as `initialVariants` so its client-side catalog query
// resolves synchronously during SSR — otherwise the client-component render on the server
// starts its own fetch and paints the spinner while the browser hydrates the real page,
// a server/client tree mismatch. See useCatalog.
export const prefetchCatalog = async (input: PrefetchCatalogInput) => {
  const params = buildCatalogParams(input);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: catalogKeys.list(params),
    queryFn: () => catalogService.list(params),
  });

  const variants = queryClient.getQueryData<CatalogVariant[]>(catalogKeys.list(params));
  return { dehydratedState: dehydrate(queryClient), variants };
};
