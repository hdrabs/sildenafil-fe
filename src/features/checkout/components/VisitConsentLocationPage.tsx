"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { useVisitConsent } from "../hooks/useVisitConsent";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { TermsOfUseDrawer } from "./drawers/TermsOfUseDrawer";
import { PrivacyPolicyDrawer } from "./drawers/PrivacyPolicyDrawer";
import { TelehealthDrawer } from "./drawers/TelehealthDrawer";
import { PrivacyPracticesDrawer } from "./drawers/PrivacyPracticesDrawer";

export const VisitConsentLocationPage = () => {
  const { back, steps } = useStepNavigation("visit_consent");
  const {
    form,
    submit,
    eligibleStates,
    isLoadingStates,
    isPending,
    submitError,
    selectedState,
    canSubmit,
  } = useVisitConsent();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTelehealthModal, setShowTelehealthModal] = useState(false);
  const [showPrivacyPracticesModal, setShowPrivacyPracticesModal] = useState(false);

  return (
    <>
      <SecondaryNav onBack={back} />
      <CheckoutProgressBar steps={steps} />
      <main className="flex min-h-screen items-start justify-center bg-bg-main px-4 py-16">
        <div className="w-full max-w-xl">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">
            Select your current location
          </h1>
          <p className="mb-8 text-base text-gray-600">
            Let&apos;s confirm that you are eligible. We need to make sure your
            state allows Telehealth.
          </p>

          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            {/* State dropdown */}
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="state-select"
                    className="text-sm font-medium text-gray-500"
                  >
                    Select State
                  </label>
                  <div className="relative">
                    <select
                      {...field}
                      id="state-select"
                      disabled={isLoadingStates}
                      className={`h-14 w-full cursor-pointer appearance-none rounded-xl border bg-white px-4 pr-10 text-base font-medium text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e05c4b] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.state ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value="">
                        {isLoadingStates ? "Loading states…" : "Select State"}
                      </option>
                      {eligibleStates.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-gray-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.state && (
                    <p className="text-xs text-red-500">{errors.state.message}</p>
                  )}
                </div>
              )}
            />

            {/* Terms & Privacy checkbox */}
            <label
              htmlFor="terms-and-privacy-policy"
              className="flex cursor-pointer items-start gap-3"
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  {...register("terms")}
                  id="terms-and-privacy-policy"
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="h-6 w-6 rounded-md border-2 border-gray-300 bg-white peer-checked:border-[#e05c4b] peer-checked:bg-[#e05c4b] transition-colors" />
                <svg
                  className="pointer-events-none absolute inset-0 m-auto hidden h-4 w-4 text-white peer-checked:block"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm leading-relaxed text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                  className="cursor-pointer font-medium text-[#3b82f6] hover:underline"
                >
                  Terms of Use
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
                  className="cursor-pointer font-medium text-[#3b82f6] hover:underline"
                >
                  Privacy Policy
                </button>
                . I also permit a provider to view medication history.
              </span>
            </label>
            {errors.terms && (
              <p className="-mt-3 text-xs text-red-500">{errors.terms.message}</p>
            )}

            {/* State acknowledgment checkbox */}
            <label
              htmlFor="location-agreement"
              className="flex cursor-pointer items-start gap-3"
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  {...register("state_ack")}
                  id="location-agreement"
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="h-6 w-6 rounded-md border-2 border-gray-300 bg-white peer-checked:border-[#e05c4b] peer-checked:bg-[#e05c4b] transition-colors" />
                <svg
                  className="pointer-events-none absolute inset-0 m-auto hidden h-4 w-4 text-white peer-checked:block"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm leading-relaxed text-gray-700">
                I acknowledge that I&apos;m located in the State of{" "}
                <strong>{selectedState || "___"}</strong> at the time I start this
                visit. I also acknowledge that I have read and agreed to the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTelehealthModal(true); }}
                  className="cursor-pointer font-medium text-[#3b82f6] hover:underline"
                >
                  Telehealth Informed Consent
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPrivacyPracticesModal(true); }}
                  className="cursor-pointer font-medium text-[#3b82f6] hover:underline"
                >
                  Notice of Privacy Practices
                </button>
                .
              </span>
            </label>
            {errors.state_ack && (
              <p className="-mt-3 text-xs text-red-500">{errors.state_ack.message}</p>
            )}

            {submitError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || isLoadingStates || !canSubmit}
              className="mt-2 w-full cursor-pointer rounded-full bg-[#e05c4b] py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#c94f3e] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Please wait…
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Legal drawers */}
      <TermsOfUseDrawer
        show={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onOpenPrivacyPolicy={() => setShowPrivacyModal(true)}
      />
      <PrivacyPolicyDrawer
        show={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TelehealthDrawer
        show={showTelehealthModal}
        onClose={() => setShowTelehealthModal(false)}
      />
      <PrivacyPracticesDrawer
        show={showPrivacyPracticesModal}
        onClose={() => setShowPrivacyPracticesModal(false)}
      />
    </>
  );
};
