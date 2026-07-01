"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useHasHydrated, useCartHasHydrated, useUser, useActiveCart } from "@/store";
import { useGetActiveCart } from "@/api/hooks/useCartQueries";
import { useCheckoutNavigation } from "@/api/hooks/useCheckoutQueries";
import { stepFromPathname } from "@/features/checkout/lib/stepPaths";
import { ROUTES } from "@/constants/routes";
import { PageLoader } from "@/components/PageLoader";

/**
 * Funnel access guard, mounted once at the (checkout) group layout. It asks the
 * backend (GET /v2/checkout/navigation) whether the user may land on the step this
 * route maps to, and does exactly what the `access` decision says — allow, or replace
 * to a server-supplied redirect_path. All order/branch/precondition logic lives in the
 * backend; this only routes.
 */
export const CheckoutStepGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Both stores must be rehydrated before we trust `user` (userStore) OR `activeCart`
  // (cartStore) — otherwise a not-yet-hydrated cart reads as "no cart" and bounces.
  // Call both hooks unconditionally (Rules of Hooks) before combining.
  const userHydrated = useHasHydrated();
  const cartHydrated = useCartHasHydrated();
  const hasHydrated = userHydrated && cartHydrated;
  const user = useUser();
  const activeCart = useActiveCart();

  const step = stepFromPathname(pathname);

  // Backfill the cart for a logged-in user whose persisted store is empty (hard refresh
  // on a fresh device). Guests rely on the persisted store — there's no guest server cart.
  const { data: backendCart, isLoading: cartLoading } = useGetActiveCart(!!user && !activeCart);
  const cart = activeCart ?? backendCart ?? null;
  const cartId = cart?.cart.id ?? 0;
  const cartToken = cart?.cart.token;

  const resolvingCart = !!user && !activeCart && cartLoading;

  const { data: nav, isLoading: navLoading } = useCheckoutNavigation(
    { step: step ?? "", cart_id: cartId, cart_token: cartToken },
    hasHydrated && !!step && cartId > 0,
  );

  // "No cart to resume" only once hydration and any logged-in backfill have settled —
  // never conclude no-cart from an empty store mid-hydration.
  const noCart = hasHydrated && !!step && !resolvingCart && cartId <= 0;
  const decision = nav?.access;

  // No-cart landing: a logged-in patient (e.g. one who just completed an order, so the
  // cart is gone) belongs in order history; a guest with no cart is sent to sign in
  // (after login the reconcile flow routes them to any resumable cart, or home).
  const noCartRedirect = user ? ROUTES.ORDERS : ROUTES.LOGIN;

  const redirectTo = noCart
    ? noCartRedirect
    : decision && !decision.allowed
      ? decision.redirect_path ?? ROUTES.HOME
      : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  // Ungated route (not a funnel step) — render as-is.
  if (!step) return <>{children}</>;
  // Deciding: wait on hydration, the logged-in cart backfill, and the access query.
  if (!hasHydrated || resolvingCart) return <PageLoader />;
  if (redirectTo) return <PageLoader />;
  if (cartId > 0 && (navLoading || !nav)) return <PageLoader />;
  if (decision?.allowed) return <>{children}</>;

  return <PageLoader />;
};
