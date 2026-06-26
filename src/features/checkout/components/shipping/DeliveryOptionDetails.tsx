"use client";

import Image from "next/image";
import { DeliveryOption } from "@/types/delivery";

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

const estimateVerb = (deliveryType: string): string =>
  deliveryType === "personal" ? "Estimated Pickup" : "Estimated Delivery";

interface Props {
  option: DeliveryOption;
  cutoff: string | null;
  /**
   * When provided, a "More Info" trigger is shown next to a pickup option's
   * label (used by the selectable shipping picker). Omitted on the read-only
   * confirmation card.
   */
  onMoreInfo?: () => void;
}

/**
 * Presentational delivery-option body — icon + label, days, estimated date and
 * the order-cutoff badge. Shared by the selectable card on /checkout/shipping
 * and the read-only card on /checkout/shipping-confirmation so both render the
 * exact same UI. Selection state, price and the "Change" action live in the
 * parent, not here.
 */
export const DeliveryOptionDetails = ({ option, cutoff, onMoreInfo }: Props) => (
  <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
    {/* Icon and label stay inline on one row at every breakpoint (mobile
        included) — never stack the label under the icon. */}
    <span className="flex flex-row items-center gap-2 max-md:gap-1.5">
      <Image
        src={option.delivery_type === "personal" ? "/icons/aum-pharmacy.svg" : "/icons/usps.svg"}
        alt=""
        width={option.delivery_type === "personal" ? 42 : 29}
        height={17}
        unoptimized
        className="shrink-0 max-md:h-3.5 max-md:w-auto"
      />
      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className="text-sm font-semibold leading-snug text-text-primary max-md:text-xs">
          {option.label_info}
        </span>
        {option.delivery_type === "personal" && onMoreInfo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo();
            }}
            className="shrink-0 cursor-pointer text-xs font-medium text-[#204AD7] hover:underline max-md:text-[11px]"
          >
            More Info
          </button>
        )}
      </span>
    </span>

    <span className="block text-sm font-medium text-text-muted max-md:text-xs max-xs:text-[11px]">
      {option.delivery_days_label}
    </span>

    <span className="block text-sm font-medium text-[#1D9629] max-md:text-xs max-xs:text-[11px]">
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
      <span className="mt-1.5 inline-flex items-start gap-1.5 rounded bg-[#ECEEFF] px-3 py-1 text-xs font-medium text-[#204AD7] max-md:px-2 max-md:text-[11px] max-xs:px-1.5 max-xs:py-0.5 max-xs:text-[10px]">
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
);
