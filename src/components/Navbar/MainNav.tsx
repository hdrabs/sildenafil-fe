"use client";

import { useState } from "react";
import Link from "next/link";
import { RiPhoneLine, RiShoppingCartLine, RiMenuLine } from "react-icons/ri";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/store";
import { NavDrawer } from "@/components/Navbar/NavDrawer";

interface MainNavProps {
  showAnnouncement?: boolean;
}

export const MainNav = ({ showAnnouncement = false }: MainNavProps) => {
  const user = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {showAnnouncement && (
        <div className="bg-bg-announcement py-2 text-center text-sm font-medium text-white">
          Save Up To 90% + FREE Consultation + FREE Shipping
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-border-default bg-bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="text-xl font-bold text-primary">
            Sildenafil
          </Link>

          {/* Center links — desktop, unauthenticated only */}
          {!user && (
            <nav className="hidden items-center gap-8 md:flex">
              <Link href="/#process"   className="text-sm font-medium text-text-primary hover:text-primary transition-colors">How It Works</Link>
              <Link href="/#labtested" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">Pricing</Link>
              <Link href="/#help"      className="text-sm font-medium text-text-primary hover:text-primary transition-colors">FAQ</Link>
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="tel:8447453362"
              className="hidden items-center gap-2 rounded-full border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg-input transition-colors sm:flex"
            >
              <RiPhoneLine className="h-3.5 w-3.5 text-primary" />
              Need help? Call us: <span className="text-primary">(844) 745-3362</span>
            </Link>

            <button
              aria-label="Cart"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-input transition-colors"
            >
              <RiShoppingCartLine className="h-5 w-5 text-text-primary" />
            </button>

            {!user && (
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex h-9 items-center justify-center rounded-full bg-bg-sidebar-dark px-5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}

            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-input transition-colors"
            >
              <RiMenuLine className="h-5 w-5 text-text-primary" />
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
