"use client";

import Link from "next/link";
import { useEmailConfirmation } from "@/features/auth/hooks/useEmailConfirmation";
import { ROUTES } from "@/constants/routes";

export const ConfirmationPage = () => {
  const { error } = useEmailConfirmation();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      {error ? (
        <div className="space-y-3">
          <p className="text-text-error">{error}</p>
          <Link href={ROUTES.LOGIN} className="text-primary underline">
            Go to sign in
          </Link>
        </div>
      ) : (
        <p className="text-text-muted">Verifying your email…</p>
      )}
    </main>
  );
};
