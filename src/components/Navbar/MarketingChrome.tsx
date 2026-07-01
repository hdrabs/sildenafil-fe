"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/Navbar/MainNav";
import { MarketingNavbar } from "@/components/Navbar/MarketingNavbar";
import { MarketingMainNav } from "@/components/Navbar/MarketingMainNav";
import { SecondaryNavbar } from "@/components/Navbar/SecondaryNavbar";
import { PlainNavbar } from "@/components/Navbar/PlainNavbar";

/**
 * Picks the navbar for the (marketing) route group:
 *  - home (`/`)                              → full MainNav
 *  - /best-value                             → full MainNav with the funnel's banner
 *  - funnel `…/product_selection/…` step     → white SecondaryNavbar (back + centered logo)
 *  - /product-selection and /new-user        → plain white PlainNavbar (logo left + call us)
 *  - lowest-price / try landings, etc.       → themed MarketingNavbar
 */
export const MarketingChrome = () => {
  const pathname = usePathname();

  if (pathname === "/") return <MainNav showAnnouncement />;

  const funnelNav = pathname.startsWith("/best-value") ? (
    <MarketingMainNav />
  ) : pathname.includes("/product_selection") ? (
    <SecondaryNavbar />
  ) : pathname.startsWith("/product-selection") || pathname.startsWith("/new-user") ? (
    <PlainNavbar />
  ) : (
    <MarketingNavbar />
  );

  // All funnel navbars read ?discount via useSearchParams — wrap in Suspense.
  return <Suspense fallback={null}>{funnelNav}</Suspense>;
};
