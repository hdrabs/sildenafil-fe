"use client";

import { use } from "react";
import Link from "next/link";
import { useBecomeUser } from "@/features/auth/hooks/useBecomeUser";
import { ROUTES } from "@/constants/routes";

const BecomePage = ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = use(params);
  const { error } = useBecomeUser(token);

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
        <p className="text-text-muted">Signing you in…</p>
      )}
    </main>
  );
};

export default BecomePage;
