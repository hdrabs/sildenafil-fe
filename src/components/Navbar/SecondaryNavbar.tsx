"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useMarketingBanner } from "@/components/Navbar/useMarketingBanner";

/**
 * White secondary navbar for the funnel's product_selection (configurator) step —
 * aum SecondaryNavBar non-free-tier branch. A themed discount banner sits on top,
 * then a white bar with a back arrow (left), centered logo, and a responsive
 * call-us control (pill ≥992 / compact 648–991 / icon <648). The nav row itself
 * stays white/blue regardless of drug; only the banner is drug-tinted.
 */
export const SecondaryNavbar = () => {
  const { text, isTadalafil } = useMarketingBanner();
  const params = useParams<{ slug?: string | string[] }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bannerBg = isTadalafil ? "#CD8F24" : "#204AD7";

  // Back → the funnel's page-1 landing for this product, query preserved.
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug ?? "");
  const prefix = pathname.split("/")[1] || "lowest-price";
  const query = searchParams.toString();
  const backHref = `/${prefix}/${slug}${query ? `?${query}` : ""}`;

  return (
    <>
      {/* Themed discount banner — sits in flow so it scrolls away. */}
      <div
        className="px-5 py-3 text-center text-[14px] font-semibold leading-tight text-white"
        style={{ backgroundColor: bannerBg }}
      >
        {text}
      </div>

      {/* White nav row — stays pinned while the banner scrolls away. */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_2px_6px_rgba(14,31,58,0.12)]">
        <div className="relative flex items-center justify-between px-4 py-3 md:px-6">
          {/* Back — returns to the landing step */}
          <Link href={backHref} aria-label="Go back" className="flex items-center">
            <svg width="9" height="18" viewBox="0 0 9 18" fill="none" aria-hidden className="shrink-0">
              <g transform="scale(-1,1) translate(-9,0)">
                <path
                  d="M9.006 8.848a1.64 1.64 0 00-.38-.904L2.861 1.11A1.607 1.607 0 001.764.509 1.577 1.577 0 00.573.893a1.623 1.623 0 00-.57 1.139 1.651 1.651 0 00.416 1.197l4.873 5.772L.42 14.776a1.632 1.632 0 00-.416 1.197A1.647 1.647 0 00.56 17.11a1.594 1.594 0 001.191.384 1.584 1.584 0 001.098-.602l5.763-6.833a1.634 1.634 0 00.394-1.21z"
                  fill="#262a32"
                />
              </g>
            </svg>
          </Link>

          {/* Logo — centered, non-interactive (matches aum sildenafil-position) */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <Image
              src="/icons/logo-mobile.svg"
              alt="Sildenafil.com"
              width={92}
              height={18}
              className="h-[18px] w-auto select-none"
              priority
            />
          </div>

          {/* Call us — responsive variants */}
          <div className="flex items-center">
            {/* Desktop pill (≥992) */}
            <a
              href="tel:8447453362"
              className="hidden items-center gap-[10px] rounded-full border border-[#d1d1d1] bg-white px-6 py-[10px] transition-colors hover:bg-[#f5f5f5] min-[992px]:flex"
            >
              <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="text-[12px] font-medium text-[#262a32]">Need help? Call us:</span>
                <span className="text-[12px] font-semibold text-[#1b53af]">(844) 745-3362</span>
              </span>
            </a>

            {/* Tablet compact (648–991) */}
            <a
              href="tel:8447453362"
              className="hidden items-center gap-2 min-[648px]:flex min-[992px]:hidden"
            >
              <span className="flex flex-col items-end leading-[1.2]">
                <span className="text-[11px] font-medium text-[#262a32]">Need help?</span>
                <span className="text-[11px] font-semibold text-[#1b53af]">Call us</span>
              </span>
              <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
            </a>

            {/* Mobile icon (<648) */}
            <a href="tel:8447453362" aria-label="Call us" className="flex min-[648px]:hidden">
              <Image src="/icons/navbar/phone-blue.svg" alt="" width={20} height={20} className="h-[20px] w-[20px]" />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
