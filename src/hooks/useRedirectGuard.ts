"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect without flashing the current page. Fires router.replace(to) when
 * `shouldRedirect` becomes true, and returns the same boolean so the caller can OR it
 * into its loading flag — the page then stays on its loader (instead of rendering its
 * real content for a frame) until the navigation lands. Effects run after paint, so
 * without this a "redirect me away" page briefly shows itself first.
 */
export const useRedirectGuard = (shouldRedirect: boolean, to: string): boolean => {
  const router = useRouter();

  useEffect(() => {
    if (shouldRedirect) router.replace(to);
  }, [shouldRedirect, to, router]);

  return shouldRedirect;
};
