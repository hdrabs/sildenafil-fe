"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import { UpsellOffer } from "@/types/upsell";

// Inter is used only for the numeric price rows on this view. Scoped here (not the
// root layout) so its weights aren't preloaded on every route. The `--font-inter-google`
// variable is applied to the root element below; `font-inter` (globals.css) reads it.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-google",
});

interface UpsellOfferViewProps {
  offer: UpsellOffer;
  firstName: string;
  secondsLeft: number;
  videoSrc: string | null;
  purchase: () => void;
  decline: () => void;
  isSubmitting: boolean;
}

const money = (value: number) => `$${value.toFixed(2)}`;

const formatTime = (seconds: number) => {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return `${mm}M : ${ss}S`;
};

const HeaderTimer = ({ seconds }: { seconds: number }) => (
  <div className="flex items-center gap-3">
    <span className="font-semibold text-[20px] text-primary-blue max-md:text-[16px]">
      Offer Expires in
    </span>
    <div className="flex min-w-[112px] items-center justify-center rounded bg-primary-blue px-2 py-1 font-semibold text-[20px] text-white max-md:min-w-[94px] max-md:text-[16px]">
      {formatTime(seconds)}
    </div>
  </div>
);

// Faint decorative pill-arches behind the offer banner text (desktop only).
const BannerArches = () => (
  <div className="pointer-events-none absolute inset-0 z-0 hidden text-upsell-arch md:block">
    <svg
      className="absolute left-[40px] top-1/2 -translate-y-1/2"
      width="59"
      height="58"
      viewBox="0 0 61 60"
      fill="none"
    >
      <path
        d="M1.36025 58.6331H59.64V30.6766C59.64 14.515 46.5682 1.36916 30.5001 1.36916C14.432 1.36916 1.36025 14.515 1.36025 30.6766V58.6331ZM61 60H0V30.6766C0 13.7622 13.683 0 30.5001 0C47.3172 0 61 13.7622 61 30.6766V60Z"
        fill="currentColor"
      />
    </svg>
    <svg
      className="absolute right-[19px] top-1/2 -translate-y-1/2"
      width="59"
      height="58"
      viewBox="0 0 61 60"
      fill="none"
    >
      <path
        d="M1.36025 58.6331H59.64V30.6766C59.64 14.515 46.5682 1.36916 30.5001 1.36916C14.432 1.36916 1.36025 14.515 1.36025 30.6766V58.6331ZM61 60H0V30.6766C0 13.7622 13.683 0 30.5001 0C47.3172 0 61 13.7622 61 30.6766V60Z"
        fill="currentColor"
      />
    </svg>
    <div className="absolute right-[45px] top-1/2 flex -translate-y-1/2">
      <svg width="48" height="56" viewBox="0 0 57 53" fill="none">
        <path
          d="M57 0L57 1.18166L29.478 1.18166C13.9479 1.18166 1.31567 12.5391 1.31567 26.5C1.31567 40.4609 13.9479 51.8183 29.478 51.8183L57 51.8183L57 53L29.478 53C13.2245 53 3.9665e-06 41.1118 4.15308e-06 26.5C4.33966e-06 11.8884 13.2245 -4.87505e-07 29.478 -3.06498e-07L57 0Z"
          fill="currentColor"
        />
      </svg>
      <svg width="49" height="56" viewBox="0 0 58 53" fill="none">
        <path
          d="M-2.46022e-06 53L-2.40536e-06 51.8183L28.0048 51.8183C43.8075 51.8183 56.6613 40.4609 56.6613 26.5C56.6613 12.5391 43.8075 1.18167 28.0048 1.18167L-5.4852e-08 1.18167L0 0L28.0048 1.15272e-06C44.5435 1.83348e-06 58 11.8882 58 26.5C58 41.1117 44.5435 53 28.0048 53L-2.46022e-06 53Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
);

export const UpsellOfferView = ({
  offer,
  firstName,
  secondsLeft,
  videoSrc,
  purchase,
  decline,
  isSubmitting,
}: UpsellOfferViewProps) => {
  return (
    <div className={`${inter.variable} min-h-screen bg-upsell-bg font-sans max-md:bg-white`}>
      <header className="fixed inset-x-0 top-0 z-[800] flex max-h-[69px] items-center justify-between border-b border-upsell-border bg-bg-card px-[68px] py-5 max-md:px-5 max-md:py-[15px]">
        <Image
          src="/icons/logo-mobile.svg"
          alt="Sildenafil.com"
          width={98}
          height={19}
          className="block sm:hidden"
          priority
        />
        <Image
          src="/icons/logo.svg"
          alt="Sildenafil.com"
          width={149}
          height={29}
          className="hidden sm:block"
          priority
        />
        <div className="hidden md:flex">
          <HeaderTimer seconds={secondsLeft} />
        </div>
      </header>

      <main className="flex flex-col items-center px-0 pb-20 pt-[100px] max-md:pb-6">
        <div className="mb-3 flex self-start px-6 md:hidden">
          <HeaderTimer seconds={secondsLeft} />
        </div>

        <div className="flex flex-col">
          <span className="text-center font-semibold text-[32px] leading-[140%] text-black max-md:px-6 max-md:text-left">
            One Final Step {firstName}!
          </span>
          <span className="mt-[5px] text-center text-[20px] text-black max-md:px-6 max-md:text-left max-md:text-[16px]">
            Boost Your Results With This Exclusive One-Time Upgrade
          </span>
        </div>

        <div className="relative my-5 w-full max-w-[880px] rounded-lg bg-linear-to-r from-primary-blue to-upsell-banner-to px-5 py-[14px] text-center max-md:mx-6 max-md:my-0 max-md:w-auto max-md:p-5">
          <BannerArches />
          <span className="relative z-[1] text-balance font-bold text-[22px] leading-[140%] text-white max-md:text-[16px]">
            Get {offer.tablet_display} for{" "}
            <span className="text-upsell-green">Just {money(offer.final_price)}</span>
            {offer.with_free_shipping && <> with FREE&nbsp;shipping.</>}
          </span>
        </div>

        <div className="px-0 max-md:flex max-md:w-full max-md:justify-center max-md:px-6">
          {videoSrc && (
            <video
              className="block max-h-[359px] max-w-[880px] rounded-2xl object-cover max-md:max-w-[327px] max-md:rounded-xl"
              src={videoSrc}
              playsInline
              muted
              autoPlay
              loop
            />
          )}
        </div>

        <div className="mt-6 flex w-full max-w-[880px] flex-col gap-5 rounded-2xl bg-bg-card p-7 max-md:mt-0 max-md:p-6 max-md:pt-0">
          {/* Bonus box */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 rounded-lg bg-upsell-bg px-5 py-4 max-md:gap-x-3">
            <Image
              src="/images/upsell/present-pack.png"
              alt=""
              width={45}
              height={45}
              className="self-center md:row-span-2 max-md:size-[30px] max-md:self-start"
            />
            <span className="font-bold text-[15px] leading-[172.5%] text-upsell-titleblue max-md:text-[14px]">
              As a new patient, you qualify for this bonus offer.
            </span>
            <span className="col-span-2 text-[14px] leading-[172.5%] text-upsell-darkgreen max-md:text-[12px] md:col-span-1 md:col-start-2">
              We&apos;ve reduced the cost from
              <span className="px-[3px] font-semibold text-upsell-darkgreen">{offer.bonus_emphasis}</span>
              {offer.bonus_tail}
            </span>
          </div>

          <div className="font-bold text-[20px] leading-[140%] text-black max-md:text-[16px]">
            Your New Patient Bonus — With Every Discount Applied
          </div>

          {/* Product line item */}
          <div className="flex items-center justify-between rounded border-[2.5px] border-primary-blue px-5 py-6 max-md:px-4 max-md:py-[10px]">
            <span className="text-[14px] leading-[145%] max-md:text-[12px]">
              {offer.product_name}
              <br />
              <span className="font-bold">{offer.tablet_display}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[16px] text-upsell-oldprice line-through max-md:text-[11px]">
                {money(offer.base_price)}
              </span>
              <span className="font-semibold text-[20px] text-black max-md:text-[14px]">
                {money(offer.final_price)}
              </span>
            </div>
          </div>

          {/* Discount rows */}
          <div className="flex flex-col gap-5 border-b-2 border-upsell-border pb-6 font-inter max-md:gap-3">
            {offer.show_new_patient_discount && (
              <div className="flex justify-between">
                <span className="font-medium text-[16px] text-black max-md:text-[14px]">
                  New Patient Discount
                  <br />
                  <span className="text-[14px] font-medium italic leading-[160%] text-upsell-subgrey max-md:text-[13px]">
                    (One-time only welcome bonus)
                  </span>
                </span>
                <span className="font-semibold text-[16px] text-upsell-discount max-md:text-[14px]">
                  {offer.discount_display}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-[16px] text-black max-md:text-[14px]">
                Volume Discount - {offer.discount_percent}% OFF
                <br />
                <span className="text-[14px] font-medium italic leading-[160%] text-upsell-subgrey max-md:text-[13px]">
                  (Savings for choosing more)
                </span>
              </span>
              <span className="font-semibold text-[16px] text-upsell-discount max-md:text-[14px]">
                -${offer.price_difference.toFixed(2)}
              </span>
            </div>
            {offer.shipping_label && (
              <div className="flex justify-between">
                <span className="font-medium text-[16px] text-black max-md:text-[14px]">
                  Shipping
                  <br />
                  <span className="text-[14px] font-medium italic leading-[160%] text-upsell-subgrey max-md:text-[13px]">
                    {offer.shipping_label}
                  </span>
                </span>
                <span className="font-semibold text-[16px] text-upsell-discount max-md:text-[14px]">
                  $0.00
                </span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex flex-col gap-[25px] border-b-2 border-upsell-border pb-6 max-md:gap-3">
            <div className="flex items-center justify-between">
              <span className="font-inter font-extrabold text-[16px] leading-[160%] text-black max-md:text-[14px]">
                Total if prescribed
              </span>
              <div className="flex items-center gap-2 font-inter">
                <span className="text-[16px] line-through max-md:text-[14px]">{money(offer.base_price)}</span>
                <span className="font-bold text-[32px] max-md:text-[24px]">{money(offer.final_price)}</span>
              </div>
            </div>
            <div className="rounded-lg bg-upsell-bg px-4 py-3 text-center font-inter text-[14px] leading-[160%] text-primary">
              Enjoy {money(offer.total_savings)} in total savings
            </div>
          </div>

          {/* Buttons */}
          <div className="my-[5px] flex flex-col gap-[25px]">
            <button
              type="button"
              onClick={purchase}
              disabled={isSubmitting}
              className="flex items-center justify-center rounded-[30px] bg-primary-blue px-[50px] py-[15px] font-semibold text-[16px] tracking-[0.5px] text-white transition-colors hover:bg-upsell-primary-hover disabled:opacity-60 max-md:p-[15px] max-md:text-[13px]"
            >
              Yes! Add {offer.upsell_quantity}
              {offer.extra_tablets > 0 ? ` + ${offer.extra_tablets} Free` : ""} Tablets for Just{" "}
              {money(offer.final_price)}
            </button>
            <button
              type="button"
              onClick={decline}
              disabled={isSubmitting}
              className="flex items-center justify-center rounded-[30px] border border-upsell-pass-border bg-bg-card px-[50px] py-[15px] font-semibold text-[16px] tracking-[0.5px] text-black transition-colors hover:bg-upsell-bg disabled:opacity-60 max-md:p-[15px] max-md:text-[13px]"
            >
              No, I&apos;ll Pass on This One-Time Upgrade
            </button>
          </div>

          <div className="text-center text-[14px] leading-[172.5%] text-upsell-support max-md:text-[12px]">
            🩺 Our Men&apos;s Health Medical Team is here to support you. Receive expert pointers on how
            to get the best results, faster and safely.
          </div>
        </div>
      </main>
    </div>
  );
};
