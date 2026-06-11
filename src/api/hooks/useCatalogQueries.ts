import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/api/services/catalogService";
import { catalogKeys } from "@/constants/queryKeys";
import { CatalogParams } from "@/types/catalog";

export const useCatalog = (params?: CatalogParams) =>
  useQuery({
    queryKey: catalogKeys.list(params),
    queryFn: () => catalogService.list(params),
  });
