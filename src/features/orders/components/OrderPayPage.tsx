"use client";

import { Fragment } from "react";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { AddressIssueWarning } from "@/components/AddressIssueWarning";
import { PaymentMethodSection } from "@/features/checkout/components/PaymentMethodSection";
import {
  CouponSection,
  DeliveryRow,
  Divider,
  NoSubscriptionBanner,
  OrderTotalRow,
  ProductLineItem,
} from "@/features/checkout/components/orderSummary/OrderSummaryParts";
import { OrderEditCartModal } from "@/features/orders/components/OrderEditCartModal";
import { useOrderPay } from "@/features/orders/hooks/useOrderPay";

export const OrderPayPage = ({ id }: { id: number }) => {
  const {
    order,
    isLoading,
    deliveryOption,
    cutoff,
    cards,
    defaultCardId,
    selectCard,
    isSelectingCard,
    hasSelectedCard,
    completeOrder,
    isCompleting,
    discounts,
    discountAmount,
    applyCoupon,
    removeCoupon,
    couponError,
    clearCouponError,
    isApplyingCoupon,
    isRemovingCoupon,
    editingCart,
    openEdit,
    closeEdit,
  } = useOrderPay(id);

  const total = order ? order.total_price : 0;
  const deliveryPrice = Number(deliveryOption?.price_value ?? order?.final_delivery_price ?? 0) || 0;
  const nonDiscounted = order
    ? order.carts.reduce((sum, cart) => sum + cart.non_discounted_price, 0) + deliveryPrice
    : 0;

  return (
    <>
      <SecondaryNav />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-[24px] font-semibold leading-[1.425] text-[#262a32]">Almost Done!</h1>

          {isLoading || !order ? (
            <div className="mt-6 flex justify-center py-16">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : order.paid ? (
            <p className="mt-6 text-text-primary">This order is already paid. Thank you!</p>
          ) : (
            <div className="mt-6 rounded-2xl bg-bg-card p-[30px] shadow-sm max-[900px]:p-4 max-[436px]:p-3">
              {order.carts.map((cart, index) => (
                <Fragment key={cart.id}>
                  {index > 0 && <Divider />}
                  <ProductLineItem cart={cart} onEdit={() => openEdit(cart.id)} price={cart.final_price} />
                </Fragment>
              ))}

              <Divider />

              <CouponSection
                discounts={discounts}
                discountAmount={discountAmount}
                onApply={applyCoupon}
                onRemove={removeCoupon}
                error={couponError}
                isApplying={isApplyingCoupon}
                isRemoving={isRemovingCoupon}
                clearError={clearCouponError}
              />

              {deliveryOption && (
                <>
                  <Divider />
                  <div className="py-[5px]">
                    <DeliveryRow option={deliveryOption} cutoff={cutoff} price={deliveryOption.price_value} />
                    <AddressIssueWarning
                      verified={order.shipping_address?.verified}
                      deliveryTypes={[order.delivery_type, deliveryOption.delivery_type]}
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              <Divider />

              <OrderTotalRow total={total} nonDiscounted={nonDiscounted} />

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

      {editingCart && order && (
        <OrderEditCartModal
          show={!!editingCart}
          orderId={order.id}
          cart={editingCart}
          onSaved={closeEdit}
          onClose={closeEdit}
        />
      )}
    </>
  );
};
