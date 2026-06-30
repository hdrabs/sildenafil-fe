import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingTheme } from "./ProductConfigurator";

interface ProductSelectionHeroProps {
  /** Active drug — drives bg, glow, jar + tablet images. */
  theme: LandingTheme;
  /** Resolved dosage, e.g. "20 mg" — picks the floating tablet pair. */
  dosage: string;
}

const THEME: Record<LandingTheme, { bg: string; glow: string; jar: string }> = {
  sildenafil: { bg: "bg-[#0e2836]", glow: "bg-[#1b53af]", jar: "/images/jars/sildenafil-jar.png" },
  tadalafil: { bg: "bg-[#2d1c09]", glow: "bg-[#6a5229]", jar: "/images/jars/tadalafil-jar.png" },
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
    <div className={cn("relative h-full min-h-[420px] overflow-hidden rounded-[24px] min-[992px]:min-h-[700px]", t.bg)}>
      {/* Ambient blue glow */}
      <div className={cn("absolute left-1/2 top-[38%] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]", t.glow)} />

      {/* Floating tablets (selected strength) */}
      <Image
        src={m1}
        alt=""
        width={120}
        height={120}
        unoptimized
        className="absolute left-[44%] top-[42%] z-10 w-[70px] -translate-x-1/2 drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] min-[992px]:w-[96px]"
      />
      <Image
        src={m2}
        alt=""
        width={120}
        height={120}
        unoptimized
        style={{ transform: "translateX(-50%) rotate(-12deg)" }}
        className="absolute left-[56%] top-[55%] z-10 w-[64px] drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] min-[992px]:w-[88px]"
      />

      {/* Bottle */}
      <Image
        src={t.jar}
        alt={`${theme} bottle`}
        width={303}
        height={694}
        priority
        className="absolute bottom-0 left-1/2 z-20 w-[200px] max-w-none -translate-x-1/2 min-[992px]:w-[300px]"
      />
    </div>
  );
};
