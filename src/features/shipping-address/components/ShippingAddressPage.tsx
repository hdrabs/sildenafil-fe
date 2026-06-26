"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/Skeleton";
import {
  useShippingAddressesV2,
  useDeleteShippingAddressV2,
} from "@/api/hooks/useShippingAddressQueries";
import { useCurrentUser } from "@/api/hooks/useUserQueries";
import { AccountAddressForm } from "@/features/shipping-address/components/AccountAddressForm";
import { ShippingAddress } from "@/types/shippingAddress";

export const ShippingAddressPage = () => {
  const { data: addresses, isLoading } = useShippingAddressesV2();
  const { data: me } = useCurrentUser();
  const deleteAddress = useDeleteShippingAddressV2();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingAddress | null>(null);

  const list = addresses ?? [];

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (a: ShippingAddress) => { setEditing(a); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleDelete = (address: ShippingAddress) =>
    deleteAddress.mutate(address.id, {
      onError: (err) =>
        toast.error((err as { message?: string })?.message ?? "Couldn't remove this address."),
    });

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {list.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            onEdit={() => openEdit(addr)}
            onDelete={() => handleDelete(addr)}
            isDeleting={deleteAddress.isPending && deleteAddress.variables === addr.id}
          />
        ))}

        <button
          type="button"
          onClick={openAdd}
          className="flex min-h-[160px] items-center justify-center rounded-xl border border-border-default bg-bg-main text-sm font-medium text-text-primary transition-colors hover:bg-bg-input"
        >
          + Add new shipping address
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} size="md">
        <AccountAddressForm me={me} editing={editing} onClose={closeModal} />
      </Modal>
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
}) => {
  const pill =
    "flex-1 rounded-full border border-border-default py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-primary-blue transition-colors hover:bg-bg-input disabled:opacity-50";

  return (
    <div className="flex min-h-[160px] flex-col rounded-xl border border-border-default bg-bg-card p-5">
      {address.is_valid === false && (
        <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-text-error">
          We&apos;re not available in your state just yet.
        </div>
      )}

      <div className="flex-1">
        <p className="text-sm text-text-primary">
          {address.street_1}{address.street_2 ? `, ${address.street_2}` : ""}
        </p>
        <p className="text-sm text-text-primary">
          {address.city} {address.state} {address.zip}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        {address.editable_for_user !== false && (
          <button type="button" onClick={onEdit} className={pill}>
            Edit
          </button>
        )}
        {/* Delete is shown purely off the backend-owned `deletable` flag. */}
        {address.deletable && (
          <button type="button" onClick={onDelete} disabled={isDeleting} className={cn(pill)}>
            {isDeleting ? "Removing…" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};
