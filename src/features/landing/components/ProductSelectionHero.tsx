import { CSSProperties } from "react";
import Image from "next/image";
import { LandingTheme } from "./ProductConfigurator";

interface ProductSelectionHeroProps {
  /** Active drug — drives bg gradient, jar + tablet images. */
  theme: LandingTheme;
  /** Resolved dosage, e.g. "20 mg" — picks the selected-strength tablet pair. */
  dosage: string;
}

// Faithful port of aum MarketingProductDetail .product-selection-free-tier-image:
// a radial-gradient panel with the -ps jar (width 500) and the selected-strength
// pills laid over it via the desktop-image-{drug}TabletImg offsets/rotations.
const THEME: Record<
  LandingTheme,
  {
    bg: string;
    jar: string;
    size: number;
    /** aum .desktop-image-{drug}PairsContainer rotate. */
    pairRotate?: string;
    p1: CSSProperties;
    p2: CSSProperties;
  }
> = {
  sildenafil: {
    bg: "radial-gradient(50% 50% at 50% 50%, #1b53af 0%, #081d29 100%)",
    jar: "/images/jars/sildenafil-jar-ps.png",
    size: 90,
    pairRotate: "rotate(30deg)",
    p1: { bottom: 150, left: "50%", transform: "translateX(-50%) rotate(-30deg)", zIndex: 1 },
    p2: { top: -20, left: "50%", transform: "translateX(-50%) rotate(-30deg)", zIndex: 2 },
  },
  tadalafil: {
    bg: "radial-gradient(50% 50% at 50% 50%, #423317 0%, #2d1c09 100%)",
    jar: "/images/jars/tadalafil-jar-ps.png",
    size: 143,
    p1: { bottom: 113, left: 285, transform: "translateX(-55%) rotate(100deg)", zIndex: 1 },
    p2: { bottom: 20, left: "50%", transform: "translateX(-55%) rotate(107deg)", zIndex: 2 },
  },
};

const tabletSrc = (theme: LandingTheme, dosage: string, n: 1 | 2) => {
  const prefix = dosage.includes("2.5") ? "2-5m" : `${dosage.replace(/\D/g, "") || "20"}m`;
  return `/images/tablets/${theme}/${prefix}${n}.png`;
};

export const ProductSelectionHero = ({ theme, dosage }: ProductSelectionHeroProps) => {
  const t = THEME[theme];
  const m1 = tabletSrc(theme, dosage, 1);
  const m2 = tabletSrc(theme, dosage, 2);

  return (
    <div
      className="mb-[40px] flex h-[calc(100%-40px)] min-h-[600px] items-end justify-center overflow-hidden rounded-[24px]"
      style={{ background: t.bg }}
    >
      {/* aum .image-content: a block at the jar width so the pill pair keeps a
          real box (~400px after margins) to resolve its offsets against */}
      <div className="w-[500px] max-w-full">
        {/* Pills pair container */}
        <div className="ml-[60px] mr-[40px] flex flex-col" style={{ transform: t.pairRotate }}>
          <div className="relative h-[120px] w-full">
            <Image
              src={m1}
              alt=""
              width={t.size}
              height={t.size}
              unoptimized
              className="absolute object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.45)]"
              style={{ width: t.size, height: t.size, ...t.p1 }}
            />
            <Image
              src={m2}
              alt=""
              width={t.size}
              height={t.size}
              unoptimized
              className="absolute object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.45)]"
              style={{ width: t.size, height: t.size, ...t.p2 }}
            />
          </div>
        </div>

        {/* Jar (aum -ps crop, width 500) */}
        <Image
          src={t.jar}
          alt={`${theme} jar`}
          width={500}
          height={367}
          priority
          className="block w-[500px] max-w-full object-contain"
        />
      </div>
    </div>
  );
};
