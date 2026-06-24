import { HeroSection } from "@/features/home/components/HeroSection";
import { PricingSection } from "@/features/home/components/PricingSection";
import { WhatsIncludedSection } from "@/features/home/components/WhatsIncludedSection";
import { ProcessSection } from "@/features/home/components/ProcessSection";
import { WhyLoveSection } from "@/features/home/components/WhyLoveSection";
import { HowItWorksSection } from "@/features/home/components/HowItWorksSection";
import { BrandComparisonSection } from "@/features/home/components/BrandComparisonSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { FaqSection } from "@/features/home/components/FaqSection";
import { CtaSection } from "@/features/home/components/CtaSection";
import { Footer } from "@/components/Footer/Footer";
import { ROUTES } from "@/constants/routes";

const HomePage = () => (
  <>
    <HeroSection />
    <PricingSection />
    <WhatsIncludedSection />
    <ProcessSection />
    <WhyLoveSection
      cta={{ label: "Try Sildenafil", freeLabel: "FREE", href: ROUTES.PRODUCT_DETAIL }}
    />
    <HowItWorksSection />
    <BrandComparisonSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaSection cta={{ label: "Learn More", href: ROUTES.PRODUCT_DETAIL }} />
    <Footer />
  </>
);

export default HomePage;
