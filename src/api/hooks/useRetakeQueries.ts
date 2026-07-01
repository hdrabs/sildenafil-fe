import { useMutation, useQuery } from "@tanstack/react-query";
import { retakeService } from "@/api/services/retakeService";
import { retakeKeys } from "@/constants/queryKeys";
import { RetakeKind } from "@/types/retake";

// Post-login prompt: checked once per session (long staleTime, not on every nav).
export const useRetakePending = (enabled: boolean) =>
  useQuery({
    queryKey: retakeKeys.pending(),
    queryFn: () => retakeService.getPending(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

export const useRetakeStatus = (enabled = true) =>
  useQuery({
    queryKey: retakeKeys.status(),
    queryFn: () => retakeService.getStatus(),
    enabled,
  });

export const useUploadRetakePhoto = () =>
  useMutation({
    mutationFn: (params: { kind: RetakeKind; photo: File }) => retakeService.upload(params),
  });
