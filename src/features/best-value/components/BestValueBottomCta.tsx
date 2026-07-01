"use client";

import { cn } from "@/lib/utils";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface BestValueBottomCtaProps {
  /** Drug drives the background tint. Defaults to sildenafil. */
  theme?: LandingTheme;
  /** Primary CTA — scrolls back to the configurator. Omit to hide it. */
  onGetStarted?: () => void;
  ctaLabel?: string;
  className?: string;
}

export const BestValueBottomCta = ({
  theme = "sildenafil",
  onGetStarted,
  ctaLabel = "Start My Free Visit",
  className,
}: BestValueBottomCtaProps) => {
  const isTada = theme === "tadalafil";
  // #0a78bb is a darkened sildenafil sky-blue that clears WCAG AA (4.9:1) for both
  // white-on-band and band-colour-on-white-button. (AUM's #0c9ced was only 3:1.)
  const btnText = isTada ? "#CD8F24" : "#0a78bb";

  return (
    <section className={cn(isTada ? "bg-[#CD8F24]" : "bg-[#0a78bb]", "text-white", className)}>
      <div className="mx-auto max-w-3xl px-6 py-[75px] text-center md:py-[100px]">
        <h2 className="text-[28px] font-normal leading-[1.3] md:text-[36px]">
          Start saving on your today
        </h2>

        {onGetStarted && (
          <button
            type="button"
            onClick={onGetStarted}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-[40px] py-[14px] text-[16px] font-semibold transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
            style={{ color: btnText }}
          >
            {ctaLabel}
          </button>
        )}

        <p className="my-10 text-[16px]">
          <strong className="block">Have any questions or prefer to sign up over the phone?</strong>
          Speak to a Patient Care Representative today!
        </p>

        <a
          href="tel:(844) 745-3362"
          className="inline-flex items-center justify-center rounded-full border border-white px-[50px] py-3 text-[16px] font-semibold transition-colors hover:bg-white/10"
        >
          (844) 745-3362
        </a>
      </div>
    </section>
  );
};
