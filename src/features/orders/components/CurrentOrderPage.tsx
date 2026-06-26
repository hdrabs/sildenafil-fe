"use client";

import { useRouter } from "next/navigation";
import { useCurrentOrder } from "@/api/hooks/useOrderQueries";
import { ROUTES } from "@/constants/routes";

/**
 * Entry point for the post-approval payment flow. Shows the patient's pending
 * order (created by an admin) and sends them to the pay page. NOTE: layout is
 * functional only — the pixel-matched legacy design lands with the /order/[id]
 * pay page in the next slice.
 */
export const CurrentOrderPage = () => {
  const router = useRouter();
  const { data: order, isLoading } = useCurrentOrder();

  if (isLoading) {
    return <p className="p-6 text-text-muted">Loading your order…</p>;
  }

  if (!order) {
    return <p className="p-6 text-text-muted">You have no order awaiting payment.</p>;
  }

  return (
    <section className="mx-auto max-w-xl space-y-6 p-6">
      <header>
        <h1 className="text-xl font-semibold text-text-primary">Almost done!</h1>
        {order.invoice_number && (
          <p className="text-sm text-text-muted">Order #{order.invoice_number}</p>
        )}
      </header>

      <ul className="divide-y divide-border-input rounded-lg border border-border-input">
        {order.carts.map((cart) => (
          <li key={cart.id} className="flex items-center justify-between p-4">
            <span className="text-text-primary">
              {cart.product_name_with_brand} × {cart.quantity}
            </span>
            <span className="text-text-primary">${cart.final_price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between text-base font-semibold text-text-primary">
        <span>Total</span>
        <span>${order.total_price.toFixed(2)}</span>
      </div>

      <button
        type="button"
        onClick={() => router.push(ROUTES.EDIT_SHIPPING)}
        className="h-11 w-full rounded-full bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Complete order
      </button>
    </section>
  );
};
