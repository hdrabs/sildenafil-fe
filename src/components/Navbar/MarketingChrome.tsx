"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { MainNav } from "@/components/Navbar/MainNav";
import { MarketingNavbar } from "@/components/Navbar/MarketingNavbar";

/**
 * Picks the navbar for the (marketing) route group: the home page keeps the full
 * MainNav; the funnel landing pages get the slim, drug-themed MarketingNavbar.
 */
export const MarketingChrome = () => {
  const pathname = usePathname();

  if (pathname === "/") return <MainNav showAnnouncement />;

  // MarketingNavbar reads ?discount via useSearchParams — wrap in Suspense.
  return (
    <Suspense fallback={null}>
      <MarketingNavbar />
    </Suspense>
  );
};
