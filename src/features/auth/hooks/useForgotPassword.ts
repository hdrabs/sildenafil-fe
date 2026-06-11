"use client";

import { useState } from "react";
import { useForgotPassword as useForgotPasswordMutation } from "@/api/hooks/useAuthQueries";
import { ForgotPasswordFormValues } from "../schemas/forgotPasswordSchema";

export const useForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const { mutate, isPending } = useForgotPasswordMutation();

  const submit = (values: ForgotPasswordFormValues) => {
    setForgotError(null);
    mutate(
      { email: values.email },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (err) => {
          setForgotError(
            (err as { message?: string })?.message ?? "Something went wrong",
          );
        },
      },
    );
  };

  return { submit, isPending, submitted, forgotError };
};
