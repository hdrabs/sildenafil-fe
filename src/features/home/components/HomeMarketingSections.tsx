"use client";

import { useRouter } from "next/navigation";
import { BestValueSections } from "@/features/best-value/components/BestValueSections";
import { ROUTES } from "@/constants/routes";
import { DEFAULT_SLUG } from "@/features/landing/catalogParams";

/**
 * Home page below-the-fold sections. Reuses the /best-value set verbatim (How Our
 * Process Works → Footer) beneath the existing home hero. "Get Started" heads to
 * the product detail page, matching the hero CTA (home has no on-page configurator).
 */
export const HomeMarketingSections = () => {
  const router = useRouter();
  return (
    <BestValueSections
      theme="sildenafil"
      onGetStarted={() => router.push(ROUTES.CHECKOUT_PRODUCT_DETAIL(DEFAULT_SLUG))}
    />
  );
};
