"use client";

import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { RiMapPinLine, RiMapPin2Line, RiBuildingLine, RiHomeLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useAddressSuggestions } from "@/api/hooks/useAddressQueries";
import { useNewAddressForm } from "@/features/checkout/hooks/useNewAddressForm";
import { AddressCorrectionDrawer } from "@/features/checkout/components/drawers/AddressCorrectionDrawer";
import { AddressSuggestion, ShippingAddress } from "@/types/shippingAddress";
import { UserMeResponse } from "@/types/user";

const describe = (s: AddressSuggestion): string => {
  const secondary = s.secondary ? ` ${s.secondary}` : "";
  const more = s.entries > 1 ? ` (${s.entries} more entries)` : "";
  return `${s.street_line}${secondary}${more} ${s.city}, ${s.state} ${s.zipcode}`;
};
const toSelected = (s: AddressSuggestion): string =>
  `${s.street_line} ${s.secondary} (${s.entries}) ${s.city} ${s.state} ${s.zipcode}`.replace(/\s+/g, " ").trim();

const fieldBox = (hasError: boolean) =>
  cn(
    "flex h-12 w-full items-center gap-2.5 rounded-lg border bg-white px-3.5 text-sm text-text-primary transition-colors focus-within:border-primary-blue focus-within:ring-1 focus-within:ring-primary-blue",
    hasError ? "border-[#e05c4b]" : "border-border-input",
  );

const IconField = ({
  label,
  icon: Icon,
  reg,
  error,
}: {
  label: string;
  icon: React.ElementType;
  reg: UseFormRegisterReturn;
  error?: string;
}) => (
  <div>
    <label className="mb-1.5 block text-sm text-text-muted">{label}</label>
    <div className={fieldBox(!!error)}>
      <Icon className="h-5 w-5 shrink-0 text-text-muted" />
      <input {...reg} className="h-full w-full bg-transparent outline-none" />
    </div>
    {error && <p className="mt-1 text-xs text-[#e05c4b]">{error}</p>}
  </div>
);

interface Props {
  me?: UserMeResponse | null;
  editing?: ShippingAddress | null;
  onClose: () => void;
}

export const AccountAddressForm = ({ me, editing, onClose }: Props) => {
  const {
    form,
    submit,
    validation,
    enteredAddress,
    acceptEntered,
    acceptSuggested,
    dismissValidation,
    isSubmitting,
    error,
  } = useNewAddressForm({ me, editing, onSaved: onClose });
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Smarty street autocomplete (icon-prefixed, matching the account design).
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState("");
  const street1 = watch("street_1") ?? "";
  const debounced = useDebounce(street1, 250);
  const { data: suggestions = [] } = useAddressSuggestions(debounced, selected, focused);
  const streetReg = register("street_1");

  const pick = (s: AddressSuggestion) => {
    if (s.entries > 1) {
      setSelected(toSelected(s));
      return;
    }
    setValue("street_1", s.street_line, { shouldValidate: true });
    setValue("street_2", s.secondary);
    setValue("city", s.city, { shouldValidate: true });
    setValue("state", s.state, { shouldValidate: true });
    setValue("zip", s.zipcode, { shouldValidate: true });
    setSelected("");
    setFocused(false);
  };
  const open = focused && suggestions.length > 0;

  return (
    <>
      <form onSubmit={submit} noValidate className="flex flex-col">
        <h2 className="mb-6 text-[28px] font-bold leading-tight text-text-primary">
          Enter a new Shipping Address
        </h2>

        <div className="flex flex-col gap-4">
          {/* Street (with autocomplete) */}
          <div className="relative">
            <label className="mb-1.5 block text-sm text-text-muted">Street</label>
            <div className={fieldBox(!!errors.street_1)}>
              <RiMapPinLine className="h-5 w-5 shrink-0 text-text-muted" />
              <input
                {...streetReg}
                autoComplete="off"
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  streetReg.onBlur(e);
                  setTimeout(() => setFocused(false), 120);
                }}
                className="h-full w-full bg-transparent outline-none"
              />
            </div>
            {errors.street_1 && <p className="mt-1 text-xs text-[#e05c4b]">{errors.street_1.message}</p>}
            {open && (
              <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border-default bg-white py-1 shadow-lg">
                {suggestions.map((s, i) => (
                  <li key={`${s.street_line}-${s.zipcode}-${i}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pick(s);
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

          <IconField label="Apt/Unit/Suite" icon={RiMapPinLine} reg={register("street_2")} />
          <IconField label="City" icon={RiBuildingLine} reg={register("city")} error={errors.city?.message} />
          <IconField label="State" icon={RiMapPin2Line} reg={register("state")} error={errors.state?.message} />
          <IconField label="ZIP" icon={RiHomeLine} reg={register("zip")} error={errors.zip?.message} />
        </div>

        {error && <p className="mt-4 text-sm text-[#e05c4b]">{error.message}</p>}

        <div className="mt-7 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-[#e05c4b] py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </form>

      <AddressCorrectionDrawer
        show={validation !== null && validation.status !== "ok"}
        status={validation?.status ?? "ok"}
        entered={enteredAddress}
        suggested={validation?.suggested_address ?? null}
        onAcceptEntered={acceptEntered}
        onAcceptSuggested={acceptSuggested}
        onReEnter={dismissValidation}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
