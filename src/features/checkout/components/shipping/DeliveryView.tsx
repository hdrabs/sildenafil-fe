"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { DeliveryOption } from "@/types/delivery";
import { DeliveryOptionDetails } from "@/features/checkout/components/shipping/DeliveryOptionDetails";
import { PickupInfoDrawer } from "@/features/checkout/components/drawers/PickupInfoDrawer";
import { ShippingPolicyDrawer } from "@/features/checkout/components/drawers/ShippingPolicyDrawer";

interface Props {
  cartId: number;
  cartToken?: string;
  addressId: number;
  destinationZip: string;
  preselectedType?: string | null;
  onSubmit: (deliveryType: string) => void;
  isSubmitting: boolean;
}

const formatPrice = (value: number | null): string =>
  Number(value) ? `$${Number(value).toFixed(2)}` : "Free";

const OptionCard = ({
  option,
  selected,
  cutoff,
  onSelect,
  onMoreInfo,
}: {
  option: DeliveryOption;
  selected: boolean;
  cutoff: string | null;
  onSelect: () => void;
  onMoreInfo: () => void;
}) => (
  // role="radio" (not a <button>) so the "More Info" trigger can nest as a real
  // button without invalid button-in-button markup.
  <div
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    }}
    className={cn(
      "flex cursor-pointer items-start gap-3 rounded-xl p-4 text-left transition-colors max-md:p-3 max-xs:p-2.5",
      selected ? "border-2 border-[#204AD7] bg-[#F8FBFF]" : "border-[1.5px] border-[#C5D4DC] bg-white",
    )}
  >
    <span
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
        selected ? "border-[#051a24]/30" : "border-[#C5D4DC]",
      )}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#204AD7]" />}
    </span>

    <DeliveryOptionDetails option={option} cutoff={cutoff} onMoreInfo={onMoreInfo} />

    <span className="shrink-0 self-start whitespace-nowrap text-[13px] font-bold leading-snug text-text-primary md:text-xl">
      {formatPrice(option.price_value)}
    </span>
  </div>
);

export const DeliveryView = ({
  cartId,
  cartToken,
  addressId,
  destinationZip,
  preselectedType,
  onSubmit,
  isSubmitting,
}: Props) => {
  const { data, isLoading } = useDeliveryOptions({ cartId, addressId, cartToken, destinationZip });
  const [override, setOverride] = useState<string | null>(null);
  const [showPickupInfo, setShowPickupInfo] = useState(false);
  const [showShippingPolicy, setShowShippingPolicy] = useState(false);

  const options = data?.delivery_options ?? [];
  const cutoff = data?.cutoff_time_remaining ?? null;

  // Pre-select the cart's delivery type when offered; otherwise default to ground
  // shipping (never the pickup option, which only leads the list visually).
  const preselectOffered =
    preselectedType && options.some((o) => o.delivery_type === preselectedType)
      ? preselectedType
      : null;
  const defaultType =
    preselectOffered ??
    options.find((o) => o.delivery_type === "grounded")?.delivery_type ??
    options.find((o) => o.delivery_type !== "personal")?.delivery_type ??
    options[0]?.delivery_type ??
    null;
  const selected = override ?? defaultType;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
      </div>
    );
  }

  return (
    <>
    <div className="rounded-2xl bg-bg-card p-5 shadow-sm max-md:p-4">
      <div className="flex flex-col gap-5">
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            selected={selected === option.delivery_type}
            cutoff={cutoff}
            onSelect={() => setOverride(option.delivery_type)}
            onMoreInfo={() => setShowPickupInfo(true)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowShippingPolicy(true)}
        className="mt-5 block cursor-pointer text-sm text-[#204AD7] underline hover:opacity-80"
      >
        Click here to learn about our shipping policy
      </button>

      <button
        type="button"
        disabled={!selected || isSubmitting}
        onClick={() => selected && onSubmit(selected)}
        className="mt-5 w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
      >
        Continue
      </button>
    </div>

    <PickupInfoDrawer show={showPickupInfo} onClose={() => setShowPickupInfo(false)} />
    <ShippingPolicyDrawer show={showShippingPolicy} onClose={() => setShowShippingPolicy(false)} />
    </>
  );
};
