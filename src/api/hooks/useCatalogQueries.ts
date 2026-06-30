import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/api/services/catalogService";
import { catalogKeys } from "@/constants/queryKeys";
import { CatalogParams } from "@/types/catalog";

export const useCatalog = (params?: CatalogParams) =>
  useQuery({
    queryKey: catalogKeys.list(params),
    queryFn: () => catalogService.list(params),
    // The SSR prefetch runs without the user's JWT (it lives in the client store), so the
    // hydrated catalog has no cart context (cart_id / default_package) or user price tier.
    // Refetch on mount on the client — where the request IS authenticated — so the open
    // cart's default_package (the resume signal) and the correct pricing come through.
    refetchOnMount: "always",
  });
