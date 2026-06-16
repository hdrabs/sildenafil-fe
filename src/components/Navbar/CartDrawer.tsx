"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useActiveCart, useClearActiveCart } from "@/store";
import { useDeleteCartV2 } from "@/api/hooks/useCartQueries";
import { ROUTES } from "@/constants/routes";

const DEFAULT_PRODUCT_SLUG = "sildenafil-citrate-20-mg";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const router = useRouter();
  const activeCart = useActiveCart();
  const clearActiveCart = useClearActiveCart();
  const { mutateAsync: deleteCart, isPending: isDeleting } = useDeleteCartV2();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [headerShadow, setHeaderShadow] = useState(false);

  /* ── body scroll lock (iOS-compatible) ── */
  useEffect(() => {
    if (!open) {
      const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.width     = "";
      document.body.style.overflowY = "";
      if (scrollY) window.scrollTo(0, scrollY);
      return;
    }
    const scrollY = window.scrollY;
    document.body.style.position  = "fixed";
    document.body.style.top       = `-${scrollY}px`;
    document.body.style.width     = "100%";
    document.body.style.overflowY = "scroll";
    return () => {
      const y = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.position  = "";
      document.body.style.top       = "";
      document.body.style.width     = "";
      document.body.style.overflowY = "";
      if (y) window.scrollTo(0, y);
    };
  }, [open]);

  /* ── drawer scroll → sticky header shadow ── */
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    const onScroll = () => setHeaderShadow(el.scrollTop > 0);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  const handleContinueProcess = () => {
    onClose();
    if (activeCart?.redirectPath) {
      router.push(activeCart.redirectPath);
    }
  };

  const handleDelete = async () => {
    if (!activeCart) return;
    try {
      await deleteCart({
        id: activeCart.cart.id,
        cartToken: activeCart.cart.token,
      });
      clearActiveCart();
    } catch {
      toast.error("Failed to delete cart. Please try again.");
    }
  };

  const handleShopMedications = () => {
    onClose();
    router.push(ROUTES.PRODUCT_SELECTION(DEFAULT_PRODUCT_SLUG));
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(14,31,58,0.45)]"
          style={{ animation: "cartFadeIn 0.25s ease-in-out" }}
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-[290px] min-[1040px]:w-[440px] flex-col bg-white shadow-[-4px_0_24px_rgba(14,31,58,0.13)] rounded-l-2xl overflow-y-auto overflow-x-hidden overscroll-contain transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {/* Sticky header */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between bg-white px-6 pt-5 pb-4 min-[1040px]:px-10 transition-shadow duration-200 ${
            headerShadow ? "shadow-[0_2px_8px_rgba(14,31,58,0.12)]" : ""
          }`}
        >
          <h2 className="text-lg font-bold text-text-primary min-[1040px]:text-xl">
            Shopping Cart
          </h2>
          <button
            aria-label="Close cart"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg-input transition-colors shrink-0"
          >
            <Image
              src="/icons/navbar/entypo-cross.svg"
              alt=""
              width={24}
              height={24}
              className="shrink-0 opacity-60"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-6 min-[1040px]:px-10">
          {activeCart ? (
            <>
              {/* Cart item row */}
              <div className="py-4">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-text-primary text-[15px] min-[1040px]:text-[16px]">
                    {activeCart.variantLabel}
                  </p>
                  <p className="font-semibold text-primary text-[15px] min-[1040px]:text-[16px] shrink-0 ml-4">
                    ${Number(activeCart.cart.final_price).toFixed(2)}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[13px] min-[1040px]:text-[14px] text-text-muted">
                    Quantity: {activeCart.cart.quantity} Tablets
                  </p>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-[12px] min-[1040px]:text-[13px] font-semibold uppercase tracking-wide text-text-error hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="h-px bg-border-default" />

              {/* Continue Process CTA */}
              <div className="mt-auto pb-6 pt-6">
                <button
                  onClick={handleContinueProcess}
                  className="w-full rounded-full bg-primary py-3.5 text-[13px] min-[1040px]:text-[14px] font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
                >
                  Continue Process
                </button>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center">
              <p className="text-[14px] min-[1040px]:text-[16px] font-medium text-text-primary leading-relaxed max-w-[260px]">
                Your shopping cart is empty. Please add an item to your cart before checking out.
              </p>
              <button
                onClick={handleShopMedications}
                className="w-full rounded-full bg-primary py-3.5 text-[13px] min-[1040px]:text-[14px] font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
              >
                Shop ED Medications
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cartFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};
