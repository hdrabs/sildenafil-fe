import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creditCardService } from "@/api/services/creditCardService";
import { CreditCardsResponse, CreateCreditCardPayload, SetDefaultCardPayload } from "@/types/creditCard";
import { creditCardKeys } from "@/constants/queryKeys";

export const useCreditCards = () =>
  useQuery<CreditCardsResponse>({
    queryKey: creditCardKeys.list(),
    queryFn:  () => creditCardService.getAll(),
  });

export const useAddCreditCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCreditCardPayload) =>
      creditCardService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: creditCardKeys.list() }),
  });
};

export const useSetDefaultCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetDefaultCardPayload) =>
      creditCardService.setDefault(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: creditCardKeys.list() }),
  });
};

export const useDeleteCreditCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentProfileId: string) =>
      creditCardService.remove(paymentProfileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: creditCardKeys.list() }),
  });
};

// ── v2 (checkout payment step) ─────────────────────────────────────────────

export const useCreditCardsV2 = () =>
  useQuery<CreditCardsResponse>({
    queryKey: creditCardKeys.listV2(),
    queryFn:  () => creditCardService.listV2(),
  });

export const useAddCreditCardV2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCreditCardPayload) => creditCardService.createV2(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: creditCardKeys.listV2() }),
  });
};

export const useSetDefaultCardV2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentProfileId: string) => creditCardService.setDefaultV2(paymentProfileId),
    onSuccess:  () => qc.invalidateQueries({ queryKey: creditCardKeys.listV2() }),
  });
};

export const useDeleteCreditCardV2 = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentProfileId: string) => creditCardService.removeV2(paymentProfileId),
    onSuccess:  () => qc.invalidateQueries({ queryKey: creditCardKeys.listV2() }),
  });
};
