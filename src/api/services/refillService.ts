import api from "@/api/baseAPI";
import { RefillsResponse } from "@/types/refill";

export const refillService = {
  // GET /v2/refills — the Order Refill tab feed ({ active, needs_action }).
  getRefills: (): Promise<RefillsResponse> => api.get<RefillsResponse>("/v2/refills"),
};
