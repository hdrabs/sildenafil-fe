"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { useVisitConsent } from "../hooks/useVisitConsent";
import { useStepNavigation } from "../hooks/useStepNavigation";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "./CheckoutProgressBar";
import { TermsOfUseDrawer } from "@/components/legal/TermsOfUseDrawer";
import { PrivacyPolicyDrawer } from "@/components/legal/PrivacyPolicyDrawer";
import { TelehealthDrawer } from "./drawers/TelehealthDrawer";
import { PrivacyPracticesDrawer } from "./drawers/PrivacyPracticesDrawer";
import { CaretDownIcon } from "@/components/icons/CaretDownIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";

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
          <h1 className="mb-4 text-2xl font-semibold text-gray-900">
            Select your current location
          </h1>
          <p className="mb-4 text-base font-normal text-gray-600">
            Let&apos;s confirm that you are eligible. We need to make sure your
            state allows Telehealth.
          </p>

          <form onSubmit={submit} noValidate className="flex flex-col">
            {/* State dropdown */}
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <div className="mb-6 flex flex-col gap-1.5">
                  <label
                    htmlFor="state-select"
                    className="text-sm font-normal text-[#989d9f]"
                  >
                    Select State
                  </label>
                  <div className="relative">
                    <select
                      {...field}
                      id="state-select"
                      disabled={isLoadingStates}
                      className={`min-h-[46px] w-full cursor-pointer appearance-none rounded-[5px] border bg-white py-2.5 pl-5 pr-10 text-sm text-gray-900 transition-colors focus:border-coral focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.state ? "border-red-400" : "border-border-dropdown"
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
                    {/* aum caret-down icon (copied from ../aum_mine/.../controls/caret-down.svg) */}
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <CaretDownIcon />
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
                <div className="h-6 w-6 rounded-md border-2 border-gray-300 bg-white peer-checked:border-coral peer-checked:bg-coral transition-colors" />
                <CheckIcon className="pointer-events-none absolute inset-0 m-auto hidden h-4 w-4 text-white peer-checked:block" />
              </div>
              <span className="text-sm leading-relaxed text-[#00000080]">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                  className="cursor-pointer text-link-blue hover:underline"
                >
                  Terms of Use
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}
                  className="cursor-pointer text-link-blue hover:underline"
                >
                  Privacy Policy
                </button>
                . I also permit a provider to view medication history.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-xs text-red-500">{errors.terms.message}</p>
            )}

            {/* State acknowledgment checkbox */}
            <label
              htmlFor="location-agreement"
              className="mt-4 flex cursor-pointer items-start gap-3"
            >
              <div className="relative mt-0.5 shrink-0">
                <input
                  {...register("state_ack")}
                  id="location-agreement"
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="h-6 w-6 rounded-md border-2 border-gray-300 bg-white peer-checked:border-coral peer-checked:bg-coral transition-colors" />
                <CheckIcon className="pointer-events-none absolute inset-0 m-auto hidden h-4 w-4 text-white peer-checked:block" />
              </div>
              <span className="text-sm leading-relaxed text-[#00000080]">
                I acknowledge that I&apos;m located in the State of{" "}
                <strong>{selectedState || "___"}</strong> at the time I start this
                visit. I also acknowledge that I have read and agreed to the{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowTelehealthModal(true); }}
                  className="cursor-pointer text-link-blue hover:underline"
                >
                  Telehealth Informed Consent
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setShowPrivacyPracticesModal(true); }}
                  className="cursor-pointer text-link-blue hover:underline"
                >
                  Notice of Privacy Practices
                </button>
                .
              </span>
            </label>
            {errors.state_ack && (
              <p className="mt-1.5 text-xs text-red-500">{errors.state_ack.message}</p>
            )}

            {submitError && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || isLoadingStates || !canSubmit}
              className="mt-6 w-full cursor-pointer rounded-full border border-coral bg-coral px-[22px] py-3 text-base font-normal uppercase text-white outline-none transition-colors hover:border-coral-hover hover:bg-coral-hover disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-gray-400"
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
