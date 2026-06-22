"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/constants/routes";
import { useActiveCart, useSetActiveCart } from "@/store";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { useUpdateCartV2 } from "@/api/hooks/useCartQueries";
import { CartSummary } from "@/types/orderSummary";

interface Props {
  show: boolean;
  cart: CartSummary;
  cartId: number;
  cartToken?: string;
  onSaved: () => void;
  onClose: () => void;
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Dropdown = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-14 w-full cursor-pointer rounded-xl border border-border-default bg-white px-5 text-base text-text-primary outline-none focus:border-primary-blue"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

// "Edit Information" modal — change product / strength / quantity. Reuses the
// catalog configurator; saving drives the v2 cart update (the server re-resolves
// refill vs telemedicine and may redirect if the branch changes).
export const EditCartModal = ({ show, cart, cartId, cartToken, onSaved, onClose }: Props) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const setActiveCart = useSetActiveCart();
  const update = useUpdateCartV2();

  const {
    variants,
    activeDrug,
    activeVariant,
    effectiveQty,
    handleDrugChange,
    handleStrengthChange,
    handleQtyChange,
  } = useProductConfigurator({
    slug: cart.product_variant.slug,
    initialQty: cart.quantity,
    autoSelectPopular: false,
  });

  const drugs = [...new Set(variants.map((v) => v.product.drug))];
  const dosages = [
    ...new Set(variants.filter((v) => v.product.drug === activeDrug).map((v) => v.product.dosage)),
  ];
  const quantities = activeVariant?.packages.map((p) => p.quantity) ?? [];

  const save = async () => {
    if (!activeVariant || effectiveQty <= 0) return;

    const res = await update.mutateAsync({
      id: cartId,
      data: { slug: activeVariant.product.slug, quantity: effectiveQty, cart_token: cartToken },
    });

    if (activeCart) setActiveCart({ ...activeCart, cart: res.cart });

    // Changing the variant/quantity can flip refill ↔ telemedicine and move the
    // cart to a different step; follow the server's redirect when that happens.
    if (res.redirect_path && res.redirect_path !== ROUTES.ORDER_VERIFICATION) {
      router.push(res.redirect_path);
      return;
    }
    onSaved();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title="Edit Information" size="lg">
      <div className="flex flex-col gap-4">
        <Dropdown
          label="Product"
          value={activeDrug ?? ""}
          options={drugs.map((d) => ({ value: d, label: titleCase(d) }))}
          onChange={handleDrugChange}
        />
        <Dropdown
          label="Strength"
          value={activeVariant?.product.dosage ?? ""}
          options={dosages.map((d) => ({ value: d, label: d }))}
          onChange={handleStrengthChange}
        />
        <Dropdown
          label="Quantity"
          value={String(effectiveQty)}
          options={quantities.map((q) => ({ value: String(q), label: `${q} tablets` }))}
          onChange={(v) => handleQtyChange(Number(v))}
        />

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={update.isPending || !activeVariant || effectiveQty <= 0}
            className="cursor-pointer rounded-full bg-[#e05c4b] px-10 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save now
          </button>
        </div>
      </div>
    </Modal>
  );
};
