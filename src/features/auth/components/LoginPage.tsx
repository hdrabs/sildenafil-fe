"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LoginPhoneStep } from "./LoginPhoneStep";
import { LoginEmailStep } from "./LoginEmailStep";
import { LoginPasswordStep } from "./LoginPasswordStep";
import { OtpModal } from "./OtpModal";
import { useLoginUser } from "../hooks/useLoginUser";
import { authService } from "@/api/services/authService";
import { APIError } from "@/api/baseAPI";
import { useSetUser } from "@/store";
import { ROUTES } from "@/constants/routes";

type Step = "phone" | "email" | "password";

interface LoginHints {
  email: string;
  phone: string | null;
}

export const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setUser = useSetUser();
  const prefillEmail = searchParams.get("email") ?? undefined;

  const [step, setStep] = useState<Step>("email");
  const [identifier, setIdentifier] = useState<string>(prefillEmail ?? "");
  const [hints, setHints] = useState<LoginHints | null>(null);

  // OTP modal state — tracks which method (phone raw value or email) triggered it
  const [otpIdentifier, setOtpIdentifier] = useState<string | null>(null); // phone or email
  const [otpPhone, setOtpPhone] = useState<string | null>(null);           // phone only (for modal display)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const { login, isPending: isPasswordPending, loginError } = useLoginUser();

  const handleEmailNext = async (email: string) => {
    setIdentifier(email);
    // Fetch hints silently — don't block or show error
    try {
      const h = await authService.getLoginHints(email);
      setHints(h);
    } catch {
      setHints({ email, phone: null });
    }
    setStep("password");
  };

  // The `_maskedPhone` arg is just for display — we pass the email to the
  // backend so it can find the user's actual registered phone number.
  const handleSendPhoneOtp = async (_maskedPhone: string) => {
    try { await authService.sendPhoneOtp(identifier); } catch { /* silent */ }
    setOtpPhone(hints?.phone ?? null); // masked display string
    setOtpIdentifier(identifier);      // email for OTP verification
  };

  const handleSendEmailOtp = async (email: string) => {
    try { await authService.sendEmailOtp(email); } catch { /* silent */ }
    setOtpPhone(null);
    setOtpIdentifier(email);
  };

  const handleOtpSubmit = async (code: string) => {
    if (!otpIdentifier) return;
    setIsVerifyingOtp(true);
    try {
      const { token } = await authService.verifyPhoneOtp(otpIdentifier, code);
      setUser({ id: 0, email: "", firstName: "", lastName: "", token, jti: "" });
      const me = await authService.me();
      setUser({ id: me.id, email: me.email, firstName: me.first_name, lastName: me.last_name, token, jti: me.jti });
      const redirectTo = searchParams.get("redirectTo");
      router.replace(redirectTo ?? ROUTES.DASHBOARD);
    } catch (err) {
      toast.error((err as APIError)?.message ?? "Invalid code. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <>
      {step === "phone" && (
        <LoginPhoneStep
          onNext={(phone) => {
            setIdentifier(phone);
            setOtpPhone(phone);
            setOtpIdentifier(phone);
          }}
          onSwitchToEmail={() => setStep("email")}
        />
      )}

      {step === "email" && (
        <LoginEmailStep
          defaultEmail={prefillEmail}
          onNext={handleEmailNext}
          onSwitchToPhone={() => setStep("phone")}
        />
      )}

      {step === "password" && (
        <LoginPasswordStep
          email={identifier}
          hints={hints}
          isPending={isPasswordPending}
          apiError={loginError}
          onSubmit={(password) => login({ identifier, password })}
          onSendPhoneOtp={handleSendPhoneOtp}
          onSendEmailOtp={handleSendEmailOtp}
        />
      )}

      {/* OTP modal — used for both phone and email OTP */}
      {otpIdentifier && (
        <OtpModal
          phone={otpPhone ?? identifier}
          isPending={isVerifyingOtp}
          onSubmit={handleOtpSubmit}
          onClose={() => { setOtpIdentifier(null); setOtpPhone(null); }}
          onSwitchToEmail={() => {
            setOtpIdentifier(null);
            setOtpPhone(null);
            setStep("email");
          }}
        />
      )}
    </>
  );
};
