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
      <div className={ACCOUNT_CARD}>
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2">
          <Skeleton className="h-[230px] w-full rounded-md" />
          <Skeleton className="h-[230px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className={ACCOUNT_CARD}>
      <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2">
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
          className="flex min-h-[230px] items-center justify-center rounded-md border border-border-tile bg-bg-tile text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          + Add new shipping address
        </button>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} size="md" className="max-w-[362px]">
        <AccountAddressForm me={me} editing={editing} onClose={closeModal} />
      </Modal>
    </div>
  );
};

// AUM `.account-card.padded`: white, 12px radius, 30px pad (15px sides on mobile),
// soft drop shadow.
const ACCOUNT_CARD =
  "rounded-xl bg-bg-card p-[30px] shadow-[0px_0px_20px_rgba(128,148,178,0.2)] max-[768px]:px-[15px]";

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
  // AUM ".btn-aum.ghost small": blue outline pill that fills blue on hover.
  const pill =
    "flex-1 rounded-full border border-border-dropdown py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50";

  return (
    // AUM card: hover turns the border AND all inherited text blue.
    <div className="flex min-h-[230px] flex-col rounded-md border border-border-tile bg-bg-tile p-[22px] text-text-primary transition-colors hover:border-primary hover:text-primary">
      {address.is_valid === false && (
        // AUM renders the restriction as plain bold text (inherits the card colour).
        <div className="mb-2 font-bold">
          We&apos;re not available in your state just yet.
        </div>
      )}

      <div className="flex-1">
        <p className="text-sm">
          {address.street_1}{address.street_2 ? `, ${address.street_2}` : ""}
        </p>
        <p className="text-sm">
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
