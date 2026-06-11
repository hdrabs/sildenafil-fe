"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useResetPassword as useResetPasswordMutation } from "@/api/hooks/useAuthQueries";
import { authService } from "@/api/services/authService";
import { useSetUser } from "@/store";
import { ROUTES } from "@/constants/routes";
import { ResetPasswordFormValues } from "../schemas/resetPasswordSchema";

export const useResetPassword = (resetToken: string) => {
  const router = useRouter();
  const setUser = useSetUser();
  const { mutate, isPending } = useResetPasswordMutation();
  const [resetError, setResetError] = useState<string | null>(null);

  const reset = (values: ResetPasswordFormValues) => {
    setResetError(null);
    mutate(
      {
        reset_password_token: resetToken,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      },
      {
        onSuccess: async ({ token }) => {
          try {
            const me = await authService.me();
            setUser({
              id: me.id,
              email: me.email,
              firstName: me.first_name,
              lastName: me.last_name,
              token,
            });
            router.replace(ROUTES.DASHBOARD);
          } catch {
            toast.error("Password reset. Please sign in.");
            router.replace(ROUTES.LOGIN);
          }
        },
        onError: (err) => {
          setResetError(
            (err as { message?: string })?.message ?? "Password reset failed",
          );
        },
      },
    );
  };

  return { reset, isPending, resetError };
};
