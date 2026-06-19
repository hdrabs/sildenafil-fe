"use client";

import { cn } from "@/lib/utils";
import { ShippingAddress } from "@/types/shippingAddress";

interface Props {
  address: ShippingAddress;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}

const formatAddress = (a: ShippingAddress): string => {
  const line1 = `${a.street_1}${a.street_2 ? `, ${a.street_2}` : ""}`;
  return `${line1}, ${a.city}, ${a.state} ${a.zip}`;
};

export const AddressCard = ({ address, selected, onSelect, onEdit }: Props) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-xl bg-white px-4 py-4 transition-colors",
      selected ? "border-[3px] border-primary-blue" : "border-[1.5px] border-border-default",
    )}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="flex flex-1 items-center gap-3 text-left"
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary-blue" : "border-border-default",
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary-blue" />}
      </span>
      <span className="text-sm text-text-primary">{formatAddress(address)}</span>
    </button>

    {address.editable_for_user !== false && (
      <button
        type="button"
        onClick={onEdit}
        className="cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
      >
        Edit
      </button>
    )}
  </div>
);
