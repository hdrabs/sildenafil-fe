"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ShippingAddress } from "@/types/shippingAddress";

interface Props {
  address: ShippingAddress;
  selected: boolean;
  /** When true, the card expands into an inline edit accordion holding `children`. */
  editing?: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onCancelEdit?: () => void;
  /** The edit form, rendered in the accordion below the header when `editing`. */
  children?: ReactNode;
}

const formatAddress = (a: ShippingAddress): string => {
  const line1 = `${a.street_1}${a.street_2 ? `, ${a.street_2}` : ""}`;
  return `${line1}, ${a.city}, ${a.state} ${a.zip}`;
};

export const AddressCard = ({
  address,
  selected,
  editing = false,
  onSelect,
  onEdit,
  onCancelEdit,
  children,
}: Props) => (
  <div
    className={cn(
      "overflow-hidden rounded-xl transition-colors",
      editing
        ? "border-[3px] border-primary bg-[#f8f9fc]"
        : selected
          ? "border-[3px] border-primary bg-white"
          : "border-[1.5px] border-[#c5d4dc] bg-white hover:border-primary",
    )}
  >
    {/* The whole header row is the select target (role="radio", like the delivery
        cards) so a click anywhere in the card selects it; Edit/Cancel stop
        propagation so they don't double as a selection. */}
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
        "flex cursor-pointer items-center gap-3 px-4 py-4 text-left",
        editing && "border-b border-[#e3eaf5]",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-[#051a24]/30" : "border-[#c5d4dc]",
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary-blue" />}
      </span>
      <span className="flex-1 text-sm text-text-primary">{formatAddress(address)}</span>

      {editing ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancelEdit?.();
          }}
          className="hidden shrink-0 cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80 md:inline-block"
        >
          Cancel
        </button>
      ) : (
        address.editable_for_user !== false && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="shrink-0 cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
          >
            Edit
          </button>
        )
      )}
    </div>

    {editing && children && (
      <div className="animate-[slideDown_0.3s_ease] bg-white px-4 py-4">{children}</div>
    )}
  </div>
);
