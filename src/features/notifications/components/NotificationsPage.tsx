"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { CONFIG } from "@/constants/config";
import { useCurrentUser, useUpdateProfile } from "@/api/hooks/useUserQueries";

// AUM's exact notification checkbox image, swapped empty→blue on check. The source
// is 12px, so it's rendered near-native to stay crisp.
const CheckBox = ({ checked }: { checked: boolean }) => (
  <Image
    src={checked ? "/icons/account/checkbox-blue.png" : "/icons/account/checkbox-empty.png"}
    alt=""
    aria-hidden
    width={14}
    height={14}
    className="mt-1 shrink-0"
  />
);

export const NotificationsPage = () => {
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const [phoneAllowed, setPhoneAllowed] = useState(false);
  const [drugsIncluded, setDrugsIncluded] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Seed the checkboxes from saved preferences once the user loads (render-time
  // adjustment, not an effect — avoids cascading renders). Later refetches don't
  // re-seed, so an in-progress toggle is never clobbered.
  if (user && !hydrated) {
    setHydrated(true);
    setPhoneAllowed(user.phone_contact_allowed ?? false);
    setDrugsIncluded(user.drugs_names_included ?? false);
  }

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
    <div className="mb-[30px] rounded-xl bg-bg-card p-[30px] shadow-[0px_0px_20px_rgba(128,148,178,0.2)] max-[768px]:px-[15px]">
      <p className="text-base text-text-primary">
        Received<strong className="font-bold"> SMS Notifications</strong>:
      </p>

      {!hasPhone && (
        <p className="mt-5 text-sm text-warning">
          To accept SMS notifications please provide your mobile phone number.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={phoneAllowed}
          onClick={() => setPhoneAllowed((v) => !v)}
          className="flex w-full items-start gap-2 rounded-[5px] bg-white px-6 py-5 text-left"
        >
          <CheckBox checked={phoneAllowed} />
          <span
            className={cn(
              "text-base leading-relaxed",
              phoneAllowed ? "text-primary" : "text-text-primary",
            )}
          >
            I agree to receive SMS (text messages) from {CONFIG.SITE_NAME} and it&apos;s partner
            pharmacy. We&apos;ll notify you with important updates to your order and refill
            reminders.
          </span>
        </button>

        <button
          type="button"
          role="checkbox"
          aria-checked={drugsIncluded}
          onClick={() => setDrugsIncluded((v) => !v)}
          className="flex w-full items-start gap-2 rounded-[5px] bg-white px-6 py-5 text-left"
        >
          <CheckBox checked={drugsIncluded} />
          <span
            className={cn(
              "text-base leading-relaxed",
              drugsIncluded ? "text-primary" : "text-text-primary",
            )}
          >
            Include medication names in email and SMS from {CONFIG.SITE_NAME} and it&apos;s partner
            pharmacy (recommended)
          </span>
        </button>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !hasPhone}
          className="rounded-full border border-border-dropdown px-5 py-[7px] text-xs font-medium uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
};
