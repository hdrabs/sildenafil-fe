"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginPhoneStep } from "./LoginPhoneStep";
import { LoginEmailStep } from "./LoginEmailStep";
import { LoginPasswordStep } from "./LoginPasswordStep";
import { OtpModal } from "@/components/modals/OtpModal";
import { useLoginUser } from "../hooks/useLoginUser";
import { authService } from "@/api/services/authService";
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
  const [otpChannel, setOtpChannel] = useState<"phone" | "email">("phone");

  const { login, isPending: isPasswordPending, loginError } = useLoginUser();

  // Each step change pushes a same-URL history entry carrying a marker (the
  // legacy app does the same via react-router `navigate(path, { state })`).
  // The URL stays /login; only browser history grows, so the navbar back
  // button walks back through the steps and finally exits the page.
  const pushStep = (next: Step) => {
    window.history.pushState({ ...window.history.state, loginStep: next }, "");
    setStep(next);
  };

  // Sync the visible step with browser back/forward navigation.
  useEffect(() => {
    const onPopState = () => {
      const marker = (window.history.state as { loginStep?: Step } | null)?.loginStep;
      setStep(marker === "phone" || marker === "password" ? marker : "email");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleEmailNext = async (email: string) => {
    setIdentifier(email);
    // Fetch hints silently — don't block or show error
    try {
      const h = await authService.getLoginHints(email);
      setHints(h);
    } catch {
      setHints({ email, phone: null });
    }
    pushStep("password");
  };

  // The `_maskedPhone` arg is just for display — we pass the email to the
  // backend so it can find the user's actual registered phone number.
  const handleSendPhoneOtp = async (_maskedPhone: string) => {
    try { await authService.sendPhoneOtp(identifier); } catch { /* silent */ }
    setOtpChannel("phone");
    setOtpPhone(hints?.phone ?? null); // masked display string
    setOtpIdentifier(identifier);      // email for OTP verification
  };

  const handleSendEmailOtp = async (email: string) => {
    try { await authService.sendEmailOtp(email); } catch { /* silent */ }
    setOtpChannel("email");
    setOtpPhone(null);
    setOtpIdentifier(email);
  };

  const handleOtpSubmit = async (code: string) => {
    if (!otpIdentifier) return;
    // Let errors propagate so the modal surfaces them inline.
    const { token } = await authService.verifyPhoneOtp(otpIdentifier, code);
    setUser({ id: 0, email: "", firstName: "", lastName: "", token, jti: "" });
    const me = await authService.me();
    setUser({ id: me.id, email: me.email, firstName: me.first_name, lastName: me.last_name, token, jti: me.jti });
    const redirectTo = searchParams.get("redirectTo");
    router.replace(redirectTo ?? ROUTES.DASHBOARD);
  };

  return (
    <>
      {step === "phone" && (
        <LoginPhoneStep
          onNext={(phone) => {
            setOtpChannel("phone");
            setIdentifier(phone);
            setOtpPhone(phone);
            setOtpIdentifier(phone);
          }}
          onSwitchToEmail={() => pushStep("email")}
        />
      )}

      {step === "email" && (
        <LoginEmailStep
          defaultEmail={prefillEmail}
          onNext={handleEmailNext}
          onSwitchToPhone={() => pushStep("phone")}
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
          channel={otpChannel}
          onSubmit={handleOtpSubmit}
          onResend={async () => {
            if (otpChannel === "email") await authService.sendEmailOtp(otpIdentifier);
            else await authService.sendPhoneOtp(otpIdentifier);
          }}
          onClose={() => { setOtpIdentifier(null); setOtpPhone(null); }}
          onAlternative={() => {
            setOtpIdentifier(null);
            setOtpPhone(null);
            pushStep("email");
          }}
        />
      )}
    </>
  );
};
