"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/Drawer";
import { AddressFields, AddressValidationStatus } from "@/types/shippingAddress";

interface Props {
  show: boolean;
  status: AddressValidationStatus;
  entered: AddressFields;
  suggested: AddressFields | null;
  onAcceptEntered: () => void;
  onAcceptSuggested: () => void;
  onReEnter: () => void;
  isSubmitting: boolean;
}

type CardBorder = "blue" | "red" | "default";

const line1 = (a: AddressFields) => `${a.street_1}${a.street_2 ? `, ${a.street_2}` : ""}`;
const line2 = (a: AddressFields) => `${a.city}, ${a.state} ${a.zip}`;

const AddressBox = ({
  heading,
  address,
  border,
  radio,
  selected,
  onSelect,
}: {
  heading: string;
  address: AddressFields;
  border: CardBorder;
  radio: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) => {
  const borderClass =
    border === "red"
      ? "border-[3px] border-coral"
      : border === "blue"
        ? "border-[3px] border-[#80abf1]"
        : "border-[3px] border-border-dropdown";

  const content = (
    <>
      {radio && (
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
            selected ? "border-[#80abf1]" : "border-border-dropdown",
          )}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#80abf1]" />}
        </span>
      )}
      <span>
        <span className="block font-semibold text-[#152e56]">{heading}</span>
        <span className="block text-text-primary">{line1(address)}</span>
        <span className="block text-text-primary">{line2(address)}</span>
      </span>
    </>
  );

  const base = cn("flex w-full items-start gap-3 rounded-xl bg-white px-5 py-4 text-left", borderClass);

  return onSelect ? (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={base}>
      {content}
    </button>
  ) : (
    <div className={base}>{content}</div>
  );
};

const CrossBullet = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
      ✕
    </span>
    <span className="text-text-primary">{children}</span>
  </li>
);

const Cta = ({
  label,
  variant,
  onClick,
  disabled,
}: {
  label: string;
  variant: "solid" | "outline";
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full cursor-pointer rounded-full py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors xs:text-base disabled:opacity-60",
      variant === "solid"
        ? "border border-primary bg-primary text-white hover:bg-primary-hover"
        : "border border-[#d1d1d1] bg-white text-primary hover:bg-bg-input",
    )}
  >
    {label}
  </button>
);

export const AddressCorrectionDrawer = (props: Props) => {
  const { show, onAcceptEntered, onAcceptSuggested, onReEnter, isSubmitting } = props;
  const [choice, setChoice] = useState<"entered" | "suggested">("suggested");

  // It stays mounted now (so the panel has a closed state to slide in from). On
  // each open, capture the content and reset the pick — both of which a remount
  // used to do for free — then keep showing that captured content while it slides
  // back out (the props snap to status "ok" the instant it's dismissed).
  const [wasOpen, setWasOpen] = useState(show);
  const [display, setDisplay] = useState<Pick<Props, "status" | "entered" | "suggested">>({
    status: props.status,
    entered: props.entered,
    suggested: props.suggested,
  });
  if (show !== wasOpen) {
    setWasOpen(show);
    if (show) {
      setChoice("suggested");
      setDisplay({ status: props.status, entered: props.entered, suggested: props.suggested });
    }
  }
  const { status, entered, suggested } = display;

  const confirmSuggestionChoice = () =>
    choice === "suggested" && suggested ? onAcceptSuggested() : onAcceptEntered();

  const reEnter: { label: string; variant: "solid" } = {
    label: status === "suggestion" ? "Re-enter address with apt/suite number" : "Re-enter address",
    variant: "solid",
  };

  return (
    <Drawer
      open={show}
      onClose={onReEnter}
      size="wide"
      ariaLabel="Verify shipping address"
      bodyClassName="flex flex-1 flex-col px-6 pb-8 min-[1040px]:px-10"
    >
          {status === "undeliverable" && (
            <>
              <h2 className="mb-6 text-2xl font-semibold leading-snug text-[#152e56]">
                Sorry, we can&apos;t find the address.
              </h2>
              <p className="mb-4 font-semibold text-[#152e56]">Sorry, we can&apos;t find the address.</p>
              <ul className="mb-6 flex flex-col gap-4">
                <CrossBullet>
                  For proper delivery of medication by the pharmacy and accurate address is required.
                </CrossBullet>
                <CrossBullet>Please include an apartment or a suite number is needed</CrossBullet>
              </ul>
              <AddressBox heading="Address entered" address={entered} border="blue" radio selected />
              <div className="mt-7 flex flex-col gap-8 max-md:mt-12">
                <Cta label={reEnter.label} variant="solid" onClick={onReEnter} disabled={isSubmitting} />
                <Cta
                  label="Continue with address"
                  variant="outline"
                  onClick={onAcceptEntered}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {status === "suggestion" && (
            <>
              <h2 className="mb-5 text-2xl font-semibold leading-snug text-[#152e56]">
                We show the address may have an apartment or a suit number. Is this correct?
              </h2>
              <p className="mb-5 text-text-primary">
                If you know the address doesn&apos;t have an apartment or site number then select one of the
                address below and press continue
              </p>
              <div className="flex flex-col gap-[22px]">
                <AddressBox
                  heading="Address entered"
                  address={entered}
                  border={choice === "entered" ? "blue" : "default"}
                  radio
                  selected={choice === "entered"}
                  onSelect={() => setChoice("entered")}
                />
                {suggested && (
                  <AddressBox
                    heading="Suggested Address"
                    address={suggested}
                    border={choice === "suggested" ? "blue" : "default"}
                    radio
                    selected={choice === "suggested"}
                    onSelect={() => setChoice("suggested")}
                  />
                )}
              </div>
              <div className="mt-7 flex flex-col gap-8 max-md:mt-12">
                <Cta label={reEnter.label} variant="solid" onClick={onReEnter} disabled={isSubmitting} />
                <Cta
                  label="Continue with selected address"
                  variant="outline"
                  onClick={confirmSuggestionChoice}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {(status === "unrecognized_secondary" || status === "missing_secondary") && (
            <>
              <h2 className="mb-6 text-2xl font-semibold leading-snug text-[#152e56]">
                {status === "unrecognized_secondary" ? (
                  <>
                    Your address is having <span className="text-coral">invalid apartment or a suite number</span>.
                    Is the below address correct?
                  </>
                ) : (
                  <>Your address maybe missing an apartment or a suite number. Is the below address correct?</>
                )}
              </h2>
              <AddressBox
                heading="Address entered"
                address={entered}
                border={status === "unrecognized_secondary" ? "red" : "default"}
                radio={false}
              />
              <div className="mt-7 flex flex-col gap-8 max-md:mt-12">
                <Cta
                  label="Yes, the address is correct"
                  variant="outline"
                  onClick={onAcceptEntered}
                  disabled={isSubmitting}
                />
                <Cta label="Re-enter address" variant="solid" onClick={onReEnter} disabled={isSubmitting} />
              </div>
            </>
          )}
    </Drawer>
  );
};
