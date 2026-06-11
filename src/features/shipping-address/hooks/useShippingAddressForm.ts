import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shippingAddressSchema,
  ShippingAddressFormValues,
} from "@/features/shipping-address/schemas/shippingAddressSchema";
import {
  useAddShippingAddress,
  useUpdateShippingAddress,
} from "@/api/hooks/useShippingAddressQueries";
import { ShippingAddress } from "@/types/shippingAddress";

interface UseShippingAddressFormOptions {
  editing?: ShippingAddress | null;
  userPhone?: string;
  onSuccess: () => void;
}

export const useShippingAddressForm = ({
  editing,
  userPhone = "",
  onSuccess,
}: UseShippingAddressFormOptions) => {
  const add    = useAddShippingAddress();
  const update = useUpdateShippingAddress();

  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: editing
      ? {
          first_name: editing.first_name,
          last_name:  editing.last_name,
          street_1:   editing.street_1,
          street_2:   editing.street_2 ?? "",
          city:       editing.city,
          state:      editing.state,
          zip:        editing.zip,
          phone:      editing.phone,
        }
      : {
          first_name: "",
          last_name:  "",
          street_1:   "",
          street_2:   "",
          city:       "",
          state:      "",
          zip:        "",
          phone:      userPhone,
        },
  });

  // defaultValues are frozen at mount time; sync userPhone once it loads
  useEffect(() => {
    if (!editing && userPhone) {
      form.setValue("phone", userPhone, { shouldValidate: false });
    }
  }, [userPhone, editing, form]);

  const submit = form.handleSubmit(async (values) => {
    const payload = { shipping_address: values };
    if (editing) {
      await update.mutateAsync({ id: editing.id, payload });
    } else {
      await add.mutateAsync(payload);
    }
    onSuccess();
  });

  return {
    form,
    submit,
    isLoading: add.isPending || update.isPending,
    error: add.error ?? update.error,
  };
};
