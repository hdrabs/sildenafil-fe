"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/Skeleton";
import { toast } from "react-toastify";
import {
  useCreditCardsV2,
  useSetDefaultCardV2,
  useDeleteCreditCardV2,
} from "@/api/hooks/useCreditCardQueries";
import { useShippingAddressesV2 } from "@/api/hooks/useShippingAddressQueries";
import { useAddCreditCardForm } from "@/features/payments/hooks/useAddCreditCardForm";
import { AddCardForm } from "@/features/payments/components/AddCardForm";
import { NoShippingAddressModal } from "@/components/modals/NoShippingAddressModal";
import { CreditCard } from "@/types/creditCard";

// AUM `.account-card.padded`: white, 12px radius, 30px pad (15px sides on mobile).
const ACCOUNT_CARD =
  "rounded-xl bg-bg-card p-[30px] shadow-[0px_0px_20px_rgba(128,148,178,0.2)] max-[768px]:px-[15px]";

const CARD_ICON: Record<string, string> = {
  visa:             "/icons/cards/visa.svg",
  mastercard:       "/icons/cards/mastercard.svg",
  americanexpress:  "/icons/cards/amex.svg",
  amex:             "/icons/cards/amex.svg",
  discover:         "/icons/cards/discover.svg",
};

export const PaymentHistoryPage = () => {
  const { data, isLoading }             = useCreditCardsV2();
  const { data: addresses }             = useShippingAddressesV2();
  const setDefault                      = useSetDefaultCardV2();
  const deleteCard                      = useDeleteCreditCardV2();
  const [modalOpen, setModalOpen]       = useState(false);
  const [noAddressModal, setNoAddressModal] = useState(false);

  const cards     = data?.credit_cards ?? [];
  const defaultId = data?.default_payment_profile_id;
  // The v2 index already returns only active addresses.
  const hasAddress = (addresses ?? []).length > 0;

  // Default card first, mirroring AUM's layout.
  const ordered = [...cards].sort(
    (a, b) =>
      Number(b.payment_profile_id === defaultId) -
      Number(a.payment_profile_id === defaultId),
  );

  const handleDelete = (card: CreditCard) =>
    deleteCard.mutate(card.payment_profile_id, {
      onError: (err) =>
        toast.error((err as { message?: string })?.message ?? "Couldn't remove this card."),
    });

  const handleAddCard = () => {
    if (!hasAddress) {
      setNoAddressModal(true);
    } else {
      setModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className={`${ACCOUNT_CARD} flex flex-col gap-4`}>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <EmptyState
          illustrationSrc="/illustrations/payment-options.svg"
          title="Payment Options"
          description="Your secure payment hub. Update and manage your payment methods in this section."
          ctaLabel="Add Card"
          onCtaClick={handleAddCard}
        />
        <AddCardModal open={modalOpen} onClose={() => setModalOpen(false)} />
        <NoShippingAddressModal open={noAddressModal} onClose={() => setNoAddressModal(false)} />
      </>
    );
  }

  return (
    <div className={ACCOUNT_CARD}>
      <div className="flex flex-col gap-[30px]">
        {ordered.map((card) => (
          <CardItem
            key={card.payment_profile_id}
            card={card}
            isDefault={card.payment_profile_id === defaultId}
            onSetDefault={() => setDefault.mutate(card.payment_profile_id)}
            onDelete={() => handleDelete(card)}
            isSettingDefault={setDefault.isPending}
            isDeleting={deleteCard.isPending && deleteCard.variables === card.payment_profile_id}
          />
        ))}
      </div>

      <div className="mt-[30px]">
        <button
          onClick={handleAddCard}
          className="rounded-full bg-coral px-5 py-[7px] text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-coral-hover"
        >
          Add card
        </button>
      </div>

      <AddCardModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <NoShippingAddressModal open={noAddressModal} onClose={() => setNoAddressModal(false)} />
    </div>
  );
};

/* ── Card item ── */

const CardItem = ({
  card,
  isDefault,
  onSetDefault,
  onDelete,
  isSettingDefault,
  isDeleting,
}: {
  card: CreditCard;
  isDefault: boolean;
  onSetDefault: () => void;
  onDelete: () => void;
  isSettingDefault: boolean;
  isDeleting: boolean;
}) => {
  const typeKey = card.card_type?.toLowerCase().replace(/\s/g, "") ?? "";
  const iconSrc = CARD_ICON[typeKey];
  // card_number comes masked from Authorize.Net as "XXXX1111" — grab last 4 chars
  const lastFour = card.card_number?.slice(-4) ?? "????";

  // AUM "ghost dark small": grey outline pill that inverts to grey on hover.
  const actionPill =
    "h-8 rounded-full border border-ghost-dark px-5 text-xs font-medium uppercase text-ghost-dark transition-colors hover:bg-ghost-dark hover:text-white disabled:opacity-50";

  return (
    <div>
      {/* Header — self-contained bordered box; blue when default (AUM __header) */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-md border border-border-tile px-[15px] py-3",
          isDefault ? "bg-primary text-white" : "bg-bg-tile text-text-primary",
        )}
      >
        <span className="text-sm tracking-wide">xxxx - xxxx - xxxx - {lastFour}</span>
        <span className="min-w-[180px] text-sm">
          {card.first_name} {card.last_name}
        </span>
        <span className="text-sm">{card.expiration_date}</span>
        {/* Badge — bare 32×19 logo; white box only on the blue default header */}
        <span
          className={cn(
            "flex h-[19px] w-8 shrink-0 items-center justify-center",
            isDefault && "rounded-[3px] bg-white",
          )}
        >
          {iconSrc ? (
            // h-full w-full → both axes sized by the 32×19 box, so the ratio stays
            // declared (no next/image aspect-ratio warning); object-contain letterboxes.
            <Image src={iconSrc} alt={card.card_type} width={32} height={19} className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] font-bold text-text-muted">{card.card_type}</span>
          )}
        </span>
      </div>

      {/* Body — borderless actions row below the header (AUM __body) */}
      <div className="flex items-center justify-between pt-[15px]">
        {isDefault ? (
          <span className="ml-[10px] text-xs text-text-faint">Default card</span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {!isDefault && (
            <button onClick={onSetDefault} disabled={isSettingDefault} className={actionPill}>
              Set as Default
            </button>
          )}
          <button onClick={onDelete} disabled={isDeleting} className={actionPill}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Add card modal ── */
// Reuses the shared AddCardForm (compact AUM card fields + Accept.js + per-field
// errors); the modal supplies the red full-width "Save Card" submit (AUM).
const AddCardModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { form, submit, isLoading, error } = useAddCreditCardForm({
    onSuccess: onClose,
    apiVersion: "v2",
  });

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="max-w-[550px]">
      <AddCardForm formId="account-add-card" form={form} onSubmit={submit} error={error} />
      <button
        type="submit"
        form="account-add-card"
        disabled={isLoading}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-coral text-sm font-bold uppercase text-white transition-colors hover:bg-coral-hover disabled:opacity-60"
      >
        {isLoading && <Spinner size="sm" />}
        Save Card
      </button>
    </Modal>
  );
};
