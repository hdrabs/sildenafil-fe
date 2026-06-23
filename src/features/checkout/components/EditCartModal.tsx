"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { useActiveCart, useSetActiveCart } from "@/store";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useUpdateCartV2 } from "@/api/hooks/useCartQueries";
import { CartSummary } from "@/types/orderSummary";
import { CatalogPackage } from "@/types/catalog";

interface Props {
  show: boolean;
  cart: CartSummary;
  cartId: number;
  cartToken?: string;
  onSaved: () => void;
  onClose: () => void;
}

type Dropdown = "product" | "dosage" | "quantity";

const money = (n: number): string => `$${Number(n).toFixed(2)}`;
const titleCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

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

const Chevron = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={cn("h-5 w-5 text-text-primary transition-transform", up && "rotate-180")}>
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const Badge = ({ label }: { label: string }) => (
  <span className="ml-2 rounded-md bg-[#27ae60] px-2.5 py-0.5 text-xs font-medium text-white">
    {label}
  </span>
);

// A select with a button trigger + a panel of radio rows (matches the legacy
// "Edit Information" dropdowns).
const Select = ({
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
      className="flex w-full items-center justify-between rounded-xl border border-border-default bg-white px-5 py-4 text-left"
    >
      <span className="font-semibold text-text-primary">{value}</span>
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

export const EditCartModal = ({ show, cart, cartId, cartToken, onSaved, onClose }: Props) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const setActiveCart = useSetActiveCart();
  const update = useUpdateCartV2();

  const {
    variants,
    activeDrug,
    activeVariant,
    effectiveQty,
    isLoading,
    handleDrugChange,
    handleStrengthChange,
    handleQtyChange,
  } = useProductConfigurator({
    slug: cart.product_variant.slug,
    initialQty: cart.quantity,
    autoSelectPopular: false,
    // Show every dosage/variant (the landing-page gating hides 20mg otherwise).
    includeGated: true,
    discountCode: cart.discounts[0]?.code ?? undefined,
  });

  const [openDropdown, setOpenDropdown] = useState<Dropdown | null>(null);
  // null = derive from the cart's quantity; otherwise the user's explicit choice.
  const [customOverride, setCustomOverride] = useState<boolean | null>(null);
  const [customValue, setCustomValue] = useState(() => String(cart.quantity));

  const drugs = [...new Set(variants.map((v) => v.product.drug))];
  const dosages = [
    ...new Set(variants.filter((v) => v.product.drug === activeDrug).map((v) => v.product.dosage)),
  ];
  const packages: CatalogPackage[] = activeVariant?.packages ?? [];
  const packageQtys = packages.map((p) => p.quantity);
  // The catalog returns original_price === final_price, so derive the "regular"
  // price from the highest per-tablet rate (the smallest pack) to show the
  // strike-through + savings, the same way the landing page does.
  const regularRate = packages.length ? Math.max(...packages.map((p) => p.per_tablet)) : 0;

  const isCustom = customOverride ?? (packageQtys.length > 0 && !packageQtys.includes(cart.quantity));
  const extraFor = (qty: number) => packages.find((p) => p.quantity === qty)?.extra_tablets ?? 0;

  const toggle = (d: Dropdown) => setOpenDropdown((cur) => (cur === d ? null : d));

  const pickDrug = (drug: string) => {
    handleDrugChange(drug);
    setCustomOverride(false);
    setOpenDropdown(null);
  };
  const pickDosage = (dosage: string) => {
    handleStrengthChange(dosage);
    setCustomOverride(false);
    setOpenDropdown(null);
  };
  const pickQty = (qty: number) => {
    handleQtyChange(qty);
    setCustomOverride(false);
    setOpenDropdown(null);
  };

  const quantityLabel = () => {
    if (isCustom) return "Custom";
    if (effectiveQty <= 0) return "Select quantity";
    const extra = extraFor(effectiveQty);
    return `${effectiveQty} tablets${extra > 0 ? ` + Free ${extra}` : ""}`;
  };

  const finalQty = isCustom ? Number(customValue) : effectiveQty;
  // Per-slug floor — you can't order fewer than the variant's min_order_quantity.
  const minQty = activeVariant?.min_order_quantity ?? 1;
  const belowMin = Number.isFinite(finalQty) && finalQty < minQty;
  const canSave = !!activeVariant && Number.isFinite(finalQty) && finalQty >= minQty;

  const save = async () => {
    if (!canSave) return;

    const res = await update.mutateAsync({
      id: cartId,
      data: { slug: activeVariant.product.slug, quantity: finalQty, cart_token: cartToken },
    });

    if (activeCart) setActiveCart({ ...activeCart, cart: res.cart });
    if (res.redirect_path && res.redirect_path !== ROUTES.ORDER_VERIFICATION) {
      router.push(res.redirect_path);
      return;
    }
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
          <Select value={titleCase(activeDrug ?? "")} open={openDropdown === "product"} onToggle={() => toggle("product")}>
            {drugs.map((drug) => (
              <OptionRow key={drug} selected={drug === activeDrug} onSelect={() => pickDrug(drug)}>
                <span className="font-semibold text-text-primary">{titleCase(drug)}</span>
              </OptionRow>
            ))}
          </Select>

          <Select value={activeVariant?.product.dosage ?? ""} open={openDropdown === "dosage"} onToggle={() => toggle("dosage")}>
            {dosages.map((dosage) => (
              <OptionRow
                key={dosage}
                selected={dosage === activeVariant?.product.dosage}
                onSelect={() => pickDosage(dosage)}
              >
                <span className="font-semibold text-text-primary">{dosage}</span>
              </OptionRow>
            ))}
          </Select>

          <Select value={quantityLabel()} open={openDropdown === "quantity"} onToggle={() => toggle("quantity")}>
            {packages.map((pkg, i) => {
              const selected = !isCustom && pkg.quantity === effectiveQty;
              const regularPrice = pkg.quantity * regularRate;
              const hasDiscount = regularPrice > pkg.final_price + 0.01;
              const savePct = hasDiscount
                ? Math.round(((regularPrice - pkg.final_price) / regularPrice) * 100)
                : 0;
              return (
                <OptionRow key={pkg.quantity} selected={selected} onSelect={() => pickQty(pkg.quantity)}>
                  <span className="flex-1">
                    <span className="font-semibold text-text-primary">
                      {pkg.quantity} tablets
                      {pkg.extra_tablets > 0 && (
                        <span className="text-[#1D9629]"> + Free {pkg.extra_tablets}</span>
                      )}
                    </span>
                    {pkg.is_popular && <Badge label="Popular" />}
                    {i === packages.length - 1 && <Badge label="Best Value" />}
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold text-text-primary">
                      {hasDiscount && (
                        <span className="mr-1 text-sm font-normal text-text-muted line-through">
                          {money(regularPrice)}
                        </span>
                      )}
                      {money(pkg.final_price)}
                    </span>
                    {savePct > 0 && (
                      <span className="block text-xs font-medium text-[#1D9629]">
                        You save {savePct}%
                      </span>
                    )}
                  </span>
                </OptionRow>
              );
            })}

            <OptionRow
              selected={isCustom}
              onSelect={() => {
                setCustomOverride(true);
                setOpenDropdown(null);
              }}
            >
              <span className="font-semibold text-text-primary">Custom Quantity</span>
            </OptionRow>
          </Select>

          {isCustom && (
            <label className="block">
              <span className="mb-1.5 block text-sm text-text-muted">Enter Custom Quantity</span>
              <input
                type="number"
                min={minQty}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className={cn(
                  "h-12 w-full rounded-xl border bg-white px-5 text-base text-text-primary outline-none",
                  belowMin ? "border-[#e05c4b]" : "border-border-default focus:border-primary-blue",
                )}
              />
              {belowMin && (
                <span className="mt-1 block text-xs text-[#e05c4b]">
                  Minimum quantity for this option is {minQty}.
                </span>
              )}
            </label>
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
