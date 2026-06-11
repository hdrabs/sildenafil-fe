"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiPhoneLine } from "react-icons/ri";
import { ROUTES } from "@/constants/routes";

export const SecondaryNav = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-border-default bg-bg-card">
    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
      <button
        onClick={() => router.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-primary hover:bg-bg-input transition-colors"
      >
        <RiArrowLeftLine className="h-5 w-5" />
      </button>

      <Link href={ROUTES.HOME} className="text-xl font-bold text-primary">
        Sildenafil
      </Link>

      <Link
        href="tel:8447453362"
        className="hidden items-center gap-2 rounded-full border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-bg-input transition-colors sm:flex"
      >
        <RiPhoneLine className="h-3.5 w-3.5 text-primary" />
        Need help? Call us: <span className="text-primary">(844) 745-3362</span>
      </Link>
    </div>
    </header>
  );
};
