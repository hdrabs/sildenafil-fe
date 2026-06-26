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
import { ROUTES } from "@/constants/routes";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";

type View = "address" | "delivery";

interface Options {
  // When set (edit-from-confirmation), Continue/back return here instead of
  // advancing the funnel. The change is still persisted; the cart just doesn't move.
  returnTo?: string;
  initialView?: View;
}

export const useShippingCheckout = ({ returnTo, initialView }: Options = {}) => {
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
  // The delivery sub-view is URL-driven (`?view=delivery`) so it has its own
  // history entry — matches the legacy app and makes the browser back button work.
  const view: View = initialView ?? "address";

  const hasAddresses = addresses.length > 0;

  // Derived (not effect-synced): a user pick wins, otherwise default to the
  // cart's current address, else the first one.
  const selectedId = selectedOverride ?? currentAddressId ?? addresses[0]?.id ?? null;

  // Only the cart's *attached* address floats to the top — and the order is
  // recomputed off `currentAddressId`, not the pending selection. Sorting on the
  // live pick would make a just-clicked card jump to position 1 mid-interaction.
  const sorted = useMemo(
    () =>
      [...addresses].sort((a, b) =>
        a.id === currentAddressId ? -1 : b.id === currentAddressId ? 1 : 0,
      ),
    [addresses, currentAddressId],
  );

  const visible = showAll ? sorted : sorted.slice(0, 3);
  const selectedAddress = addresses.find((a) => a.id === selectedId) ?? null;

  // Read the delivery-options loading state here (same query key as DeliveryView,
  // so it's deduped) to drive one page-level loader — otherwise landing on
  // ?view=delivery flashes the heading + an empty card with a spinner inside.
  const { isLoading: isDeliveryLoading } = useDeliveryOptions(
    {
      cartId,
      addressId: selectedAddress?.id ?? 0,
      cartToken,
      destinationZip: selectedAddress?.zip ?? "",
    },
    view === "delivery",
  );

  const attachAndContinue = async (addressId: number) => {
    const { cart } = await attach.mutateAsync({
      cart_id: cartId,
      cart_token: cartToken,
      shipping_address_id: addressId,
    });
    // Refresh the stored cart so the delivery view pre-selects the now-set
    // delivery_type (the attach sets it to grounded).
    if (activeCart) setActiveCart({ ...activeCart, cart });
    // Editing the address from confirmation: go straight back once attached.
    if (returnTo) {
      router.push(returnTo);
      return;
    }
    // Advance to the delivery options as a real navigation so the URL becomes
    // `/checkout/shipping?view=delivery` (server re-renders with the new view).
    router.push(`${ROUTES.SHIPPING}?view=delivery`);
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
    const { redirect_path, cart } = await continueDelivery.mutateAsync({
      cart_id: cartId,
      cart_token: cartToken,
      delivery_type: deliveryType,
    });
    // Keep the stored cart in sync so a return to confirmation shows the new choice.
    if (activeCart) setActiveCart({ ...activeCart, cart });
    // Editing delivery from confirmation: persist, then return there.
    router.push(returnTo ?? redirect_path);
  };

  // Edit-from-confirmation back returns to the confirmation page. Otherwise a
  // two-layer back: from the delivery sub-view, step back to the address view
  // (client-side); from the address view, defer to the NavigationController back.
  const onBack = returnTo
    ? () => router.push(returnTo)
    : view === "delivery"
      ? () => router.back()
      : back;

  return {
    me,
    onBack,
    steps,
    view,
    cartId,
    cartToken,
    preselectedDeliveryType: activeCart?.cart.delivery_type ?? null,
    // One loader for the whole step: addresses, plus delivery options on that view.
    isPageLoading: isLoading || (view === "delivery" && isDeliveryLoading),
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
