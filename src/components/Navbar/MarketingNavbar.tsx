"use client";

import Image from "next/image";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCatalog } from "@/api/hooks/useCatalogQueries";
import { buildCatalogParams } from "@/features/landing/catalogParams";
import { useConfiguratorDrug } from "@/store";

const DEFAULT_BANNER = "Save Up To 90% + FREE Consultation + FREE Shipping";

const PhoneIcon = ({ className }: { className: string }) => (
  <Image src="/icons/navbar/phone-blue.svg" alt="" width={18} height={18} className={className} />
);

/**
 * Slim, drug-themed marketing navbar for the funnel/landing pages (NOT the home
 * page). Theme is inferred from the route slug; banner copy comes from the v2
 * catalog's discount.banner_text. The banner scrolls away with the page while the
 * nav row stays pinned to the top. Logo is intentionally not a link.
 */
export const MarketingNavbar = () => {
  const params = useParams<{ slug?: string | string[] }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const configuratorDrug = useConfiguratorDrug();

  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug ?? "");
  // Follow the in-page drug selector so the banner + theme react to a drug switch (the
  // backend then resolves the cart's discount only when it matches this drug); else the URL.
  const slug = configuratorDrug ?? urlSlug;
  const isTadalafil = slug.includes("tadalafi");
  const bannerBg = isTadalafil ? "#CD8F24" : "#204AD7";

  // Banner copy comes from the v2 catalog's discount.banner_text. Rebuild the same
  // query params the page uses so this reuses the prefetched cache (no extra fetch).
  const qtyParam = searchParams.get("qty");
  const { data: variants } = useCatalog(
    buildCatalogParams({
      slug,
      discountCode: searchParams.get("discount") ?? undefined,
      initialQty: qtyParam ? parseInt(qtyParam, 10) : undefined,
      landingContext: searchParams.get("landing_context") ?? pathname.split("/")[1],
    }),
  );
  const bannerText =
    variants?.find((v) => v.discount?.banner_text)?.discount?.banner_text?.trim() || DEFAULT_BANNER;

  return (
    <>
      {/* Themed banner — sits in normal flow so it scrolls away on scroll. */}
      <div
        className="px-5 py-3 text-center text-[14px] font-semibold leading-tight text-white"
        style={{ backgroundColor: bannerBg }}
      >
        {bannerText}
      </div>

      {/* Nav row — stays pinned to the top while the banner scrolls away. */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-[18px] py-3 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.12)]">
        {/* Logo — intentionally NOT a link */}
        <Image
          src="/icons/logo.svg"
          alt="Sildenafil.com"
          width={153}
          height={30}
          className="h-[22px] w-auto select-none"
          priority
        />

        {/* Phone — 3 responsive variants */}
        <div>
          {/* Desktop pill: ≥992px */}
          <a
            href="tel:8447453362"
            className="hidden items-center gap-2.5 rounded-full border border-[#d1d1d1] bg-white px-6 py-2.5 transition-colors hover:bg-[#f4f6fb] min-[992px]:flex"
          >
            <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="text-xs font-medium text-[#262a32]">Need help? Call us:</span>
              <span className="text-xs font-semibold uppercase text-primary">(844) 745-3362</span>
            </span>
          </a>

          {/* Tablet compact: 648–991px */}
          <a
            href="tel:8447453362"
            className="hidden items-center gap-2 min-[648px]:flex min-[992px]:hidden"
          >
            <span className="flex flex-col items-end leading-[1.2]">
              <span className="whitespace-nowrap text-[11px] font-medium text-text-primary">Need help?</span>
              <span className="whitespace-nowrap text-[11px] font-semibold text-primary">Call us</span>
            </span>
            <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
          </a>

          {/* Mobile icon only: <648px */}
          <a href="tel:8447453362" aria-label="Need help? Call us" className="flex min-[648px]:hidden">
            <PhoneIcon className="h-5 w-5 shrink-0" />
          </a>
        </div>
      </header>
    </>
  );
};
