"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  OrderHistoryCard as Card,
  OrderHistoryAction,
  OrderHistoryLineItem,
} from "@/types/orderHistory";

const money = (n: number): string => `$${Number(n).toFixed(2)}`;
const pad = (n: number): string => String(n).padStart(2, "0");
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
};
const bottleSrc = (drug: string): string =>
  drug === "tadalafil"
    ? "/images/products/tadalafil-bottle.png"
    : "/images/products/sildenafil-bottle.png";

// AUM close.svg — grey circle + white X, shown when the card is expanded.
const CloseToggle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#CFD6E8" />
    <rect x="8.414" y="7" width="12" height="2" rx="1" transform="rotate(45 8.414 7)" fill="#fff" />
    <rect x="16.899" y="8.414" width="12" height="2" rx="1" transform="rotate(135 16.9 8.414)" fill="#fff" />
  </svg>
);

// AUM chevron-down.svg — blue chevron, shown when collapsed.
const ChevronToggle = () => (
  <svg width="17" height="10" viewBox="0 0 17 10" fill="none" aria-hidden="true">
    <rect x="1.414" width="12" height="2" rx="1" transform="rotate(45 1.414 0)" fill="#1B53AF" />
    <rect x="16.971" y="1.414" width="12" height="2" rx="1" transform="rotate(135 16.97 1.414)" fill="#1B53AF" />
  </svg>
);

const Column = ({ label, value, hideOnMobile }: { label: string; value: string; hideOnMobile?: boolean }) => (
  <div className={hideOnMobile ? "max-md:hidden" : undefined}>
    <p className="text-sm font-semibold leading-snug text-text-primary max-md:text-xs">{label}</p>
    <p className="text-sm text-text-primary">{value}</p>
  </div>
);

const LineItem = ({
  item,
  onReorder,
}: {
  item: OrderHistoryLineItem;
  onReorder: (reorder: { slug: string; quantity: number }) => void;
}) => (
  <div className="flex items-center gap-5 max-md:items-start max-md:gap-3">
    {/* AUM __product-img: 73×73, contained, 8px radius, #e3e3e3 border. */}
    <div className="flex h-[73px] w-[73px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e3e3e3] bg-white">
      <Image src={bottleSrc(item.drug)} alt="" width={73} height={73} unoptimized className="h-full w-full object-contain" />
    </div>
    <div className="flex min-w-0 flex-1 items-center gap-4 max-md:flex-col max-md:items-start max-md:gap-1.5">
      <div className="min-w-0 flex-1 text-text-primary [&>p]:max-md:text-sm">
        <p className="font-semibold">
          Drug: <span className="ml-0.5 font-bold text-[#204ad7]">{item.drug_name}</span>
        </p>
        <p className="font-semibold">
          Quantity: <span className="font-normal">{item.quantity_label}</span>
        </p>
        <p className="font-semibold">
          Price: <span className="font-normal">{money(item.price)}</span>
        </p>
      </div>
      {item.reorder && (
        <button
          type="button"
          onClick={() => onReorder(item.reorder!)}
          className="shrink-0 cursor-pointer whitespace-nowrap rounded-full bg-[#204ad7] px-[30px] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a3fb8] max-md:px-5 max-md:py-2 max-md:text-xs"
        >
          Buy it again
        </button>
      )}
    </div>
  </div>
);

export const OrderHistoryCard = ({ card }: { card: Card }) => {
  const router = useRouter();
  // AUM expands order cards by default.
  const [open, setOpen] = useState(true);
  const { presentation: p, summary } = card;

  const runAction = (action: OrderHistoryAction) => () => {
    if (!action.href) return;
    if (action.external) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(action.href);
  };

  const reorder = (r: { slug: string; quantity: number }) =>
    router.push(`/product-selection/${r.slug}?qty=${r.quantity}`);

  // AUM __delivered: blue for shipped; dark once delivered.
  const timelineColor = p.tone === "success" ? "text-[#262a32]" : "text-[#204ad7]";
  const hasStatus = !!(p.heading || p.status || p.detail || p.support_phone || p.actions.length > 0);

  const rowPad = "px-6 py-5 max-md:px-4";

  return (
    <div className="overflow-hidden rounded-xl bg-bg-card shadow-[0px_0px_20px_rgba(128,148,178,0.2)]">
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-8 bg-[#f7f9fd] px-6 py-4 max-md:gap-3 max-md:px-3.5 max-md:py-3",
          open ? "rounded-t-xl" : "rounded-xl",
        )}
      >
        <Column label="Date Ordered" value={formatDate(card.created_at)} />
        {card.order_id && <Column label="Order ID" value={card.order_id} hideOnMobile />}
        <Column label="Amount" value={money(card.amount)} />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse" : "Expand"}
          className="ml-auto shrink-0 cursor-pointer"
        >
          {open ? <CloseToggle /> : <ChevronToggle />}
        </button>
      </div>

      {/* Body */}
      {open && (
        <div className="flex flex-col">
          {p.timeline && (
            <p className={cn("px-6 pt-5 text-xl font-semibold max-md:px-4 max-md:text-base", timelineColor)}>
              {p.timeline}
            </p>
          )}

          {hasStatus && (
            <div className={cn(rowPad, "text-center")}>
              {p.heading && (
                <h3 className="text-[28px] font-medium leading-tight text-black max-md:text-base max-md:font-semibold">
                  {p.heading}
                </h3>
              )}
              {p.status && <p className="text-base leading-[1.725] text-[#ef2a31]">{p.status}</p>}
              {p.detail && <p className="text-base leading-[1.725] text-black">{p.detail}</p>}
              {p.support_phone && (
                <p className="text-xs leading-[1.725] text-black">
                  Please call{" "}
                  <a
                    href={`tel:${p.support_phone.replace(/[^\d+]/g, "")}`}
                    className="text-black hover:text-[#204ad7] hover:underline"
                  >
                    {p.support_phone}
                  </a>{" "}
                  for any questions.
                </p>
              )}
              {p.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {p.actions.map((action) => (
                    <button
                      key={action.type}
                      type="button"
                      onClick={runAction(action)}
                      className="w-[225px] cursor-pointer rounded-full bg-[#204ad7] px-[30px] py-2.5 text-sm font-normal text-white transition-colors hover:bg-[#1a3fb8] max-md:w-auto"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {card.line_items.map((item, index) => (
            <div key={index} className={cn(rowPad, "border-b border-[#d7dce5]")}>
              <LineItem item={item} onReorder={reorder} />
            </div>
          ))}

          {/* Shipping */}
          <div className={cn(rowPad, "flex flex-col gap-[11px] border-b border-[#d7dce5] max-md:gap-1")}>
            {card.shipping_type && (
              <p className="text-base text-black max-md:text-sm">
                <span className="font-semibold">Shipping Type: </span>
                {card.shipping_type}
              </p>
            )}
            <p className="text-base text-black max-md:text-sm">
              <span className="font-semibold">Ship To: </span>
              {card.ship_to ?? ""}
            </p>
          </div>

          {/* Payment + summary */}
          <div className={cn(rowPad, "flex max-md:flex-col max-md:gap-3")}>
            <p className="flex-1 text-base text-black max-md:text-sm">
              <span className="font-semibold">Payment Method: </span>
              {card.payment_method ?? ""}
            </p>
            <div className="ml-[30px] whitespace-nowrap text-right max-md:ml-0 max-md:w-full max-md:whitespace-normal max-md:text-left [&>p]:mb-2 [&>p]:text-base max-md:[&>p]:mb-0 max-md:[&>p]:text-sm">
              <p>Sub Total: {money(summary.sub_total)}</p>
              {summary.discount != null && <p>Discount: {money(summary.discount)}</p>}
              <p>Shipping: {summary.shipping > 0 ? money(summary.shipping) : "Free"}</p>
              <p>Sales tax: {money(0)}</p>
              <hr className="my-2 border-t border-[#e0e7f2]" />
              <p className="font-semibold">
                <span>Grand Total: </span>
                <span className="font-semibold text-[#ef2a31]">{money(summary.grand_total)}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
