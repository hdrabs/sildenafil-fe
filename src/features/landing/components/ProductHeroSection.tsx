"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CatalogDrugInfo } from "@/types/catalog";
import { LandingTheme } from "./ProductConfigurator";
import dynamic from "next/dynamic";
import { Modal } from "@/components/ui/Modal";

// Opens only on "view drug details" — lazy so it stays out of the hero's initial bundle.
const DrugInfoModal = dynamic(() =>
  import("./DrugInfoModal").then((m) => m.DrugInfoModal),
);

interface ProductHeroSectionProps {
  /** Active drug — drives the whole theme (colours, jar, clock, copy). */
  theme: LandingTheme;
  /** Dosage label from the resolved variant, e.g. "20 mg". */
  dosage: string;
  /** Drug info for the "view drug details" modal. */
  drugInfo: CatalogDrugInfo | null;
}

interface Testimonial {
  text: string;
  location: string;
}

interface ThemeConfig {
  containerBg: string;
  sourceText: string;
  clockBg: string;
  clockMin: string;
  clockHr: string;
  subText: string;
  glow: string;
  cardBg: string;
  cardText: string;
  btnActive: string;
  btnDisabled: string;
  lastFor: string;
  clock: string;
  jar: string;
  jarMobile: string;
  jarW: number;
  jarH: number;
  jarMobileW: number;
  jarMobileH: number;
  brand: string;
}

const THEME: Record<LandingTheme, ThemeConfig> = {
  sildenafil: {
    containerBg: "bg-[#0e2836]",
    sourceText: "text-[#8297cd]",
    clockBg: "bg-[#063047]",
    clockMin: "text-[#3c77d8]",
    clockHr: "text-[#8297cd]",
    subText: "text-[#8297cd]",
    glow: "bg-[#447a96]",
    cardBg: "bg-[#063047]",
    cardText: "text-[#76b2d2]",
    btnActive: "bg-[#204ad7] border-[#204ad7]",
    btnDisabled: "bg-[#11314f] border-[#11314f]",
    lastFor: "4-6 hrs",
    clock: "/images/clocks/sildenafil-clock.svg",
    jar: "/images/jars/sildenafil-jar.png",
    jarMobile: "/images/jars/sildenafil-jar-mobile.png",
    jarW: 303,
    jarH: 694,
    jarMobileW: 303,
    jarMobileH: 295,
    brand: "Viagra",
  },
  tadalafil: {
    containerBg: "bg-[#2d1c09]",
    sourceText: "text-white",
    clockBg: "bg-[#191105]",
    clockMin: "text-[#cd8f24]",
    clockHr: "text-[#695337]",
    subText: "text-[#cd8f24]",
    glow: "bg-[#6a5229]",
    cardBg: "bg-[#191105]",
    cardText: "text-[#9a8975]",
    btnActive: "bg-[#cd8f24] border-[#cd8f24]",
    btnDisabled: "bg-[#4e340f] border-[#4e340f]",
    lastFor: "12-36 hrs",
    clock: "/images/clocks/tadalafil-clock.svg",
    jar: "/images/jars/tadalafil-jar.png",
    jarMobile: "/images/jars/tadalafil-jar-mobile.png",
    jarW: 370,
    jarH: 848,
    jarMobileW: 370,
    jarMobileH: 370,
    brand: "Cialis",
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Jar + shadow box — size (width/height) AND position (top/right/bottom/left),
// all in px. Adjust these freely; they feed straight into inline styles.
// ──────────────────────────────────────────────────────────────────────────
type Box = { width: number; height: number; top?: number; right?: number; bottom?: number; left?: number };

const JAR_CONFIG: Record<LandingTheme, { jar: Box; shadow: Box; jarMobile: Box }> = {
  sildenafil: {
    jar: { width: 181, height: 414.5, top: 42, right: -14 },
    shadow: { width: 379, height: 598, top: -32, right: -135 },
    jarMobile: { width: 112, height: 100, bottom: 0, right: 12 },
  },
  tadalafil: {
    jar: { width: 181, height: 414.5, top: 12, right: -14 },
    shadow: { width: 379, height: 598, top: 0, right: -136 },
    jarMobile: { width: 180, height: 180, bottom: 0, right: 0 },
  },
};

const FEATURES = [
  "No Monthly Subscriptions",
  "FDA Approved",
  "Free Online Doctor Visit",
  "Expert Pharmacist Guidance",
  "Low Price Guarantee",
];

const TESTIMONIALS: Testimonial[] = [
  {
    text: "I had a few doubts that it would help me--but the only other alternative was to purchase the brand name expensive VIAGRA--and if I could get the expected results with this Sildenafil, then I would benefit two-fold: in the bedroom--and my out of pocket expense!",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "I've issues with ED due to blood flow issues. I had a previous Sildenafil prescription at $50.00 a dose. After paying too high of prices, I was doing some research to find a cheaper price. I had heard / read positive things about Sildenafil.com. I was a little hesitant to try an online pharmacy, but thought I'd give it a try. The folks at Sildenafil.com were very professional and easy to work with. I would describe this service as being trustworthy, professional and great prices. Thanks for making it easy!",
    location: "Sildenafil Patient, NY",
  },
  {
    text: "Didn't know if it would work... But it did! Found the generic form, Sildenafil, worked just as well as the big brand names. I am fully satisfied! All my doubts were dispelled! Sildenafil worked just fine. Ask my fiancé!",
    location: "Sildenafil Patient, NY",
  },
  {
    text: "Two words: THE BOMB! - (that's what the young people say when they think something is really cool or real radical) - at least that's what one of my grandkids says all the time!",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "The pharmacist and staff were very helpful and friendly. Answered all my questions and I received very prompt and professional service.",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "I never heard of generic viagra before and I was kind of hesitant about the product, but once I tried it I liked it. They provide me with a quick service. I was pleased. I would also say that they are very knowledgeable about their products, friendly service, and very quick.",
    location: "Sildenafil Patient, TX",
  },
  {
    text: "I was referred by a friend to this site and was pleased with shipping in a timely manner and so I didn't have to wait too long when I ordered it. I am able to go ahead and last a little longer because of the sildenafils and then also be able to have a firmer package. Having my other half be happy also with the sildenafils was another benefit.",
    location: "Sildenafil Patient, FL",
  },
  {
    text: "Honestly, I have to say I am happy with the price and the product itself. I have done some research and everything is positive. It didn't affect my health in any way. It doesn't have any conflict with the other medications I am on, my blood pressure and a few other things. The service has always been excellent. I never have to worry about my refills being expired. You guys take care of them.",
    location: "Sildenafil Patient, AZ",
  },
];

// Recolours the dark check-mark SVG to the light bullet colour used on the dark bg.
const CHECK_FILTER =
  "[filter:brightness(0)_saturate(100%)_invert(95%)_sepia(5%)_saturate(1200%)_hue-rotate(200deg)_brightness(98%)_contrast(95%)]";

const DRUG_NAME: Record<LandingTheme, string> = { sildenafil: "Sildenafil", tadalafil: "Tadalafil" };

const formatName = (theme: LandingTheme, dosage: string): string => {
  const safe = dosage || "20 mg";
  const value = parseInt(safe, 10);
  if (theme === "sildenafil" && value === 20) return `${safe} ${DRUG_NAME[theme]}`;
  return `${safe} ${DRUG_NAME[theme]} (${THEME[theme].brand})`;
};

const DEFAULT_DOSAGE: Record<LandingTheme, string> = { sildenafil: "20 mg", tadalafil: "2.5 mg" };

// Tablet shown inside the clock — mirrors the configurator's image naming.
const tabletImage = (theme: LandingTheme, dosage: string): string => {
  const safe = dosage || DEFAULT_DOSAGE[theme];
  const prefix = safe.includes("2.5") ? "2-5m" : `${safe.replace(/\D/g, "")}m`;
  return `/images/tablets/${theme}/${prefix}1.png`;
};

const RatingStars = () => (
  <Image src="/icons/rating-stars.svg" alt="5 star rating" width={84} height={15} className="h-[15px] w-auto" />
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M10.5 13L6 8L10.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M5.5 3L10 8L5.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Features = () => (
  <div className="flex flex-col gap-[10px] min-[992px]:gap-5">
    {FEATURES.map((feature) => (
      <div key={feature} className="flex items-center">
        <Image
          src="/icons/check-mark-bullet.svg"
          alt=""
          width={20}
          height={20}
          className={cn("h-[14px] w-[14px] shrink-0 min-[992px]:h-5 min-[992px]:w-5", CHECK_FILTER)}
        />
        <span className="ml-3 text-[14px] font-normal leading-[142.5%] text-[#f4f6fb] min-[992px]:ml-5 min-[992px]:text-[16px]">
          {feature}
        </span>
      </div>
    ))}
  </div>
);

const Header = ({ theme, heading, withSubtitle }: { theme: LandingTheme; heading: string; withSubtitle?: boolean }) => (
  <>
    <div className="flex items-center gap-2">
      <Image src="/icons/us-flag.svg" alt="us-flag" width={22} height={22} className="w-[22px] max-[700px]:w-[15px]" />
      <span className={cn("text-[14px] font-semibold leading-[142.5%] max-[991px]:text-[10px]", THEME[theme].sourceText)}>
        US Lab Tested &amp; Official Source
      </span>
    </div>
    <h1 className="mt-[13px] text-[38px] font-bold leading-[140%] text-white max-[991px]:mt-1 max-[991px]:text-[21px]">
      {heading}
    </h1>
    {withSubtitle && (
      <p className="mt-2 text-[38px] font-bold leading-[140%] text-white">Prescribed &amp; Delivered</p>
    )}
  </>
);

const Jar = ({ theme, mobile }: { theme: LandingTheme; mobile?: boolean }) => {
  const t = THEME[theme];
  const d = JAR_CONFIG[theme];
  if (mobile) {
    return (
      <Image
        src={t.jarMobile}
        alt={`${theme} jar`}
        width={t.jarMobileW}
        height={t.jarMobileH}
        priority
        sizes={`${d.jarMobile.width}px`}
        style={d.jarMobile}
        className="pointer-events-none absolute max-w-none select-none"
      />
    );
  }
  return (
    <div className="relative z-0 flex items-center justify-center self-center min-[1620px]:right-[50px]">
      {/* Coloured ambient glow */}
      <div className={cn("absolute right-[-126px] top-[13px] z-[1] h-[501px] w-[499px] rounded-[421px] opacity-30 blur-[50px]", t.glow)} />
      {/* Soft jar-silhouette shadow */}
      <Image
        src="/images/jars/jar-shadow.png"
        alt=""
        width={377}
        height={595}
        priority
        sizes={`${d.shadow.width}px`}
        style={d.shadow}
        className="pointer-events-none absolute z-[1] max-w-none select-none"
      />
      <Image
        src={t.jar}
        alt={`${theme} jar`}
        width={t.jarW}
        height={t.jarH}
        priority
        sizes={`${d.jar.width}px`}
        style={d.jar}
        className="relative z-[2] mb-[44px] max-w-none"
      />
    </div>
  );
};

export const ProductHeroSection = ({ theme, dosage, drugInfo }: ProductHeroSectionProps) => {
  const t = THEME[theme];
  const heading = formatName(theme, dosage);
  const tablet = tabletImage(theme, dosage);

  const [drugModalOpen, setDrugModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : 360;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      setAtStart(track.scrollLeft <= 5);
      setAtEnd(track.scrollLeft >= maxScroll - 5);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative z-[1] h-full text-white", t.containerBg)}>
      {/* ── Desktop (≥992px) ── */}
      <div className="hidden px-[60px] pt-[60px] pb-[60px] min-[992px]:block">
        <Header theme={theme} heading={heading} withSubtitle />

        <div className="flex justify-between">
          <div>
            <div className="mt-[30px]">
              <Features />
            </div>

            {/* Clock timer */}
            <div className={cn("relative z-10 mt-[35px] flex h-[194px] w-[340px] rounded-[12px] p-[15px] max-[1220px]:w-[285px]", t.clockBg)}>
              <div className="flex flex-col">
                <span className="text-[11px] leading-[142.5%] text-[#f4f6fb] opacity-60">Starts working in</span>
                <span className={cn("text-[15px] font-semibold", t.clockMin)}>15-60 min*</span>
              </div>
              <div className="relative h-[140px] w-[139px] self-center">
                <Image src={t.clock} alt="" width={139} height={140} unoptimized className="absolute inset-0 h-[140px] w-[139px]" />
                <Image
                  src={tablet}
                  alt="tablet"
                  width={40}
                  height={40}
                  className="absolute left-1/2 top-1/2 z-[20] h-9 w-9 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div className="flex flex-col self-end pl-[10px]">
                <span className="text-[11px] leading-[142.5%] text-[#f4f6fb] opacity-60">Last for</span>
                <span className={cn("text-[15px] font-semibold", t.clockHr)}>{t.lastFor}</span>
              </div>
            </div>

            <p className={cn("mt-[17px] text-[10px] leading-[142.5%]", t.subText)}>
              *To learn more{" "}
              <button type="button" onClick={() => setDrugModalOpen(true)} className={cn("cursor-pointer p-0.5 underline", t.subText)}>
                view drug details
              </button>
            </p>
          </div>

          <Jar theme={theme} />
        </div>

        {/* Testimonials carousel */}
        <div className="mt-[30px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[22px] font-semibold leading-none text-white">Patient Testimonials</h3>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                className={cn("flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 text-white transition-colors disabled:cursor-not-allowed", atStart ? t.btnDisabled : t.btnActive)}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                className={cn("flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 text-white transition-colors disabled:cursor-not-allowed", atEnd ? t.btnDisabled : t.btnActive)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.location + testimonial.text.slice(0, 12)}
                data-card
                className={cn("flex h-[244px] w-[calc(50%-12px)] shrink-0 snap-start flex-col rounded-[35px_35px_0_35px] p-[30px]", t.cardBg)}
              >
                <p className={cn("mb-auto line-clamp-6 overflow-hidden whitespace-pre-wrap text-left text-[12px] leading-[172.5%]", t.cardText)}>
                  {testimonial.text}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTestimonial(testimonial)}
                  className="mb-2.5 cursor-pointer self-start text-[12px] text-white underline hover:text-[#1b53af]"
                >
                  Read More
                </button>
                <div className="flex items-center justify-between">
                  <RatingStars />
                  <p className="text-[12px] font-medium text-white">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile (<992px) ── */}
      <div className="relative block overflow-hidden px-[22px] pt-[49px] pb-5 md:mx-auto md:max-w-[600px] min-[992px]:hidden">
        <Jar theme={theme} mobile />
        <div className="relative z-10">
          <Header theme={theme} heading={heading} />
          <div className="mt-[19px]">
            <Features />
          </div>
        </div>
      </div>

      {/* Drug details */}
      <DrugInfoModal
        isOpen={drugModalOpen}
        onClose={() => setDrugModalOpen(false)}
        drugInfo={drugInfo}
        drugDisplayName={DRUG_NAME[theme]}
        activeDrug={theme}
      />

      {/* Read More — single testimonial */}
      <Modal isOpen={activeTestimonial !== null} onClose={() => setActiveTestimonial(null)} title="Patient Testimonial" size="md">
        {activeTestimonial && (
          <>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{activeTestimonial.text}</p>
            <div className="mt-4 flex items-center gap-2">
              <RatingStars />
              <span className="text-xs font-medium text-primary">{activeTestimonial.location}</span>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};
