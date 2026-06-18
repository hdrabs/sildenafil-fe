"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUser, useActiveCart, useSetActiveCart } from "@/store";
import { useGetActiveCart } from "@/api/hooks/useCartQueries";
import { NavDrawer } from "@/components/Navbar/NavDrawer";
import { CartDrawer } from "@/components/Navbar/CartDrawer";

interface MainNavProps {
  showAnnouncement?: boolean;
}

export const MainNav = ({ showAnnouncement = false }: MainNavProps) => {
  const user = useUser();
  const activeCart = useActiveCart();
  const setActiveCart = useSetActiveCart();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Restore cart from backend when authenticated but store is empty (e.g. new browser/tab)
  const { data: backendCart } = useGetActiveCart(!!user && !activeCart);

  useEffect(() => {
    if (backendCart) setActiveCart(backendCart);
  }, [backendCart, setActiveCart]);

  const isHome = pathname === "/";
  const isAccountPath = pathname.startsWith("/account");

  return (
    <>
      {showAnnouncement && (
        <div className="border-b border-[#b8daff] bg-[#cce5ff] py-2 text-center text-sm font-semibold text-[#004085]">
          Save Up To 90% + FREE Consultation + FREE Shipping
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-border-default bg-bg-card">
        <div className="flex h-14 w-full items-center justify-between px-[18px]">
          {/* Left group: Logo + nav links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link href={ROUTES.HOME} className="flex shrink-0 items-center">
              <Image
                src="/icons/logo-mobile.svg"
                alt="Sildenafil.com"
                width={92}
                height={18}
                className="block sm:hidden"
                priority
              />
              <Image
                src="/icons/logo.svg"
                alt="Sildenafil.com"
                width={102}
                height={20}
                className="hidden sm:block"
                priority
              />
            </Link>

            {/* Nav links — desktop only */}
            {!isAccountPath && (
              <nav className="hidden items-center gap-6 md:flex">
                {user && isHome ? (
                  <>
                    <Link
                      href={ROUTES.ORDER_REFILL}
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      Order Refill
                    </Link>
                    <Link
                      href={ROUTES.ORDERS}
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      Orders History
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/#process"
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/#labtested"
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/#help"
                      className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      FAQ
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Phone pill — desktop only */}
            <Link
              href="tel:8447453362"
              className="hidden items-center gap-2 rounded-full border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg-input transition-colors sm:flex"
            >
              <Image src="/icons/navbar/phone-blue.svg" alt="" width={14} height={14} className="shrink-0" />
              Need help? Call us: <span className="text-primary">(844) 745-3362</span>
            </Link>

            {/* Phone icon — mobile only */}
            <a
              href="tel:8447453362"
              aria-label="Call us"
              className="flex flex-col items-center justify-center gap-0 px-1.5 py-1 cursor-pointer rounded-lg transition-colors sm:hidden"
            >
              <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="shrink-0" />
              <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium leading-[135%] text-black">Call Us</span>
            </a>

            {/* Cart */}
            <button
              aria-label="Cart"
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex flex-col items-center justify-center gap-0 px-1.5 py-1 cursor-pointer rounded-lg transition-colors"
            >
              <Image src="/icons/navbar/shopping-cart-solid.svg" alt="" width={20} height={20} className="shrink-0" />
              {activeCart && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
              <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium leading-[135%] text-black">Cart</span>
            </button>

            {!user && (
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}

            {/* Burger menu */}
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className={`flex flex-col items-center justify-center gap-0 px-1.5 py-1 cursor-pointer rounded-lg transition-colors${!user ? " md:hidden" : ""}`}
            >
              <Image src="/icons/navbar/burger-menu.svg" alt="" width={20} height={20} className="shrink-0" />
              <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium leading-[135%] text-black">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
};
