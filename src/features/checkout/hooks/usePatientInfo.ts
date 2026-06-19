"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetMe, useUpdateMe, useGenerateOtp } from "@/api/hooks/useAuthQueries";
import { useAdvancePatientInfo } from "@/api/hooks/useQuestionnaireQueries";
import { useActiveCart } from "@/store";
import { patientInfoSchema, PatientInfoFormValues } from "../schemas/patientInfoSchema";
import { APIError } from "@/api/baseAPI";

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
  const { mutateAsync: generateOtp } = useGenerateOtp();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLimitExceeded, setOtpLimitExceeded] = useState(false);

  const form = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoSchema),
    mode: "onTouched",
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      dob_month: "",
      dob_day: "",
      dob_year: "",
      phone_type: "mobile",
      phone: "",
      sms_agreement: true,
      partner_agreement: true,
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
      sms_agreement: me.phone_contact_allowed ?? true,
      partner_agreement: me.drugs_names_included ?? true,
    });
  }, [me, form]);

  const [watchedGender, watchedFirst, watchedLast, watchedMonth, watchedDay, watchedYear, watchedPhone] =
    form.watch(["gender", "first_name", "last_name", "dob_month", "dob_day", "dob_year", "phone"]);
  const canSubmit =
    !!watchedGender &&
    !!watchedFirst?.trim() &&
    !!watchedLast?.trim() &&
    !!watchedMonth &&
    !!watchedDay &&
    !!watchedYear &&
    /^\(\d{3}\) \d{3}-\d{4}$/.test(watchedPhone ?? "");

  const advanceCheckout = async () => {
    const { redirect_path } = await advancePatientInfo({
      cart_id: cartId,
      cart_token: cartToken,
    });
    router.push(redirect_path);
  };

  const submit = form.handleSubmit(async (values) => {
    try {
      const dateOfBirth = `${values.dob_year}-${values.dob_month}-${values.dob_day}`;
      const isHome = values.phone_type === "home";

      await updateMe({
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
          date_of_birth: dateOfBirth,
          mobile_phone: values.phone,
          ...(isHome && { home_phone: values.phone, otp_verified: false }),
          phone_contact_allowed: values.sms_agreement,
          drugs_names_included: values.partner_agreement,
        },
      });

      if (isHome) {
        // Home phone — no OTP needed, advance directly
        await advanceCheckout();
        return;
      }

      // Mobile phone — skip OTP if already verified with this number
      if (me?.otp_verified) {
        await advanceCheckout();
        return;
      }

      // Open the modal immediately and send the code in the background — the
      // modal shouldn't be gated on the (slow) SMS request.
      setOtpLimitExceeded(false);
      setShowOtpModal(true);
      void generateOtp().catch((e) => {
        if (e instanceof APIError && e.status === 429) {
          setOtpLimitExceeded(true);
        }
      });
    } catch {
      // updateMe error surfaced via mutation error state
    }
  });

  const onOtpVerified = async () => {
    setShowOtpModal(false);
    await advanceCheckout();
  };

  const onOtpSkip = async () => {
    setShowOtpModal(false);
    await advanceCheckout();
  };

  const onOtpClose = () => {
    setShowOtpModal(false);
    setOtpLimitExceeded(false);
  };

  const submitError = (updateError as { message?: string } | null)?.message ?? null;

  return {
    form,
    submit,
    isLoadingMe,
    isPending: isUpdating || isAdvancing,
    submitError,
    canSubmit,
    showOtpModal,
    otpLimitExceeded,
    otpPhone: watchedPhone ?? "",
    onOtpVerified,
    onOtpSkip,
    onOtpClose,
  };
};
