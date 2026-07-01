"use client";

import dynamic from "next/dynamic";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

// Below-the-fold marketing sections for the /best-value page. Code-split so they
// stay out of the initial bundle — the configurator above the fold loads first.
// Section order + content mirrors the legacy aum_mine best-value landing page.
const BestValueProcess = dynamic(() =>
  import("./BestValueProcess").then((m) => m.BestValueProcess),
);
const BestValueAboutEd = dynamic(() =>
  import("./BestValueAboutEd").then((m) => m.BestValueAboutEd),
);
const BestValueWhatIsIncluded = dynamic(() =>
  import("./BestValueWhatIsIncluded").then((m) => m.BestValueWhatIsIncluded),
);
const BestValueRealResults = dynamic(() =>
  import("./BestValueRealResults").then((m) => m.BestValueRealResults),
);
const BestValueViagraVsSildenafil = dynamic(() =>
  import("./BestValueViagraVsSildenafil").then((m) => m.BestValueViagraVsSildenafil),
);
const BestValueHappyPatients = dynamic(() =>
  import("./BestValueHappyPatients").then((m) => m.BestValueHappyPatients),
);
const BestValueFaq = dynamic(() => import("./BestValueFaq").then((m) => m.BestValueFaq));
const BestValueBottomCta = dynamic(() =>
  import("./BestValueBottomCta").then((m) => m.BestValueBottomCta),
);
const Footer = dynamic(() => import("@/components/Footer/Footer").then((m) => m.Footer));

interface BestValueSectionsProps {
  theme: LandingTheme;
  /** Scroll the user back to the configurator at the top of the page. */
  onGetStarted: () => void;
}

export const BestValueSections = ({ theme, onGetStarted }: BestValueSectionsProps) => (
  <>
    <BestValueProcess onGetStarted={onGetStarted} />
    <BestValueAboutEd theme={theme} />
    <BestValueWhatIsIncluded />
    <BestValueRealResults />
    <BestValueViagraVsSildenafil theme={theme} />
    <BestValueHappyPatients theme={theme} onGetStarted={onGetStarted} />
    <BestValueFaq theme={theme} />
    <BestValueBottomCta theme={theme} onGetStarted={onGetStarted} />
    {/* AUM's best-value renders the no-drug footer variant → brand-blue bg, not the navy theme default */}
    <Footer theme={theme} bgColor="#1b53af" />
  </>
);
