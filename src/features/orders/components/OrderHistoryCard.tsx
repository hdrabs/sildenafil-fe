"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const Column = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-bold text-text-primary">{label}</p>
    <p className="text-text-primary">{value}</p>
  </div>
);

const Chevron = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary-blue">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const Divider = () => <div className="my-5 border-t border-border-default" />;

const LineItem = ({
  item,
  onReorder,
}: {
  item: OrderHistoryLineItem;
  onReorder: (reorder: { slug: string; quantity: number }) => void;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-default bg-white p-1.5">
      <Image src={bottleSrc(item.drug)} alt="" width={72} height={72} unoptimized className="h-full w-full object-contain" />
    </div>
    <div className="min-w-0 flex-1 text-text-primary">
      <p className="font-semibold">
        Drug: <span className="font-bold text-primary-blue">{item.drug_name}</span>
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
        className="shrink-0 cursor-pointer rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
      >
        Buy it again
      </button>
    )}
  </div>
);

export const OrderHistoryCard = ({ card }: { card: Card }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

  const header = (
    <>
      <Column label="Date Ordered" value={formatDate(card.created_at)} />
      {card.order_id && <Column label="Order ID" value={card.order_id} />}
      <Column label="Amount" value={money(card.amount)} />
    </>
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl bg-bg-card px-6 py-5 text-left shadow-sm"
      >
        {header}
        <Chevron />
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-bg-card shadow-sm">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-4 bg-bg-input/60 px-6 py-5">
        {header}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Collapse"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c7ccd6] text-white transition-colors hover:bg-[#b3b9c5]"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        {p.timeline && (
          <p className={`mb-4 text-center font-semibold ${p.tone === "success" ? "text-[#1D9629]" : "text-text-muted"}`}>
            {p.timeline}
          </p>
        )}

        {(p.heading || p.status || p.actions.length > 0) && (
          <div className="text-center">
            {p.heading && <h2 className="text-[26px] font-bold text-text-primary">{p.heading}</h2>}
            {p.status && <p className="mt-2 text-lg font-medium text-[#e0584b]">{p.status}</p>}
            {p.detail && <p className="mt-1 text-text-primary">{p.detail}</p>}
            {p.support_phone && (
              <p className="mt-1 text-text-primary">Please call {p.support_phone} for any questions.</p>
            )}
            {p.actions.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {p.actions.map((action) => (
                  <button
                    key={action.type}
                    type="button"
                    onClick={runAction(action)}
                    className="cursor-pointer rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Divider />

        {card.line_items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && <Divider />}
            <LineItem item={item} onReorder={reorder} />
          </Fragment>
        ))}

        <Divider />

        <div className="text-text-primary">
          {card.shipping_type && (
            <p>
              <span className="font-bold">Shipping Type:</span> {card.shipping_type}
            </p>
          )}
          <p className="mt-1">
            <span className="font-bold">Ship To:</span> {card.ship_to ?? ""}
          </p>
        </div>

        <Divider />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-text-primary">
            <span className="font-bold">Payment Method:</span> {card.payment_method ?? "Pending"}
          </p>
          <div className="text-text-primary sm:text-right">
            <p>Sub Total: {money(summary.sub_total)}</p>
            {summary.discount != null && <p>Discount: {money(summary.discount)}</p>}
            <p>Shipping: {summary.shipping > 0 ? money(summary.shipping) : "Free"}</p>
            <p>Sales tax: $0.00</p>
            <div className="my-2 border-t border-border-default" />
            <p>
              <span className="font-bold">Grand Total: </span>
              <span className="font-bold text-[#e0584b]">{money(summary.grand_total)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
