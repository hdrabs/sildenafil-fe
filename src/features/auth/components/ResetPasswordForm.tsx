"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schemas/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ResetPasswordFormProps {
  resetToken: string;
}

export const ResetPasswordForm = ({ resetToken }: ResetPasswordFormProps) => {
  const { reset, isPending, resetError } = useResetPassword(resetToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(reset)} className="flex flex-col gap-4">
      <Input
        label="New Password"
        type="password"
        autoComplete="new-password"
        hint="Min 8 chars, one uppercase, one lowercase, one number"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm New Password"
        type="password"
        autoComplete="new-password"
        error={errors.passwordConfirmation?.message}
        {...register("passwordConfirmation")}
      />
      {resetError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-text-error">
          {resetError}
        </p>
      )}

      <Button type="submit" loading={isPending} fullWidth>
        Set new password
      </Button>
    </form>
  );
};
