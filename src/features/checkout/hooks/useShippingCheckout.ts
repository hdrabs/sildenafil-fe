import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveCart, useSetActiveCart } from "@/store";
import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";
import { useShippingAddressesV2 } from "@/api/hooks/useShippingAddressQueries";
import { useGetMe } from "@/api/hooks/useAuthQueries";
import {
  useAttachShippingAddress,
  useContinueDelivery,
} from "@/api/hooks/useCheckoutQueries";
import { ShippingAddress } from "@/types/shippingAddress";

type View = "address" | "delivery";

export const useShippingCheckout = () => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const setActiveCart = useSetActiveCart();
  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token ?? undefined;
  const currentAddressId = activeCart?.cart.shipping_address_id ?? null;
  const enabled = cartId > 0;

  const { back, steps } = useStepNavigation("shipping_address_info");
  const { data: addresses = [], isLoading } = useShippingAddressesV2(enabled);
  const { data: me } = useGetMe(enabled);
  const attach = useAttachShippingAddress();
  const continueDelivery = useContinueDelivery();

  const [selectedOverride, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingAddress | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState<View>("address");

  const hasAddresses = addresses.length > 0;

  // Derived (not effect-synced): a user pick wins, otherwise default to the
  // cart's current address, else the first one.
  const selectedId = selectedOverride ?? currentAddressId ?? addresses[0]?.id ?? null;

  // Cart's current / selected address floats to the top.
  const sorted = useMemo(
    () =>
      [...addresses].sort((a, b) =>
        a.id === selectedId ? -1 : b.id === selectedId ? 1 : 0,
      ),
    [addresses, selectedId],
  );

  const visible = showAll ? sorted : sorted.slice(0, 3);
  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;

  const attachAndContinue = async (addressId: number) => {
    const { cart } = await attach.mutateAsync({
      cart_id: cartId,
      cart_token: cartToken,
      shipping_address_id: addressId,
    });
    // Refresh the stored cart so the delivery view pre-selects the now-set
    // delivery_type (the attach sets it to grounded).
    if (activeCart) setActiveCart({ ...activeCart, cart });
    setView("delivery");
  };

  // After saving: the first-ever address doubles as the primary "Continue"
  // action; any later address just joins the list.
  const onAddressSaved = async (saved: ShippingAddress) => {
    setSelectedId(saved.id);
    if (!hasAddresses) {
      await attachAndContinue(saved.id);
    } else {
      setFormOpen(false);
      setEditing(null);
    }
  };

  const continueFromList = async () => {
    if (!selectedAddress) return;
    await attachAndContinue(selectedAddress.id);
  };

  const submitDelivery = async (deliveryType: string) => {
    const { redirect_path } = await continueDelivery.mutateAsync({
      cart_id: cartId,
      cart_token: cartToken,
      delivery_type: deliveryType,
    });
    router.push(redirect_path);
  };

  // Two-layer back: from the delivery sub-view, step back to the address view
  // (client-side, no API). From the address view, defer to the read-only
  // NavigationController back (previous funnel step).
  const onBack = view === "delivery" ? () => setView("address") : back;

  return {
    me,
    onBack,
    steps,
    view,
    cartId,
    cartToken,
    preselectedDeliveryType: activeCart?.cart.delivery_type ?? null,
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
    // The form is the primary action when the user has no saved addresses yet.
    showForm: formOpen || editing !== null || (!hasAddresses && !isLoading),
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
    isAttaching: attach.isPending,
    submitDelivery,
    isSubmittingDelivery: continueDelivery.isPending,
    destinationZip: selectedAddress?.zip ?? "",
  };
};
