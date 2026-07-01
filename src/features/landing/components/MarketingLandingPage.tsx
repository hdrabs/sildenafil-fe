"use client";

import dynamic from "next/dynamic";
import { useProductConfigurator } from "@/features/landing/hooks/useProductConfigurator";
import { LandingTheme } from "./ProductConfigurator";
import { CatalogVariant } from "@/types/catalog";
import { LandingHeroSection } from "@/features/home/components/LandingHeroSection";
import { HeroTestimonialSection } from "@/features/home/components/HeroTestimonialSection";
import { VideoSeoSection } from "@/features/home/components/VideoSeoSection";

// Below-the-fold sections — code-split so they stay out of the initial bundle
// (mirrors ProductLandingPage). The hero + testimonial band paint first.
const MedInstructionsSection = dynamic(() =>
  import("@/features/home/components/MedInstructionsSection").then((m) => m.MedInstructionsSection),
);
const WhyLoveSection = dynamic(() =>
  import("@/features/home/components/WhyLoveSection").then((m) => m.WhyLoveSection),
);
const ReviewVideosSection = dynamic(() =>
  import("@/features/home/components/ReviewVideosSection").then((m) => m.ReviewVideosSection),
);
const ProcessSection = dynamic(() =>
  import("@/features/home/components/ProcessSection").then((m) => m.ProcessSection),
);
const LabTestedSection = dynamic(() =>
  import("@/features/home/components/LabTestedSection").then((m) => m.LabTestedSection),
);
const WhatsIncludedSection = dynamic(() =>
  import("@/features/home/components/WhatsIncludedSection").then((m) => m.WhatsIncludedSection),
);
const HappyPatientsSection = dynamic(() =>
  import("@/features/home/components/HappyPatientsSection").then((m) => m.HappyPatientsSection),
);
const BrandComparisonSection = dynamic(() =>
  import("@/features/home/components/BrandComparisonSection").then((m) => m.BrandComparisonSection),
);
const FaqSection = dynamic(() =>
  import("@/features/home/components/FaqSection").then((m) => m.FaqSection),
);
const CtaSection = dynamic(() =>
  import("@/features/home/components/CtaSection").then((m) => m.CtaSection),
);
const Footer = dynamic(() => import("@/components/Footer/Footer").then((m) => m.Footer));

interface MarketingLandingPageProps {
  slug: string;
  initialQty?: number;
  discountCode?: string;
  landingContext?: string;
  /** Incoming query string (without "?"), forwarded verbatim to the configurator. */
  query?: string;
  /** lowest-price = regular (per-tablet pricing); try = free-tier sample pack. */
  regular?: boolean;
  /** Route prefix for the configurator hand-off — "lowest-price" | "try". */
  configPrefix?: string;
  /** Server-prefetched variants → seed the catalog query so SSR renders the real page
   *  (not the loading spinner) and hydration matches. See useCatalog / prefetchCatalog. */
  initialVariants?: CatalogVariant[];
}

export const MarketingLandingPage = ({
  slug,
  initialQty,
  discountCode,
  landingContext,
  query,
  regular = true,
  configPrefix = "lowest-price",
  initialVariants,
}: MarketingLandingPageProps) => {
  const { contextVariant, activeVariant, activeDrug, isLoading } = useProductConfigurator({
    slug,
    initialQty,
    discountCode,
    landingContext,
    initialVariants,
  });

  const variant = activeVariant ?? contextVariant;
  const theme: LandingTheme = activeDrug === "tadalafil" ? "tadalafil" : "sildenafil";
  const dosage = variant?.product.dosage ?? "";

  // "As low as" = cheapest per-tablet across this variant's packages.
  const packages = variant?.packages ?? [];
  const lowestPerTablet = packages.length ? Math.min(...packages.map((p) => p.per_tablet)) : undefined;

  // Hero + CTAs hand off to the configurator page, preserving the query string.
  const configHref = `/${configPrefix}/product_selection/${slug}${query ? `?${query}` : ""}`;
  const getStarted = { label: "Get Started", href: configHref };

  // Free-tier (try) hero values come from the resolved variant's default sample pack.
  const defaultPkg = variant?.default_package;
  const freeTierQuantity = defaultPkg ? String(defaultPkg.quantity) : undefined;
  const shippingCost = defaultPkg?.shipping_cost ? Number(defaultPkg.shipping_cost) : undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <LandingHeroSection
        theme={theme}
        dosage={dosage}
        pricePerTablet={lowestPerTablet?.toFixed(2)}
        regular={regular}
        href={configHref}
        discountAmount={defaultPkg?.original_price}
        quantity={freeTierQuantity}
        shippingCost={shippingCost}
      />
      <HeroTestimonialSection theme={theme} />
      <VideoSeoSection />
      <MedInstructionsSection theme={theme} />
      <WhyLoveSection theme={theme} cta={getStarted} />
      <ReviewVideosSection theme={theme} />
      <ProcessSection theme={theme} />
      <LabTestedSection theme={theme} cta={getStarted} />
      <WhatsIncludedSection theme={theme} />
      <HappyPatientsSection theme={theme} cta={getStarted} />
      <BrandComparisonSection theme={theme} />
      <FaqSection theme={theme} />
      <CtaSection theme={theme} cta={{ label: "Learn More", href: configHref }} />
      <Footer theme={theme} />
    </>
  );
};
