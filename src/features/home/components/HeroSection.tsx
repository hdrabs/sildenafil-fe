import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SLUG } from "@/features/landing/catalogParams";
import { PatientTestimonials } from "@/features/home/components/PatientTestimonials";

// aum Home/Hero (ab-1 variant): light-blue band, left copy column (~76%) with the
// get-started CTA + trust icons, and the hero image (man in circle) anchored to the
// centred container's right, flush to the bottom. Mobile hides the hero image and
// shows the bottle instead. Fonts/sizes/weights match aum _typography + Home/styles.
export const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#c4dbe8]">
    <div className="relative mx-auto flex min-h-[520px] max-w-[1320px] flex-col justify-center px-5 py-10 sm:px-6 lg:min-h-[615px] lg:py-[100px]">
      {/* Hero image — anchored to the centred container's right edge, flush to the bottom */}
      <Image
        src="/images/home/hero_image.webp"
        alt=""
        width={1024}
        height={667}
        priority
        className="pointer-events-none absolute bottom-[-49px] right-0 z-0 hidden h-auto w-[850px] max-w-none md:block lg:w-[916px]"
      />

      {/* Left copy column */}
      <div className="relative z-10 w-full text-left lg:w-[76%]">
        {/* Eyebrow/kicker — not a heading (keeps the page's heading order h1-first for a11y). */}
        <p className="mb-2 text-[16px] font-medium leading-[1.2] text-[#1b53af] lg:text-[18px]">
          Official Lab Tested Source for Sildenafil
        </p>

        <h1 className="mb-5 text-[24px] font-extrabold leading-[36px] text-[#262a32] md:text-[26px] md:leading-[42px] lg:text-[48px] lg:leading-[68px]">
          Generic Sildenafil <span className="text-[#1b53af]">(Viagra)</span>
          <br />
          Prescribed &amp; Delivered
        </h1>

        <div className="lg:max-w-[50%]">
          <p className="mt-2 mb-4 text-[16px] leading-[28px] text-[#262a32]">
            Don&apos;t put your love life on hold. Discuss Sildenafil treatment options with a real
            US-licensed healthcare professional and have it delivered to you. All from the comfort of
            home.
          </p>

          <div className="flex items-center gap-2">
            <PatientTestimonials />
            <Image src="/icons/rating-stars.svg" alt="5 star rating" width={84} height={15} className="h-[15px] w-auto" />
          </div>

          {/* Mobile bottle (hero image hidden below md). This is the mobile LCP element,
              so it must load eagerly with a high fetchpriority — not Next's default lazy. */}
          <Image
            src="/images/home/sildenafil_bottle.webp"
            alt="Sildenafil bottle"
            width={310}
            height={310}
            priority
            className="mx-auto mt-3 w-[280px] md:hidden"
          />
        </div>

        {/* Get started + trust badges */}
        <div className="mt-8 flex flex-col gap-6 lg:mt-[50px] lg:flex-row lg:items-center lg:gap-0">
          {/* Mobile: discount above the button (aum column-reverse), full-width button */}
          <div className="relative flex flex-col-reverse items-center gap-[15px] lg:mr-6 lg:block lg:gap-0">
            <Link
              href={ROUTES.CHECKOUT_PRODUCT_DETAIL(DEFAULT_SLUG)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1b53af] px-[60px] py-3 text-[16px] font-normal uppercase text-white transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] lg:inline-flex lg:w-auto"
            >
              Start My Free Visit
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden>
                <path d="M1.5 2L7 8L1.5 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div className="flex items-center justify-center gap-1.5 lg:absolute lg:inset-x-0 lg:top-full lg:mt-[15px]">
              <Image src="/icons/discount_tag.svg" alt="" width={25} height={22} className="h-[22px] w-[25px]" />
              <small className="text-[13px] font-semibold text-[#262a32]">From $1.33 per tablet</small>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 lg:justify-start">
            <div className="flex items-center gap-[10px]">
              <Image src="/icons/licensed-pharmacy.svg" alt="" width={36} height={32} className="h-[32px] w-[36px] shrink-0" />
              <p className="text-left text-[14px] font-normal uppercase leading-[20px] text-[#262a32]">
                U.S. Licensed
                <br />
                Pharmacy
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <Image src="/icons/hipaa_compliance.svg" alt="" width={36} height={41} className="h-[41px] w-[36px] shrink-0" />
              <p className="text-left text-[14px] font-normal uppercase leading-[20px] text-[#262a32]">
                HIPAA
                <br />
                Compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
