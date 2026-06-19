"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SecondaryNav } from "@/components/Navbar/SecondaryNav";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth={false}>
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-main">
      <SecondaryNav />

      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 pb-8 pt-[120px]">
        <div className="w-full max-w-[500px]">
          <div className="rounded-lg bg-bg-card p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  </AuthGuard>
);

export default AuthLayout;
