"use client";

import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { SsnVerificationModal } from "@/features/checkout/components/SsnVerificationModal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useIdentityVerification } from "@/features/checkout/hooks/useIdentityVerification";

interface OptionCardProps {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  title: string;
  subtext: string;
}

// Mirrors the aum .answer-option card: white tile, coral border + filled radio
// when selected, label over muted subtext.
const OptionCard = ({ selected, disabled, onSelect, title, subtext }: OptionCardProps) => (
  <div
    onClick={disabled ? undefined : onSelect}
    className={cn(
      "flex items-start gap-4 rounded-[5px] border-[3px] bg-white p-5 transition-all duration-200",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      selected ? "border-coral" : "border-border-dropdown hover:border-[#a9cbd9]",
    )}
  >
    <span
      className={cn(
        "mt-0.5 flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full border-[3px] transition-all duration-200",
        selected ? "border-coral bg-coral" : "border-border-dropdown bg-white",
      )}
    >
      {selected && (
        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <div>
      <p className="font-bold text-text-primary">{title}</p>
      <p className="mt-1 text-sm text-text-muted">{subtext}</p>
    </div>
  </div>
);

export const IdentityVerificationPage = () => {
  const {
    selectedOption,
    setSelectedOption,
    onContinue,
    limitExceeded,
    ssnModalOpen,
    closeSsnModal,
    submitSsn,
    ssnError,
    isVerifying,
    continueWithVisit,
    isContinuing,
    back,
    steps,
  } = useIdentityVerification();

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isContinuing} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">Let&apos;s verify your Identity</h1>
          <p className="mt-3 text-text-primary">
            Verifying your identity is crucial to ensuring the right person receives the right medical
            advice and treatment. We apologize for any inconvenience and appreciate your cooperation.
          </p>

          <h2 className="mt-6 font-bold text-text-primary">Provide the best option that works for you:</h2>

          <div className="mt-4 space-y-4">
            <OptionCard
              selected={selectedOption === "last_4_ssn"}
              disabled={limitExceeded}
              onSelect={() => setSelectedOption("last_4_ssn")}
              title="Last 4 of Social Security Number"
              subtext="For your privacy, the full number is not required. We don't save this information. It will be deleted immediately after verification."
            />

            {limitExceeded && (
              <p className="text-sm text-text-error">
                You&apos;ve exceeded the number of attempts. Please try the option below.
              </p>
            )}

            <OptionCard
              selected={selectedOption === "id_review"}
              onSelect={() => setSelectedOption("id_review")}
              title="Picture of Government Issued ID & Selfie"
              subtext="This option is great if you are comfortable uploading pictures on your phone"
            />
          </div>

          <Button
            variant="coral"
            size="lg"
            fullWidth
            disabled={!selectedOption}
            loading={isContinuing && selectedOption === "id_review"}
            onClick={onContinue}
            className="mt-8 disabled:bg-[#6b7685] disabled:opacity-100"
          >
            Continue
          </Button>
        </div>
      </main>

      {ssnModalOpen && (
        <SsnVerificationModal
          onClose={closeSsnModal}
          onSubmit={submitSsn}
          isVerifying={isVerifying}
          error={ssnError}
          limitExceeded={limitExceeded}
          onContinueWithVisit={continueWithVisit}
          isContinuing={isContinuing}
        />
      )}
    </>
  );
};
