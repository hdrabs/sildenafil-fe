"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBecome } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { useSetUser } from "@/store";
import { ROUTES } from "@/constants/routes";

/**
 * Drives the /users/become/:token deep link: exchanges the admin sign-in token for
 * a patient JWT, loads the patient profile, then lands them on their current order.
 * Mirrors useLoginUser's token → /me → setUser flow.
 */
export const useBecomeUser = (token: string) => {
  const router = useRouter();
  const setUser = useSetUser();
  const { mutateAsync } = useBecome();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const { token: jwt } = await mutateAsync(token);
        // Seed the token first so the /me request is authenticated.
        setUser({ id: 0, email: "", firstName: "", lastName: "", token: jwt, jti: "" });

        const me = await authService.me();
        if (cancelled) return;

        setUser({
          id: me.id,
          email: me.email,
          firstName: me.first_name,
          lastName: me.last_name,
          token: jwt,
          jti: me.jti,
        });
        router.replace(ROUTES.ORDERS);
      } catch {
        if (!cancelled) setError("This sign-in link is invalid or has expired.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, mutateAsync, setUser, router]);

  return { error };
};
