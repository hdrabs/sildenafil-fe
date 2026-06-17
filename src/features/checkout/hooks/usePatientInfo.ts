"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetMe, useUpdateMe } from "@/api/hooks/useAuthQueries";
import { useAdvancePatientInfo } from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart } from "@/store";
import { patientInfoSchema, PatientInfoFormValues } from "../schemas/patientInfoSchema";

const parseDob = (dob: string | undefined) => {
  if (!dob) return { month: "", day: "", year: "" };
  const d = new Date(dob);
  if (isNaN(d.getTime())) return { month: "", day: "", year: "" };
  return {
    month: String(d.getUTCMonth() + 1).padStart(2, "0"),
    day: String(d.getUTCDate()).padStart(2, "0"),
    year: String(d.getUTCFullYear()),
  };
};

export const usePatientInfo = () => {
  const router = useRouter();
  const activeCart = useActiveCart();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { data: me, isLoading: isLoadingMe } = useGetMe(cartId > 0);
  const { mutateAsync: updateMe, isPending: isUpdating, error: updateError } = useUpdateMe();
  const { mutateAsync: advancePatientInfo, isPending: isAdvancing } = useAdvancePatientInfo();

  const form = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      dob_month: "",
      dob_day: "",
      dob_year: "",
      phone_type: "mobile",
      phone: "",
      sms_agreement: false,
      partner_agreement: false,
    },
  });

  useEffect(() => {
    if (!me) return;
    const { month, day, year } = parseDob(me.date_of_birth);
    form.reset({
      first_name: me.first_name ?? "",
      last_name: me.last_name ?? "",
      gender: (me.gender as "male" | "female") ?? undefined,
      dob_month: month,
      dob_day: day,
      dob_year: year,
      phone_type: me.mobile_phone ? "mobile" : "home",
      phone: me.mobile_phone ?? me.home_phone ?? "",
      sms_agreement: me.phone_contact_allowed ?? false,
      partner_agreement: me.drugs_names_included ?? false,
    });
  }, [me, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      const dateOfBirth = `${values.dob_year}-${values.dob_month}-${values.dob_day}`;

      await updateMe({
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          date_of_birth: dateOfBirth,
          // mobile_phone is always required by the backend User model.
          // When the user picks "home", persist the number in both fields.
          mobile_phone: values.phone,
          ...(values.phone_type === "home" && { home_phone: values.phone }),
          phone_contact_allowed: values.sms_agreement,
          drugs_names_included: values.partner_agreement,
        },
      });

      const { redirect_path } = await advancePatientInfo({
        cart_id: cartId,
        cart_token: cartToken,
      });

      router.push(redirect_path);
    } catch {
      // errors surfaced via hook error state
    }
  });

  const submitError = (updateError as { message?: string } | null)?.message ?? null;

  return {
    form,
    submit,
    isLoadingMe,
    isPending: isUpdating || isAdvancing,
    submitError,
  };
};
