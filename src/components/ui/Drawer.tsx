"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Header title; omit for a header with just the close button. */
  title?: ReactNode;
  children: ReactNode;
  /** "default" = nav/cart width; "wide" = roomier, for content-heavy drawers. */
  size?: "default" | "wide";
  /** Override the scrollable body wrapper classes (e.g. legal typography). */
  bodyClassName?: string;
  closeLabel?: string;
  ariaLabel?: string;
}

const WIDTH: Record<NonNullable<DrawerProps["size"]>, string> = {
  default: "w-[290px] rounded-l-2xl min-[1040px]:w-[440px]",
  // Full-width on phones (≤ max-w-md), so drop the rounded edge there — it reads
  // as a full page; keep it once there's an overlay gap on larger screens.
  wide: "w-full max-w-md rounded-l-2xl max-[448px]:rounded-none min-[1040px]:max-w-lg",
};

/**
 * The single right-side slide-over used across the app (cart, burger menu, and
 * the checkout/legal drawers). Chrome — overlay, panel width, rounded edge,
 * sticky header with close, and the iOS-safe body-scroll lock — matches the nav
 * drawers so every drawer looks and behaves identically.
 */
export const Drawer = ({
  open,
  onClose,
  title,
  children,
  size = "default",
  bodyClassName,
  closeLabel = "Close",
  ariaLabel,
}: DrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [headerShadow, setHeaderShadow] = useState(false);

  /* ── body scroll lock ── overflow-only (no reposition) so opening mid-page
     doesn't jump the layout; pad for the removed scrollbar to avoid a shift. */
  useEffect(() => {
    if (!open) return;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open]);

  /* ── drawer scroll → sticky header shadow ── */
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onScroll = () => setHeaderShadow(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(14,31,58,0.45)]"
          style={{ animation: "uiDrawerFadeIn 0.25s ease-in-out" }}
          onClick={onClose}
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        className={`fixed right-0 top-0 z-50 flex h-full ${WIDTH[size]} flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-white shadow-[-4px_0_24px_rgba(14,31,58,0.13)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between gap-3 bg-white px-6 pt-5 pb-4 transition-shadow duration-200 min-[1040px]:px-10 ${
            headerShadow ? "shadow-[0_2px_8px_rgba(14,31,58,0.12)]" : ""
          }`}
        >
          {title ? (
            <h2 className="text-lg font-bold text-text-primary min-[1040px]:text-xl">{title}</h2>
          ) : (
            <span />
          )}
          <button
            aria-label={closeLabel}
            onClick={onClose}
            className="flex shrink-0 items-center justify-center rounded-full p-1.5 text-text-muted transition-colors hover:bg-bg-input"
          >
            <CloseIcon className="h-7 w-7 shrink-0" />
          </button>
        </div>

        <div className={bodyClassName ?? "flex flex-1 flex-col px-6 pb-6 min-[1040px]:px-10"}>
          {children}
        </div>
      </div>

      <style>{`@keyframes uiDrawerFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
};
