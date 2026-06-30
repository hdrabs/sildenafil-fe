import Link from "next/link";
import { RiArrowRightLine, RiShieldCheckLine, RiMedicineBottleLine } from "react-icons/ri";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SLUG } from "@/features/landing/catalogParams";

export const HeroSection = () => (
  <section className="bg-bg-main">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-center md:gap-12">
      {/* Left text */}
      <div className="flex-1 text-center md:text-left">
        <p className="mb-3 text-sm font-semibold text-primary">
          Official Lab Tested Source for Sildenafil
        </p>
        <h1 className="text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
          Generic Sildenafil{" "}
          <span className="text-primary">(Viagra)</span>
          <br />
          Prescribed &amp; Delivered
        </h1>
        <p className="mt-4 max-w-lg text-base text-text-muted">
          Don&apos;t put your love life on hold. Discuss Sildenafil treatment
          options with a real US-licensed healthcare professional and have it
          delivered to you. All from the comfort of home.
        </p>

        {/* Stars */}
        <div className="mt-4 flex items-center justify-center gap-2 md:justify-start">
          <span className="text-sm font-semibold text-primary">
            Patient Testimonials
          </span>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
          <Link
            href={ROUTES.CHECKOUT_PRODUCT_DETAIL(DEFAULT_SLUG)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Start My Free Visit
            <RiArrowRightLine className="h-4 w-4" />
          </Link>
          <p className="text-xs text-text-muted">From $1.33 per tablet</p>
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 md:justify-start">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <RiMedicineBottleLine className="h-5 w-5 text-primary" />
            U.S. Licensed Pharmacy
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <RiShieldCheckLine className="h-5 w-5 text-primary" />
            HIPAA Compliant
          </div>
        </div>
      </div>

      {/* Right image placeholder */}
      <div className="flex h-72 w-72 shrink-0 items-center justify-center rounded-full bg-[#d6e9f6] sm:h-80 sm:w-80">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <RiMedicineBottleLine className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-3 text-sm font-medium text-text-muted">
            Doctor Photo
          </p>
        </div>
      </div>
    </div>
  </section>
);
