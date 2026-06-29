"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiCalendarLine,
  RiUserSettingsLine,
  RiSmartphoneLine,
  RiPhoneLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { PersonIcon } from "@/components/icons/PersonIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";
import { useUser, useUpdateUser } from "@/store";
import { useCurrentUser, useUpdateProfile, useChangePassword } from "@/api/hooks/useUserQueries";
import { useGenerateOtp, useVerifyOtp } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { OtpModal } from "@/components/modals/OtpModal";
import {
  profileSchema,
  passwordChangeSchema,
  ProfileFormValues,
  PasswordChangeValues,
} from "@/lib/schemas/profileSchema";

const FieldInput = ({
  icon: Icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  error?: string;
}) => (
  <div className="flex flex-col gap-1">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      <input
        className="h-11 w-full rounded-lg border border-border-input bg-bg-card pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-bg-input disabled:cursor-not-allowed"
        {...props}
      />
    </div>
    {error && <p className="text-xs text-text-error">{error}</p>}
  </div>
);

const PasswordInput = ({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <PasswordIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type={show ? "text" : "password"}
          className="h-11 w-full rounded-lg border border-border-input bg-bg-card pl-9 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
        >
          {show ? (
            <EyeIcon className="h-4 w-4" />
          ) : (
            <EyeOffIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && <p className="text-xs text-text-error">{error}</p>}
    </div>
  );
};

// AUM `.input-label`: 12px, rgba(0,0,0,.5), normal weight/case.
const FormLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-1 text-xs text-black/50">{children}</p>
);

// AUM `.actions` buttons: small uppercase pills — grey "ghost dark" Cancel + coral Save.
const CANCEL_BTN =
  "rounded-full border border-ghost-dark px-5 py-[7px] text-xs font-medium uppercase tracking-wide text-ghost-dark transition-colors hover:bg-ghost-dark hover:text-white";
const SUBMIT_BTN =
  "rounded-full bg-coral px-5 py-[7px] text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover disabled:opacity-60";

/** Formats raw digits into (XXX) XXX-XXXX as the user types */
const formatUSPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const ProfilePage = () => {
  const user = useUser();
  const updateUser = useUpdateUser();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const { mutateAsync: generateOtp } = useGenerateOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtp();
  const { data: profile } = useCurrentUser();

  const [showOtpModal, setShowOtpModal] = useState(false);

  // Patient identity fields are locked once the checkout patient-info step is done
  // (server-authoritative `info_provided`); only contact details stay editable.
  const identityLocked = profile?.info_provided ?? false;

  // Mirror verification flags locally so they update optimistically when
  // the user edits the phone or email before saving.
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [emailChanged, setEmailChanged] = useState(false);
  const [otpVerified, setOtpVerified] = useState<boolean | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [passwordSaveError, setPasswordSaveError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    reset,
    watch,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      dateOfBirth: "",
      gender: "male",
      mobilePhone: "",
      homePhone: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      firstName: profile.first_name ?? user?.firstName ?? "",
      lastName: profile.last_name ?? user?.lastName ?? "",
      email: profile.email ?? user?.email ?? "",
      dateOfBirth: profile.date_of_birth ?? "",
      gender: (profile.gender as "" | "male" | "female" | "other") ?? "male",
      mobilePhone: profile.mobile_phone ?? "",
      homePhone: profile.home_phone ?? "",
    });
    setEmailVerified(profile.email_verified ?? false);
    setEmailChanged(false);
    setOtpVerified(profile.otp_verified ?? false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const mobilePhoneValue = watch("mobilePhone") ?? "";
  const homePhoneValue = watch("homePhone") ?? "";

  const handlePhoneChange = useCallback(
    (field: "mobilePhone" | "homePhone") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileValue(field, formatUSPhone(e.target.value));
      },
    [setProfileValue],
  );

  const handleResendEmailVerification = async () => {
    setIsResendingEmail(true);
    try {
      await authService.resendEmailVerification();
      toast.success("Verification email sent. Please check your inbox.");
    } catch {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const onProfileSave = (values: ProfileFormValues) => {
    setProfileSaveError(null);
    updateProfile(
      {
        user: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email || undefined,
          date_of_birth: values.dateOfBirth || undefined,
          gender: values.gender || undefined,
          mobile_phone: values.mobilePhone || undefined,
          home_phone: values.homePhone || undefined,
        },
      },
      {
        onSuccess: (data) => {
          updateUser({
            firstName: data.first_name,
            lastName: data.last_name,
          });
          const emailWasChanged = values.email && values.email !== (profile?.email ?? user?.email ?? "");
          if (emailWasChanged) {
            setEmailChanged(true);
            setEmailVerified(false);
          } else {
            setEmailChanged(false);
          }
          const phoneWasChanged = values.mobilePhone && values.mobilePhone !== (profile?.mobile_phone ?? "");
          if (phoneWasChanged) {
            setOtpVerified(false);
          }
          toast.success("Profile updated successfully");
        },
        onError: (err) => {
          setProfileSaveError(
            (err as { message?: string })?.message ?? "Failed to update profile",
          );
        },
      },
    );
  };

  const handleVerifyNow = async () => {
    setShowOtpModal(true);
    try {
      await generateOtp();
    } catch {
      toast.error("Could not send a verification code. Please try again.");
    }
  };

  // OtpModal surfaces an inline error when onSubmit rejects, so let verifyOtp throw.
  const handleOtpSubmit = async (code: string) => {
    await verifyOtp(code);
    setOtpVerified(true);
    setShowOtpModal(false);
    toast.success("Phone number verified");
  };

  const onPasswordUpdate = (values: PasswordChangeValues) => {
    setPasswordSaveError(null);
    changePassword(
      {
        user: {
          current_password: values.oldPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully");
          resetPassword();
        },
        onError: (err) => {
          setPasswordSaveError(
            (err as { message?: string })?.message ?? "Failed to update password",
          );
        },
      },
    );
  };

  return (
    <div className="rounded-xl bg-bg-card p-[30px] shadow-[0px_0px_20px_rgba(128,148,178,0.2)] max-[768px]:px-[15px]">
      {/* Personal Info */}
      <form onSubmit={handleProfileSubmit(onProfileSave)}>
        {identityLocked && (
          <p className="mb-5 rounded-lg border border-border-default bg-bg-input px-4 py-3 text-sm text-text-muted">
            Your name, date of birth, and gender are locked. Contact support to update them.
          </p>
        )}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <FormLabel>First Name</FormLabel>
            <FieldInput
              icon={PersonIcon}
              error={profileErrors.firstName?.message}
              disabled={identityLocked}
              onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
              {...registerProfile("firstName")}
            />
          </div>
          <div>
            <FormLabel>Last Name</FormLabel>
            <FieldInput
              icon={PersonIcon}
              error={profileErrors.lastName?.message}
              disabled={identityLocked}
              onKeyDown={(e) => { if (/[0-9]/.test(e.key)) e.preventDefault(); }}
              {...registerProfile("lastName")}
            />
          </div>
          <div>
            <FormLabel>Date of birth</FormLabel>
            <FieldInput
              icon={RiCalendarLine}
              type="date"
              error={profileErrors.dateOfBirth?.message}
              disabled={identityLocked}
              {...registerProfile("dateOfBirth")}
            />
          </div>
          <div>
            <FormLabel>Gender</FormLabel>
            <div className="relative">
              <RiUserSettingsLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <select
                disabled={identityLocked}
                className="h-11 w-full appearance-none rounded-lg border border-border-input bg-bg-card pl-9 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-bg-input disabled:cursor-not-allowed"
                {...registerProfile("gender")}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                {/* Telemedicine is available for male patients only. */}
                <option value="female" disabled>Female</option>
                <option value="other" disabled>Other</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                ▾
              </span>
            </div>
          </div>
          <div>
            <FormLabel>Mobile phone number</FormLabel>
            <FieldInput
              icon={RiSmartphoneLine}
              type="tel"
              maxLength={14}
              value={mobilePhoneValue}
              error={profileErrors.mobilePhone?.message}
              onChange={handlePhoneChange("mobilePhone")}
            />
            {profile?.mobile_phone && otpVerified === true ? (
              <p className="mt-2.5 flex items-center gap-1 text-sm text-success">
                <RiCheckboxCircleLine className="h-3.5 w-3.5" />
                OTP is verified
              </p>
            ) : profile?.mobile_phone && otpVerified === false ? (
              <p className="mt-2.5 text-sm text-coral">
                OTP is not verified please{" "}
                <button
                  type="button"
                  onClick={handleVerifyNow}
                  className="text-primary underline hover:opacity-80"
                >
                  Verify Now
                </button>
              </p>
            ) : null}
          </div>
          <div>
            <FormLabel>Home number</FormLabel>
            <FieldInput
              icon={RiPhoneLine}
              type="tel"
              maxLength={14}
              value={homePhoneValue}
              error={profileErrors.homePhone?.message}
              onChange={handlePhoneChange("homePhone")}
            />
          </div>
          <div>
            <FormLabel>Email</FormLabel>
            <FieldInput
              icon={EmailIcon}
              type="email"
              error={profileErrors.email?.message}
              {...registerProfile("email")}
            />
            {emailVerified === true ? (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-success">
                <RiCheckboxCircleLine className="h-3.5 w-3.5" />
                Email verified
              </p>
            ) : emailVerified === false && !emailChanged ? (
              // Unverified but email hasn't been changed — confirmation was already sent at signup
              <p className="mt-1.5 flex items-center gap-1 text-xs text-success">
                <RiCheckboxCircleLine className="h-3.5 w-3.5" />
                Confirmation link has been sent to your email address.
              </p>
            ) : emailVerified === false && emailChanged ? (
              // Email was changed — show warning + resend
              <div className="mt-1.5 flex flex-col gap-1.5">
                <p className="text-xs text-text-error leading-relaxed">
                  Your email has not been verified. An email verification link has been sent to you.
                  Please check your inbox and click the link in that email.
                </p>
                <button
                  type="button"
                  onClick={handleResendEmailVerification}
                  disabled={isResendingEmail}
                  className="self-start text-xs font-semibold text-link-blue underline hover:opacity-80 disabled:opacity-50"
                >
                  {isResendingEmail ? "Sending…" : "Resend verification email, I have not received it."}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {profileSaveError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-text-error">
            {profileSaveError}
          </p>
        )}

        <div className="mt-[30px] flex justify-end gap-3">
          <button type="button" className={CANCEL_BTN}>
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className={SUBMIT_BTN}>
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="my-[30px] border-t border-border-default" />

      {/* Password */}
      <form onSubmit={handlePasswordSubmit(onPasswordUpdate)}>
        <h2 className="mb-5 text-xl font-semibold text-text-primary">Password</h2>

        <div className="flex flex-col gap-4 sm:max-w-sm">
          <div>
            <FormLabel>Old password</FormLabel>
            <PasswordInput
              error={passwordErrors.oldPassword?.message}
              {...registerPassword("oldPassword")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-none">
            <div>
              <FormLabel>New password</FormLabel>
              <PasswordInput
                error={passwordErrors.newPassword?.message}
                {...registerPassword("newPassword")}
              />
            </div>
            <div>
              <FormLabel>Repeat new password</FormLabel>
              <PasswordInput
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword("confirmPassword")}
              />
            </div>
          </div>
        </div>

        {passwordSaveError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-text-error">
            {passwordSaveError}
          </p>
        )}

        <div className="mt-[30px] flex justify-end gap-3">
          <button type="button" className={CANCEL_BTN}>
            Cancel
          </button>
          <button type="submit" disabled={isChangingPassword} className={SUBMIT_BTN}>
            {isChangingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </form>

      <OtpModal
        show={showOtpModal}
        phone={mobilePhoneValue || profile?.mobile_phone || ""}
        channel="phone"
        onSubmit={handleOtpSubmit}
        onResend={generateOtp}
        onClose={() => setShowOtpModal(false)}
        onAlternative={() => setShowOtpModal(false)}
      />
    </div>
  );
};
