"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowLeftSLine } from "react-icons/ri";
import { PatientSidebar } from "@/components/Navbar/PatientSidebar";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export const PatientShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAccountRoot = pathname === "/account";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 min-[900px]:flex-row">
      {/* Sidebar: always visible on desktop; on mobile only on /account */}
      <div
        className={cn(
          isAccountRoot ? "block" : "hidden",
          "min-[900px]:block",
        )}
      >
        <PatientSidebar />
      </div>

      {/* Content: always visible on desktop; on mobile only on sub-routes */}
      <main
        className={cn(
          "min-w-0 flex-1",
          isAccountRoot ? "hidden min-[900px]:block" : "block",
        )}
      >
        {/* Back to Account — mobile only, hidden on desktop */}
        {!isAccountRoot && (
          <Link
            href={ROUTES.DASHBOARD}
            className="mb-4 flex items-center gap-1 text-primary font-medium min-[900px]:hidden"
            style={{ fontSize: 15 }}
          >
            <RiArrowLeftSLine style={{ width: 20, height: 20 }} />
            Back To Account
          </Link>
        )}
        {children}
      </main>
    </div>
  );
};
