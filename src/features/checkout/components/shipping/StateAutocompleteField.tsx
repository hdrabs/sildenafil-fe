"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { US_STATES } from "@/constants/usStates";

interface Props {
  label: string;
  /** Current form value — the 2-letter state code. */
  value: string;
  error?: string;
  /** Pushes the selected code (or raw text, so the schema can flag it) to the form. */
  onChange: (value: string) => void;
  onBlur: () => void;
}

const matchExact = (text: string) => {
  const q = text.trim().toLowerCase();
  return US_STATES.find((s) => s.code.toLowerCase() === q || s.name.toLowerCase() === q);
};

/**
 * State typeahead (ports the legacy StateInput): a dropdown of state names,
 * filterable by name or code; selecting stores the canonical 2-letter code.
 */
export const StateAutocompleteField = ({ label, value, error, onChange, onBlur }: Props) => {
  const [focused, setFocused] = useState(false);
  // null = not actively typing → display the stored value (the 2-letter code, like
  // the legacy field). A string = the user's in-progress input. Deriving the display
  // this way keeps it synced when `value` is set externally (e.g. the street
  // autocomplete) without an effect.
  const [typed, setTyped] = useState<string | null>(null);

  const display = typed ?? value;

  const matches = useMemo(() => {
    const q = (typed ?? "").trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [typed]);

  const handleType = (text: string) => {
    setTyped(text);
    const exact = matchExact(text);
    onChange(exact ? exact.code : text.trim());
  };

  const pick = (s: { name: string; code: string }) => {
    setTyped(null);
    onChange(s.code);
    setFocused(false);
  };

  const open = focused && matches.length > 0;

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm text-text-muted">{label}</label>
      <input
        autoComplete="off"
        value={display}
        onChange={(e) => handleType(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          onBlur();
          setTyped(null);
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
          {matches.map((s) => (
            <li key={s.code}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-bg-input"
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
