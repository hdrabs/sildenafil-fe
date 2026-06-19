"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormValues } from "../schemas/resetPasswordSchema";
import { useResetPassword } from "../hooks/useResetPassword";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeOffIcon } from "@/components/icons/EyeOffIcon";

interface ResetPasswordFormProps {
  resetToken: string;
}

const PasswordToggle = ({ shown, onToggle }: { shown: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-text-muted hover:text-text-primary transition-colors"
    tabIndex={-1}
    aria-label={shown ? "Hide password" : "Show password"}
  >
    {shown ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
  </button>
);

export const ResetPasswordForm = ({ resetToken }: ResetPasswordFormProps) => {
  const { reset, isPending, resetError } = useResetPassword(resetToken);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        hint="Min 8 chars, one uppercase, one lowercase, one number"
        startAdornment={<PasswordIcon className="h-4 w-4" />}
        endAdornment={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((p) => !p)} />}
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm New Password"
        type={showConfirm ? "text" : "password"}
        autoComplete="new-password"
        startAdornment={<PasswordIcon className="h-4 w-4" />}
        endAdornment={<PasswordToggle shown={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />}
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
