"use client";

import { MainNav } from "@/components/Navbar/MainNav";
import { useMarketingBanner } from "@/components/Navbar/useMarketingBanner";

/**
 * Full {@link MainNav} (Call Us, Cart, conditional Sign In, Menu) driven by the
 * funnel's dynamic discount banner. Used only for the /best-value page.
 */
export const MarketingMainNav = () => {
  const { text } = useMarketingBanner();
  return <MainNav showAnnouncement announcement={text} />;
};
