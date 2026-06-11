import api from "@/api/baseAPI";
import { CatalogVariant, CatalogListResponse, CatalogParams } from "@/types/catalog";

const buildCatalogQuery = (params?: CatalogParams): string => {
  if (!params) return "";
  const qs = new URLSearchParams();

  if (params.slug) qs.set("slug", params.slug);
  if (params.discount) qs.set("discount", params.discount);
  if (params.landing_context) qs.set("landing_context", params.landing_context);
  if (params.custom_quantity?.length) {
    params.custom_quantity.forEach((qty) => qs.append("custom_quantity[]", String(qty)));
  }

  const str = qs.toString();
  return str ? `?${str}` : "";
};

export const catalogService = {
  list: async (params?: CatalogParams): Promise<CatalogVariant[]> => {
    const res = await api.get<CatalogListResponse>(`/v2/catalog${buildCatalogQuery(params)}`);
    return res.products;
  },
};
