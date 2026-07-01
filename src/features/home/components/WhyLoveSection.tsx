"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type WhyLoveTheme = "sildenafil" | "tadalafil";

interface WhyLoveCta {
  label: string;
  /** Optional trailing word (e.g. "FREE") rendered next to the label. */
  freeLabel?: string;
  /** Render as a link. Takes precedence over onClick for navigation. */
  href?: string;
  onClick?: () => void;
}

interface WhyLoveSectionProps {
  /** Drug drives copy, accent colour, and the clinical citation. Defaults to sildenafil. */
  theme?: WhyLoveTheme;
  /** Optional CTA button. Omit to render the section without a button. */
  cta?: WhyLoveCta;
  className?: string;
}

const COPY: Record<WhyLoveTheme, {
  name: string;
  statement1: string;
  statement2: string;
  stat: string;
  panelMain: string;
  panelSource: string;
}> = {
  sildenafil: {
    name: "Sildenafil",
    statement1: "Save big—same trusted ingredient",
    statement2: "Same active ingredient as name brand Viagra® as low as 5% of the cost.",
    stat: "74% of users reported harder, stronger erections.",
    panelMain:
      "In a 12-week, double-blind study of 329 men with erectile dysfunction, those who received sildenafil reported harder, stronger erections, compared with those on placebo.",
    panelSource:
      "Source: Padma-Nathan H, Steers W D, Wicker P A. Efficacy and safety of oral sildenafil in the treatment of erectile dysfunction: a double-blind, placebo-controlled study of 329 patients. International Journal of Clinical Practice. 1998;52(6):375-379. PMID: 9894373.",
  },
  tadalafil: {
    name: "Tadalafil",
    statement1: "Save big, with options to fit your lifestyle",
    statement2: "Same active ingredient as name brand Cialis® as low as 5% of the cost.",
    stat: "82% of men reported harder, longer-lasting erections",
    panelMain:
      "In clinical studies, a single 20 mg dose of tadalafil remained effective for up to 36 hours; most regained normal erectile-function scores and achieved high rates of successful intercourse.",
    panelSource:
      "Source: Frajese GV, Pozzi F, Frajese G. “Tadalafil in the treatment of erectile dysfunction: an overview of the clinical evidence.” Clinical Interventions in Aging. 2006;1(4):439-449. doi: 10.2147/ciia.2006.1.4.439. PMCID: PMC2699638.",
  },
};

const Chevron = ({ open, color }: { open: boolean; color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className="ml-3 shrink-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <path
      d="M10.3881 11.8374L11.5002 10.8837L15.9165 14.6738C16.0406 14.78 16.1845 14.8608 16.3398 14.9115C16.4952 14.9621 16.659 14.9816 16.8219 14.9689C16.9847 14.9562 17.1435 14.9115 17.2891 14.8373C17.4348 14.7632 17.5644 14.6611 17.6705 14.5368C17.7767 14.4125 17.8574 14.2686 17.908 14.1131C17.9586 13.9576 17.9781 13.7937 17.9654 13.6306C17.9527 13.4676 17.908 13.3087 17.834 13.1629C17.7599 13.0172 17.6579 12.8875 17.5337 12.7812L12.3088 8.29881C12.0835 8.10591 11.7967 7.9999 11.5002 7.9999C11.2037 7.9999 10.9169 8.10591 10.6916 8.29881L5.46672 12.7812C5.34256 12.8875 5.24054 13.0172 5.16647 13.1629C5.0924 13.3087 5.04773 13.4676 5.03502 13.6306C5.02231 13.7937 5.04181 13.9576 5.09241 14.1131C5.143 14.2686 5.22369 14.4125 5.32988 14.5368C5.43607 14.6611 5.56567 14.7632 5.71129 14.8373C5.85691 14.9115 6.01569 14.9562 6.17857 14.9689C6.34145 14.9816 6.50524 14.9621 6.66058 14.9115C6.81592 14.8608 6.95979 14.78 7.08394 14.6738L10.3881 11.8374Z"
      fill={color}
    />
  </svg>
);

export const WhyLoveSection = ({ theme = "sildenafil", cta, className }: WhyLoveSectionProps) => {
  const [open, setOpen] = useState(false);
  const isTada = theme === "tadalafil";
  const accent = isTada ? "#CD8F24" : "#204AD7";
  const copy = COPY[theme];

  const ctaClasses = cn(
    "mt-6 flex w-full items-center justify-center gap-2 rounded-[30px] border border-transparent px-[50px] py-3 text-[16px] font-semibold text-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] max-lg:self-center lg:mt-8 lg:max-w-[330px]",
    isTada ? "bg-[#CD8F24] hover:bg-[#956004]" : "bg-[#204AD7] hover:bg-[#08299A]",
  );

  const ctaInner = (
    <span className="flex items-center justify-center gap-[5px] font-bold">
      <span>{cta?.label}</span>
      {cta?.freeLabel && <span className="hover:underline">{cta.freeLabel}</span>}
      <Image src="/images/why-love/arrow-figma.svg" alt="" width={17} height={17} className="h-[17px] w-[17px]" />
    </span>
  );

  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-5 px-6 py-10 lg:flex-row lg:items-start lg:gap-12 lg:pt-[100px] lg:pb-16">
        {/* Image */}
        <div className="shrink-0 overflow-hidden rounded-2xl">
          <Image
            src="/images/why-love/couple.jpg"
            alt={`Happy couple representing ${copy.name} benefits`}
            width={2555}
            height={2699}
            sizes="(max-width: 1024px) 90vw, 426px"
            className="h-auto w-full max-w-[426px] rounded-2xl object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex w-full flex-col lg:ml-20 lg:max-w-[680px]">
          <h2 className="max-w-[400px] self-start text-[32px] font-medium leading-[120%] text-[#0e2836] max-lg:w-full lg:max-w-none lg:text-[45px] lg:leading-[142%]">
            Why you&apos;ll Love {copy.name}
          </h2>

          <ul className="w-full list-none p-0 max-lg:max-w-[380px] max-lg:self-center">
            <li
              className="pt-5 pb-2.5 text-[14px] font-bold leading-[172.5%] lg:pt-10 lg:pb-3 lg:text-[16px]"
              style={{ color: accent }}
            >
              {copy.statement1}
            </li>
            <li className="border-b border-[#d9dee0] pb-3 text-[14px] leading-[172.5%] text-[#262a32]">
              {copy.statement2}
            </li>
            <li
              className="pt-4 text-[14px] font-bold leading-[172.5%] lg:text-[16px]"
              style={{ color: accent }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls="why-love-panel"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent p-0 text-left font-bold text-inherit"
              >
                <span className="flex-1">Safe and effective</span>
                <Chevron open={open} color={accent} />
              </button>

              <div className="mt-2 text-[14px] font-normal text-[#262a32]">{copy.stat}</div>

              <div
                id="why-love-panel"
                role="region"
                className={cn(
                  "overflow-hidden transition-[max-height,padding] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  open ? "max-h-[500px] py-4" : "max-h-0 py-0",
                )}
              >
                <div
                  className="max-w-[560px] text-[14px] font-normal"
                  style={{ color: isTada ? "#CD8F24" : "#262a32" }}
                >
                  <div className="mb-5">{copy.panelMain}</div>
                  <div className="text-[11px] italic text-[#767676] lg:text-[12px]">{copy.panelSource}</div>
                </div>
              </div>
            </li>
          </ul>

          {cta &&
            (cta.href ? (
              <Link href={cta.href} onClick={cta.onClick} className={ctaClasses}>
                {ctaInner}
              </Link>
            ) : (
              <button type="button" onClick={cta.onClick} className={ctaClasses}>
                {ctaInner}
              </button>
            ))}
        </div>
      </div>
    </section>
  );
};
