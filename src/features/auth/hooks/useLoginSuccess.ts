"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { authService, AuthTokenResponse } from "@/api/services/authService";
import { useSetUser, useSetActiveCart, useClearActiveCart } from "@/store";
import { ROUTES } from "@/constants/routes";

/**
 * Shared post-login handler for both the password and OTP paths. Seeds the user
 * store, then applies the backend's cart reconciliation (S1–S4): adopt/resume the
 * returned cart, or clear a dropped guest token, and navigate to the server-chosen
 * path. The reconcile decision is entirely backend-owned; the FE only renders it.
 */
export const useLoginSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useSetUser();
  const setActiveCart = useSetActiveCart();
  const clearActiveCart = useClearActiveCart();

  return async (
    { token, cart, redirect_path, cart_token_cleared }: AuthTokenResponse,
    initialEmail = "",
  ) => {
    // Seed the token first so authService.me() sends the Bearer.
    setUser({ id: 0, email: initialEmail, firstName: "", lastName: "", token, jti: "", pocketmedUuid: null });

    const me = await authService.me();
    setUser({
      id: me.id,
      email: me.email,
      firstName: me.first_name,
      lastName: me.last_name,
      token,
      jti: me.jti,
      pocketmedUuid: me.pocketmed_uuid ?? null,
    });

    if (cart) {
      setActiveCart({ cart, carts: [], orderId: null, variantLabel: "", redirectPath: redirect_path ?? "" });
    } else if (cart_token_cleared) {
      // S4 / empty-clear: the guest token cart was dropped server-side.
      clearActiveCart();
    }

    const redirectTo = searchParams.get("redirectTo");
    router.replace(redirect_path ?? redirectTo ?? ROUTES.HOME);
  };
};
