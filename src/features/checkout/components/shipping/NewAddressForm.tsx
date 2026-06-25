"use client";

import { cn } from "@/lib/utils";
import { useNewAddressForm } from "@/features/checkout/hooks/useNewAddressForm";
import { AddressCorrectionDrawer } from "@/features/checkout/components/drawers/AddressCorrectionDrawer";
import { StreetAutocompleteField } from "@/features/checkout/components/shipping/StreetAutocompleteField";
import { StateAutocompleteField } from "@/features/checkout/components/shipping/StateAutocompleteField";
import { ShippingAddress } from "@/types/shippingAddress";
import { UserMeResponse } from "@/types/user";

interface Props {
  me?: UserMeResponse | null;
  editing?: ShippingAddress | null;
  /** Bordered sub-card with a Cancel link + outlined button (adding to an existing list). */
  boxed: boolean;
  /** Rendered inside an address card's edit accordion: no border, no header, outlined button. */
  embedded?: boolean;
  submitLabel: string;
  onCancel?: () => void;
  onSaved: (address: ShippingAddress) => void;
}

// street_1 (Smarty autocomplete) and state (typeahead) are rendered separately;
// the rest are plain inputs.
const REST_FIELDS = [
  { name: "street_2", label: "Apt/Suite Number" },
  { name: "city", label: "City" },
  { name: "state", label: "State / Province / Region" },
  { name: "zip", label: "Zip" },
] as const;

export const NewAddressForm = ({
  me,
  editing,
  boxed,
  embedded = false,
  submitLabel,
  onCancel,
  onSaved,
}: Props) => {
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
  } = useNewAddressForm({ me, editing, onSaved });
  const {
    register,
    formState: { errors },
  } = form;
  const street1 = form.watch("street_1") ?? "";

  return (
    <>
      <form
        onSubmit={submit}
        noValidate
        className={cn(boxed && !embedded && "rounded-xl border border-border-default p-5")}
      >
        {!embedded && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Enter Shipping Address</h2>
            {boxed && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <StreetAutocompleteField
            label="Street address"
            registration={register("street_1")}
            value={street1}
            error={errors.street_1?.message}
            onSelect={(a) => {
              form.setValue("street_1", a.street_1, { shouldValidate: true });
              form.setValue("street_2", a.street_2);
              form.setValue("city", a.city, { shouldValidate: true });
              form.setValue("state", a.state, { shouldValidate: true });
              form.setValue("zip", a.zip, { shouldValidate: true });
            }}
          />
          {REST_FIELDS.map(({ name, label }) =>
            name === "state" ? (
              <StateAutocompleteField
                key={name}
                label={label}
                value={form.watch("state") ?? ""}
                error={errors.state?.message}
                onChange={(v) => form.setValue("state", v)}
                onBlur={() => form.trigger("state")}
              />
            ) : (
              <div key={name}>
                <label htmlFor={name} className="mb-1.5 block text-sm text-text-muted">
                  {label}
                </label>
                <input
                  id={name}
                  {...register(name)}
                  className={cn(
                    "h-12 w-full rounded-lg border-[1.5px] bg-white px-4 text-sm text-text-primary outline-none transition-colors",
                    "focus:border-[#e05c4b] focus:ring-1 focus:ring-[#e05c4b]",
                    errors[name] ? "border-[#e05c4b]" : "border-[#c5d4dc]",
                  )}
                />
                {errors[name] && (
                  <p className="mt-1 text-xs text-[#e05c4b]">{errors[name]?.message}</p>
                )}
              </div>
            ),
          )}
        </div>

        {error && <p className="mt-4 text-sm text-[#e05c4b]">{error.message}</p>}

        <div
          className={cn(
            "mt-6",
            embedded
              ? "flex items-center justify-between md:justify-end"
              : boxed && "flex justify-end",
          )}
        >
          {/* Inline Cancel only on mobile (desktop cancels from the card header). */}
          {embedded && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer text-[13px] text-[#0e2836] md:hidden"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "cursor-pointer transition-colors disabled:opacity-60",
              boxed || embedded
                ? "rounded-full border border-[#d65a4a] px-6 py-2.5 text-xs font-semibold text-[#d65a4a] hover:bg-[#d65a4a] hover:text-white"
                : "w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white hover:bg-coral-hover",
            )}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing
              </span>
            ) : (
              submitLabel
            )}
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
