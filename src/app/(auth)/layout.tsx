"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth={false}>
    <div className="relative flex min-h-screen flex-col bg-bg-main">
      <SecondaryNav />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border-default bg-bg-card p-8 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  </AuthGuard>
);

export default AuthLayout;
