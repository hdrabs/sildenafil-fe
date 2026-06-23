"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ChevronLeftIcon } from "@/components/icons/ChevronLeftIcon";
import { SildenafilWordmark } from "@/components/icons/SildenafilWordmark";

interface Props {
  onBack?: () => void;
  isLoading?: boolean;
}

export const SecondaryNav = ({ onBack, isLoading = false }: Props) => {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <header className="sticky top-0 z-30 bg-bg-card shadow-[0_6px_20px_-6px_rgba(0,0,0,0.12)]">
    <div className="relative flex w-full items-center justify-between px-[18px] py-3">
      <button
        onClick={handleBack}
        disabled={isLoading}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-text-primary transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <ChevronLeftIcon />
        )}
      </button>

      <Link href={ROUTES.HOME} className="absolute left-1/2 -translate-x-1/2 flex items-center text-primary">
        <SildenafilWordmark />
      </Link>

      <Link
        href="tel:8447453362"
        className="hidden items-center gap-2 rounded-full border border-[#d1d1d1] bg-white px-3 py-1.5 transition-colors hover:bg-[#f4f6fb] min-[1040px]:gap-2.5 min-[1040px]:px-6 min-[1040px]:py-2.5 sm:flex"
      >
        <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-xs font-medium text-[#262a32]">Need help? Call us:</span>
          <span className="text-xs font-semibold uppercase text-primary">(844) 745-3362</span>
        </span>
      </Link>
    </div>
    </header>
  );
};
