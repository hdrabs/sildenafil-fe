"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { US_STATES } from "@/constants/usStates";

interface Props {
  label: string;
  /** Current form value — the 2-letter state code. */
  value: string;
  error?: string;
  /** Pushes the selected code (or raw ≤2-char text, so the schema can flag it) to the form. */
  onChange: (value: string) => void;
  onBlur: () => void;
}

const matchExact = (text: string) => {
  const q = text.trim().toLowerCase();
  return US_STATES.find((s) => s.code.toLowerCase() === q || s.name.toLowerCase() === q);
};

/**
 * State typeahead (ports the legacy StateInput): the input is capped at 2 chars
 * and force-uppercased like a state code, and it stays synced to the external
 * `value` so the street autocomplete's auto-fill always shows through (mirrors
 * the legacy field syncing to `smartyState`). The dropdown filters by name or
 * code; selecting stores the canonical 2-letter code.
 */
export const StateAutocompleteField = ({ label, value, error, onChange, onBlur }: Props) => {
  const [focused, setFocused] = useState(false);
  // Mirror the external value into the input, re-syncing (during render, the
  // React-recommended way to derive from a changing prop) whenever the value is
  // set elsewhere — e.g. the street autocomplete auto-fill — so the field never
  // gets stuck showing stale in-progress text.
  const [text, setText] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [text]);

  const handleType = (raw: string) => {
    // Hard 2-char cap + uppercase, exactly like the legacy field: a state is a
    // 2-letter code, so a 3rd character is rejected outright.
    if (raw.length > 2) return;
    const next = raw.toUpperCase();
    setText(next);
    const exact = matchExact(next);
    onChange(exact ? exact.code : next);
  };

  const pick = (s: { name: string; code: string }) => {
    setText(s.code);
    onChange(s.code);
    setFocused(false);
  };

  const open = focused && matches.length > 0;

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm text-text-muted">{label}</label>
      <input
        autoComplete="off"
        value={text}
        maxLength={2}
        onChange={(e) => handleType(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          onBlur();
          // Delay so an onMouseDown pick still registers.
          setTimeout(() => setFocused(false), 120);
        }}
        className={cn(
          "h-12 w-full rounded-lg border-[1.5px] bg-white px-4 text-sm uppercase text-text-primary outline-none transition-colors",
          "focus:border-[#e05c4b] focus:ring-1 focus:ring-[#e05c4b]",
          error ? "border-[#e05c4b]" : "border-[#c5d4dc]",
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
