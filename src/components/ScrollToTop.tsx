"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the window to the top on every route change.
 *
 * Next.js App Router only scrolls to top reliably when a navigation mounts a new
 * page segment. Navigating between instances of the *same* dynamic route
 * (e.g. /intro-questions/[slug] → next slug, /checkout/product-detail/[slug] → another
 * slug) reconciles the component in place, so the previous scroll position
 * sticks. This resets it for every client navigation.
 */
export const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Preserve in-page anchor links (e.g. /#process) — only reset full page changes.
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
