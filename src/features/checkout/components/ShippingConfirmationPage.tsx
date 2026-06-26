"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { useShippingConfirmation } from "@/features/checkout/hooks/useShippingConfirmation";
import { DeliveryOptionDetails } from "@/features/checkout/components/shipping/DeliveryOptionDetails";

const formatDob = (dob?: string): string => {
  if (!dob) return "";
  const d = new Date(dob);
  if (isNaN(d.getTime())) return dob;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

const capitalize = (s?: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const formatPhone = (value?: string): string => {
  const digits = (value ?? "").replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return value ?? "";
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const InfoRow = ({ children }: { children: ReactNode }) => (
  <span className="text-sm font-normal leading-relaxed text-[#777] max-md:text-xs">{children}</span>
);

const ChangeButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 cursor-pointer text-sm font-normal text-primary-blue hover:opacity-80 max-md:text-xs"
  >
    Change
  </button>
);

const Card = ({
  title,
  onChange,
  children,
}: {
  title: string;
  onChange: () => void;
  children: ReactNode;
}) => (
  <div className="rounded-xl border-[1.5px] border-[#c5d4dc] bg-white p-4 md:p-5">
    <div className="mb-2 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold leading-[1.725] text-black">{title}</h2>
      <ChangeButton onClick={onChange} />
    </div>
    <div className="flex flex-col">{children}</div>
  </div>
);

export const ShippingConfirmationPage = () => {
  const router = useRouter();
  const { me, address, deliveryOption, cutoff, back, onContinue, isSubmitting, isLoading } =
    useShippingConfirmation();

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isSubmitting} />
      <CheckoutProgressBar step="shipping_confirmation" />

      <main className="min-h-screen bg-bg-main px-4 pt-[52px] pb-10 md:pt-[120px]">
        <div className="mx-auto w-full max-w-xl">
          {isLoading ? (
            // The whole page (title + subheading included) waits behind the loader
            // until patient, address and delivery data are all ready.
            <div className="flex min-h-[60vh] items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : (
            <>
              <h1 className="text-[24px] font-semibold leading-[1.425] text-[#262a32]">
                Let&apos;s confirm your Delivery Info
              </h1>
              <p className="mt-2 mb-8 text-[16px] font-medium leading-[1.4] text-[#777]">
                Choose your preferred shipping option
              </p>

              <div className="rounded-2xl bg-bg-card px-[30px] py-[35px] shadow-sm max-[436px]:px-[15px] max-[436px]:py-[15px]">
                <div className="flex flex-col gap-[20px]">
                  <Card
                    title="Patient Information"
                    onChange={() => router.push(`${ROUTES.PATIENT_INFO}?return=confirmation`)}
                  >
                    <InfoRow>
                      {me?.first_name} {me?.last_name}
                    </InfoRow>
                    <InfoRow>{formatDob(me?.date_of_birth)}</InfoRow>
                    <InfoRow>{capitalize(me?.gender)}</InfoRow>
                    <InfoRow>{formatPhone(me?.mobile_phone ?? me?.home_phone)}</InfoRow>
                  </Card>

                  <Card
                    title="Shipping Information"
                    onChange={() => router.push(`${ROUTES.SHIPPING}?return=confirmation`)}
                  >
                    {address && (
                      <>
                        <InfoRow>
                          {address.street_1}
                          {address.street_2 ? `, ${address.street_2}` : ""}
                        </InfoRow>
                        <InfoRow>
                          {address.city}, {address.state} {address.zip}
                        </InfoRow>
                      </>
                    )}
                  </Card>

                  {deliveryOption && (
                    // Read-only twin of the /checkout/shipping delivery card: same
                    // body (icon, label, ETA, cutoff badge), no radio/price, with a
                    // "Change" link that routes back to the delivery view.
                    <div className="rounded-xl border-[1.5px] border-[#c5d4dc] bg-white p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <DeliveryOptionDetails option={deliveryOption} cutoff={cutoff} />
                        <ChangeButton
                          onClick={() =>
                            router.push(`${ROUTES.SHIPPING}?return=confirmation&view=delivery`)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onContinue}
                  disabled={isSubmitting}
                  className="mt-5 w-full cursor-pointer rounded-full bg-[#e05c4b] py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};
