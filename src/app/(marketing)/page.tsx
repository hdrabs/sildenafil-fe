import { HeroSection } from "@/features/home/components/HeroSection";
import { PricingSection } from "@/features/home/components/PricingSection";
import { WhatsIncludedSection } from "@/features/home/components/WhatsIncludedSection";
import { RealResultsSection } from "@/features/home/components/RealResultsSection";
import { ProcessSection } from "@/features/home/components/ProcessSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { FaqSection } from "@/features/home/components/FaqSection";
import { CtaSection } from "@/features/home/components/CtaSection";

const HomePage = () => (
  <>
    <HeroSection />
    <PricingSection />
    <WhatsIncludedSection />
    <RealResultsSection />
    <ProcessSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaSection />
  </>
);

export default HomePage;
