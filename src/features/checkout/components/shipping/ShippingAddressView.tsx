"use client";

import { cn } from "@/lib/utils";
import { ShippingAddress } from "@/types/shippingAddress";
import { UserMeResponse } from "@/types/user";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";
import { CheckoutProgressBar } from "@/features/checkout/components/CheckoutProgressBar";
import { AddressCard } from "@/features/checkout/components/shipping/AddressCard";
import { NewAddressForm } from "@/features/checkout/components/shipping/NewAddressForm";
import { DeliveryView } from "@/features/checkout/components/shipping/DeliveryView";

interface Props {
  me?: UserMeResponse | null;
  onBack: () => void;
  view: "address" | "delivery";
  cartId: number;
  cartToken?: string;
  preselectedDeliveryType: string | null;
  isLoading: boolean;
  hasAddresses: boolean;
  visible: ShippingAddress[];
  showAll: boolean;
  toggleShowAll: () => void;
  addresses: ShippingAddress[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  selectedAddress: ShippingAddress | null;
  editing: ShippingAddress | null;
  showForm: boolean;
  openForm: () => void;
  closeForm: () => void;
  startEdit: (address: ShippingAddress) => void;
  onAddressSaved: (address: ShippingAddress) => void;
  continueFromList: () => void;
  isAttaching: boolean;
  submitDelivery: (deliveryType: string) => void;
  isSubmittingDelivery: boolean;
  destinationZip: string;
  /** Checkout funnel shows the step progress bar; the order-scoped edit hides it. */
  showProgressBar?: boolean;
}

/**
 * Shared address → delivery view for both the checkout `/checkout/shipping` step
 * and the order-scoped `/edit/shipping` page. Each route wires its own hook
 * (cart vs. order) and passes the data in; the only visual difference is the
 * progress bar, which the funnel shows and the edit page hides.
 */
export const ShippingAddressView = ({
  me,
  onBack,
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
  showProgressBar = false,
}: Props) => {
  const continueDisabled = !selectedAddress || !selectedAddress.is_valid || isAttaching;
  // The boxed "add a new address" form sits above the list; editing happens
  // inline within each card, so it must not also open the top form.
  const editingId = editing?.id ?? null;
  const addingNew = showForm && !editing && hasAddresses;

  return (
    <>
      <SecondaryNav onBack={onBack} isLoading={isAttaching} />
      {showProgressBar && <CheckoutProgressBar step="shipping_address_info" />}

      <main className="min-h-screen bg-bg-main px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          {isLoading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-[#e05c4b]" />
            </div>
          ) : (
            <>
              <h1 className="text-[24px] font-semibold leading-[35px] text-[#262a32] max-md:text-[20px]">
                {view === "delivery" ? "Shipping Options" : "Shipping Address"}
              </h1>
              <p className="mt-2 mb-8 text-base font-medium leading-[140%] text-[#777] max-md:mb-6 max-md:leading-[150%]">
                {view === "delivery" ? (
                  "Choose your preferred shipping option"
                ) : hasAddresses ? (
                  // AUM: with saved addresses, mobile shows the delivery-option prompt;
                  // desktop keeps the full "enter your address" copy.
                  <>
                    <span className="md:hidden">Choose delivery option</span>
                    <span className="hidden md:inline">
                      Enter your delivery address to continue with your shipment
                    </span>
                  </>
                ) : (
                  "Enter your delivery address to continue with your shipment"
                )}
              </p>

              <div>
                {view === "delivery" ? (
                  <DeliveryView
                    cartId={cartId}
                    cartToken={cartToken}
                    addressId={selectedAddress?.id ?? 0}
                    destinationZip={destinationZip}
                    preselectedType={preselectedDeliveryType}
                    onSubmit={submitDelivery}
                    isSubmitting={isSubmittingDelivery}
                  />
                ) : (
                  <div className="rounded-2xl bg-bg-card p-5 shadow-sm">
                    {!hasAddresses ? (
                      // First-ever address: the form is the whole step.
                      <NewAddressForm
                        me={me}
                        editing={null}
                        boxed={false}
                        submitLabel="Continue"
                        onSaved={onAddressSaved}
                      />
                    ) : (
                      <>
                        {addingNew ? (
                          <NewAddressForm
                            me={me}
                            editing={null}
                            boxed
                            submitLabel="Add address"
                            onCancel={closeForm}
                            onSaved={onAddressSaved}
                          />
                        ) : (
                          <div className="mb-4 flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                            <h2 className="m-0 text-lg font-semibold text-[#262a32]">
                              Confirm shipping address
                            </h2>
                            {!editingId && (
                              <button
                                type="button"
                                onClick={openForm}
                                className="cursor-pointer text-sm font-normal leading-[140%] text-primary-blue hover:opacity-80"
                              >
                                + Add new shipping address
                              </button>
                            )}
                          </div>
                        )}

                        <div className={cn("flex flex-col gap-3", addingNew && "mt-6")}>
                          {visible.map((address) => (
                            <AddressCard
                              key={address.id}
                              address={address}
                              selected={selectedId === address.id}
                              editing={editingId === address.id}
                              onSelect={() => setSelectedId(address.id)}
                              onEdit={() => startEdit(address)}
                              onCancelEdit={closeForm}
                            >
                              {editingId === address.id && (
                                <NewAddressForm
                                  me={me}
                                  editing={address}
                                  boxed={false}
                                  embedded
                                  submitLabel="Update Address"
                                  onCancel={closeForm}
                                  onSaved={onAddressSaved}
                                />
                              )}
                            </AddressCard>
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

                        {!editingId && !addingNew && (
                          <button
                            type="button"
                            disabled={continueDisabled}
                            onClick={continueFromList}
                            className="mt-6 w-full rounded-full bg-coral px-2.5 py-3 text-base font-normal uppercase tracking-widest text-white transition-colors hover:bg-coral-hover disabled:cursor-not-allowed disabled:bg-[#6c757d]"
                          >
                            Continue
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};
