"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useActiveCart, useUser } from "@/store";
import { useUpsellOffer, useSubmitUpsellDecision } from "@/api/hooks/useUpsellQueries";
import { UpsellDecision } from "@/types/upsell";
import { ROUTES } from "@/constants/routes";

const OFFER_SECONDS = 600; // 10-minute window (server enforces the same cap).
const TIMER_KEY = "upsellTimerStartTime";
const CDN_BASE = "https://d3959x8cuku1ma.cloudfront.net/upsell";

/**
 * Orchestrates the post-payment upsell page: loads the server-computed offer for
 * the active cart, runs the 10-minute countdown, picks the product video, and on
 * purchase/decline/timeout records the decision and redirects to the final
 * destination carried in ?redirect_path=. The backend owns all pricing; this hook
 * only renders it and times the offer.
 */
export const useUpsellOfferFlow = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCart = useActiveCart();
  const firstName = useUser()?.firstName ?? "";

  // Prefer the cart_id the backend put in the redirect (self-sufficient once the
  // cart has advanced past the active-cart window); fall back to the store.
  const queryCartId = Number(searchParams.get("cart_id")) || 0;
  const cartId = queryCartId || (activeCart?.cart.id ?? 0);
  // Post-payment carts are user-owned, so Bearer auth covers them; the token is
  // only a fallback (e.g. guest carts) when it matches the resolved cart.
  const cartToken = activeCart?.cart.id === cartId ? activeCart?.cart.token : undefined;

  const redirectPath = useMemo(
    () => searchParams.get("redirect_path") || ROUTES.ORDERS,
    [searchParams],
  );

  const { data, isLoading } = useUpsellOffer(cartId, cartToken);
  const submit = useSubmitUpsellDecision();
  const offer = data?.offer ?? null;

  const redirectedRef = useRef(false);
  const redirect = useCallback(() => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    sessionStorage.removeItem(TIMER_KEY);
    router.push(redirectPath);
  }, [router, redirectPath]);

  // No cart, or the cart has no upsell tier → there's nothing to offer here.
  useEffect(() => {
    if (cartId === 0) redirect();
  }, [cartId, redirect]);
  useEffect(() => {
    if (!isLoading && data && data.offer === null) redirect();
  }, [isLoading, data, redirect]);

  const [secondsLeft, setSecondsLeft] = useState(OFFER_SECONDS);
  useEffect(() => {
    const stored = sessionStorage.getItem(TIMER_KEY);
    const start = stored ? Number(stored) : Date.now();
    if (!stored) sessionStorage.setItem(TIMER_KEY, String(start));

    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const left = Math.max(0, OFFER_SECONDS - elapsed);
      setSecondsLeft(left);
      if (left === 0) redirect();
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [redirect]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const videoSrc = offer ? `${CDN_BASE}/${offer.video_name}${isMobile ? "_m" : "_d"}.mp4` : null;

  const decide = useCallback(
    async (decision: UpsellDecision) => {
      try {
        await submit.mutateAsync({ cart_id: cartId, cart_token: cartToken, decision });
      } finally {
        // Always leave the page — a late/expired decision (422) shouldn't trap the user.
        redirect();
      }
    },
    [submit, cartId, cartToken, redirect],
  );

  return {
    offer,
    cart: data?.cart ?? null,
    firstName,
    isLoading,
    secondsLeft,
    videoSrc,
    purchase: () => decide("purchased"),
    decline: () => decide("not_interested"),
    isSubmitting: submit.isPending,
  };
};
