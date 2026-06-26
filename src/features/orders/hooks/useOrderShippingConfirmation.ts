import { useRouter } from "next/navigation";
import { useCurrentOrder } from "@/api/hooks/useOrderQueries";
import { useGetMe } from "@/api/hooks/useAuthQueries";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { ROUTES } from "@/constants/routes";

/**
 * Order-scoped twin of useShippingConfirmation: patient + shipping + delivery
 * summary for the current pending order, with Continue → the pay page.
 */
export const useOrderShippingConfirmation = () => {
  const router = useRouter();
  const { data: order, isLoading: orderLoading } = useCurrentOrder();

  const enabled = !!order;
  const { data: me } = useGetMe(enabled);

  const cartId = order?.carts[0]?.id ?? 0;
  const destinationZip = order?.shipping_address?.zip ?? "";
  const { data: deliveryData, isLoading: deliveryLoading } = useDeliveryOptions(
    { cartId, destinationZip },
    cartId > 0,
  );

  const deliveryOption =
    deliveryData?.delivery_options.find((option) => option.delivery_type === order?.delivery_type) ??
    null;

  return {
    order,
    me,
    address: order?.shipping_address ?? null,
    deliveryOption,
    cutoff: deliveryData?.cutoff_time_remaining ?? null,
    isLoading: orderLoading || deliveryLoading,
    back: () => router.push(`${ROUTES.EDIT_SHIPPING}?view=delivery`),
    changeShipping: () => router.push(ROUTES.EDIT_SHIPPING),
    changeDelivery: () => router.push(`${ROUTES.EDIT_SHIPPING}?view=delivery`),
    onContinue: () => {
      if (order) router.push(ROUTES.ORDER_PAY(order.id));
    },
  };
};
