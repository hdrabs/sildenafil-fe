"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CartSummary, CartSummaryDiscount } from "@/types/orderSummary";
import { DeliveryOption } from "@/types/delivery";
import { DeliveryOptionDetails } from "@/features/checkout/components/shipping/DeliveryOptionDetails";

export const money = (n: number): string => `$${Number(n).toFixed(2)}`;

const bottleSrc = (drug: string): string =>
  drug === "tadalafil"
    ? "/images/products/tadalafil-bottle.png"
    : "/images/products/sildenafil-bottle.png";

// AUM's "Sildenafil 25mg (Generic Viagra)": simple drug name + dosage value (no
// space before "mg") and the generic brand as a separate part so the brand can
// drop cleanly onto its own line on mobile (AUM stacks it at ≤991px).
const productNameParts = (cart: CartSummary): { main: string; brand: string } => {
  const drug = cart.product_variant.product.drug;
  const name = drug.charAt(0).toUpperCase() + drug.slice(1);
  const brand = drug === "tadalafil" ? "Generic Cialis" : "Generic Viagra";
  return { main: `${name} ${cart.product_variant.dosage_value}mg`, brand: `(${brand})` };
};

export const Divider = () => <div className="my-5 border-t border-border-default" />;

const TagIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"
      stroke="#1b53af"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="7.5" cy="7.5" r="1.4" fill="#1b53af" />
  </svg>
);

// AUM "free-box": fixed 49×24 green pill; otherwise a bold price.
export const FreeOrPrice = ({ value }: { value: number | null }) =>
  Number(value) ? (
    <span className="shrink-0 text-[16px] font-semibold text-text-primary">{money(Number(value))}</span>
  ) : (
    <span className="flex h-6 w-[49px] shrink-0 items-center justify-center rounded-[5px] bg-[#27ae60] text-xs font-semibold text-white">
      Free
    </span>
  );

export const NoSubscriptionBanner = () => (
  <div className="mt-3 flex items-center justify-center rounded-[5px] bg-bg-main px-[16px] py-[10px] text-[11px] text-primary">
    No Subscription. One time charge only.
  </div>
);

// Product row (bottle, name with brand, qty, Edit, price) + the prescription
// "tablets available" note.
export const ProductLineItem = ({
  cart,
  onEdit,
  price,
}: {
  cart: CartSummary;
  onEdit: () => void;
  /** Amount shown on the right — checkout shows cart.price, the pay flow final_price. */
  price: number;
}) => {
  const product = productNameParts(cart);
  return (
    <>
      <div className="flex items-start gap-4 max-[436px]:gap-3">
        <div className="flex h-20 w-[65px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#c5d4dc] bg-white max-[375px]:h-[60px] max-[375px]:w-[45px]">
          <Image
            src={bottleSrc(cart.product_variant.product.drug)}
            alt=""
            width={90}
            height={80}
            unoptimized
            className="max-h-[90px] w-full object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="flex flex-wrap items-baseline gap-x-1 text-[16px] font-semibold text-text-primary max-[991px]:flex-col max-[991px]:items-start max-[991px]:gap-x-0 max-[991px]:gap-y-1 max-[991px]:text-[15px] max-[991px]:leading-5 max-[436px]:text-[14px]">
              <span className="whitespace-nowrap">{product.main}</span>
              <span className="whitespace-nowrap">{product.brand}</span>
            </span>
            <span className="shrink-0 text-[16px] font-semibold text-text-primary max-[436px]:text-[15px]">
              {money(price)}
            </span>
          </div>
          <p className="text-[16px] text-text-primary max-[991px]:mt-1 max-[436px]:text-[14px]">
            {cart.quantity} Tablets
            {cart.final_quantity > cart.quantity && (
              <span> + {cart.final_quantity - cart.quantity} FREE</span>
            )}
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="mt-0.5 cursor-pointer text-[16px] font-medium text-primary-blue hover:opacity-80"
          >
            Edit
          </button>
        </div>
      </div>

      {cart.max_quantity !== null && (
        <div className="mt-4 rounded-md border border-border-dropdown bg-[#e7f3f8] px-4 py-3 text-sm text-text-primary max-[1024px]:text-[10px]">
          Your prescription has <strong>{cart.max_quantity} tablets</strong> available to order
        </div>
      )}
    </>
  );
};

export const DeliveryRow = ({
  option,
  cutoff,
  price,
}: {
  option: DeliveryOption;
  cutoff: string | null;
  price: number | null;
}) => (
  <div className="flex items-start justify-between gap-3">
    <DeliveryOptionDetails option={option} cutoff={cutoff} />
    <FreeOrPrice value={price} />
  </div>
);

export const OrderTotalRow = ({
  total,
  nonDiscounted,
}: {
  total: number;
  nonDiscounted: number;
}) => {
  const showSavings = nonDiscounted > total + 0.001;
  const savePct = showSavings ? Math.round((1 - total / nonDiscounted) * 100) : 0;
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[18px] font-semibold text-text-primary">Total</span>
        <span className="flex items-baseline gap-2">
          {showSavings && (
            <span className="text-[16px] font-medium text-black/30 line-through">
              {money(nonDiscounted)}
            </span>
          )}
          <span className="text-[18px] font-bold text-text-primary">{money(total)}</span>
        </span>
      </div>
      {showSavings && savePct > 0 && (
        <p className="mt-1 text-right text-sm font-medium text-save">You save {savePct}%</p>
      )}
    </>
  );
};

// Collapsible "I have a coupon" → green ring + tag, input + Apply now; applied =
// pill with the code and the discount amount (matches AUM).
export const CouponSection = ({
  discounts,
  discountAmount,
  onApply,
  onRemove,
  error,
  isApplying,
  isRemoving,
  clearError,
}: {
  discounts: CartSummaryDiscount[];
  discountAmount: number;
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  error: string | null;
  isApplying: boolean;
  isRemoving: boolean;
  clearError: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  if (discounts.length > 0) {
    const codes = discounts.map((d) => d.code).filter(Boolean).join(", ");
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-dropdown px-4 py-1.5 text-sm text-text-primary max-[359px]:text-xs">
          {codes || "Coupon"}
          <button
            type="button"
            onClick={onRemove}
            disabled={isRemoving}
            aria-label="Remove coupon"
            className="cursor-pointer text-[#e05c4b] disabled:opacity-50"
          >
            ✕
          </button>
        </span>
        {discountAmount > 0 && <span className="font-medium text-save">- {money(discountAmount)}</span>}
      </div>
    );
  }

  const submit = async () => {
    if (!code.trim()) return;
    const ok = await onApply(code.trim());
    if (ok) setCode("");
  };

  return (
    <div>
      {/* The "I have a coupon" row stays visible; checking it fills the ring green
          and collapses the input open below (matches AUM). */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (error) clearError();
        }}
        className="flex cursor-pointer items-center gap-2.5 py-[5px] text-sm text-text-primary"
      >
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
            open ? "bg-[#27ae60]" : "bg-[#eee]",
          )}
        >
          {open && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
        </span>
        I have a coupon
        <TagIcon />
      </button>

      {open && (
        <div className="mt-4">
          <div className="flex h-[50px] items-center gap-2 rounded-md border border-[#cddfe7] px-2 pl-4">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) clearError();
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Coupon code"
              className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={isApplying || !code.trim()}
              className="shrink-0 cursor-pointer whitespace-nowrap rounded-full border border-border-dropdown bg-primary px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {isApplying ? "Processing…" : "Apply now"}
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs text-[#ec534b]">{error}</p>}
        </div>
      )}
    </div>
  );
};
