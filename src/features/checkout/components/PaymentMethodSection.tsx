"use client";

import { useState } from "react";
import dayjs from "dayjs";
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

// AUM: a card is expired once its YYYY-MM month is in the past. Masked ("XXXX")
// or unparseable expiries are treated as not-expired.
const isCardExpired = (exp: string): boolean =>
  /^\d{4}-\d{2}$/.test(exp ?? "") && !dayjs().isBefore(exp, "month");

const ChevronIcon = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={cn("h-5 w-5 transition-transform", up && "rotate-180")}>
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// AUM shows a check on every row: green for the selected/default card, grey otherwise.
const CheckIcon = ({ green }: { green: boolean }) => (
  <Image
    src={green ? "/icons/cards/check-green.svg" : "/icons/cards/check-grey.svg"}
    alt=""
    width={16}
    height={11}
    className="shrink-0"
  />
);

const CardLabel = ({ card }: { card: CreditCard }) => {
  // AUM: an expired card fades its badge + number to 30%.
  const expired = isCardExpired(card.expiration_date);
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      {/* AUM .card-img: fixed 32×19 box, badge contained. */}
      <span className={cn("flex h-[19px] w-8 shrink-0 items-center justify-center", expired && "opacity-30")}>
        <Image src={cardBadge(card.card_type)} alt="" width={32} height={19} unoptimized className="h-full w-full object-contain" />
      </span>
      <span className={cn("text-sm tracking-wide text-text-primary", expired && "opacity-30")}>
        {card.card_number}
      </span>
    </span>
  );
};

const AddCardLabel = () => (
  <span className="flex items-center gap-2.5">
    <Image src="/icons/cards/add-card.svg" alt="" width={30} height={20} className="shrink-0" />
    <span className="text-sm text-text-primary">Add Payment Method</span>
  </span>
);

// Expired → "expired" in red (full opacity); otherwise the date faded to 50% (AUM).
const Expiry = ({ value }: { value: string }) =>
  isCardExpired(value) ? (
    <span className="text-sm text-[#ff0000]">expired</span>
  ) : (
    <span className="text-sm text-text-primary opacity-50">{formatExpiry(value)}</span>
  );

interface Props {
  cards: CreditCard[];
  defaultCardId: string | null;
  onSelect: (paymentProfileId: string) => void;
  isSelecting: boolean;
  completeOrder: (opts?: { cardJustAdded?: boolean }) => void;
  isCompleting: boolean;
  hasSelectedCard: boolean;
  // Order-completion failure (distinct from the card-save error). Optional: callers
  // that surface it another way (e.g. the order-pay page toasts) leave it unset.
  completeError?: string | null;
  // While the saved-cards query is still loading, show a skeleton instead of the
  // add-card form — an empty `cards` list otherwise looks like the user's cards were lost.
  isLoadingCards?: boolean;
}

export const PaymentMethodSection = ({
  cards,
  defaultCardId,
  onSelect,
  isSelecting,
  completeOrder,
  isCompleting,
  hasSelectedCard,
  completeError,
  isLoadingCards,
}: Props) => {
  const hasCards = cards.length > 0;
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);

  // Adding a card and completing are one action: "Complete My Order" submits this
  // form, which tokenizes + saves the card, then completes via onSuccess. The card is
  // already the backend default at this point, so flag it so completion doesn't gate
  // on the not-yet-refetched client card list.
  const { form, submit, isLoading: isAddingCard, error: cardError } = useAddCreditCardForm({
    onSuccess: () => {
      // Card is saved now; clear "adding" so a failed completion reverts to the
      // dropdown (with the new card selected) and a retry completes instead of
      // re-adding the card. The form stays visible through completion via `processing`.
      setAdding(false);
      return completeOrder({ cardJustAdded: true });
    },
    apiVersion: "v2",
  });

  const selectedCard = cards.find((c) => c.payment_profile_id === defaultCardId) ?? cards[0] ?? null;
  const processing = isCompleting || isAddingCard;
  // Keep the add-card form up for the whole add → complete flow. Once the card saves,
  // the list refetches and (for a first card) `hasCards` flips true, which would swap
  // the form out for the freshly-populated dropdown mid-submit — a confusing flicker
  // while the button still reads "Processing…". Hold the form until completion, which
  // then redirects away.
  const showForm = adding || !hasCards || processing;

  return (
    <div>
      <h2 className="mb-6 text-[20px] font-bold text-text-primary">Payment Method</h2>

      <div className="flex flex-wrap items-center gap-1.5">
        {BRANDS.map((b) => (
          <Image
            key={b}
            src={`/icons/cards/badges/${b}.svg`}
            alt={b}
            width={30}
            height={20}
            unoptimized
            className="h-5 w-auto max-[360px]:h-[18px]"
          />
        ))}
      </div>

      {isLoadingCards ? (
        // Saved cards still loading: skeleton, not the add-card form (an empty `cards`
        // list would render the form and read as "your cards were lost").
        <div className="mt-4 animate-pulse space-y-4" aria-hidden="true">
          <div className="h-[46px] w-full rounded-[5px] bg-[#eef1f5]" />
          <div className="h-[50px] w-full rounded-full bg-[#eef1f5]" />
        </div>
      ) : (
        <>
      {/* The selector: its options are the saved cards + "Add Payment Method".
          The header shows the current choice; switching back to a saved card is
          done from this dropdown (no separate link). Hidden while processing so a
          just-added card doesn't flash into the list mid-submit — the form stays up
          with "Processing…" until completion redirects. */}
      {hasCards && selectedCard && !processing && (
        <div className="relative mt-4">
          {/* Header — the bordered "selected card" box (AUM .selected-card); hover
              turns the border blue. The list overlays the content below it. */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 rounded-[5px] border border-[#ced5e1] bg-white px-[18px] py-3 transition-colors hover:border-[#0c9ced] focus-visible:border-[#0c9ced] focus-visible:outline-none"
          >
            {adding ? <AddCardLabel /> : <CardLabel card={selectedCard} />}
            <span className="flex items-center gap-3">
              {!adding && <Expiry value={selectedCard.expiration_date} />}
              <span className="text-[#262a32]">
                <ChevronIcon up={open} />
              </span>
            </span>
          </button>

          {open && (
            <ul className="absolute inset-x-0 top-full z-[300] mt-1 max-h-40 w-full overflow-y-auto border border-[#ced5e1] bg-white">
              {cards.map((card) => {
                const selected = !adding && card.payment_profile_id === defaultCardId;
                return (
                  <li key={card.payment_profile_id}>
                    <button
                      type="button"
                      disabled={isSelecting}
                      onClick={() => {
                        onSelect(card.payment_profile_id);
                        setAdding(false);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-[18px] py-3 text-left transition-colors disabled:opacity-60",
                        selected ? "bg-[#f3f3f3]" : "bg-white hover:bg-[#e7f3f8]",
                      )}
                    >
                      <CardLabel card={card} />
                      <span className="flex items-center gap-3">
                        <Expiry value={card.expiration_date} />
                        <CheckIcon green={selected} />
                      </span>
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(true);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 bg-white px-[18px] py-3 text-left transition-colors hover:bg-[#e7f3f8]"
                >
                  <AddCardLabel />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}

      {showForm && <AddCardForm formId={CARD_FORM_ID} form={form} onSubmit={submit} error={cardError} />}

      {completeError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-text-error">{completeError}</p>
      )}

      <button
        type={showForm ? "submit" : "button"}
        form={showForm ? CARD_FORM_ID : undefined}
        onClick={showForm ? undefined : () => completeOrder()}
        disabled={processing || (!showForm && !hasSelectedCard)}
        className="mt-6 w-full cursor-pointer rounded-full bg-coral py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {processing ? "Processing…" : "Complete my order"}
      </button>
        </>
      )}

      <p className="mt-[15px] flex items-center justify-center gap-[5px] text-xs font-normal uppercase tracking-wide text-black">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="#c1c6c9" aria-hidden="true">
          <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
        </svg>
        128-Bit TLS Security
      </p>
    </div>
  );
};
