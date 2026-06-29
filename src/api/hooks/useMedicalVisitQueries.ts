import { useQuery } from "@tanstack/react-query";
import { medicalVisitService } from "@/api/services/medicalVisitService";
import { visitKeys } from "@/constants/queryKeys";

export const useMedicalVisits = () =>
  useQuery({
    queryKey: visitKeys.history(),
    queryFn: () => medicalVisitService.getMedicalVisits(),
  });
