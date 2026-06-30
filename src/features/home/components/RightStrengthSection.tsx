"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type RightStrengthTheme = "sildenafil" | "tadalafil";

interface StrengthData {
  mg: string;
  tagLine: string;
  supportingCopy: string;
  benefitIcons: string[];
  onset: string;
  duration: string;
  referenceNote?: string;
}

const ICON_FILE: Record<string, string> = {
  fastOnset: "flash",
  lastUpTo: "clock",
  TadalafilLastUpTo: "clock",
  lowerSideEffectRisk: "circle-fading-arrow-up",
  flexibleDosing: "capsul",
  greatStartingDose: "crosshair",
  reliableResults: "shield-check",
  strongestDose: "biceps-flexed",
  alwaysReady: "user-check",
  dailyDose: "calendar-check",
};

const ICON_TEXT: Record<string, string> = {
  fastOnset: "Fast Onset",
  lastUpTo: "Lasts 4-6 Hours",
  TadalafilLastUpTo: "Lasts Up to 36-Hours",
  lowerSideEffectRisk: "Lower side-effect risk",
  flexibleDosing: "Flexible Dosing",
  greatStartingDose: "Great Starting Dose",
  reliableResults: "Reliable Results",
  strongestDose: "Strongest Dose",
  alwaysReady: "Always Ready",
  dailyDose: "Daily Dose",
};

const STRENGTHS_DATA: Record<RightStrengthTheme, StrengthData[]> = {
  sildenafil: [
    {
      mg: "20 mg",
      tagLine: "Micro-dose introduction, least side-effects",
      supportingCopy:
        "The lightest option—great if you're new to sildenafil or want to ease in. Some men feel results with just 20–40 mg, while others may be prescribed up to 100 mg per day. This strength is ideal for micro-dosing with less risk of side-effects: it helps you and your provider find the exact combo that works for you—and it can be more cost-effective over time.",
      benefitIcons: ["fastOnset", "lastUpTo", "lowerSideEffectRisk", "flexibleDosing"],
      onset: "30-45 min",
      duration: "4-6 hours",
    },
    {
      mg: "25 mg",
      tagLine: "Starter dose, least side-effects",
      supportingCopy:
        "A gentle but reliable entry point. Many men settle at 50–75 mg (2–3 tablets) for strong, steady results. It gives you flexibility to adjust your dose if your provider recommends it—without going straight to the higher strengths.",
      benefitIcons: ["fastOnset", "lastUpTo", "lowerSideEffectRisk", "flexibleDosing"],
      onset: "30-45 min",
      duration: "4-6 hours",
    },
    {
      mg: "50 mg",
      tagLine: "Most prescribed & balanced",
      supportingCopy:
        "The clinical gold standard—about 75% of men report improvement in trials.¹ One tablet satisfies most men; a second reaches the full 100 mg cap on demanding days. Fewer pills, built-in headroom. Always follow your provider’s instructions.",
      benefitIcons: ["fastOnset", "lastUpTo", "greatStartingDose", "reliableResults"],
      onset: "30-45 min",
      duration: "4-6 hours",
      referenceNote:
        "Derry, F. A., Dinsmore, W. W., Hultling, C., Seftel, A. D., & Sipski, M. L. (1998). Efficacy and safety of oral sildenafil (Viagra) in men with erectile dysfunction caused by spinal cord injury: A double‑blind, placebo‑controlled, 28‑day study. Annals of Neurology, 46(1), 15–21.",
    },
    {
      mg: "100 mg",
      tagLine: "Maximum single dose",
      supportingCopy:
        "All the potency in one go—up to 82% efficacy reported in dose-ranging studies¹. This is the highest strength allowed in a 24-hour period. No adding, no stacking—take only as directed by your provider.",
      benefitIcons: ["fastOnset", "lastUpTo", "strongestDose", "reliableResults"],
      onset: "30-45 min",
      duration: "4-6 hours",
      referenceNote:
        "¹Khorrami, M. H., Gharibdoust, F., Habibi, M., & Khoshdel, A. (2010). Efficacy of sildenafil in the treatment of neurogenic erectile dysfunction secondary to upper‑motor‑neuron and lower‑motor‑neuron spinal cord injury. International Journal of Andrology, 33(5), 595–600. doi:10.1111/j.1365-2605.2009.00943.x",
    },
  ],
  tadalafil: [
    {
      mg: "2.5 mg",
      tagLine: "Everyday ease-in",
      supportingCopy:
        "A subtle, daily-strength dose that keeps tadalafil in your system around the clock. Ideal for men who prefer readiness anytime without timing things. May be prescribed as a daily regimen.",
      benefitIcons: ["dailyDose", "TadalafilLastUpTo", "lowerSideEffectRisk", "alwaysReady"],
      onset: "30-60 min",
      duration: "up to 36 hours",
    },
    {
      mg: "5 mg",
      tagLine: "Daily with more kick",
      supportingCopy:
        "The most commonly prescribed daily dose. Keeps you ready around the clock with more potency than 2.5 mg. Perfect for men who want performance flexibility without the need to plan.",
      benefitIcons: ["dailyDose", "TadalafilLastUpTo", "lowerSideEffectRisk", "alwaysReady"],
      onset: "30-60 min",
      duration: "up to 36 hours",
    },
    {
      mg: "10 mg",
      tagLine: "On-demand starter",
      supportingCopy:
        "An ideal starting dose for on-demand use. Often strong enough on its own, but can be increased to 20 mg depending on results and provider guidance. Take only when needed.",
      benefitIcons: ["fastOnset", "TadalafilLastUpTo", "greatStartingDose", "reliableResults"],
      onset: "30-60 min",
      duration: "up to 36 hours",
    },
    {
      mg: "20 mg",
      tagLine: "Max single-use strength",
      supportingCopy:
        "The highest on-demand dose available. Typically reserved for men who didn't respond well to lower doses. It's strong and long-lasting, often referred to as the 'weekend pill' but always take only as directed.",
      benefitIcons: ["fastOnset", "TadalafilLastUpTo", "strongestDose", "reliableResults"],
      onset: "30-60 min",
      duration: "up to 36 hours",
    },
  ],
};

interface RightStrengthSectionProps {
  /** Drives the strength set + accent colours. Defaults to sildenafil. */
  theme?: RightStrengthTheme;
  /** Resolved dosage, e.g. "100 mg" — auto-selects the matching strength. */
  dosage?: string;
  className?: string;
}

const IconRow = ({ keys }: { keys: string[] }) => (
  <div className="flex gap-7">
    {keys.map((k, i) => (
      <div key={i} className="flex max-w-[80px] flex-col items-center text-center">
        <Image
          src={`/images/right-strength/${ICON_FILE[k]}.svg`}
          alt={ICON_TEXT[k]}
          width={44}
          height={44}
          className="h-8 w-8 min-[900px]:h-11 min-[900px]:w-11"
        />
        <div className="pt-3 text-center text-xs font-medium leading-[130%] text-black min-[1025px]:text-sm">
          {ICON_TEXT[k]}
        </div>
      </div>
    ))}
  </div>
);

export const RightStrengthSection = ({ theme = "sildenafil", dosage, className }: RightStrengthSectionProps) => {
  const isTada = theme === "tadalafil";
  const strengths = STRENGTHS_DATA[theme];

  // Selection defaults to the URL dosage (derived, not stored) and follows it until
  // the user picks a strength — avoids a setState-in-effect when dosage loads async.
  const [userSelected, setUserSelected] = useState<number | null>(null);
  const dosageIndex = useMemo(() => {
    if (!dosage) return 0;
    const target = dosage.replace(/\s*mg\s*/i, "");
    const idx = strengths.findIndex((s) => s.mg.replace(/\s*mg\s*/i, "") === target);
    return idx === -1 ? 0 : idx;
  }, [dosage, strengths]);
  const selected = userSelected ?? dosageIndex;

  const current = strengths[selected];
  const icons = current?.benefitIcons ?? [];

  return (
    <section className={cn("w-full bg-white", className)}>
      <div className="mx-auto flex max-w-[1320px] flex-col gap-0 px-6 py-10 min-[900px]:flex-row min-[900px]:items-start min-[900px]:justify-between min-[1025px]:gap-[102px] min-[1025px]:px-0 min-[1025px]:py-[100px]">
        {/* Left: heading + desktop icons */}
        <div className="w-full min-[1024px]:w-[450px]">
          <div className="text-[32px] font-medium leading-[140%] text-[#0e2836] min-[1025px]:text-[45px]">
            Which Strength is Right for Me?
          </div>
          <div className="mb-4 mt-3 text-base font-normal text-[#0E2836] min-[1025px]:mb-10">
            US Licensed Medical Support
          </div>
          <div className="hidden min-[900px]:block">
            <IconRow keys={icons} />
          </div>
        </div>

        {/* Right: strength buttons + intro card */}
        <div className="flex w-full flex-col gap-6 min-[900px]:w-[48%]">
          <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {strengths.map((s, idx) => {
              const isSel = selected === idx;
              return (
                <button
                  key={s.mg}
                  type="button"
                  onClick={() => setUserSelected(idx)}
                  className={cn(
                    "w-full cursor-pointer whitespace-nowrap rounded border-2 px-[18px] py-2.5 text-base font-medium text-[#1a1a1a] transition-colors min-[1025px]:text-base max-[1024px]:text-xs",
                    isSel
                      ? isTada
                        ? "border-[#CD8F24] bg-[#F8E9D6]"
                        : "border-[#204AD7] bg-[#D6E0F8]"
                      : isTada
                        ? "border-[#C5D4DC] bg-transparent hover:border-[#CD8F24] hover:bg-[#F8E9D6]"
                        : "border-[#C5D4DC] bg-transparent hover:border-[#204AD7] hover:bg-[#D6E0F8]",
                  )}
                >
                  {s.mg}
                </button>
              );
            })}
          </div>

          <div className="rounded-lg border border-[#e5e7eb] text-left">
            <div className="p-5 max-[1024px]:p-3">
              <div className="mb-1.5 text-2xl font-semibold text-[#1a1a1a] max-[1024px]:text-xl">{current?.tagLine}</div>
              <div className="text-base text-[#374151] max-[1024px]:text-[13px]">{current?.supportingCopy}</div>
              {current?.referenceNote && (
                <div className="mt-5 text-xs font-normal italic text-[#777] max-[1024px]:text-[11px]">
                  {current.referenceNote}
                </div>
              )}
            </div>
            <div className="flex border-t border-[#e5e7eb] p-0">
              <div className="flex flex-1 flex-row items-center justify-start px-5 py-2 max-[1024px]:flex-col max-[1024px]:items-start max-[1024px]:px-4">
                <span className="mr-2.5 text-base font-medium max-[1024px]:text-xs">Onset:</span>
                <span className="text-base font-medium max-[1024px]:text-xs">{current?.onset}</span>
              </div>
              <div className="flex flex-1 flex-row items-center justify-start border-l border-[#bfcad6] px-5 py-2 max-[1024px]:flex-col max-[1024px]:items-start max-[1024px]:px-4">
                <span className="mr-2.5 text-base font-medium max-[1024px]:text-xs">Duration:</span>
                <span className="text-base font-medium max-[1024px]:text-xs">{current?.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile icons */}
        <div className="mt-[23px] block min-[900px]:hidden">
          <IconRow keys={icons} />
        </div>
      </div>
    </section>
  );
};
