"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRemoveRefillCart } from "@/features/refills/hooks/useRemoveRefillCart";
import { RefillAction, RefillCard as RefillCardData, RefillPresentation } from "@/types/refill";

// AUM .rx-card__tag tones (10px pill). Blue tag text reuses the brand primary.
const BADGE_TONE: Record<NonNullable<RefillPresentation["badge_tone"]>, string> = {
  warning: "bg-bg-tag-yellow text-text-tag-yellow",
  info: "bg-bg-tag-blue text-primary",
  success: "bg-bg-tag-green text-text-tag-green",
};

// Active Rx → outline pill (.rx-card__btn--refill); Needs Action → solid blue (.needs-action-card__btn).
const PRIMARY_BTN: Record<"active" | "needs_action", string> = {
  active:
    "border-[1.5px] border-border-soft bg-white font-medium text-text-card-strong hover:bg-bg-card-hover",
  needs_action: "bg-primary-blue font-bold text-white hover:opacity-90",
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
  const lineItems = card.line_items ?? [];
  const extraCount = lineItems.length - 1;

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
    <article
      onClick={() => showItems && setShowItems(false)}
      className="flex items-center justify-between gap-4 rounded-lg border border-border-card bg-bg-card p-5 max-[649px]:flex-col max-[649px]:items-start max-[649px]:gap-4 max-[649px]:p-4"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          className={`flex flex-wrap items-start ${accent === "needs_action" ? "gap-2" : "gap-1"}`}
        >
          <p className="m-0 text-sm font-bold leading-[1.3] text-text-primary max-[649px]:text-xs">
            {card.medication_name}
          </p>

          {extraCount > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setShowItems((v) => !v);
              }}
              className="group relative inline-flex cursor-pointer items-center whitespace-nowrap rounded-[4px] bg-bg-tag-blue px-2 py-0.5 text-[10px] font-semibold text-primary"
            >
              +{extraCount} more
              {/* Desktop: hover tooltip */}
              <span className="pointer-events-none absolute left-0 top-[calc(100%+6px)] z-[100] flex min-w-[200px] flex-col gap-1.5 rounded-lg bg-bg-tooltip px-[14px] py-2.5 opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 max-[649px]:hidden">
                {lineItems.map((item, i) => (
                  <span key={i} className="flex items-center justify-between gap-3 text-[11px] leading-snug">
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="whitespace-nowrap font-normal text-text-tooltip-muted">
                      {item.quantity_label}
                    </span>
                  </span>
                ))}
              </span>
              {/* Mobile: tap popup */}
              {showItems && (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-1/2 top-[calc(100%+6px)] z-[200] hidden w-[220px] -translate-x-1/2 flex-col gap-2.5 rounded-[10px] border border-border-card bg-bg-card px-4 py-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-[649px]:flex">
                  <span className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-card-strong">Order items</span>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowItems(false);
                      }}
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-bg-input text-[10px] leading-none text-text-muted hover:opacity-80"
                    >
                      ✕
                    </button>
                  </span>
                  {lineItems.map((item, i) => (
                    <span
                      key={i}
                      className="flex items-center justify-between gap-3 border-b border-bg-input py-1.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-xs font-semibold text-text-card-strong">{item.name}</span>
                      <span className="whitespace-nowrap text-[11px] font-normal text-text-card-muted">
                        {item.quantity_label}
                      </span>
                    </span>
                  ))}
                </span>
              )}
            </span>
          )}

          {presentation.badge && (
            <span
              className={`ml-3 inline-flex items-center whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[10px] font-medium ${
                BADGE_TONE[presentation.badge_tone ?? "info"]
              }`}
            >
              {presentation.badge}
            </span>
          )}
        </div>

        {card.subtitle && (
          <p className="m-0 text-xs font-medium leading-5 text-text-card-muted">{card.subtitle}</p>
        )}
        {presentation.description && (
          <p className="m-0 text-xs font-medium leading-5 text-text-card-muted">
            {presentation.description}
          </p>
        )}
      </div>

      <div className="shrink-0 max-[649px]:w-full">
        <div className="flex flex-col items-center gap-1 max-[649px]:w-full">
          {primary && (
            <button
              type="button"
              onClick={() => runAction(primary)}
              disabled={removing}
              className={`inline-flex w-44 items-center justify-center whitespace-nowrap rounded-full px-5 py-2 text-xs transition-colors disabled:opacity-60 max-[649px]:w-full ${PRIMARY_BTN[accent]}`}
            >
              {primary.label}
            </button>
          )}
          {remove && (
            <button
              type="button"
              onClick={() => runAction(remove)}
              disabled={removing}
              className="cursor-pointer text-[10px] font-normal text-primary underline transition-opacity hover:opacity-75 disabled:opacity-60"
            >
              {remove.label}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
