"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCurrentUser, useUpdateProfile } from "@/api/hooks/useUserQueries";

const CheckSquare = ({ checked }: { checked: boolean }) => (
  <span
    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
      checked ? "border-primary-blue text-primary-blue" : "border-border-input text-transparent"
    }`}
  >
    <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
      <path
        d="M4.5 10.5l3.2 3.2 7.8-8.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const NotificationsPage = () => {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [phoneAllowed, setPhoneAllowed] = useState(false);
  const [drugsIncluded, setDrugsIncluded] = useState(false);

  // Hydrate the checkboxes from the saved preferences.
  useEffect(() => {
    if (!user) return;
    setPhoneAllowed(user.phone_contact_allowed ?? false);
    setDrugsIncluded(user.drugs_names_included ?? false);
  }, [user]);

  const hasPhone = !!user?.mobile_phone;

  const handleSave = () => {
    if (!user) return;
    updateProfile(
      {
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          phone_contact_allowed: phoneAllowed,
          drugs_names_included: drugsIncluded,
        },
      },
      {
        onSuccess: () => toast.success("Notification preferences saved"),
        onError: (err) =>
          toast.error((err as { message?: string })?.message ?? "Failed to save preferences"),
      },
    );
  };

  return (
    <div className="rounded-2xl bg-bg-card p-8 shadow-sm sm:p-10">
      <h1 className="text-base text-text-primary">
        Received <strong className="font-bold">SMS Notifications</strong>:
      </h1>

      {!hasPhone && (
        <p className="mt-5 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          To receive SMS notifications please add your mobile phone number in your{" "}
          <a href="/profile" className="font-semibold underline">Profile</a>.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-7">
        <button
          type="button"
          role="checkbox"
          aria-checked={phoneAllowed}
          onClick={() => setPhoneAllowed((v) => !v)}
          className="flex w-full cursor-pointer items-start gap-3 text-left"
        >
          <CheckSquare checked={phoneAllowed} />
          <span className="text-[15px] leading-relaxed text-primary-blue">
            I agree to receive SMS (text messages) from and it&apos;s partner pharmacy. We&apos;ll
            notify you with important updates to your order and refill reminders.
          </span>
        </button>

        <button
          type="button"
          role="checkbox"
          aria-checked={drugsIncluded}
          onClick={() => setDrugsIncluded((v) => !v)}
          className="flex w-full cursor-pointer items-start gap-3 text-left"
        >
          <CheckSquare checked={drugsIncluded} />
          <span className="text-[15px] leading-relaxed text-primary-blue">
            Include medication names in email and SMS from and it&apos;s partner pharmacy
            (recommended)
          </span>
        </button>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasPhone}
          className="rounded-full border border-border-input px-8 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-blue transition-colors hover:bg-primary-blue/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};
