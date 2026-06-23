"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AddCardForm } from "@/features/payments/components/AddCardForm";
import { useAddCreditCardForm } from "@/features/payments/hooks/useAddCreditCardForm";
import { CreditCard } from "@/types/creditCard";

const CARD_FORM_ID = "checkout-card-form";

// Brand strip shown above the payment inputs (order matches the design).
const BRANDS = ["amex", "mastercard", "visa", "discover", "diners", "jcb", "fsa", "hsa"];

const BADGE_FOR_TYPE: Record<string, string> = {
  visa: "visa",
  mastercard: "mastercard",
  americanexpress: "amex",
  amex: "amex",
  discover: "discover",
  jcb: "jcb",
  dinersclub: "diners",
  diners: "diners",
};

const cardBadge = (cardType: string): string => {
  const key = cardType?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  return `/icons/cards/badges/${BADGE_FOR_TYPE[key] ?? "visa"}.svg`;
};

// "YYYY-MM" → "MM/YYYY" (Authorize.net masks unknown expiries as "XXXX").
const formatExpiry = (exp: string): string => {
  const m = exp?.match(/^(\d{4})-(\d{2})$/);
  return m ? `${m[2]}/${m[1]}` : exp;
};

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={cn("h-5 w-5 transition-transform", up && "rotate-180")}>
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const CardOutlineIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-9 shrink-0 text-text-muted">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[#1D9629]">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 011.4-1.4l2.8 2.79 6.8-6.79a1 1 0 011.4 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CardLabel = ({ card }: { card: CreditCard }) => (
  <span className="flex min-w-0 items-center gap-3">
    <Image src={cardBadge(card.card_type)} alt="" width={36} height={24} unoptimized className="h-6 w-auto" />
    <span className="font-medium tracking-wide text-text-primary">{card.card_number}</span>
  </span>
);

const AddCardLabel = () => (
  <span className="flex items-center gap-3">
    <CardOutlineIcon />
    <span className="font-medium text-text-primary">Add Payment Method</span>
  </span>
);

// Fixed-width trailing slot so the expiry column stays aligned across the
// header and every row (whether or not a check is shown).
const IconSlot = ({ children }: { children?: React.ReactNode }) => (
  <span className="flex h-5 w-5 items-center justify-center">{children}</span>
);

interface Props {
  cards: CreditCard[];
  defaultCardId: string | null;
  onSelect: (paymentProfileId: string) => void;
  isSelecting: boolean;
  completeOrder: () => void;
  isCompleting: boolean;
  hasSelectedCard: boolean;
}

export const PaymentMethodSection = ({
  cards,
  defaultCardId,
  onSelect,
  isSelecting,
  completeOrder,
  isCompleting,
  hasSelectedCard,
}: Props) => {
  const hasCards = cards.length > 0;
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const showForm = adding || !hasCards;

  // Adding a card and completing are one action: "Complete My Order" submits this
  // form, which tokenizes + saves the card, then completes via onSuccess.
  const { form, submit, isLoading: isAddingCard, error: cardError } = useAddCreditCardForm({
    onSuccess: completeOrder,
    apiVersion: "v2",
  });

  const selectedCard = cards.find((c) => c.payment_profile_id === defaultCardId) ?? cards[0] ?? null;
  const processing = isCompleting || isAddingCard;

  return (
    <div>
      <h2 className="text-lg font-bold text-text-primary">Payment Method</h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {BRANDS.map((b) => (
          <Image
            key={b}
            src={`/icons/cards/badges/${b}.svg`}
            alt={b}
            width={40}
            height={28}
            unoptimized
            className="h-7 w-auto"
          />
        ))}
      </div>

      {/* The selector: its options are the saved cards + "Add Payment Method".
          The header shows the current choice; switching back to a saved card is
          done from this dropdown (no separate link). */}
      {hasCards && selectedCard && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-border-default bg-white px-4 py-3"
          >
            {adding ? <AddCardLabel /> : <CardLabel card={selectedCard} />}
            <span className="flex items-center gap-3 text-text-muted">
              {!adding && formatExpiry(selectedCard.expiration_date)}
              <ChevronIcon up={open} />
            </span>
          </button>

          {open && (
            <div className="mt-1 overflow-hidden rounded-lg border border-border-default">
              {cards.map((card) => {
                const selected = !adding && card.payment_profile_id === defaultCardId;
                return (
                  <button
                    key={card.payment_profile_id}
                    type="button"
                    disabled={isSelecting}
                    onClick={() => {
                      onSelect(card.payment_profile_id);
                      setAdding(false);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 bg-bg-input/40 px-4 py-3 text-left hover:bg-bg-input disabled:opacity-60"
                  >
                    <CardLabel card={card} />
                    <span className="flex items-center gap-3 text-text-muted">
                      {formatExpiry(card.expiration_date)}
                      <IconSlot>{selected && <CheckIcon />}</IconSlot>
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setAdding(true);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 border-t border-border-default bg-white px-4 py-3 text-left hover:bg-bg-input/40"
              >
                <AddCardLabel />
                <IconSlot>{adding && <CheckIcon />}</IconSlot>
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && <AddCardForm formId={CARD_FORM_ID} form={form} onSubmit={submit} error={cardError} />}

      <button
        type={showForm ? "submit" : "button"}
        form={showForm ? CARD_FORM_ID : undefined}
        onClick={showForm ? undefined : completeOrder}
        disabled={processing || (!showForm && !hasSelectedCard)}
        className="mt-6 w-full cursor-pointer rounded-full bg-[#e05c4b] py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {processing ? "Processing…" : "Complete my order"}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide text-text-muted">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
        </svg>
        128-Bit TLS Security
      </p>
    </div>
  );
};
