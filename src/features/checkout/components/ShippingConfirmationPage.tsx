"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { useShippingConfirmation } from "@/features/checkout/hooks/useShippingConfirmation";
import { DeliveryOption } from "@/types/delivery";

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

const Card = ({
  title,
  onChange,
  children,
}: {
  title: string;
  onChange: () => void;
  children: ReactNode;
}) => (
  <div className="rounded-2xl border border-border-default bg-bg-card p-5">
    <div className="mb-3 flex items-start justify-between gap-3">
      <h2 className="font-semibold text-text-primary">{title}</h2>
      <button
        type="button"
        onClick={onChange}
        className="shrink-0 cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
      >
        Change
      </button>
    </div>
    {children}
  </div>
);

const DeliverySummary = ({
  option,
  cutoff,
}: {
  option: DeliveryOption;
  cutoff: string | null;
}) => (
  <>
    <div className="flex items-center gap-2">
      <Image
        src={option.delivery_type === "personal" ? "/icons/aum-pharmacy.svg" : "/icons/usps.svg"}
        alt=""
        width={option.delivery_type === "personal" ? 42 : 29}
        height={17}
        unoptimized
        className="shrink-0"
      />
      <span className="text-sm font-semibold text-text-primary">{option.label_info}</span>
    </div>
    <p className="mt-1 text-sm text-text-muted">{option.delivery_days_label}</p>
    {option.estimated_delivery_date && (
      <p className="text-sm text-[#1D9629]">
        {option.estimated_delivery_date.day_name},{" "}
        <span className="font-bold">{option.estimated_delivery_date.month_day}</span>{" "}
        {option.delivery_type === "personal" ? "Estimated Pickup" : "Estimated Delivery"}
      </p>
    )}
    {cutoff && (
      <span className="mt-2 inline-flex items-start gap-1.5 rounded bg-[#ECEEFF] px-3 py-1 text-xs font-medium text-[#204AD7]">
        If You Order within <span className="font-bold">{cutoff}</span>
      </span>
    )}
  </>
);

export const ShippingConfirmationPage = () => {
  const router = useRouter();
  const { me, address, deliveryOption, cutoff, back, steps, onContinue, isSubmitting, isLoading } =
    useShippingConfirmation();

  return (
    <>
      <SecondaryNav onBack={back} isLoading={isSubmitting} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">Let&apos;s confirm your Delivery Info</h1>
          <p className="mt-1 text-text-muted">Choose your preferred shipping option</p>

          {isLoading ? (
            <div className="mt-6 flex justify-center py-16">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <Card
                  title="Patient Information"
                  onChange={() => router.push(`${ROUTES.PATIENT_INFO}?return=confirmation`)}
                >
                  <p className="text-text-muted">
                    {me?.first_name} {me?.last_name}
                  </p>
                  <p className="text-text-muted">{formatDob(me?.date_of_birth)}</p>
                  <p className="text-text-muted">{capitalize(me?.gender)}</p>
                  <p className="text-text-muted">{formatPhone(me?.mobile_phone ?? me?.home_phone)}</p>
                </Card>

                <Card
                  title="Shipping Information"
                  onChange={() => router.push(`${ROUTES.SHIPPING}?return=confirmation`)}
                >
                  {address && (
                    <>
                      <p className="text-text-muted">
                        {address.street_1}
                        {address.street_2 ? `, ${address.street_2}` : ""}
                      </p>
                      <p className="text-text-muted">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </>
                  )}
                </Card>

                {deliveryOption && (
                  <Card
                    title="Delivery Option"
                    onChange={() =>
                      router.push(`${ROUTES.SHIPPING}?return=confirmation&view=delivery`)
                    }
                  >
                    <DeliverySummary option={deliveryOption} cutoff={cutoff} />
                  </Card>
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
          )}
        </div>
      </main>
    </>
  );
};
