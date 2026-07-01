"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConsumeMagicLink } from "@/api/hooks/useMagicLinkQueries";
import { authService } from "@/api/services/authService";
import { useSetUser, useIsAuthenticated } from "@/store";
import { MagicLinkResolution } from "@/types/magicLink";
import { ROUTES } from "@/constants/routes";

const refillDetailPath = (res: MagicLinkResolution): string => {
  const params = new URLSearchParams();
  if (res.slug) params.set("slug", res.slug);
  if (res.qty != null) params.set("qty", String(res.qty));
  return `${ROUTES.REFILL_PRODUCT_DETAIL}?${params.toString()}`;
};

const loginThen = (target: string): string =>
  `${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(target)}`;

/**
 * Drives /magic-link/:token — the SMS refill nudge. Consumes the link and routes
 * on the backend's outcome (mirrors the legacy MagicLinkHandler):
 *  - skip-login: seed the minted Bearer, load /me, resume the refill;
 *  - require_login + same owner: resume the refill;
 *  - require_login (logged out): log in, then return here to re-consume;
 *  - mismatch / expired: fall back to the refills tab.
 * Works logged-out (baseAPI attaches the Bearer only if one exists).
 */
export const useMagicLink = (token: string) => {
  const router = useRouter();
  const setUser = useSetUser();
  const isLoggedIn = useIsAuthenticated();
  const { mutateAsync } = useConsumeMagicLink();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const signInAndResume = async (jwt: string, res: MagicLinkResolution) => {
      // Seed the token first so /me is authenticated (mirrors useBecomeUser).
      setUser({ id: 0, email: "", firstName: "", lastName: "", token: jwt, jti: "", pocketmedUuid: null });
      const me = await authService.me();
      if (cancelled) return;
      setUser({
        id: me.id,
        email: me.email,
        firstName: me.first_name,
        lastName: me.last_name,
        token: jwt,
        jti: me.jti,
        pocketmedUuid: me.pocketmed_uuid ?? null,
      });
      router.replace(refillDetailPath(res));
    };

    const run = async () => {
      try {
        const res = await mutateAsync(token);
        if (cancelled) return;

        if (res.token) {
          await signInAndResume(res.token, res);
        } else if (res.mismatch_user) {
          router.replace(ROUTES.ORDER_REFILL);
        } else if (res.require_login) {
          if (res.same_user) router.replace(refillDetailPath(res));
          else if (isLoggedIn) router.replace(ROUTES.ORDER_REFILL);
          else router.replace(loginThen(ROUTES.MAGIC_LINK(token)));
        } else {
          // expired / unknown link
          router.replace(isLoggedIn ? ROUTES.ORDER_REFILL : loginThen(ROUTES.ORDER_REFILL));
        }
      } catch {
        if (!cancelled) setError("This link is invalid or has expired.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, mutateAsync, isLoggedIn, setUser, router]);

  return { error };
};
