import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/api/services/cartService";
import { cartKeys, orderKeys } from "@/constants/queryKeys";
import { CartListParams, OrderListParams, CreateCartRequest } from "@/types/cart";

export const useCarts = (params?: CartListParams) =>
  useQuery({
    queryKey: cartKeys.list(params),
    queryFn: () => cartService.listCarts(params),
  });

export const useCart = (id: number) =>
  useQuery({
    queryKey: cartKeys.detail(id),
    queryFn: () => cartService.getCart(id),
    enabled: !!id,
  });

export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCartRequest) => cartService.createCart(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

export const useOrders = (params?: OrderListParams) =>
  useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => cartService.listOrders(params),
  });

export const useOrder = (id: number) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => cartService.getOrder(id),
    enabled: !!id,
  });
