"use client";

import { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CreditCardFormValues } from "@/features/payments/schemas/creditCardSchema";

const ACCEPT_JS_URL =
  process.env.NEXT_PUBLIC_ANET_ENV === "production"
    ? "https://js.authorize.net/v1/Accept.js"
    : "https://jstest.authorize.net/v1/Accept.js";

// Matches the shipping-address form inputs for a consistent checkout look.
const labelClass = "mb-1.5 block text-sm text-text-muted";
const inputClass =
  "h-12 w-full rounded-lg border border-border-input bg-white px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary-blue";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-text-error">{error}</p>}
  </div>
);

interface Props {
  formId: string;
  form: UseFormReturn<CreditCardFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

// Inline card fields (Authorize.net Accept.js). There is no submit button — the
// page's "Complete My Order" submits this form (via the `formId`), adds the card,
// then completes the order. Fields are styled to the checkout design (grey labels,
// white inputs) rather than the shared account Input.
export const AddCardForm = ({ formId, form, onSubmit, error }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (document.querySelector(`script[src="${ACCEPT_JS_URL}"]`)) return;
    const script = document.createElement("script");
    script.src = ACCEPT_JS_URL;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const fieldClass = (hasErr: boolean) => cn(inputClass, hasErr && "border-error");

  return (
    <form id={formId} onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" error={errors.first_name?.message}>
          <input
            className={fieldClass(!!errors.first_name)}
            autoComplete="cc-given-name"
            {...register("first_name")}
          />
        </Field>
        <Field label="Last name" error={errors.last_name?.message}>
          <input
            className={fieldClass(!!errors.last_name)}
            autoComplete="cc-family-name"
            {...register("last_name")}
          />
        </Field>
      </div>

      <Field label="Card Info" error={errors.card_number?.message}>
        <Controller
          name="card_number"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className={fieldClass(!!errors.card_number)}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                field.onChange(digits.replace(/(.{4})/g, "$1 ").trim());
              }}
            />
          )}
        />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Expiration" error={errors.expiration_date?.message}>
          <Controller
            name="expiration_date"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={fieldClass(!!errors.expiration_date)}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  field.onChange(
                    digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
                  );
                }}
              />
            )}
          />
        </Field>
        <Field label="CVV" error={errors.card_code?.message}>
          <input
            className={fieldClass(!!errors.card_code)}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
            {...register("card_code")}
          />
        </Field>
        <Field label="Zip Code" error={errors.zip?.message}>
          <input
            className={fieldClass(!!errors.zip)}
            placeholder="90210"
            inputMode="numeric"
            maxLength={5}
            autoComplete="postal-code"
            {...register("zip")}
          />
        </Field>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-text-error">{error}</p>}
    </form>
  );
};
