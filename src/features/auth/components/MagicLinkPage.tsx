"use client";

import Link from "next/link";
import { useMagicLink } from "@/features/auth/hooks/useMagicLink";
import { ROUTES } from "@/constants/routes";

export const MagicLinkPage = ({ token }: { token: string }) => {
  const { error } = useMagicLink(token);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      {error ? (
        <div className="space-y-3">
          <p className="text-text-error">{error}</p>
          <Link href={ROUTES.ORDER_REFILL} className="text-primary underline">
            Go to your refills
          </Link>
        </div>
      ) : (
        <p className="text-text-muted">Opening your refill…</p>
      )}
    </main>
  );
};
