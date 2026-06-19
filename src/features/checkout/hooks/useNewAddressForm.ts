import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingCheckoutSchema,
  ShippingCheckoutFormValues,
} from "@/features/checkout/schemas/shippingCheckoutSchema";
import { useValidateAddress } from "@/api/hooks/useAddressQueries";
import {
  useCreateShippingAddressV2,
  useUpdateShippingAddressV2,
} from "@/api/hooks/useShippingAddressQueries";
import {
  ShippingAddress,
  AddressFields,
  AddressValidationResult,
} from "@/types/shippingAddress";
import { UserMeResponse } from "@/types/user";

interface Options {
  me?: UserMeResponse | null;
  editing?: ShippingAddress | null;
  onSaved: (address: ShippingAddress) => void;
}

const toFields = (values: ShippingCheckoutFormValues): AddressFields => ({
  street_1: values.street_1,
  street_2: values.street_2,
  city: values.city,
  // Normalize to the canonical 2-letter code regardless of how it was typed.
  state: values.state.trim().toUpperCase(),
  zip: values.zip,
});

/**
 * Drives the checkout address form: runs Smarty validation on submit. A clean
 * ("ok") result persists immediately; any other result is exposed as
 * `validation` so the caller can render the matching correction drawer, whose
 * "accept" actions then persist with the appropriate `verified` flag.
 */
export const useNewAddressForm = ({ me, editing, onSaved }: Options) => {
  const validate = useValidateAddress();
  const create = useCreateShippingAddressV2();
  const update = useUpdateShippingAddressV2();
  const [validation, setValidation] = useState<AddressValidationResult | null>(null);

  const form = useForm<ShippingCheckoutFormValues>({
    resolver: zodResolver(shippingCheckoutSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          street_1: editing.street_1,
          street_2: editing.street_2 ?? "",
          city: editing.city,
          state: editing.state,
          zip: editing.zip,
        }
      : { street_1: "", street_2: "", city: "", state: "", zip: "" },
  });

  const persist = async (fields: AddressFields, verified: boolean) => {
    const payload = {
      shipping_address: {
        first_name: me?.first_name ?? "",
        last_name: me?.last_name ?? "",
        phone: me?.mobile_phone ?? me?.home_phone ?? "",
        street_1: fields.street_1,
        street_2: fields.street_2 || undefined,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        verified,
      },
    };

    const saved = editing
      ? await update.mutateAsync({ id: editing.id, payload })
      : await create.mutateAsync(payload);

    setValidation(null);
    onSaved(saved);
  };

  const submit = form.handleSubmit(async (values) => {
    setValidation(null);
    const result = await validate.mutateAsync(toFields(values));

    if (result.status === "ok") {
      await persist(toFields(values), true);
      return;
    }
    setValidation(result);
  });

  return {
    form,
    submit,
    validation,
    enteredAddress: toFields(form.getValues()),
    // Keep the user's address as-is (they confirmed it / are using it anyway).
    acceptEntered: () => persist(toFields(form.getValues()), false),
    // Use Smarty's corrected address.
    acceptSuggested: () =>
      validation?.suggested_address && persist(validation.suggested_address, true),
    dismissValidation: () => setValidation(null),
    isSubmitting: validate.isPending || create.isPending || update.isPending,
    error: (validate.error ?? create.error ?? update.error) as Error | null,
  };
};
