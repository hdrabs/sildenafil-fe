"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiMapPinLine } from "react-icons/ri";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/Skeleton";
import {
  useShippingAddresses,
  useDeleteShippingAddress,
} from "@/api/hooks/useShippingAddressQueries";
import { useCurrentUser } from "@/api/hooks/useUserQueries";
import { useShippingAddressForm } from "@/features/shipping-address/hooks/useShippingAddressForm";
import { ShippingAddress } from "@/types/shippingAddress";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export const ShippingAddressPage = () => {
  const { data, isLoading } = useShippingAddresses();
  const { data: currentUser } = useCurrentUser();
  const deleteAddress = useDeleteShippingAddress();

  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<ShippingAddress | null>(null);

  const addresses = data?.shipping_addresses?.filter((a) => a.status === "active") ?? [];
  const userPhone = currentUser?.mobile_phone ?? "";

  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (a: ShippingAddress) => { setEditing(a); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-default bg-bg-card p-6 flex flex-col gap-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <EmptyState
          illustrationSrc="/illustrations/shipping-address.svg"
          title="Shipping Address"
          description="Where should we send your orders? Review and edit your shipping address here."
          ctaLabel="Add Shipping Address"
          onCtaClick={openAdd}
        />
        <ShippingAddressModal open={modalOpen} editing={editing} onClose={closeModal} userPhone={userPhone} />
      </>
    );
  }

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Shipping Address</h1>
        <p className="mt-1 text-sm text-text-muted">View and edit your address.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onEdit={() => openEdit(addr)}
            onDelete={() => deleteAddress.mutate(addr.id)}
            isDeleting={deleteAddress.isPending}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 h-9 rounded-full bg-primary px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <RiAddLine className="h-4 w-4" />
          Add Address
        </button>
      </div>

      <ShippingAddressModal open={modalOpen} editing={editing} onClose={closeModal} userPhone={userPhone} />
    </div>
  );
};

/* ── Address card ── */

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  isDeleting,
}: {
  address: ShippingAddress;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) => (
  <div className="flex items-start justify-between rounded-xl border border-border-default bg-bg-main p-4">
    <div className="flex items-start gap-3">
      <RiMapPinLine className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-semibold text-text-primary">
          {address.first_name} {address.last_name}
        </p>
        <p className="text-sm text-text-muted">{address.street_1}{address.street_2 ? `, ${address.street_2}` : ""}</p>
        <p className="text-sm text-text-muted">
          {address.city}, {address.state} {address.zip}
        </p>
        <p className="text-sm text-text-muted">{address.phone}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="rounded-lg border border-border-input p-2 text-text-muted hover:text-primary hover:border-primary transition-colors"
        aria-label="Edit address"
      >
        <RiEditLine className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="rounded-lg border border-border-input p-2 text-text-muted hover:text-text-error hover:border-red-300 transition-colors disabled:opacity-50"
        aria-label="Delete address"
      >
        <RiDeleteBinLine className="h-4 w-4" />
      </button>
    </div>
  </div>
);

/* ── Add / Edit modal ── */

const ShippingAddressModal = ({
  open,
  editing,
  onClose,
  userPhone,
}: {
  open: boolean;
  editing: ShippingAddress | null;
  onClose: () => void;
  userPhone: string;
}) => {
  const { form, submit, isLoading, error } = useShippingAddressForm({
    editing,
    userPhone,
    onSuccess: onClose,
  });

  const { register, control, formState: { errors } } = form;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={editing ? "Edit Shipping Address" : "Add Shipping Address"}
      size="lg"
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            {...register("first_name")}
            error={errors.first_name?.message}
            autoComplete="given-name"
          />
          <Input
            label="Last Name"
            {...register("last_name")}
            error={errors.last_name?.message}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Street Address"
          {...register("street_1")}
          error={errors.street_1?.message}
          placeholder="123 Main St"
          autoComplete="address-line1"
        />

        <Input
          label="Apt / Suite (optional)"
          {...register("street_2")}
          error={errors.street_2?.message}
          placeholder="Apt 4B"
          autoComplete="address-line2"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            {...register("city")}
            error={errors.city?.message}
            autoComplete="address-level2"
          />

          {/* State select — uses Controller so we get a native <select> with proper RHF binding */}
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-primary">State</label>
                <select
                  {...field}
                  className={`h-12 w-full rounded-lg border bg-bg-input px-3 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.state ? "border-error" : "border-border-input"
                  }`}
                >
                  <option value="">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-text-error">{errors.state.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div className={`grid gap-4 ${userPhone ? "grid-cols-1" : "grid-cols-2"}`}>
          <Input
            label="ZIP Code"
            {...register("zip")}
            error={errors.zip?.message}
            placeholder="90210"
            maxLength={5}
            autoComplete="postal-code"
          />

          {/* Phone — hidden when user already has a phone number on file */}
          {!userPhone && (
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  label="Phone"
                  {...field}
                  error={errors.phone?.message}
                  placeholder="(555) 555-5555"
                  inputMode="tel"
                  autoComplete="tel"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    let formatted = digits;
                    if (digits.length >= 7) {
                      formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
                    } else if (digits.length >= 4) {
                      formatted = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
                    } else if (digits.length >= 1) {
                      formatted = `(${digits}`;
                    }
                    field.onChange(formatted);
                  }}
                />
              )}
            />
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-text-error">
            Something went wrong. Please try again.
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
            {editing ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
