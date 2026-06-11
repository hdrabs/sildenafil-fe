"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsAuthenticated, useHasHydrated } from "@/store";
import { ROUTES } from "@/constants/routes";
import { PageLoader } from "@/components/PageLoader";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (!hasHydrated) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(`${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(pathname)}`);
    } else if (!requireAuth && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [hasHydrated, isAuthenticated, requireAuth, router, pathname]);

  if (!hasHydrated) return <PageLoader />;

  if (requireAuth && !isAuthenticated) return <PageLoader />;
  if (!requireAuth && isAuthenticated) return <PageLoader />;

  return <>{children}</>;
};
