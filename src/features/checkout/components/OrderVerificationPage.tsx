"use client";

import { useState } from "react";
import Image from "next/image";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { EditCartModal } from "@/features/checkout/components/EditCartModal";
import { PaymentMethodSection } from "@/features/checkout/components/PaymentMethodSection";
import { useOrderVerification } from "@/features/checkout/hooks/useOrderVerification";
import { CartSummary } from "@/types/orderSummary";
import { DeliveryOption } from "@/types/delivery";

const money = (n: number): string => `$${Number(n).toFixed(2)}`;

const bottleSrc = (drug: string): string =>
  drug === "tadalafil"
    ? "/images/products/tadalafil-bottle.png"
    : "/images/products/sildenafil-bottle.png";

// product_name_with_brand is "Sildenafil (Generic Viagra)" — slot the dosage in
// before the brand to read "Sildenafil 20mg (Generic Viagra)".
const productTitle = (cart: CartSummary): string => {
  const dosage = cart.product_variant.dosage;
  const m = cart.product_name_with_brand.match(/^(.*?)\s*(\(.*\))\s*$/);
  return m ? `${m[1]} ${dosage} ${m[2]}` : `${cart.product_variant.product.name} ${dosage}`;
};

const Divider = () => <div className="my-5 border-t border-border-default" />;

const FreeOrPrice = ({ value }: { value: number | null }) =>
  Number(value) ? (
    <span className="font-bold text-text-primary">{money(Number(value))}</span>
  ) : (
    <span className="rounded-md bg-[#1D9629] px-3 py-1 text-sm font-semibold text-white">Free</span>
  );

const DeliveryRow = ({ option, cutoff }: { option: DeliveryOption; cutoff: string | null }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Image
          src={option.delivery_type === "personal" ? "/icons/aum-pharmacy.svg" : "/icons/usps.svg"}
          alt=""
          width={option.delivery_type === "personal" ? 42 : 29}
          height={17}
          unoptimized
          className="shrink-0"
        />
        <span className="font-semibold text-text-primary">{option.label_info}</span>
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
    </div>
    <FreeOrPrice value={option.price_value} />
  </div>
);

const CouponSection = ({
  cart,
  onApply,
  onRemove,
  error,
  isApplying,
  isRemoving,
  clearError,
}: {
  cart: CartSummary;
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  error: string | null;
  isApplying: boolean;
  isRemoving: boolean;
  clearError: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  if (cart.discounts.length > 0) {
    const codes = cart.discounts.map((d) => d.code).filter(Boolean).join(", ");
    const amount = Math.max(0, cart.price - cart.final_price);
    return (
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-1.5 text-sm text-text-primary">
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
        {amount > 0 && <span className="font-medium text-[#1D9629]">- {money(amount)}</span>}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 text-text-primary"
      >
        <span className="h-5 w-5 rounded-full border border-border-default" />I have a coupon 🏷️
      </button>
    );
  }

  const submit = async () => {
    if (!code.trim()) return;
    const ok = await onApply(code.trim());
    if (ok) setCode("");
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) clearError();
          }}
          placeholder="Coupon code"
          className="h-11 flex-1 rounded-lg border border-border-input bg-white px-4 text-sm text-text-primary outline-none focus:border-primary-blue"
        />
        <button
          type="button"
          onClick={submit}
          disabled={isApplying || !code.trim()}
          className="cursor-pointer rounded-lg bg-primary-blue px-5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {isApplying ? "Applying…" : "Apply now"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-[#e05c4b]">{error}</p>}
    </div>
  );
};

export const OrderVerificationPage = () => {
  const {
    cart,
    isLoading,
    back,
    cartId,
    cartToken,
    deliveryOption,
    cutoff,
    couponError,
    clearCouponError,
    applyCoupon,
    removeCoupon,
    isApplying,
    isRemoving,
    editing,
    openEdit,
    closeEdit,
    onEditSaved,
    cards,
    defaultCardId,
    selectCard,
    isSelectingCard,
    hasSelectedCard,
    completeOrder,
    isCompleting,
  } = useOrderVerification();

  const displayTotal = cart ? cart.total_price + cart.provider_fee : 0;
  const showSavings = cart ? cart.non_discounted_price > displayTotal + 0.001 : false;
  const savePct =
    cart && showSavings ? Math.round((1 - displayTotal / cart.non_discounted_price) * 100) : 0;

  return (
    <>
      <SecondaryNav onBack={back} />
      <CheckoutProgressBar step="order_verification" />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">Almost Done!</h1>

          {isLoading || !cart ? (
            <div className="mt-6 flex justify-center py-16">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
              {/* Product */}
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-default bg-white p-1.5">
                  <Image
                    src={bottleSrc(cart.product_variant.product.drug)}
                    alt=""
                    width={72}
                    height={72}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-text-primary">{productTitle(cart)}</p>
                  <p className="text-text-muted">
                    {cart.quantity} Tablets
                    {cart.final_quantity > cart.quantity && (
                      <span> + {cart.final_quantity - cart.quantity} FREE</span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={openEdit}
                    className="mt-1 cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
                  >
                    Edit
                  </button>
                </div>
                <span className="font-bold text-text-primary">{money(cart.final_price)}</span>
              </div>

              <Divider />

              <CouponSection
                cart={cart}
                onApply={applyCoupon}
                onRemove={removeCoupon}
                error={couponError}
                isApplying={isApplying}
                isRemoving={isRemoving}
                clearError={clearCouponError}
              />

              <Divider />

              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">Medical Provider Visit Fee</span>
                <FreeOrPrice value={cart.provider_fee} />
              </div>

              {deliveryOption && (
                <>
                  <Divider />
                  <DeliveryRow option={deliveryOption} cutoff={cutoff} />
                </>
              )}

              <Divider />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-text-primary">Total</span>
                <span className="flex items-baseline gap-2">
                  {showSavings && (
                    <span className="text-text-muted line-through">
                      {money(cart.non_discounted_price)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-text-primary">{money(displayTotal)}</span>
                </span>
              </div>
              {showSavings && savePct > 0 && (
                <p className="mt-1 text-right text-sm font-medium text-[#1D9629]">
                  You save {savePct}%
                </p>
              )}

              <div className="mt-4 rounded-lg bg-[#F1F8FB] py-3 text-center text-sm text-primary-blue">
                No Subscription. One time charge only.
              </div>

              <Divider />

              <PaymentMethodSection
                cards={cards}
                defaultCardId={defaultCardId}
                onSelect={selectCard}
                isSelecting={isSelectingCard}
                completeOrder={completeOrder}
                isCompleting={isCompleting}
                hasSelectedCard={hasSelectedCard}
              />
            </div>
          )}
        </div>
      </main>

      {cart && (
        <EditCartModal
          show={editing}
          cart={cart}
          cartId={cartId}
          cartToken={cartToken}
          onSaved={onEditSaved}
          onClose={closeEdit}
        />
      )}
    </>
  );
};
