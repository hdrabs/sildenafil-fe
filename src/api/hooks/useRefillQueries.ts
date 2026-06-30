import { useQuery } from "@tanstack/react-query";
import { refillService } from "@/api/services/refillService";
import { refillKeys } from "@/constants/queryKeys";

export const useRefills = () =>
  useQuery({
    queryKey: refillKeys.list(),
    queryFn: () => refillService.getRefills(),
  });
