"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/Navbar/MainNav";
import { MarketingNavbar } from "@/components/Navbar/MarketingNavbar";
import { MarketingMainNav } from "@/components/Navbar/MarketingMainNav";
import { SecondaryNavbar } from "@/components/Navbar/SecondaryNavbar";

/**
 * Picks the navbar for the (marketing) route group: the home page keeps the full
 * MainNav; /best-value uses the full MainNav with the funnel's dynamic banner; the
 * funnel's product_selection (configurator) step gets the white SecondaryNavbar;
 * the other funnel landing pages get the slim MarketingNavbar.
 */
export const MarketingChrome = () => {
  const pathname = usePathname();

  if (pathname === "/") return <MainNav showAnnouncement />;

  const funnelNav = pathname.startsWith("/best-value") ? (
    <MarketingMainNav />
  ) : pathname.includes("/product_selection") ? (
    <SecondaryNavbar />
  ) : (
    <MarketingNavbar />
  );

  // All funnel navbars read ?discount via useSearchParams — wrap in Suspense.
  return <Suspense fallback={null}>{funnelNav}</Suspense>;
};
