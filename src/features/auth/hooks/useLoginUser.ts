"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useLogin } from "@/api/hooks/useAuthQueries";
import { useCartToken } from "@/store";
import { LoginFormValues } from "../schemas/loginSchema";
import { useLoginSuccess } from "./useLoginSuccess";

export const useLoginUser = () => {
  const { mutate, isPending } = useLogin();
  const cartToken = useCartToken();
  const onLoginSuccess = useLoginSuccess();
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = (values: LoginFormValues) => {
    setLoginError(null);
    mutate(
      {
        identifier: values.identifier,
        password: values.password,
        ...(cartToken && { cart_token: cartToken }),
      },
      {
        onSuccess: async (response) => {
          try {
            await onLoginSuccess(response, values.identifier);
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
