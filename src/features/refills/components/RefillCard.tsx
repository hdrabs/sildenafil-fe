"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRemoveRefillCart } from "@/features/refills/hooks/useRemoveRefillCart";
import { RefillAction, RefillCard as RefillCardData, RefillPresentation } from "@/types/refill";

const BADGE_TONE: Record<NonNullable<RefillPresentation["badge_tone"]>, string> = {
  warning: "bg-[#fdecd8] text-[#cf8a2e]",
  info: "bg-[#e6eefb] text-[#1b53af]",
  success: "bg-[#d8ecda] text-[#1d9629]",
};

// Active Rx cards use an outline primary button; Needs Action uses solid blue.
const PRIMARY_BTN: Record<"active" | "needs_action", string> = {
  active:
    "rounded-full border border-border-default bg-white px-7 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-input",
  needs_action:
    "rounded-full bg-[#1b53af] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90",
};

export const RefillCard = ({
  card,
  accent,
}: {
  card: RefillCardData;
  accent: "active" | "needs_action";
}) => {
  const router = useRouter();
  const { submit: removeCart, isLoading: removing } = useRemoveRefillCart();
  const [showItems, setShowItems] = useState(false);

  const { presentation } = card;
  const primary = presentation.actions.find((a) => a.type !== "remove_from_cart");
  const remove = presentation.actions.find((a) => a.type === "remove_from_cart");

  const runAction = (action: RefillAction) => {
    if (action.type === "remove_from_cart") {
      if (action.cart_id) removeCart(action.cart_id);
      return;
    }
    if (!action.href) return;
    if (action.external) window.open(action.href, "_blank", "noopener,noreferrer");
    else router.push(action.href);
  };

  return (
    <div className="rounded-2xl bg-bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="relative flex flex-wrap items-center gap-3">
            <p className="font-bold text-text-primary">{card.medication_name}</p>

            {card.line_items && card.line_items.length > 1 && (
              <button
                type="button"
                onClick={() => setShowItems((v) => !v)}
                className="rounded-full bg-bg-input px-2.5 py-0.5 text-xs font-medium text-text-muted hover:opacity-80"
              >
                +{card.line_items.length - 1} more
              </button>
            )}

            {presentation.badge && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  BADGE_TONE[presentation.badge_tone ?? "info"]
                }`}
              >
                {presentation.badge}
              </span>
            )}

            {showItems && card.line_items && (
              <div className="absolute left-0 top-full z-10 mt-2 w-72 rounded-xl border border-border-default bg-bg-card p-4 shadow-lg">
                <p className="mb-2 text-sm font-semibold text-text-primary">Order items</p>
                {card.line_items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 text-sm text-text-muted">
                    <span>{item.name}</span>
                    <span>{item.quantity_label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {card.subtitle && <p className="mt-1 text-sm text-text-muted">{card.subtitle}</p>}
          {presentation.description && (
            <p className="mt-2 text-text-muted">{presentation.description}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          {primary && (
            <button
              type="button"
              onClick={() => runAction(primary)}
              disabled={removing}
              className={`${PRIMARY_BTN[accent]} disabled:opacity-60`}
            >
              {primary.label}
            </button>
          )}
          {remove && (
            <button
              type="button"
              onClick={() => runAction(remove)}
              disabled={removing}
              className="text-sm text-primary-blue underline transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {remove.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
