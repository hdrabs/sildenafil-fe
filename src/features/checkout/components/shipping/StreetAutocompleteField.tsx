"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddressSuggestions } from "@/api/hooks/useAddressQueries";
import { AddressSuggestion } from "@/types/shippingAddress";

interface PickedAddress {
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
}

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
  value: string;
  error?: string;
  onSelect: (address: PickedAddress) => void;
}

// Smarty re-queries a multi-unit suggestion by echoing it back as `selected`.
const toSelected = (s: AddressSuggestion): string =>
  `${s.street_line} ${s.secondary} (${s.entries}) ${s.city} ${s.state} ${s.zipcode}`.replace(/\s+/g, " ").trim();

const describe = (s: AddressSuggestion): string => {
  const secondary = s.secondary ? ` ${s.secondary}` : "";
  const more = s.entries > 1 ? ` (${s.entries} more entries)` : "";
  return `${s.street_line}${secondary}${more} ${s.city}, ${s.state} ${s.zipcode}`;
};

export const StreetAutocompleteField = ({ label, registration, value, error, onSelect }: Props) => {
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState("");

  const debounced = useDebounce(value ?? "", 250);
  const { data: suggestions = [] } = useAddressSuggestions(debounced, selected, focused);

  const handlePick = (s: AddressSuggestion) => {
    // Multi-unit building → drill into its secondary units instead of selecting.
    if (s.entries > 1) {
      setSelected(toSelected(s));
      return;
    }
    onSelect({
      street_1: s.street_line,
      street_2: s.secondary,
      city: s.city,
      state: s.state,
      zip: s.zipcode,
    });
    setSelected("");
    setFocused(false);
  };

  const open = focused && suggestions.length > 0;

  return (
    <div className="relative">
      <label htmlFor={registration.name} className="mb-1.5 block text-sm text-text-muted">
        {label}
      </label>
      <input
        id={registration.name}
        autoComplete="off"
        {...registration}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          registration.onBlur(e);
          // Delay so an onMouseDown pick still registers.
          setTimeout(() => setFocused(false), 120);
        }}
        className={cn(
          "h-12 w-full rounded-lg border bg-white px-4 text-sm text-text-primary outline-none transition-colors",
          "focus:border-[#e05c4b] focus:ring-1 focus:ring-[#e05c4b]",
          error ? "border-[#e05c4b]" : "border-border-input",
        )}
      />
      {error && <p className="mt-1 text-xs text-[#e05c4b]">{error}</p>}

      {open && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border-default bg-white py-1 shadow-lg">
          {suggestions.map((s, i) => (
            <li key={`${s.street_line}-${s.zipcode}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handlePick(s);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-bg-input"
              >
                {describe(s)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
