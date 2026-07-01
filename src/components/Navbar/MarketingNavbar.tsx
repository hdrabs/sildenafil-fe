"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useMarketingBanner } from "@/components/Navbar/useMarketingBanner";

/**
 * Themed dark marketing navbar for the funnel/landing pages (aum SecondaryNavBar
 * free-tier variant). Drug-themed: navy/blue for sildenafil, brown/gold for
 * tadalafil. Banner scrolls away; the nav row stays pinned.
 */
export const MarketingNavbar = () => {
  const { text, isTadalafil } = useMarketingBanner();
  const params = useParams<{ slug?: string | string[] }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bannerBg = isTadalafil ? "#CD8F24" : "#204AD7";
  const navBg = isTadalafil ? "#1D1204" : "#041925";
  const btnBg = isTadalafil ? "#CD8F24" : "#204AD7";
  const btnHover = isTadalafil ? "#956004" : "#08299A";

  // "Get Started" hands off to the configurator, preserving the query string.
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug ?? "");
  const prefix = pathname.split("/")[1] || "lowest-price";
  const query = searchParams.toString();
  const getStartedHref = `/${prefix}/product_selection/${slug}${query ? `?${query}` : ""}`;

  return (
    <>
      {/* Themed banner — sits in normal flow so it scrolls away on scroll. */}
      <div
        className="px-5 py-3 text-center text-[14px] font-semibold leading-tight text-white"
        style={{ backgroundColor: bannerBg }}
      >
        {text}
      </div>

      {/* Dark themed nav row — stays pinned while the banner scrolls away. */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:px-16"
        style={{ backgroundColor: navBg }}
      >
        {/* Logo — intentionally NOT a link */}
        <Image
          src="/icons/logo-sildenafil-com.svg"
          alt="Sildenafil.com"
          width={154}
          height={22}
          className="h-[22px] w-auto select-none"
          priority
        />

        <div className="flex items-center gap-[15px]">
          {/* Need help? Call us! — desktop only */}
          <a href="tel:8447453362" className="hidden flex-col text-[12px] font-bold leading-[1.3] text-white sm:flex">
            <span>Need help?</span>
            <span>Call us!</span>
          </a>

          {/* Phone pill — desktop only */}
          <a
            href="tel:8447453362"
            className="hidden items-center gap-2 rounded-full border border-[#262a32] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/10 sm:flex"
          >
            <Image src="/icons/navbar/phone-blue.svg" alt="" width={10} height={10} className="h-[10px] w-[10px] shrink-0" />
            (844)-745-3362
          </a>

          {/* Get Started — themed pill */}
          <Link
            href={getStartedHref}
            className="rounded-full border border-transparent px-4 py-2 text-[12px] font-semibold text-white transition-colors"
            style={{ backgroundColor: btnBg }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = btnBg)}
          >
            Get Started
          </Link>
        </div>
      </header>
    </>
  );
};
