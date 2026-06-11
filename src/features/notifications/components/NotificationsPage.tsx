"use client";

import { useState } from "react";
import { useUser } from "@/store";

export const NotificationsPage = () => {
  const user = useUser();
  const [phoneAllowed, setPhoneAllowed] = useState(false);
  const [drugsIncluded, setDrugsIncluded] = useState(false);

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <h1 className="text-xl font-bold text-text-primary">Notifications</h1>
      <p className="mt-1 text-sm text-text-muted">
        View and edit your notification preferences.
      </p>

      <div className="mt-6 flex flex-col gap-5">
        <p className="text-sm text-text-primary">
          Received <strong>SMS Notifications</strong>:
        </p>

        {!user?.email && (
          <p className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            To receive SMS notifications please add your mobile phone number in your{" "}
            <a href="/profile" className="font-semibold underline">Profile</a>.
          </p>
        )}

        {/* SMS toggle */}
        <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border-default bg-bg-main p-4">
          <button
            type="button"
            role="switch"
            aria-checked={phoneAllowed}
            onClick={() => setPhoneAllowed((v) => !v)}
            className="relative mt-0.5 flex-shrink-0 focus:outline-none"
          >
            <div className={`h-6 w-11 rounded-full transition-colors ${phoneAllowed ? "bg-primary" : "bg-border-input"}`} />
            <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${phoneAllowed ? "translate-x-5" : "translate-x-0"}`} />
          </button>
          <p className="text-sm text-text-primary leading-relaxed">
            I agree to receive SMS (text messages) from Sildenafil.com and its partner
            pharmacy. We'll notify you with important updates to your order and refill reminders.
          </p>
        </label>

        {/* Drug names toggle */}
        <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border-default bg-bg-main p-4">
          <button
            type="button"
            role="switch"
            aria-checked={drugsIncluded}
            onClick={() => setDrugsIncluded((v) => !v)}
            className="relative mt-0.5 flex-shrink-0 focus:outline-none"
          >
            <div className={`h-6 w-11 rounded-full transition-colors ${drugsIncluded ? "bg-primary" : "bg-border-input"}`} />
            <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${drugsIncluded ? "translate-x-5" : "translate-x-0"}`} />
          </button>
          <p className="text-sm text-text-primary leading-relaxed">
            Include medication names in email and SMS from Sildenafil.com and its partner
            pharmacy (recommended).
          </p>
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            className="h-10 rounded-full bg-selected px-8 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
