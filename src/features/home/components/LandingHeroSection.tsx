import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface LandingHeroSectionProps {
  /** Active drug — drives gradient, accent, copy, tablet images. Defaults to sildenafil. */
  theme?: LandingTheme;
  /** Dosage label from the resolved variant, e.g. "100 mg". */
  dosage: string;
  /** Lowest per-tablet price, pre-formatted to 2 decimals (regular mode). */
  pricePerTablet?: string;
  /** lowest-price = regular (as-low-as/per-tablet); try = free-tier (sample pack). */
  regular?: boolean;
  /** CTA target — kept a prop so the hero is reusable on any landing route. */
  href: string;
  /** Free-tier only. */
  discountAmount?: number;
  quantity?: string;
  shippingCost?: number;
  className?: string;
}

const THEME: Record<
  LandingTheme,
  { container: string; fda: string; pill: string; button: string; glow: string }
> = {
  sildenafil: {
    container: "bg-[linear-gradient(180deg,#081C27_0%,#133243_100%)]",
    fda: "text-[#5092FF]",
    pill: "bg-[#204AD7]",
    button: "bg-[#204AD7] hover:bg-[#08299A]",
    glow: "bg-[#1B53AF]",
  },
  tadalafil: {
    container: "bg-[radial-gradient(50%_50%_at_50%_50%,#423317_0%,#2D1C09_100%)]",
    fda: "text-[#CD8F24]",
    pill: "bg-[#CD8F24]",
    button: "bg-[#CD8F24] hover:bg-[#956004]",
    glow: "bg-[#6A5229]",
  },
};

const DISPLAY_NAME: Record<LandingTheme, string> = {
  sildenafil: "Sildenafil (Viagra®)",
  tadalafil: "Tadalafil (Cialis®)",
};

// Per-drug tablet cluster layout (aum hero.module.scss desktopTadalafilImg /
// desktopSildenafilImg + regularMobileContainer). Tadalafil pills are larger and
// rotated differently from sildenafil.
const TABLETS: Record<
  LandingTheme,
  {
    mobile: number;
    desktop: number;
    mM1: { top: string; transform: string };
    mM2: { top: string; transform: string };
    dM1: { top: string; transform: string };
    dM2: { top: string; transform: string };
  }
> = {
  sildenafil: {
    mobile: 76,
    desktop: 140,
    mM1: { top: "top-[-3px] min-[480px]:top-[10px]", transform: "translateX(-50%)" },
    mM2: { top: "top-[72px] min-[480px]:top-[80px]", transform: "translateX(-90%) rotate(10deg)" },
    dM1: { top: "top-[11px]", transform: "translateX(-50%)" },
    dM2: { top: "top-[145px]", transform: "translateX(-65%) rotate(-20deg)" },
  },
  // Regular-mode desktop = aum .regularDesktopContainer .desktopTadalafilImg (190px,
  // m1 rotate 6deg / m2 rotate -30deg). aum shifts this container to top:175 (41px below
  // sildenafil) so aum tops -60/83 become -19/124 against our shared top-[134px] container.
  tadalafil: {
    mobile: 110,
    desktop: 190,
    mM1: { top: "top-[-57px] min-[450px]:top-[-20px]", transform: "translateX(-50%)" },
    mM2: { top: "top-[15px] min-[450px]:top-[52px]", transform: "translateX(-65%) rotate(-20deg)" },
    dM1: { top: "top-[-19px]", transform: "translateX(-45%) rotate(6deg)" },
    dM2: { top: "top-[124px]", transform: "translateX(-23%) rotate(-30deg)" },
  },
};

const tabletSrc = (theme: LandingTheme, dosage: string, n: 1 | 2) => {
  const prefix = dosage.includes("2.5") ? "2-5m" : `${dosage.replace(/\D/g, "")}m`;
  return `/images/tablets/${theme}/${prefix}${n}.png`;
};

// Lifts any "®" into a lighter mark (aum .rMark).
const renderName = (name: string) =>
  name.split("®").map((part, i, arr) =>
    i === arr.length - 1 ? (
      <Fragment key={i}>{part}</Fragment>
    ) : (
      <Fragment key={i}>
        {part}
        <span className="ml-0.5 font-light">®</span>
      </Fragment>
    ),
  );

export const LandingHeroSection = ({
  theme = "sildenafil",
  dosage,
  pricePerTablet,
  regular = true,
  href,
  discountAmount,
  quantity,
  shippingCost,
  className,
}: LandingHeroSectionProps) => {
  const t = THEME[theme];
  const tab = TABLETS[theme];
  const m1 = dosage ? tabletSrc(theme, dosage, 1) : null;
  const m2 = dosage ? tabletSrc(theme, dosage, 2) : null;
  const buttonText = theme === "tadalafil" ? "Try Tadalafil" : "Try Sildenafil";

  return (
    <div className={cn("w-full", t.container, className)}>
      <section className="relative mx-auto w-full max-w-[1320px] px-6 pt-[90px] pb-6 text-white min-[1001px]:pt-[100px] min-[1001px]:pr-[4vw] min-[1001px]:pb-16 min-[1001px]:pl-[10vw] min-[1420px]:px-0 min-[1420px]:pt-[110px] min-[1420px]:pb-[70px]">
        {/* US Lab Tested header */}
        <div className="mb-2 flex items-center">
          <Image
            src="/icons/us-flag.svg"
            alt="us-flag"
            width={24}
            height={24}
            className="mr-2 h-[18px] w-[18px] min-[601px]:h-6 min-[601px]:w-6"
          />
          <span className={cn("text-xs font-semibold leading-[142.5%] min-[1001px]:text-[21px]", t.fda)}>
            US Lab Tested &amp; FDA Approved
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-0 text-[32px] font-bold leading-[130%] min-[1001px]:text-[52px]">
          {dosage} {renderName(DISPLAY_NAME[theme])}
        </h1>
        <div className="hidden min-[1001px]:block">
          <h2 className="mb-0 text-[32px] font-bold leading-[130%] min-[1001px]:text-[52px]">
            Prescribed &amp; Delivered
          </h2>
        </div>

        {/* Details + tablet row */}
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex max-w-[250px] flex-col min-[601px]:max-w-[500px]">
            {regular ? (
              <span className="pt-3 text-xs font-normal leading-[142.5%] min-[1024px]:pt-[19px] min-[1024px]:text-sm">
                As low as:
              </span>
            ) : (
              <span className={cn("mt-[13px] mb-[5px] block text-base font-medium leading-[142.5%] line-through", t.fda)}>
                ${discountAmount ? Math.round(discountAmount) : 0}
              </span>
            )}

            <span className={cn("my-3 w-max px-[9px] py-[3px] text-sm font-semibold leading-[142.5%] min-[1001px]:text-base", t.pill)}>
              {regular ? `$${pricePerTablet ?? "0.00"}/tablet` : "$0 Sample Pack"}
            </span>

            {!regular && (
              <span className="mt-5 mb-3.5 block text-base font-semibold">Get {quantity} Tablets for Free*</span>
            )}

            <span className="block text-sm font-normal leading-[142.5%] min-[1001px]:text-[20px]">
              Clinically proven ED treatment that helps men feel confident &amp; enjoy better sex.
            </span>
          </div>

          {/* Tablet cluster — mobile (in-flow) */}
          <div className="min-[1000px]:hidden">
            {m1 && m2 && (
              <div className="ml-[60px] mr-[40px] flex flex-col">
                <div className="relative h-[120px]">
                  <Image
                    src={m1}
                    alt=""
                    width={tab.mobile}
                    height={tab.mobile}
                    unoptimized
                    style={{ transform: tab.mM1.transform, width: tab.mobile, height: tab.mobile }}
                    className={cn("absolute left-1/2 max-w-none object-contain", tab.mM1.top)}
                  />
                  <Image
                    src={m2}
                    alt=""
                    width={tab.mobile}
                    height={tab.mobile}
                    unoptimized
                    style={{ transform: tab.mM2.transform, width: tab.mobile, height: tab.mobile }}
                    className={cn("absolute left-1/2 z-[2] max-w-none object-contain", tab.mM2.top)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tablet cluster — desktop (absolute, floats top-right) */}
        {m1 && m2 && (
          <div className="pointer-events-none absolute right-0 top-[134px] hidden h-[514px] w-[514px] min-[1000px]:block">
            <div className={cn("absolute bottom-[100px] h-[514px] w-[514px] rounded-full opacity-30 blur-[50px]", t.glow)} />
            <div className="relative z-[1] h-[120px]">
              <Image
                src={m1}
                alt=""
                width={tab.desktop}
                height={tab.desktop}
                unoptimized
                style={{ transform: tab.dM1.transform, width: tab.desktop, height: tab.desktop }}
                className={cn("absolute right-[100px] z-[1] max-w-none object-contain", tab.dM1.top)}
              />
              <Image
                src={m2}
                alt=""
                width={tab.desktop}
                height={tab.desktop}
                unoptimized
                style={{ transform: tab.dM2.transform, width: tab.desktop, height: tab.desktop }}
                className={cn("absolute right-[150px] z-[2] max-w-none object-contain", tab.dM2.top)}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex w-full flex-col items-center justify-center min-[650px]:items-start min-[1001px]:w-max min-[1001px]:items-center">
          <Link
            href={href}
            className={cn(
              "group mt-[26px] mb-5 flex w-full items-center justify-center gap-5 rounded-[30px] border border-white py-2 px-[10px] text-[18px] font-bold leading-[1.5] text-white transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] min-[651px]:mt-8 min-[651px]:mb-[11px] min-[651px]:w-max min-[651px]:px-[50px]",
              t.button,
            )}
          >
            <span className="flex items-center justify-center gap-[5px]">
              <span>{regular ? "Get Started" : buttonText}</span>
              <span className="group-hover:underline">{regular ? "Today" : "FREE"}</span>
              <Image src="/images/why-love/arrow-figma.svg" alt="arrow" width={17} height={17} className="ml-[10px] mr-[-10px] h-[17px] w-[17px]" />
            </span>
          </Link>

          <span className="block text-sm font-semibold leading-[142.5%]">No Subscription + No Gimmicks</span>

          {!regular && <span className="mt-5 block text-[11px] font-normal">*${shippingCost} Shipping &amp; Handling</span>}
        </div>
      </section>
    </div>
  );
};
