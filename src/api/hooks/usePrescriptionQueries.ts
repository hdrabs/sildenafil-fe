import { useQuery } from "@tanstack/react-query";
import { prescriptionService } from "@/api/services/prescriptionService";
import { prescriptionKeys } from "@/constants/queryKeys";

/**
 * Fetches patient's active prescriptions via GET /v1/account/order_refill
 */
export const usePrescriptions = () =>
  useQuery({
    queryKey: prescriptionKeys.list(),
    queryFn: () => prescriptionService.list(),
  });
