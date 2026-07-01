"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useConfirmEmail } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { useSetUser } from "@/store";
import { ROUTES } from "@/constants/routes";

/**
 * Drives the /confirmation?confirmation_token=… landing: confirms the email,
 * exchanges the response for a patient JWT, loads the profile, then lands the
 * patient on their account. Mirrors useBecomeUser's token → /me → setUser flow.
 */
export const useEmailConfirmation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation_token") ?? "";
  const setUser = useSetUser();
  const { mutateAsync } = useConfirmEmail();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!token) {
        setError("This confirmation link is invalid or has expired.");
        return;
      }
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
        toast.success("Your email has been verified.");
        router.replace(ROUTES.PROFILE);
      } catch {
        if (!cancelled) setError("This confirmation link is invalid or has expired.");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token, mutateAsync, setUser, router]);

  return { error };
};
