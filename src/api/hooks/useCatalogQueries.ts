import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/api/services/catalogService";
import { catalogKeys } from "@/constants/queryKeys";
import { CatalogParams, CatalogVariant } from "@/types/catalog";

interface UseCatalogOptions {
  // Server-prefetched variants, passed as `initialData` so the query is already in a
  // success state during SSR (isLoading=false). Without it the client-component render on
  // the server starts its own fetch and paints the loading spinner, while the browser
  // hydrates the dehydrated cache and paints the real page — a server/client tree mismatch
  // (hydration error) that also drops the LCP image + copy from the initial HTML.
  initialData?: CatalogVariant[];
}

export const useCatalog = (params?: CatalogParams, options?: UseCatalogOptions) =>
  useQuery({
    queryKey: catalogKeys.list(params),
    queryFn: () => catalogService.list(params),
    // The SSR prefetch runs without the user's JWT (it lives in the client store), so the
    // hydrated catalog has no cart context (cart_id / default_package) or user price tier.
    // Refetch on mount on the client — where the request IS authenticated — so the open
    // cart's default_package (the resume signal) and the correct pricing come through.
    refetchOnMount: "always",
    initialData: options?.initialData,
  });
