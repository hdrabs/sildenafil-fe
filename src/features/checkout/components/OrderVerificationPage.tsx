"use client";

import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { EditCartModal } from "@/features/checkout/components/EditCartModal";
import { PaymentMethodSection } from "@/features/checkout/components/PaymentMethodSection";
import {
  CouponSection,
  DeliveryRow,
  Divider,
  FreeOrPrice,
  NoSubscriptionBanner,
  OrderTotalRow,
  ProductLineItem,
} from "@/features/checkout/components/orderSummary/OrderSummaryParts";
import { useOrderVerification } from "@/features/checkout/hooks/useOrderVerification";

export const OrderVerificationPage = () => {
  const {
    cart,
    isLoading,
    back,
    cartId,
    cartToken,
    address,
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

  const showAddressWarning =
    !!cart &&
    !!deliveryOption &&
    address?.verified === false &&
    cart.delivery_type !== "personal" &&
    deliveryOption.delivery_type !== "personal";

  return (
    <>
      <SecondaryNav onBack={back} />
      <CheckoutProgressBar step="order_verification" />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-[24px] font-semibold leading-[1.425] text-[#262a32]">Almost Done!</h1>

          {isLoading || !cart ? (
            <div className="mt-6 flex justify-center py-16">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-bg-card p-[30px] shadow-sm max-[900px]:p-4 max-[436px]:p-3">
              <ProductLineItem cart={cart} onEdit={openEdit} price={cart.price} />

              <Divider />

              <CouponSection
                discounts={cart.discounts}
                discountAmount={Math.max(0, cart.price - cart.final_price)}
                onApply={applyCoupon}
                onRemove={removeCoupon}
                error={couponError}
                isApplying={isApplying}
                isRemoving={isRemoving}
                clearError={clearCouponError}
              />

              <Divider />

              <div className="flex items-center justify-between gap-3 py-[5px]">
                <span className="text-[16px] font-semibold text-text-primary">
                  Medical Provider Visit Fee
                </span>
                <FreeOrPrice value={cart.provider_fee} />
              </div>

              {deliveryOption && (
                <>
                  <Divider />
                  <div className="py-[5px]">
                    <DeliveryRow option={deliveryOption} cutoff={cutoff} price={cart.final_delivery_price} />
                    {showAddressWarning && (
                      <p className="mt-2 text-xs font-medium text-coral">
                        Our system shows an issue with your address, shipping delays may occur.
                        Contact us at{" "}
                        <a href="tel:7142762040" className="underline">
                          (714) 276-2040
                        </a>{" "}
                        for more information.
                      </p>
                    )}
                  </div>
                </>
              )}

              <Divider />

              <OrderTotalRow
                total={cart.total_price + cart.provider_fee}
                nonDiscounted={cart.non_discounted_price}
              />

              <NoSubscriptionBanner />

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
