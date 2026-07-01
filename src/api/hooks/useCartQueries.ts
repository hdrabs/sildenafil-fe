import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/api/services/cartService";
import { cartKeys, checkoutKeys, orderKeys } from "@/constants/queryKeys";
import {
  CartListParams,
  OrderListParams,
  CreateCartRequest,
  CreateCartV2Request,
  UpdateCartV2Request,
} from "@/types/cart";

// ── V1 hooks ─────────────────────────────────────────────────────────────────

export const useCarts = (params?: CartListParams, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: cartKeys.list(params),
    queryFn: () => cartService.listCarts(params),
    enabled: options?.enabled,
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

// ── V2 hooks ─────────────────────────────────────────────────────────────────

/**
 * Lazily checks visit eligibility before cart creation.
 * Exposed as a mutation so callers can trigger it on demand (e.g. button click).
 */
export const useCheckEligibility = () =>
  useMutation({
    mutationFn: (params?: { cart_token?: string }) =>
      cartService.visitEligibility(params),
  });

/**
 * Creates a new v2 cart (guest-friendly).
 * Returns { cart, redirect_path }.
 */
export const useCreateCartV2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCartV2Request) => cartService.createCartV2(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

/**
 * Updates an existing open v2 cart (guest-friendly via cart_token).
 * Returns { cart, redirect_path }.
 */
export const useUpdateCartV2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCartV2Request & { cart_token?: string } }) =>
      cartService.updateCartV2(id, data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

/**
 * Deletes an open v2 cart (guest-friendly via cart_token).
 */
export const useDeleteCartV2 = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cartToken }: { id: number; cartToken?: string }) =>
      cartService.deleteCartV2(id, cartToken),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

/**
 * Fetches the authenticated user's most recent in-progress cart.
 * Used to restore cart state on page load or across browsers.
 */
export const useGetActiveCart = (enabled = true) =>
  useQuery({
    queryKey: cartKeys.active(),
    queryFn: () => cartService.getActiveCart(),
    enabled,
    staleTime: 30_000,
  });

/**
 * Advances a cart from product_detail → intro_questions.
 * PATCH /api/v2/carts/:id with { advance: true } — no slug/qty change.
 */
export const useAdvanceCartStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cartToken }: { id: number; cartToken?: string }) =>
      cartService.advanceCartStep(id, cartToken),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      // cart.step moved — drop the funnel guard's cached access verdict so it can't
      // act on a stale reachability decision. (Per-step navigation already refetches
      // per new step; this covers advance-without-navigation.)
      queryClient.invalidateQueries({ queryKey: checkoutKeys.all });
    },
  });
};
