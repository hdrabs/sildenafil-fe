"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useRegister } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { useSetUser, useCartToken, useSetActiveCart } from "@/store";
import { ROUTES } from "@/constants/routes";
import { SignupFormValues } from "../schemas/signupSchema";

export const useSignupUser = () => {
  const router = useRouter();
  const setUser = useSetUser();
  const setActiveCart = useSetActiveCart();
  const cartToken = useCartToken();
  const { mutate, isPending } = useRegister();
  const [signupError, setSignupError] = useState<string | null>(null);

  const signup = (values: SignupFormValues) => {
    setSignupError(null);
    mutate(
      {
        user: {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          password: values.password,
          password_confirmation: values.password,
          terms_of_service: true,
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(cartToken && { cart_token: cartToken }),
        },
      },
      {
        onSuccess: async ({ token, cart, redirect_path }) => {
          setUser({
            id: 0,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
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

            if (cart && redirect_path) {
              setActiveCart({ cart, variantLabel: "", redirectPath: redirect_path });
              router.replace(redirect_path);
            } else {
              router.replace(ROUTES.DASHBOARD);
            }
          } catch {
            toast.error("Could not load your profile. Please try again.");
          }
        },
        onError: (err) => {
          setSignupError(
            (err as { message?: string })?.message ?? "Registration failed",
          );
        },
      },
    );
  };

  return { signup, isPending, signupError };
};
