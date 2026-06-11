"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ROUTES } from "@/constants/routes";

export const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("reset_password_token") ?? searchParams.get("token");

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-text-muted">
          This reset link is invalid or has expired.
        </p>
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="mt-2 block text-sm text-text-link hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary">Set new password</h1>
        <p className="mt-1 text-sm text-text-muted">
          Choose a strong password for your account
        </p>
      </div>
      <ResetPasswordForm resetToken={token} />
    </div>
  );
};
