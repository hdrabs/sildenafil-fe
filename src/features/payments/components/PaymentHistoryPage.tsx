"use client";

import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
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
import { NoShippingAddressModal } from "@/components/modals/NoShippingAddressModal";
import { CreditCard } from "@/types/creditCard";

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
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);

  const cards     = data?.credit_cards ?? [];
  const defaultId = data?.default_payment_profile_id;
  // The v2 index already returns only active addresses.
  const hasAddress = (addresses ?? []).length > 0;

  const handleConfirmDelete = () => {
    if (!cardToDelete) return;
    deleteCard.mutate(cardToDelete.payment_profile_id, {
      onSuccess: () => setCardToDelete(null),
      onError: (err) =>
        toast.error((err as { message?: string })?.message ?? "Couldn't remove this card."),
    });
  };

  const handleAddCard = () => {
    if (!hasAddress) {
      setNoAddressModal(true);
    } else {
      setModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-default bg-bg-card p-6 flex flex-col gap-4">
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
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Payment Options</h1>
        <p className="mt-1 text-sm text-text-muted">View and manage your payment methods.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {cards.map((card) => (
          <CardItem
            key={card.payment_profile_id}
            card={card}
            isDefault={card.payment_profile_id === defaultId}
            onSetDefault={() => setDefault.mutate(card.payment_profile_id)}
            onDelete={() => setCardToDelete(card)}
            isSettingDefault={setDefault.isPending}
            isDeleting={deleteCard.isPending && cardToDelete?.payment_profile_id === card.payment_profile_id}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddCard}
          className="flex items-center gap-1.5 h-9 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <RiAddLine className="h-4 w-4" />
          Add Card
        </button>
      </div>

      <AddCardModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <NoShippingAddressModal open={noAddressModal} onClose={() => setNoAddressModal(false)} />

      <Modal isOpen={!!cardToDelete} onClose={() => setCardToDelete(null)} title="Remove card?" size="sm">
        <p className="text-sm text-text-muted">
          This payment method will be permanently removed from your account.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setCardToDelete(null)}
            className="h-10 rounded-full border border-border-input px-5 text-sm font-medium text-text-primary hover:bg-bg-input transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deleteCard.isPending}
            className="h-10 rounded-full bg-[#e05c4b] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {deleteCard.isPending ? "Removing…" : "Remove"}
          </button>
        </div>
      </Modal>
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

  return (
    <div className="rounded-xl border border-border-default overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between gap-4 px-5 py-4 ${
          isDefault ? "bg-primary text-white" : "bg-bg-main text-text-primary"
        }`}
      >
        {/* Left — card number + cardholder name */}
        <div className="flex items-center gap-6 min-w-0 flex-wrap">
          <p className="text-sm font-medium tracking-wide">
            xxxx - xxxx - xxxx - {lastFour}
          </p>
          <p className="text-sm font-bold opacity-90">
            {card.first_name} {card.last_name}
          </p>
        </div>

        {/* Right — expiry + brand icon */}
        <div className="flex items-center gap-4 shrink-0">
          <p className="text-sm opacity-80">{card.expiration_date}</p>
          <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white overflow-hidden">
            {iconSrc ? (
              <Image src={iconSrc} alt={card.card_type} width={44} height={28} className="object-contain" />
            ) : (
              <span className="text-xs font-bold text-gray-500">{card.card_type}</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center justify-between px-5 py-3 bg-bg-card border-t border-border-default">
        {isDefault ? (
          <span className="text-xs font-medium text-text-muted">Default card</span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          {!isDefault && (
            <button
              onClick={onSetDefault}
              disabled={isSettingDefault}
              className="h-8 rounded-full border border-border-input px-4 text-xs font-medium text-text-primary hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              Set as Default
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="h-8 rounded-full border border-border-input px-4 text-xs font-medium text-text-primary hover:border-red-300 hover:text-text-error transition-colors disabled:opacity-50"
          >
            <RiDeleteBinLine className="inline h-3.5 w-3.5 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Add card modal ── */

const ACCEPT_JS_URL =
  process.env.NEXT_PUBLIC_ANET_ENV === "production"
    ? "https://js.authorize.net/v1/Accept.js"
    : "https://jstest.authorize.net/v1/Accept.js";

const AddCardModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { form, submit, isLoading, error } = useAddCreditCardForm({ onSuccess: onClose, apiVersion: "v2" });
  const { register, control, formState: { errors } } = form;

  // Load Accept.js when the modal opens
  useEffect(() => {
    if (!open) return;
    if (document.querySelector(`script[src="${ACCEPT_JS_URL}"]`)) return;
    const script = document.createElement("script");
    script.src = ACCEPT_JS_URL;
    script.async = true;
    document.head.appendChild(script);
  }, [open]);

  return (
    <Modal isOpen={open} onClose={onClose} title="Add Payment Method" size="lg">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Billing name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register("first_name")}
            error={errors.first_name?.message}
            autoComplete="cc-given-name"
          />
          <Input
            label="Last Name"
            {...register("last_name")}
            error={errors.last_name?.message}
            autoComplete="cc-family-name"
          />
        </div>

        {/* Card number with spacing mask */}
        <Controller
          name="card_number"
          control={control}
          render={({ field }) => (
            <Input
              label="Card Number"
              {...field}
              error={errors.card_number?.message}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
                field.onChange(formatted);
              }}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry MM/YY */}
          <Controller
            name="expiration_date"
            control={control}
            render={({ field }) => (
              <Input
                label="Expiry (MM/YY)"
                {...field}
                error={errors.expiration_date?.message}
                placeholder="12/27"
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted = digits.length > 2
                    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                    : digits;
                  field.onChange(formatted);
                }}
              />
            )}
          />

          <Input
            label="CVV"
            {...register("card_code")}
            error={errors.card_code?.message}
            placeholder="123"
            inputMode="numeric"
            autoComplete="cc-csc"
            maxLength={4}
          />
        </div>

        {/* Billing ZIP */}
        <Input
          label="Billing ZIP Code"
          {...register("zip")}
          error={errors.zip?.message}
          placeholder="90210"
          inputMode="numeric"
          maxLength={5}
          autoComplete="postal-code"
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-text-error">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-border-input px-5 text-sm font-medium text-text-primary hover:bg-bg-input transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isLoading && <Spinner size="sm" />}
            Add Card
          </button>
        </div>
      </form>
    </Modal>
  );
};
