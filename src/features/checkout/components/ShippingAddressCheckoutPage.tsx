"use client";

import { cn } from "@/lib/utils";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { AddressCard } from "@/features/checkout/components/shipping/AddressCard";
import { NewAddressForm } from "@/features/checkout/components/shipping/NewAddressForm";
import { DeliveryView } from "@/features/checkout/components/shipping/DeliveryView";
import { useShippingCheckout } from "@/features/checkout/hooks/useShippingCheckout";

export const ShippingAddressCheckoutPage = () => {
  const {
    me,
    onBack,
    steps,
    view,
    cartId,
    cartToken,
    preselectedDeliveryType,
    isLoading,
    hasAddresses,
    visible,
    showAll,
    toggleShowAll,
    addresses,
    selectedId,
    setSelectedId,
    selectedAddress,
    editing,
    showForm,
    openForm,
    closeForm,
    startEdit,
    onAddressSaved,
    continueFromList,
    isAttaching,
    submitDelivery,
    isSubmittingDelivery,
    destinationZip,
  } = useShippingCheckout();

  const submitLabel = editing ? "Update address" : hasAddresses ? "Add address" : "Continue";
  const continueDisabled = !selectedAddress || !selectedAddress.is_valid || isAttaching;

  return (
    <>
      <SecondaryNav onBack={onBack} isLoading={isAttaching} />
      <CheckoutProgressBar steps={steps} />

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-primary">
            {view === "delivery" ? "Shipping Options" : "Shipping Address"}
          </h1>
          <p className="mt-1 text-text-muted">
            {view === "delivery"
              ? "Choose your preferred shipping option"
              : "Enter your delivery address to continue with your shipment"}
          </p>

          <div className="mt-6">
            {view === "delivery" ? (
              <DeliveryView
                cartId={cartId}
                cartToken={cartToken}
                destinationZip={destinationZip}
                preselectedType={preselectedDeliveryType}
                onSubmit={submitDelivery}
                isSubmitting={isSubmittingDelivery}
              />
            ) : isLoading ? (
              <div className="flex justify-center py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
              </div>
            ) : (
              <div className="rounded-2xl bg-bg-card p-6 shadow-sm">
                {showForm && (
                  <NewAddressForm
                    me={me}
                    editing={editing}
                    boxed={hasAddresses}
                    submitLabel={submitLabel}
                    onCancel={hasAddresses ? closeForm : undefined}
                    onSaved={onAddressSaved}
                  />
                )}

                {!showForm && hasAddresses && (
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">
                      Confirm shipping address
                    </h2>
                    <button
                      type="button"
                      onClick={openForm}
                      className="cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
                    >
                      + Add new shipping address
                    </button>
                  </div>
                )}

                {hasAddresses && (
                  <>
                    <div className={cn("flex flex-col gap-3", showForm && "mt-6")}>
                      {visible.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          selected={selectedId === address.id}
                          onSelect={() => setSelectedId(address.id)}
                          onEdit={() => startEdit(address)}
                        />
                      ))}
                    </div>

                    {addresses.length > 3 && (
                      <button
                        type="button"
                        onClick={toggleShowAll}
                        className="mt-4 cursor-pointer text-sm font-medium text-primary-blue hover:opacity-80"
                      >
                        {showAll ? "Show less addresses" : "Show more addresses"}
                      </button>
                    )}

                    {!showForm && (
                      <button
                        type="button"
                        disabled={continueDisabled}
                        onClick={continueFromList}
                        className={cn(
                          "mt-6 w-full cursor-pointer rounded-full py-3.5 text-sm font-medium uppercase tracking-wide text-white transition-colors disabled:cursor-not-allowed",
                          continueDisabled ? "bg-[#6d757f] opacity-90" : "bg-[#e05c4b] hover:opacity-90",
                        )}
                      >
                        Continue
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
