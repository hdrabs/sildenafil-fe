"use client";

import { Controller } from "react-hook-form";
import { useVisitConsent } from "../hooks/useVisitConsent";

export const VisitConsentLocationPage = () => {
  const {
    form,
    submit,
    eligibleStates,
    isLoadingStates,
    isPending,
    submitError,
    selectedState,
  } = useVisitConsent();

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f0f6f8] px-4 py-16">
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
                  className="text-sm font-medium text-gray-700"
                >
                  Select State
                </label>
                <div className="relative">
                  <select
                    {...field}
                    id="state-select"
                    disabled={isLoadingStates}
                    className={`h-12 w-full appearance-none rounded-lg border bg-white px-4 pr-10 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${
                      errors.state ? "border-red-400" : "border-gray-300"
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
                  {/* Chevron icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
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
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              errors.terms ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          >
            <input
              {...register("terms")}
              id="terms-and-privacy-policy"
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm leading-relaxed text-gray-700">
              I agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
              . I also permit a provider to view medication history.
            </span>
          </label>
          {errors.terms && (
            <p className="-mt-3 text-xs text-red-500">{errors.terms.message}</p>
          )}

          {/* State acknowledgment checkbox */}
          <label
            htmlFor="location-agreement"
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              errors.state_ack ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          >
            <input
              {...register("state_ack")}
              id="location-agreement"
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm leading-relaxed text-gray-700">
              I acknowledge that I&apos;m located in the State of{" "}
              <strong>{selectedState || "___"}</strong> at the time I start this
              visit. I also acknowledge that I have read and agreed to the{" "}
              <a
                href="/telehealth-consent"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Telehealth Informed Consent
              </a>{" "}
              and{" "}
              <a
                href="/privacy-practices"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Notice of Privacy Practices
              </a>
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
            disabled={isPending || isLoadingStates}
            className="mt-2 w-full rounded-full bg-gray-600 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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
  );
};
