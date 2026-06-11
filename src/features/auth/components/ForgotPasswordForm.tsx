"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "../schemas/forgotPasswordSchema";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export const ForgotPasswordForm = () => {
  const { submit, isPending, submitted, forgotError } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="font-semibold text-text-primary">Check your inbox</h3>
        <p className="mt-1 text-sm text-text-muted">
          If that email is registered, you&apos;ll receive a reset link shortly.
        </p>
        <Link
          href={ROUTES.LOGIN}
          className="mt-4 block text-sm text-text-link hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <p className="text-sm text-text-muted">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message ?? forgotError ?? undefined}
        {...register("email")}
      />
      <Button type="submit" loading={isPending} fullWidth>
        Send reset link
      </Button>
      <Link
        href={ROUTES.LOGIN}
        className="text-center text-sm text-text-link hover:underline"
      >
        Back to sign in
      </Link>
    </form>
  );
};
