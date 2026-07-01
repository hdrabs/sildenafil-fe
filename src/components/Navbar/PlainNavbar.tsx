"use client";

import Image from "next/image";
import { CallUsControl } from "@/components/Navbar/CallUsControl";
import { useMarketingBanner } from "@/components/Navbar/useMarketingBanner";

/**
 * Plain white navbar for the /product-selection and /new-user pages: a themed
 * discount banner on top, then a white bar with the blue logo on the left and the
 * call-us control on the right. No back arrow (unlike the funnel's SecondaryNavbar).
 */
export const PlainNavbar = () => {
  const { text, isTadalafil } = useMarketingBanner();
  const bannerBg = isTadalafil ? "#CD8F24" : "#204AD7";

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
        <div className="flex items-center justify-between px-4 py-3 md:px-16">
          <Image
            src="/icons/logo-sildenafil-com-blue.svg"
            alt="Sildenafil.com"
            width={154}
            height={22}
            className="h-[22px] w-auto select-none"
            priority
          />
          <CallUsControl />
        </div>
      </header>
    </>
  );
};
