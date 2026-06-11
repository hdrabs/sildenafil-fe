import { Modal } from "@/components/ui/Modal";

interface NoShippingAddressModalProps {
  open: boolean;
  onClose: () => void;
}

export const NoShippingAddressModal = ({ open, onClose }: NoShippingAddressModalProps) => (
  <Modal isOpen={open} onClose={onClose} title="" size="md">
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <p className="text-base text-text-primary leading-relaxed">
        To add a Payment Method, there must be at least one Shipping Address added to your
        account. Please add one before proceeding.
      </p>
      <button
        onClick={onClose}
        className="h-10 rounded-full bg-[#e05a5a] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-90 transition-opacity"
      >
        Close
      </button>
    </div>
  </Modal>
);
