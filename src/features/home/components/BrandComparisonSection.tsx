import Image from "next/image";
import { cn } from "@/lib/utils";

type ComparisonTheme = "sildenafil" | "tadalafil";

interface BrandComparisonSectionProps {
  /** Drug drives the brand pairing, copy, and label colour. Defaults to sildenafil. */
  theme?: ComparisonTheme;
  className?: string;
}

interface SideImage {
  src: string;
  w: number;
  h: number;
  /** Rendered display width in px (height auto-scales) — desktop / mobile. */
  dw: number;
  mdw: number;
  label: string;
}

const COPY: Record<ComparisonTheme, {
  heading: string;
  accent: string;
  brand: SideImage;
  generic: SideImage;
  para1: string;
  para2: string;
}> = {
  sildenafil: {
    heading: "Viagra vs Sildenafil, which is better?",
    accent: "#056cb6",
    brand: { src: "/images/comparison/viagra.png", w: 203, h: 147, dw: 124, mdw: 88, label: "Viagra" },
    generic: { src: "/images/comparison/sildenafil.png", w: 270, h: 270, dw: 80, mdw: 64, label: "Sildenafil" },
    para1:
      "Both are equally great! Sildenafil is the generic version of Viagra®, and it's the only active ingredient in Viagra that delivers its benefits for treating erectile dysfunction. The differences compared to the brand name are typically in color, shape, and—most notably—cost.",
    para2:
      "It's important to ensure that you're using FDA-approved generic sildenafil, as many counterfeit versions are sold online.",
  },
  tadalafil: {
    heading: "Cialis vs Tadalafil, which is better?",
    accent: "#CD8F24",
    brand: { src: "/images/comparison/cialis.png", w: 249, h: 147, dw: 124, mdw: 100, label: "Cialis" },
    generic: { src: "/images/comparison/tadalafil.png", w: 269, h: 168, dw: 124, mdw: 100, label: "Tadalafil" },
    para1:
      "Both are equally great! Tadalafil is the generic version of Cialis®, and it's the only active ingredient in Cialis that delivers its benefits for treating erectile dysfunction. The differences compared to the brand name are typically in color, shape, and—most notably—cost.",
    para2:
      "It's important to ensure that you're using FDA-approved generic tadalafil, as many counterfeit versions are sold online.",
  },
};

const DesktopCard = ({ side, accent }: { side: SideImage; accent: string }) => (
  <div className="flex min-h-[269px] w-[250px] flex-col overflow-hidden rounded-t-[10px] border border-[#BFD9E4]">
    <div className="flex flex-1 items-center justify-center p-5">
      <Image
        src={side.src}
        alt={side.label}
        width={side.w}
        height={side.h}
        className="h-auto object-contain"
        style={{ width: side.dw }}
      />
    </div>
    <div className="bg-[#ebeff8] py-3 text-center">
      <span className="text-[16px] font-medium" style={{ color: accent }}>
        {side.label}
      </span>
    </div>
  </div>
);

export const BrandComparisonSection = ({ theme = "sildenafil", className }: BrandComparisonSectionProps) => {
  const copy = COPY[theme];

  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-10 px-[18px] py-10 md:flex-row md:justify-between md:gap-12 md:px-0 md:py-[100px]">
        {/* Heading + mobile strip + paragraphs */}
        <div className="flex w-full flex-col md:max-w-[600px]">
          <h2 className="text-[32px] font-medium leading-[142.5%] text-[#0e2836] md:text-[45px]">
            {copy.heading}
          </h2>

          {/* Mobile comparison strip (image/label split bars) */}
          <div className="mt-6 w-full md:hidden">
            <div className="flex h-24 overflow-hidden rounded-[10px]">
              <div className="flex flex-1 items-center justify-center">
                <Image src={copy.brand.src} alt={copy.brand.label} width={copy.brand.w} height={copy.brand.h} className="h-auto object-contain" style={{ width: copy.brand.mdw }} />
              </div>
              <div className="flex flex-1 items-center justify-center bg-[#e1e4eb]">
                <span className="text-[16px] font-medium" style={{ color: copy.accent }}>{copy.brand.label}</span>
              </div>
            </div>
            <p className="my-3 text-center text-[18px] font-semibold text-[#0e2836]">Vs</p>
            <div className="flex h-24 overflow-hidden rounded-[10px]">
              <div className="flex flex-1 items-center justify-center bg-[#e1e4eb]">
                <span className="text-[16px] font-medium" style={{ color: copy.accent }}>{copy.generic.label}</span>
              </div>
              <div className="flex flex-1 items-center justify-center bg-white">
                <Image src={copy.generic.src} alt={copy.generic.label} width={copy.generic.w} height={copy.generic.h} className="h-auto object-contain" style={{ width: copy.generic.mdw }} />
              </div>
            </div>
          </div>

          <p className="mt-8 text-[16px] leading-[160%] text-[#262a32]">{copy.para1}</p>
          <p className="mt-4 text-[16px] leading-[160%] text-[#262a32]">{copy.para2}</p>
        </div>

        {/* Desktop cards */}
        <div className="hidden shrink-0 items-center gap-8 md:flex md:self-center">
          <DesktopCard side={copy.brand} accent={copy.accent} />
          <span className="text-[20px] font-medium text-[#0e2836]">Vs</span>
          <DesktopCard side={copy.generic} accent={copy.accent} />
        </div>
      </div>
    </section>
  );
};
