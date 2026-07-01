import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface BestValueViagraVsSildenafilProps {
  /** Drug drives the brand pairing, copy, and heading. Defaults to sildenafil. */
  theme?: LandingTheme;
  className?: string;
}

interface Side {
  src: string;
  w: number;
  h: number;
  label: string;
  sub: string;
}

const COPY: Record<LandingTheme, {
  heading: string;
  brand: Side;
  generic: Side;
  para1: string;
  para2: string;
}> = {
  sildenafil: {
    heading: "Viagra vs Sildenafil, which is better?",
    brand: { src: "/images/best-value/comparison/viagra_tab.webp", w: 203, h: 147, label: "Viagra", sub: "(Brand)" },
    generic: { src: "/images/best-value/comparison/sildenafil_tab.webp", w: 213, h: 128, label: "Sildenafil", sub: "(Generic)" },
    para1:
      "Both are equally great! Sildenafil is the FDA approved generic version of Viagra and is the only active ingredient in Viagra that causes its positive effects on treating ED. Some of the differences compared to the brand name are in color, shape, and not to mention, cost.",
    para2:
      "It is important that the FDA approved version of sildenafil is used since many counterfeit formulations are sold online. We guarantee that our medication is FDA approved and meets all the strict and rigorous FDA specifications and qualifications.",
  },
  tadalafil: {
    heading: "Cialis vs Tadalafil, which is better?",
    brand: { src: "/images/best-value/comparison/c20-tab.png", w: 203, h: 147, label: "Cialis", sub: "(Brand)" },
    generic: { src: "/images/best-value/comparison/289-tab.png", w: 213, h: 128, label: "Tadalafil", sub: "(Generic)" },
    para1:
      "Both are equally great! Tadalafil is the generic version of Cialis®, and it's the only active ingredient in Cialis that delivers its benefits for treating erectile dysfunction. The differences compared to the brand name are typically in color, shape, and—most notably—cost.",
    para2:
      "It's important to ensure that you're using FDA-approved generic tadalafil, as many counterfeit versions are sold online.",
  },
};

const MedicineCard = ({ side }: { side: Side }) => (
  <div className="flex min-h-[200px] w-[150px] flex-col md:min-h-[269px] md:w-[250px]">
    {/* card-body — pill floats, no border/background */}
    <div className="flex flex-1 items-center justify-center p-2">
      <Image src={side.src} alt={side.label} width={side.w} height={side.h} className="h-auto w-1/2 object-contain" />
    </div>
    {/* card-footer — standalone rounded lavender label box */}
    <div className="w-full rounded-[10px] bg-[#ebeff8] px-2 py-4 text-center leading-[1.3]">
      <span className="text-[16px] text-primary">
        {side.label}
        <br />
        {side.sub}
      </span>
    </div>
  </div>
);

const Cards = ({ copy, className }: { copy: (typeof COPY)[LandingTheme]; className?: string }) => (
  <div className={cn("flex items-center justify-center gap-2", className)}>
    <MedicineCard side={copy.brand} />
    <span className="mx-1 text-[20px] font-normal text-black md:mx-2">Vs</span>
    <MedicineCard side={copy.generic} />
  </div>
);

// Mobile: each comparison is a split pair — image half (white) + label half (lavender),
// with the label alternating sides between the two rows (AUM `.modile-versus`).
const MobilePill = ({ side }: { side: Side }) => (
  <div className="flex w-1/2 items-center justify-center bg-white">
    <Image src={side.src} alt={side.label} width={side.w} height={side.h} className="h-auto max-h-[70px] w-auto object-contain" />
  </div>
);

const MobileLabel = ({ label }: { label: string }) => (
  <div className="flex w-1/2 items-center justify-center bg-[#e1e4eb]">
    <span className="text-[16px] text-primary">{label}</span>
  </div>
);

const MobileCards = ({ copy, className }: { copy: (typeof COPY)[LandingTheme]; className?: string }) => (
  <div className={cn("md:hidden", className)}>
    <div className="flex h-24 w-full overflow-hidden rounded-[10px] shadow-[0px_0px_45px_rgba(21,41,71,0.1)]">
      <MobilePill side={copy.brand} />
      <MobileLabel label={copy.brand.label} />
    </div>
    <p className="my-[15px] text-center text-[18px] font-medium text-black">Vs</p>
    <div className="flex h-24 w-full overflow-hidden rounded-[10px] shadow-[0px_0px_45px_rgba(21,41,71,0.1)]">
      <MobileLabel label={copy.generic.label} />
      <MobilePill side={copy.generic} />
    </div>
  </div>
);

export const BestValueViagraVsSildenafil = ({ theme = "sildenafil", className }: BestValueViagraVsSildenafilProps) => {
  const copy = COPY[theme];

  return (
    <section id="viagra-vs-sildenafil" className={cn("bg-white", className)}>
      <div className="mx-auto flex w-full max-w-[1320px] flex-col px-[18px] py-[40px] md:flex-row md:items-start md:justify-between md:px-0 md:py-[120px]">
        {/* Desktop cards (left) */}
        <Cards copy={copy} className="hidden md:flex md:w-1/2" />

        {/* Heading + paragraphs (right); mobile cards sit between heading and copy */}
        <div className="flex w-full flex-col md:w-1/2 md:px-6">
          <h2 className="text-[24px] font-medium leading-[34px] text-black md:text-[32px] md:leading-[46px]">
            {copy.heading}
          </h2>

          <MobileCards copy={copy} className="mt-6" />

          <p className="mt-8 text-[16px] leading-[28px] text-black">{copy.para1}</p>
          <p className="mt-5 text-[16px] leading-[28px] text-black">{copy.para2}</p>
        </div>
      </div>
    </section>
  );
};
