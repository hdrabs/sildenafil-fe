"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useUpdateOrderCart } from "@/api/hooks/useOrderQueries";
import { CartSummary } from "@/types/orderSummary";

interface Props {
  show: boolean;
  orderId: number;
  cart: CartSummary;
  onSaved: () => void;
  onClose: () => void;
}

const titleCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const Chevron = ({ up, muted = false }: { up: boolean; muted?: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={cn("h-5 w-5 transition-transform", muted ? "text-text-muted" : "text-text-primary", up && "rotate-180")}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const Radio = ({ selected }: { selected: boolean }) => (
  <span
    className={cn(
      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
      selected ? "border-[#e05c4b]" : "border-[#C5D4DC]",
    )}
  >
    {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#e05c4b]" />}
  </span>
);

// Drug + dosage are doctor-approved here, so they render as disabled (grey) fields.
const LockedField = ({ value }: { value: string }) => (
  <div className="flex w-full items-center justify-between rounded-xl bg-[#f1f3f5] px-5 py-4">
    <span className="text-text-primary">{value}</span>
    <Chevron up={false} muted />
  </div>
);

const QtySelect = ({
  value,
  open,
  onToggle,
  children,
}: {
  value: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl border border-primary-blue bg-white px-5 py-4 text-left"
    >
      <span className="text-text-primary">{value}</span>
      <Chevron up={open} />
    </button>
    {open && (
      <div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-border-default bg-white py-1 shadow-lg">
        {children}
      </div>
    )}
  </div>
);

const OptionRow = ({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onSelect();
    }}
    className="flex w-full items-center gap-3 border-b border-border-default px-5 py-3.5 text-left last:border-b-0 hover:bg-bg-input/40"
  >
    <Radio selected={selected} />
    {children}
  </button>
);

export const OrderEditCartModal = ({ show, orderId, cart, onSaved, onClose }: Props) => {
  const update = useUpdateOrderCart(orderId);
  const { variants, activeVariant, contextVariant, isLoading } = useProductConfigurator({
    slug: cart.product_variant.slug,
    initialQty: cart.quantity,
    autoSelectPopular: false,
    includeGated: true,
  });

  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState<number>(cart.quantity);
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState(String(cart.quantity));

  // Resolve the cart's own (doctor-approved) dosage variant for its quantity packages,
  // falling back to the configurator's resolved/context variant.
  const cartVariant =
    variants.find((variant) => variant.product.dosage === cart.product_variant.dosage) ??
    activeVariant ??
    contextVariant;
  const packages = cartVariant?.packages ?? [];
  const minQty = cart.product_variant.min_order_quantity;
  const maxQty = cart.max_quantity;
  const finalQty = custom ? Number(customValue) : qty;
  const aboveMax = maxQty != null && Number.isFinite(finalQty) && finalQty > maxQty;
  const belowMin = Number.isFinite(finalQty) && finalQty < minQty;
  const canSave = !aboveMax && !belowMin && Number.isFinite(finalQty);

  const save = async () => {
    if (!canSave) return;
    await update.mutateAsync({ cartId: cart.id, quantity: finalQty });
    onSaved();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title="Edit Information" size="xl">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <LockedField value={titleCase(cart.product_variant.product.drug)} />
          <LockedField value={cart.product_variant.dosage} />

          <QtySelect
            value={custom ? "Custom" : `${qty} tablets`}
            open={open}
            onToggle={() => setOpen((o) => !o)}
          >
            {packages.map((pkg) => (
              <OptionRow
                key={pkg.quantity}
                selected={!custom && pkg.quantity === qty}
                onSelect={() => {
                  setQty(pkg.quantity);
                  setCustom(false);
                  setOpen(false);
                }}
              >
                <span className="font-semibold text-text-primary">
                  {pkg.quantity} tablets
                  {pkg.extra_tablets > 0 && <span className="text-[#1D9629]"> + Free {pkg.extra_tablets}</span>}
                </span>
              </OptionRow>
            ))}
            <OptionRow
              selected={custom}
              onSelect={() => {
                setCustom(true);
                setOpen(false);
              }}
            >
              <span className="font-semibold text-text-primary">Custom Quantity</span>
            </OptionRow>
          </QtySelect>

          {custom && (
            <input
              type="number"
              min={minQty}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="h-12 w-full rounded-xl border border-border-default bg-white px-5 text-base text-text-primary outline-none focus:border-primary-blue"
            />
          )}

          {aboveMax && maxQty != null && (
            <div className="rounded-xl border border-[#e05c4b] bg-[#FBEDEB] px-4 py-3 text-sm text-[#e05c4b]">
              The maximum quantity allowed by your prescription is {maxQty} tablets
            </div>
          )}
          {belowMin && !aboveMax && (
            <div className="rounded-xl border border-[#e05c4b] bg-[#FBEDEB] px-4 py-3 text-sm text-[#e05c4b]">
              The minimum quantity for this item is {minQty} tablets.
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={save}
              disabled={update.isPending || !canSave}
              className="cursor-pointer rounded-full bg-[#e05c4b] px-10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save now
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
