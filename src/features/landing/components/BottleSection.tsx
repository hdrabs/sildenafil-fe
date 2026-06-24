"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { LandingTheme } from "./ProductConfigurator";

interface BottleSectionProps {
  /** Active drug — drives the bottle image and heading brand name. */
  theme: LandingTheme;
  /** Dosage label coming from the resolved variant, e.g. "20 mg". */
  dosage: string;
}

interface Testimonial {
  text: string;
  location: string;
}

const BOTTLE_BY_DRUG: Record<LandingTheme, { src: string; alt: string }> = {
  sildenafil: { src: "/images/bottles/sildenafil.webp", alt: "Generic Sildenafil bottle" },
  tadalafil: { src: "/images/bottles/tadalafil.webp", alt: "Generic Tadalafil bottle" },
};

const BRAND_BY_DRUG: Record<LandingTheme, string> = {
  sildenafil: "Viagra",
  tadalafil: "Cialis",
};

const FEATURES = [
  "Expert Pharmacist Guidance",
  "No Monthly Subscriptions",
  "Free Online Doctor Visit",
  "FDA Approved",
  "Low Price Guarantee",
];

const TESTIMONIALS: Testimonial[] = [
  {
    text: "I had a few doubts that it would help me—but the only other alternative was to purchase the brand name expensive VIAGRA—and if I could get the expected results with this Sildenafil, then I would benefit two-fold: in the bedroom—and my out of pocket expense!",
    location: "Sildenafil Patient, CA",
  },
  {
    text: "I've issues with ED due to blood flow issues. I had a previous Sildenafil prescription at $50.00 a dose. After paying too high of prices, I was doing some research to find a cheaper price. I had heard / read positive things about Sildenafil.com. I was a little hesitant to try an online pharmacy, but I'm so glad I did.",
    location: "Sildenafil Patient, NY",
  },
  {
    text: "The whole process was simple and discreet. The free online doctor visit took just a few minutes and my order shipped fast. No awkward pharmacy visits and a fraction of the price I was paying before.",
    location: "Verified Patient, TX",
  },
  {
    text: "I was skeptical about ordering online, but the lab-tested quality and the pharmacist guidance won me over. Results were exactly what I hoped for and re-ordering is effortless with no subscription locking me in.",
    location: "Verified Patient, FL",
  },
];

// Heading mirrors the legacy formatter: 20 mg Sildenafil stays bare, every other
// combination appends the brand name, e.g. "50 mg Sildenafil (Viagra)".
const formatProductName = (theme: LandingTheme, dosage: string): string => {
  const drugName = `${theme.charAt(0).toUpperCase()}${theme.slice(1)}`;
  const safeDosage = dosage || "20 mg";
  const dosageValue = parseInt(safeDosage, 10);

  if (theme === "sildenafil" && dosageValue === 20) {
    return `${safeDosage} ${drugName}`;
  }
  return `${safeDosage} ${drugName} (${BRAND_BY_DRUG[theme]})`;
};

const RatingStars = () => (
  <Image src="/icons/rating-stars.svg" alt="5 star rating" width={88} height={16} className="h-4 w-auto" />
);

const SourceLine = () => (
  <div className="flex items-center gap-2.5">
    <Image src="/icons/us-flag.svg" alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
    <span className="text-sm font-semibold text-primary sm:text-[18px]">
      US Lab Tested &amp; Official Source
    </span>
  </div>
);

const FeatureList = () => (
  <ul className="mt-[15px] flex flex-col gap-2.5">
    {FEATURES.map((feature) => (
      <li key={feature} className="flex items-center">
        <Image src="/icons/check-mark-bullet.svg" alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
        <span className="ml-2 text-sm text-text-primary min-[990px]:text-base">{feature}</span>
      </li>
    ))}
  </ul>
);

export const BottleSection = ({ theme, dosage }: BottleSectionProps) => {
  const bottle = BOTTLE_BY_DRUG[theme];
  const heading = formatProductName(theme, dosage);

  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const modalTrackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-testimonial-card]");
    const step = card ? card.getBoundingClientRect().width + 40 : 320;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  // Track scroll edges so the arrows can be disabled at the first / last card.
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
    <div className="relative h-full overflow-hidden bg-bg-bottle px-6 py-[35px] text-text-primary min-[990px]:min-h-0 min-[990px]:px-[75px]">
      {/* Mobile: bottle bleeds off the right edge, behind the text */}
      <Image
        src={bottle.src}
        alt={bottle.alt}
        width={455}
        height={417}
        priority
        sizes="260px"
        className="pointer-events-none absolute -right-10 top-[70%] z-0 w-[216px] -translate-y-1/2 select-none min-[360px]:w-[230px] min-[440px]:top-[65%] min-[440px]:w-[260px] min-[990px]:hidden"
      />

      <div className="relative z-10">
        {/* ── Header (shared) ── */}
        <SourceLine />
        <h1 className="mt-2 text-[21px] font-bold leading-tight xs:text-[28px] sm:text-[34px] lg:text-[40px]">
          {heading}
        </h1>

        {/* ── Mobile-only: testimonials link + stars ── */}
        <div className="mt-1 flex items-center gap-2 min-[990px]:hidden">
          <button
            type="button"
            onClick={() => {
              setModalIndex(0);
              setMobileListOpen(true);
            }}
            className="cursor-pointer text-sm font-semibold text-primary underline"
          >
            See what our patients say
          </button>
          <RatingStars />
        </div>

        {/* ── Desktop-only: centered bottle ── */}
        <div className="hidden min-[990px]:flex">
          <Image
            src={bottle.src}
            alt={bottle.alt}
            width={455}
            height={417}
            priority
            sizes="420px"
            className="mx-auto mt-3 h-auto w-full max-w-[420px]"
          />
        </div>

        <FeatureList />

        {/* ── Desktop-only: testimonials carousel ── */}
        <div className="mt-[48px] hidden min-[990px]:block">
          <div className="mb-[24px] flex items-center justify-between">
            <h3 className="text-[28px] font-semibold">Patient Testimonials</h3>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-testimonial-arrow bg-testimonial-arrow text-bg-bottle transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-testimonial-arrow bg-testimonial-arrow text-bg-bottle transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* One auto-width card per view below 1080px, two from 1080px up — each card
              fills the view exactly, so a partial card is never shown. */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-[40px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.location + testimonial.text.slice(0, 12)}
                data-testimonial-card
                className="flex h-[294px] shrink-0 grow-0 basis-full snap-start flex-col rounded-[35px_35px_0_35px] bg-bg-testimonial p-[30px] min-[1080px]:basis-[calc(50%-20px)]"
              >
                <p className="mb-2.5 line-clamp-6 overflow-hidden whitespace-pre-wrap text-left text-[14px] leading-[21px] text-testimonial-text 2xl:mb-auto">
                  {testimonial.text}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTestimonial(testimonial)}
                  className="mb-2.5 cursor-pointer self-center text-xs text-primary underline 2xl:self-start"
                >
                  Read More
                </button>
                <div className="mt-auto flex flex-col items-center gap-1.5 2xl:mt-0 2xl:flex-row 2xl:justify-between 2xl:gap-0">
                  <RatingStars />
                  <p className="text-xs font-medium text-primary">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Read More — single testimonial */}
      <Modal
        isOpen={activeTestimonial !== null}
        onClose={() => setActiveTestimonial(null)}
        title="Patient Testimonial"
        size="md"
      >
        {activeTestimonial && (
          <>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
              {activeTestimonial.text}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <RatingStars />
              <span className="text-xs font-medium text-primary">{activeTestimonial.location}</span>
            </div>
          </>
        )}
      </Modal>

      {/* Mobile — testimonials carousel */}
      <Modal isOpen={mobileListOpen} onClose={() => setMobileListOpen(false)} size="md">
        <button
          type="button"
          onClick={() => setMobileListOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex cursor-pointer items-center justify-center rounded-full p-1 text-text-muted transition-colors hover:text-text-primary"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <div
          ref={modalTrackRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setModalIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="mt-4 flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.location + testimonial.text.slice(0, 12)}
              className="flex w-full shrink-0 snap-start flex-col items-center px-2 text-center"
            >
              <RatingStars />
              <p className="mt-2 text-base font-semibold text-text-primary">{testimonial.location}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.location + testimonial.text.slice(0, 12)}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                const track = modalTrackRef.current;
                if (track) track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
              }}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-colors ${
                i === modalIndex ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
};
