import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCartV2 } from "@/api/hooks/useCartQueries";
import { refillKeys } from "@/constants/queryKeys";

// Removes an in-progress refill/visit cart from the Order Refill tab, then
// refreshes the feed so the card disappears.
export const useRemoveRefillCart = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteCartV2();

  const submit = (id: number) =>
    mutate(
      { id },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: refillKeys.list() }) },
    );

  return { submit, isLoading: isPending };
};
