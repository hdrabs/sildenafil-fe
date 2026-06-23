"use client";

import { useStepNavigation } from "@/features/checkout/hooks/useStepNavigation";

interface Props {
  /** The cart step this page represents (same value passed to useStepNavigation). */
  step: string;
  /** Questionnaire steps only: 0–1 answered ratio, to interpolate across the band. */
  fraction?: number;
}

/**
 * Thin continuous progress line, driven by the backend milestone for `step`
 * (GET /navigation → progress). Self-sufficient: it reads the navigation query
 * itself (react-query dedupes with the page's own call), so pages just pass their
 * step. Hidden before the funnel (no milestone, e.g. intro-questions). Questionnaire
 * steps carry a [value..to] band that `fraction` interpolates across.
 *
 * Rendered right after <SecondaryNav> on every checkout page; `sticky top-[60px]`
 * pins it to the bottom edge of that ~60px sticky header so it rides along on scroll
 * instead of sliding away. (Nav is z-30; the bar sits just under it at z-20.)
 */
export const CheckoutProgressBar = ({ step, fraction }: Props) => {
  const { navigation } = useStepNavigation(step);
  const progress = navigation?.progress;
  if (!progress) return null;

  const { value, to } = progress;
  const percent = fraction != null && to != null ? value + fraction * (to - value) : value;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="sticky top-[60px] z-20 h-1.5 w-full bg-bg-input"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
