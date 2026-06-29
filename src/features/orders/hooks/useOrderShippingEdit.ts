import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentOrder, useUpdateOrder } from "@/api/hooks/useOrderQueries";
import { useShippingAddressesV2 } from "@/api/hooks/useShippingAddressQueries";
import { useGetMe } from "@/api/hooks/useAuthQueries";
import { ROUTES } from "@/constants/routes";
import { ShippingAddress } from "@/types/shippingAddress";

type View = "address" | "delivery";

/**
 * Order-scoped twin of useShippingCheckout: same address → delivery flow, but it
 * operates on the patient's current pending order (PATCH /v2/orders/:id) instead of
 * the cart. The back button always returns to the current-order page.
 */
export const useOrderShippingEdit = ({ initialView }: { initialView?: View } = {}) => {
  const router = useRouter();
  const { data: order, isLoading: orderLoading } = useCurrentOrder();
  const orderId = order?.id ?? 0;
  const enabled = orderId > 0;

  const { data: addresses = [], isLoading: addressesLoading } = useShippingAddressesV2(enabled);
  const { data: me } = useGetMe(enabled);
  const update = useUpdateOrder(orderId);

  const [selectedOverride, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingAddress | null>(null);
  const [showAll, setShowAll] = useState(false);
  // URL-driven (?view=delivery) so Continue re-renders into the delivery view the
  // same way the checkout step does (a plain client navigation).
  const view: View = initialView ?? "address";

  const isLoading = orderLoading || addressesLoading;
  const hasAddresses = addresses.length > 0;
  const currentAddressId = order?.shipping_address_id ?? null;
  const selectedId = selectedOverride ?? currentAddressId ?? addresses[0]?.id ?? null;

  const sorted = useMemo(
    () => [...addresses].sort((a, b) => (a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0)),
    [addresses, selectedId],
  );
  const visible = showAll ? sorted : sorted.slice(0, 3);
  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;

  const saveAddressAndContinue = async (addressId: number) => {
    await update.mutateAsync({ shipping_address_id: addressId });
    router.push(`${ROUTES.EDIT_SHIPPING}?view=delivery`);
  };

  const onAddressSaved = async (saved: ShippingAddress) => {
    setSelectedId(saved.id);
    if (!hasAddresses) {
      await saveAddressAndContinue(saved.id);
    } else {
      setFormOpen(false);
      setEditing(null);
    }
  };

  const continueFromList = async () => {
    if (!selectedAddress) return;
    await saveAddressAndContinue(selectedAddress.id);
  };

  const submitDelivery = async (deliveryType: string) => {
    await update.mutateAsync({ delivery_type: deliveryType });
    router.push(ROUTES.ORDER_SHIPPING_CONFIRMATION);
  };

  return {
    me,
    // From the delivery sub-view, back returns to the address view; from the
    // address view, back leaves to the current-order page. Use an explicit push
    // (not router.back) because the order-confirmation page can push into the
    // delivery view — history-back would bounce there instead of to the address.
    onBack:
      view === "delivery"
        ? () => router.push(ROUTES.EDIT_SHIPPING)
        : () => router.push(ROUTES.CURRENT_ORDER),
    view,
    cartId: order?.carts[0]?.id ?? 0,
    preselectedDeliveryType: order?.delivery_type ?? null,
    isLoading,
    hasAddresses,
    addresses,
    visible,
    showAll,
    toggleShowAll: () => setShowAll((v) => !v),
    selectedId,
    setSelectedId,
    selectedAddress,
    editing,
    // The form is the primary action when the patient has no saved addresses yet.
    showForm: formOpen || editing !== null || (!hasAddresses && !isLoading && enabled),
    openForm: () => {
      setEditing(null);
      setFormOpen(true);
    },
    closeForm: () => {
      setFormOpen(false);
      setEditing(null);
    },
    startEdit: (address: ShippingAddress) => {
      setEditing(address);
      setFormOpen(true);
    },
    onAddressSaved,
    continueFromList,
    isAttaching: update.isPending,
    submitDelivery,
    isSubmittingDelivery: update.isPending,
    destinationZip: selectedAddress?.zip ?? order?.shipping_address?.zip ?? "",
  };
};
