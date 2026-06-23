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

// AUM convention: the phone number ALWAYS lives in mobile_phone. "Mobile"/"Home"
// is a UI-only toggle persisted per-user in localStorage that only controls OTP —
// it is never derived from the DB and never clears a field (clearing mobile_phone
// tripped its uniqueness validation -> "already taken").
const phoneTypeKey = (userId: number) => `phone_type_${userId}`;

export const usePatientInfo = ({ returnTo }: { returnTo?: string } = {}) => {
  const router = useRouter();
  const activeCart = useActiveCart();

  const cartId = activeCart?.cart.id ?? 0;
  const cartToken = activeCart?.cart.token;

  const { data: me, isLoading: isLoadingMe } = useGetMe(cartId > 0);
  const { mutateAsync: updateMe, isPending: isUpdating, error: updateError, reset: resetUpdate } = useUpdateMe();
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
      gender: "male", // Sildenafil is a male ED product — default the selection.
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
    const savedPhoneType =
      typeof window !== "undefined"
        ? (localStorage.getItem(phoneTypeKey(me.id)) as "mobile" | "home" | null)
        : null;
    form.reset({
      first_name: me.first_name ?? "",
      last_name: me.last_name ?? "",
      gender: (me.gender as "male" | "female") || "male",
      dob_month: month,
      dob_day: day,
      dob_year: year,
      // Mobile/Home comes from localStorage (not the DB), matching AUM.
      phone_type: savedPhoneType ?? "mobile",
      // The number always lives in mobile_phone.
      phone: me.mobile_phone || me.home_phone || "",
      sms_agreement: me.phone_contact_allowed ?? true,
      partner_agreement: me.drugs_names_included ?? true,
    });
  }, [me, form]);

  const [
    watchedGender,
    watchedFirst,
    watchedLast,
    watchedMonth,
    watchedDay,
    watchedYear,
    watchedPhone,
    watchedPhoneType,
  ] = form.watch([
    "gender",
    "first_name",
    "last_name",
    "dob_month",
    "dob_day",
    "dob_year",
    "phone",
    "phone_type",
  ]);

  // Persist the Mobile/Home choice per-user (AUM keeps this in localStorage).
  useEffect(() => {
    if (me?.id != null && typeof window !== "undefined") {
      localStorage.setItem(phoneTypeKey(me.id), watchedPhoneType);
    }
  }, [watchedPhoneType, me?.id]);

  // Clear a stale server error once the user edits the phone, so the banner
  // doesn't persist while they correct it. (Depend only on the phone value —
  // depending on updateError would wipe the error the instant it appears.)
  useEffect(() => {
    if (updateError) resetUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPhone]);

  const canSubmit =
    !!watchedGender &&
    !!watchedFirst?.trim() &&
    !!watchedLast?.trim() &&
    !!watchedMonth &&
    !!watchedDay &&
    !!watchedYear &&
    /^\(\d{3}\) \d{3}-\d{4}$/.test(watchedPhone ?? "");

  const advanceCheckout = async () => {
    // Edit-from-confirmation: the change is already persisted (updateMe); skip the
    // step advance and return straight to the confirmation page.
    if (returnTo) {
      router.push(returnTo);
      return;
    }
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
          // The number always saves to mobile_phone; "Home" only means skip OTP
          // (so we unverify it). We never split it into home_phone or clear it.
          mobile_phone: values.phone,
          ...(isHome && { otp_verified: false }),
          phone_contact_allowed: values.sms_agreement,
          drugs_names_included: values.partner_agreement,
        },
      });

      // Home phone — no OTP needed, advance directly.
      if (isHome) {
        await advanceCheckout();
        return;
      }

      // Mobile phone — skip OTP if already verified with this number.
      if (me?.otp_verified) {
        await advanceCheckout();
        return;
      }

      // Open the modal immediately and send the code in the background.
      setOtpLimitExceeded(false);
      setShowOtpModal(true);
      void generateOtp().catch((e) => {
        if (e instanceof APIError && e.status === 429) {
          setOtpLimitExceeded(true);
        }
      });
    } catch {
      // Surfaced via submitError below.
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
