import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/api/services/orderService";
import { cartKeys, orderKeys } from "@/constants/queryKeys";
import { OrderDetail, PayOrderRequest, UpdateOrderRequest } from "@/types/order";

export const useOrdersHistory = () =>
  useQuery({
    queryKey: orderKeys.history(),
    queryFn: () => orderService.getOrdersHistory(),
  });

export const useCurrentOrder = (enabled = true) =>
  useQuery({
    queryKey: orderKeys.current(),
    queryFn: () => orderService.getCurrentOrder(),
    enabled,
  });

// Draft/pending order for /edit/shipping (editable set). Null once submitted.
export const useEditableOrder = (enabled = true) =>
  useQuery({
    queryKey: orderKeys.editable(),
    queryFn: () => orderService.getEditableOrder(),
    enabled,
  });

export const useOrder = (id: number, enabled = true) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrder(id),
    enabled: enabled && id > 0,
  });

export const useUpdateOrder = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOrderRequest) => orderService.updateOrder(id, data),
    onSuccess: (order: OrderDetail) => {
      queryClient.setQueryData(orderKeys.detail(id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.current() });
      queryClient.invalidateQueries({ queryKey: orderKeys.editable() });
      queryClient.invalidateQueries({ queryKey: orderKeys.history() });
    },
  });
};

export const useUpdateOrderCart = (orderId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartId, quantity }: { cartId: number; quantity: number }) =>
      orderService.updateCartQuantity(orderId, cartId, quantity),
    onSuccess: (order: OrderDetail) => {
      queryClient.setQueryData(orderKeys.detail(orderId), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.history() });
    },
  });
};

export const useApplyOrderDiscount = (orderId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => orderService.applyDiscount(orderId, code),
    onSuccess: (order: OrderDetail) => {
      queryClient.setQueryData(orderKeys.detail(orderId), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.history() });
    },
  });
};

export const useRemoveOrderDiscount = (orderId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderService.removeDiscount(orderId),
    onSuccess: (order: OrderDetail) => {
      queryClient.setQueryData(orderKeys.detail(orderId), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.history() });
    },
  });
};

export const usePayOrder = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayOrderRequest = {}) => orderService.payOrder(id, data),
    onSuccess: (order: OrderDetail) => {
      queryClient.setQueryData(orderKeys.detail(id), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.current() });
      // Order History must show the new status (e.g. "being fulfilled") immediately
      // on redirect — without this the 5-min global staleTime serves stale data.
      queryClient.invalidateQueries({ queryKey: orderKeys.history() });
      // The order's carts are now in fulfillment — resync the active cart so the
      // navbar/cart drawer reflect that the cart is no longer pending payment.
      queryClient.invalidateQueries({ queryKey: cartKeys.active() });
    },
  });
};
