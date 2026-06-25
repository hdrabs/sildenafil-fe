"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDeliveryOptions } from "@/api/hooks/useDeliveryQueries";
import { DeliveryOption } from "@/types/delivery";
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

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
      stroke="#204AD7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatPrice = (value: number | null): string =>
  Number(value) ? `$${Number(value).toFixed(2)}` : "Free";

const estimateVerb = (deliveryType: string): string =>
  deliveryType === "personal" ? "Estimated Pickup" : "Estimated Delivery";

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
      "flex cursor-pointer items-start gap-3 rounded-xl px-4 py-4 text-left transition-colors",
      selected ? "border-2 border-[#204AD7] bg-[#F8FBFF]" : "border-[1.5px] border-[#C5D4DC] bg-white",
    )}
  >
    <span
      className={cn(
        "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
        selected ? "border-[#204AD7]" : "border-[#C5D4DC]",
      )}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#204AD7]" />}
    </span>

    <span className="min-w-0 flex-1">
      {/* Icon stacks above the label on mobile (matches legacy ≤768px), inline on
          larger screens — otherwise a wrapping label strands the icon mid-text. */}
      <span className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2">
        <Image
          src={option.delivery_type === "personal" ? "/icons/aum-pharmacy.svg" : "/icons/usps.svg"}
          alt=""
          width={option.delivery_type === "personal" ? 42 : 29}
          height={17}
          unoptimized
          className="shrink-0"
        />
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold leading-snug text-text-primary">
            {option.label_info}
          </span>
          {option.delivery_type === "personal" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoreInfo();
              }}
              className="shrink-0 cursor-pointer text-xs font-medium text-[#204AD7] hover:underline"
            >
              More Info
            </button>
          )}
        </span>
      </span>

      <span className="mt-1 block text-sm text-text-muted">{option.delivery_days_label}</span>

      <span className="block text-sm text-[#1D9629]">
        {option.estimated_delivery_date ? (
          <>
            {option.estimated_delivery_date.day_name},{" "}
            <span className="font-bold">{option.estimated_delivery_date.month_day}</span>{" "}
            {estimateVerb(option.delivery_type)}
          </>
        ) : (
          `Calculating... ${estimateVerb(option.delivery_type)}`
        )}
      </span>

      {cutoff && (
        <span className="mt-2 inline-flex items-start gap-1.5 rounded bg-[#ECEEFF] px-3 py-1 text-xs font-medium text-[#204AD7]">
          <span className="mt-px shrink-0">
            <ClockIcon />
          </span>
          {/* Single span so the text wraps as a normal line instead of breaking
              into separate flex columns on narrow screens. */}
          <span className="leading-snug">
            If You Order within <span className="font-bold">{cutoff}</span>
          </span>
        </span>
      )}
    </span>

    <span className="shrink-0 whitespace-nowrap text-lg font-bold text-text-primary sm:text-xl">
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
    <div className="rounded-2xl bg-bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4">
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
