"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUser, useClearUser, useClearActiveCart, useResetQuestionnaire } from "@/store";
import { useLogout } from "@/api/hooks/useAuthQueries";

const SILDENAFIL_SLUG = "sildenafil-citrate-20-mg";
const TADALAFIL_SLUG  = "tadalafi-generic-10-mg";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NavDrawer = ({ open, onClose }: NavDrawerProps) => {
  const user      = useUser();
  const clearUser = useClearUser();
  const clearActiveCart     = useClearActiveCart();
  const resetQuestionnaire  = useResetQuestionnaire();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const router    = useRouter();

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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    // Invalidate the server session FIRST — it needs the bearer token, which the
    // store clears below wipe. Await it so the hard reload doesn't abort the
    // request, but log out locally regardless of the result (an offline or
    // already-expired token must not trap the user in the app).
    try {
      await logout();
    } catch {
      // Server-side logout failed — proceed with local logout anyway.
    }
    // Clear every persisted, user-specific store so the next session doesn't
    // inherit this user's cart / questionnaire progress from localStorage.
    clearUser();
    clearActiveCart();
    resetQuestionnaire();
    onClose();
    // Hard-navigate so AuthGuard on the current protected page
    // cannot race and append a ?redirectTo before we leave.
    window.location.replace(ROUTES.HOME);
  };

  const goTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(14,31,58,0.45)]"
          style={{ animation: "drawerFadeIn 0.25s ease-in-out" }}
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
        {/* Sticky header row */}
        <div
          className={`sticky top-0 z-10 flex items-center justify-between bg-white px-6 pt-5 pb-2 min-[1040px]:px-10 min-[1040px]:pt-4 transition-shadow duration-200 ${
            headerShadow ? "shadow-[0_2px_8px_rgba(14,31,58,0.12)]" : ""
          }`}
        >
          <span
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap mr-2 font-semibold text-[#152E56]"
            style={{ fontSize: 18 }}
          >
            {user ? `Welcome, ${user.firstName}!` : "Welcome"}
          </span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-1.5 text-text-muted hover:bg-bg-input transition-colors shrink-0"
          >
            <CloseIcon className="h-7 w-7 shrink-0" />
          </button>
        </div>

        {/* ── Authenticated ── */}
        {user ? (
          <>
            <Section label="My Treatments" />
            <NavLink href={ROUTES.ORDER_REFILL} label="Order Refill"     onClose={onClose} />
            <NavLink href={ROUTES.ORDERS}       label="Orders History"   onClose={onClose} />

            <Section label="Account Management" />
            <NavLink href={ROUTES.DASHBOARD}    label="Account"          onClose={onClose} />
            <NavLink href={ROUTES.PAYMENTS}     label="Payment Options"  onClose={onClose} />
            <NavLink href={ROUTES.SETTINGS}     label="Shipping Address" onClose={onClose} />

            <Section label="ED Treatment Options" />
            <NavButton label="Sildenafil (Viagra)" onClick={() => goTo(ROUTES.PRODUCT_SELECTION(SILDENAFIL_SLUG))} />
            <NavButton label="Tadalafil (Cialis)"  onClick={() => goTo(ROUTES.PRODUCT_SELECTION(TADALAFIL_SLUG))} />

            <Section label="Exit" />
            <div className="mx-6 min-[1040px]:mx-10">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2 py-4 text-[14px] min-[1040px]:text-[16px] font-medium text-text-error transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out…" : "Log Out"}
              </button>
              <div className="h-px bg-[#E6E8EE]" />
            </div>

            <div className="mt-auto" />
            <ContactUs />
          </>
        ) : (
          /* ── Unauthenticated ── */
          <>
            <Section label="ED Treatment Options" />
            <NavButton label="Sildenafil (Viagra)" onClick={() => goTo(ROUTES.PRODUCT_SELECTION(SILDENAFIL_SLUG))} />
            <NavButton label="Tadalafil (Cialis)"  onClick={() => goTo(ROUTES.PRODUCT_SELECTION(TADALAFIL_SLUG))} />

            <Section label="Explore" />
            <NavLink href="/#process"   label="How It Works" onClose={onClose} />
            <NavLink href="/#labtested" label="Pricing"      onClose={onClose} />
            <NavLink href="/#help"      label="FAQ"          onClose={onClose} />

            <Section label="Enter" style={{ paddingTop: 32 }} />
            <div className="mx-6 min-[1040px]:mx-10">
              <Link
                href={ROUTES.LOGIN}
                onClick={onClose}
                className="flex w-full items-center py-4 text-[14px] min-[1040px]:text-[16px] font-medium text-text-primary no-underline hover:text-primary transition-colors"
              >
                Sign In
                <Chevron />
              </Link>
              <div className="h-px bg-[#E6E8EE]" />
            </div>

            <div className="mt-auto" />
            <ContactUs />

            <div className="px-6 pb-6 min-[1040px]:px-10">
              <button
                onClick={() => goTo(ROUTES.PRODUCT_SELECTION(SILDENAFIL_SLUG))}
                className="w-full rounded-[300px] bg-primary py-3.5 text-[13px] min-[1040px]:text-[14px] font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Start A New Order
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes drawerFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

/* ── Internal primitives ── */

const Chevron = () => (
  <svg className="ml-auto shrink-0" width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1 1L5 4.5L1 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Section = ({ label, style }: { label: string; style?: React.CSSProperties }) => (
  <p
    className="px-6 min-[1040px]:px-10 pb-1.5 text-[11px] min-[1040px]:text-[14px] font-semibold uppercase tracking-[0.56px] text-[#152E56] opacity-40 pointer-events-none"
    style={{ paddingTop: 24, ...style }}
  >
    {label}
  </p>
);

const NavLink = ({ href, label, onClose }: { href: string; label: string; onClose: () => void }) => (
  <div className="mx-6 min-[1040px]:mx-10">
    <Link
      href={href}
      onClick={onClose}
      className="flex w-full items-center py-4 text-[14px] min-[1040px]:text-[16px] font-medium text-text-primary no-underline hover:text-primary transition-colors"
    >
      {label}
      <Chevron />
    </Link>
    <div className="h-px bg-[#E6E8EE]" />
  </div>
);

const NavButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <div className="mx-6 min-[1040px]:mx-10">
    <button
      onClick={onClick}
      className="flex w-full items-center py-4 text-[14px] min-[1040px]:text-[16px] font-medium text-text-primary hover:text-primary transition-colors"
    >
      {label}
      <Chevron />
    </button>
    <div className="h-px bg-[#E6E8EE]" />
  </div>
);

const ContactUs = () => (
  <>
    <p
      className="px-6 min-[1040px]:px-10 pb-3 text-[11px] min-[1040px]:text-[12px] font-semibold uppercase tracking-[0.56px] text-[#152E56] opacity-40 pointer-events-none"
      style={{ paddingTop: 24 }}
    >
      Need Help? Contact Us
    </p>
    <div className="mx-6 min-[1040px]:mx-10">
      <a
        href="tel:8447453362"
        className="flex items-center justify-center gap-2.5 rounded-[50px] border border-[#d1d1d1] h-[45px] min-[1040px]:h-[48px] text-[13px] min-[1040px]:text-[14px] font-medium uppercase tracking-[0.04em] text-primary no-underline hover:bg-[#f4f6fb] hover:border-primary transition-colors"
      >
        <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="shrink-0" />
        (844) 745-3362
      </a>
    </div>
    <p className="pb-6 pt-3 text-center text-[12px] italic text-[#777] pointer-events-none">
      (M-F 9:00 AM - 5:30 PM PST)
    </p>
  </>
);
