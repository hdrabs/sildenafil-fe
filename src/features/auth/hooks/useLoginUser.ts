"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useLogin } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { useSetUser } from "@/store";
import { ROUTES } from "@/constants/routes";
import { LoginFormValues } from "../schemas/loginSchema";

export const useLoginUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useSetUser();
  const { mutate, isPending } = useLogin();
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = (values: LoginFormValues) => {
    setLoginError(null);
    mutate(
      { identifier: values.identifier, password: values.password },
      {
        onSuccess: async ({ token }) => {
          setUser({
            id: 0,
            email: values.identifier,
            firstName: "",
            lastName: "",
            token,
            jti: "",
          });
          try {
            const me = await authService.me();
            setUser({
              id: me.id,
              email: me.email,
              firstName: me.first_name,
              lastName: me.last_name,
              token,
              jti: me.jti,
            });
            const redirectTo = searchParams.get("redirectTo");
            router.replace(redirectTo ?? ROUTES.DASHBOARD);
          } catch {
            toast.error("Could not load your profile. Please try again.");
          }
        },
        onError: (err) => {
          setLoginError(
            (err as { message?: string })?.message ?? "Invalid credentials",
          );
        },
      },
    );
  };

  return { login, isPending, loginError };
};
