"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

interface StrengthData {
  mg: string;
  tagLine: string;
  supportingCopy: string;
  referenceNote?: string;
  onset: string;
  duration: string;
  benefitIcons: string[];
}

const ICON_MAP: Record<string, string> = {
  fastOnset: "/icons/strength-fast-onset.svg",
  lastUpTo: "/icons/strength-clock.svg",
  TadalafilLastUpTo: "/icons/strength-clock.svg",
  lowerSideEffectRisk: "/icons/strength-lower-risk.svg",
  flexibleDosing: "/icons/strength-flexible.svg",
  greatStartingDose: "/icons/strength-great-start.svg",
  reliableResults: "/icons/strength-reliable.svg",
  strongestDose: "/icons/strength-strongest.svg",
  alwaysReady: "/icons/strength-always-ready.svg",
  dailyDose: "/icons/strength-daily-dose.svg",
};

const ICON_TEXT_MAP: Record<string, string> = {
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

const STRENGTHS_DATA: Record<string, StrengthData[]> = {
  sildenafil: [
    {
      mg: "20 mg",
      tagLine: "Ultra-low starter, maximum flexibility",
      supportingCopy:
        "The most gentle entry point for sildenafil — ideal for men who are sensitive to medications or trying ED treatment for the first time. Multiple tablets can be combined up to the 100 mg daily cap as directed by your provider, giving you full flexibility to dial in your ideal dose.",
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
        "The clinical gold standard—about 75% of men report improvement in trials.¹ One tablet satisfies most men; a second reaches the full 100 mg cap on demanding days. Fewer pills, built-in headroom. Always follow your provider's instructions.",
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
        "The highest on-demand dose available. Typically reserved for men who didn't respond well to lower doses. It's strong and long-lasting—often referred to as the 'weekend pill' but always take only as directed.",
      benefitIcons: ["fastOnset", "TadalafilLastUpTo", "strongestDose", "reliableResults"],
      onset: "30-60 min",
      duration: "up to 36 hours",
    },
  ],
};

interface StrengthGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  drug: string | null;
  currentDosage?: string;
  availableDosages?: string[];
}

export const StrengthGuideModal = ({
  isOpen,
  onClose,
  drug,
  currentDosage,
  availableDosages,
}: StrengthGuideModalProps) => {
  const normalizedDrug = drug?.toLowerCase() ?? "sildenafil";
  const strengths = useMemo(() => {
    const all = STRENGTHS_DATA[normalizedDrug] ?? STRENGTHS_DATA.sildenafil;
    if (!availableDosages || availableDosages.length === 0) return all;
    return all.filter((s) =>
      availableDosages.some(
        (d) => d.replace(/\s*mg\s*/i, "") === s.mg.replace(/\s*mg\s*/i, ""),
      ),
    );
  }, [normalizedDrug, availableDosages]);


  // null = modal just opened, no explicit user click yet
  const [selected, setSelected] = useState<number | null>(null);

  const derivedSelected = useMemo(() => {
    if (currentDosage) {
      const idx = strengths.findIndex(
        (s) => s.mg.replace(/\s*mg\s*/i, "") === currentDosage.replace(/\s*mg\s*/i, ""),
      );
      return idx !== -1 ? idx : 0;
    }
    const defaultIdx = strengths.findIndex((s) => s.mg.trim() === "25 mg");
    return defaultIdx !== -1 ? defaultIdx : 0;
  }, [currentDosage, strengths]);

  // User click takes priority; fall back to derived (based on currentDosage or default)
  const activeSelected = selected !== null ? selected : derivedSelected;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isTadalafil = normalizedDrug === "tadalafil";
  const activeStrength = strengths[activeSelected];

  const selectedBorderColor = isTadalafil ? "#cd8f24" : "#204ad7";
  const selectedBgColor = isTadalafil ? "#f8e9d6" : "#d6e0f8";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="strength-guide-modal-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 flex h-[60vh] w-full flex-col bg-white pb-5 sm:max-w-2xl" style={{ borderRadius: "4.8px" }}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <h2
            id="strength-guide-modal-title"
            className="text-2xl font-bold leading-tight text-text-primary"
          >
            Which Strength Is Right For Me?
          </h2>
          <button
            onClick={onClose}
            className="ml-4 mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-muted hover:bg-bg-card"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pb-6">
          {/* Strength tabs */}
          <div className="mb-4 flex gap-2">
            {strengths.map((s, idx) => {
              const isActive = activeSelected === idx;
              return (
                <button
                  key={s.mg}
                  type="button"
                  onClick={() => setSelected(idx)}
                  style={
                    isActive
                      ? { backgroundColor: selectedBgColor, borderColor: selectedBorderColor }
                      : { "--hover-border": selectedBorderColor } as React.CSSProperties
                  }
                  className={`flex-1 cursor-pointer whitespace-nowrap rounded border-2 px-[18px] py-[10px] text-base font-medium text-text-primary ${
                    isActive ? "" : "border-border-input bg-white hover:border-(--hover-border)"
                  }`}
                >
                  {s.mg}
                </button>
              );
            })}
          </div>

          {/* Detail card */}
          {activeStrength && (
            <div className="rounded-xl border border-border-default bg-bg-card p-5">
              <p className="mb-2 text-lg font-bold capitalize text-text-primary">
                {activeStrength.tagLine}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                {activeStrength.supportingCopy}
              </p>
              {activeStrength.referenceNote && (
                <p className="mb-4 text-[11px] leading-relaxed text-text-muted">
                  {activeStrength.referenceNote}
                </p>
              )}

              {/* Onset / Duration row */}
              <div className="flex divide-x divide-border-default overflow-hidden rounded-lg border border-border-default">
                <div className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm text-text-primary">
                  <span className="font-medium text-text-muted">Onset:</span>
                  <span className="font-semibold">{activeStrength.onset}</span>
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 py-3 text-sm text-text-primary">
                  <span className="font-medium text-text-muted">Duration:</span>
                  <span className="font-semibold">{activeStrength.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Benefit icons row */}
          {activeStrength && (
            <div className="mt-5 flex justify-around">
              {activeStrength.benefitIcons.map((key) => {
                const src = ICON_MAP[key];
                const text = ICON_TEXT_MAP[key];
                if (!src) return null;
                return (
                  <div key={key} className="flex flex-col items-center gap-2 text-center">
                    <Image src={src} alt={text} width={28} height={28} className="object-contain" style={{ width: 28, height: "auto" }} />
                    <span className="max-w-[72px] text-xs font-medium text-text-secondary">
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
