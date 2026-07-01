"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { PATIENT_TESTIMONIALS, type PatientTestimonial } from "@/features/home/data/testimonials";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

const MAX_CHARS = 280;

interface BestValueHappyPatientsProps {
  /** Drives the subheading drug name + active-dot accent. Defaults to sildenafil. */
  theme?: LandingTheme;
  /** Primary CTA below the carousel — scrolls to the configurator. Omit to hide. */
  onGetStarted?: () => void;
  className?: string;
}

export const BestValueHappyPatients = ({ theme = "sildenafil", onGetStarted, className }: BestValueHappyPatientsProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState<PatientTestimonial | null>(null);
  const [show, setShow] = useState(false);
  const isTada = theme === "tadalafil";
  const drugLabel = isTada ? "Tadalafil" : "Sildenafil";
  const activeDot = isTada ? "#CD8F24" : "#1b53af";
  const accent = isTada ? "#CD8F24" : "#1b53af";
  const accentHover = isTada ? "#956004" : "#2269db";

  const stepOf = (track: HTMLDivElement) =>
    track.children.length < 2
      ? track.clientWidth
      : (track.children[1] as HTMLElement).offsetLeft - (track.children[0] as HTMLElement).offsetLeft;

  // Click-and-drag to swipe on desktop (native touch scroll handles mobile).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = { active: true, moved: false, startX: e.clientX, scrollLeft: track.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.scrollLeft - delta;
  };
  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <section id="happy-patients" className={cn("w-full bg-[#c4dbe8]", className)}>
      <div className="relative mx-auto max-w-[1320px] px-[18px] py-[30px] lg:py-[100px]">
        {/* Flanking customer photos — sit BEHIND the cards (z-0) */}
        <div className="pointer-events-none absolute inset-x-0 top-[110px] z-0 mx-auto hidden w-[95%] max-w-[1284px] lg:block">
          <Image src="/images/best-value/happy-patients/happy_customer1.webp" alt="" width={143} height={143} className="absolute left-0 top-0 h-[143px] w-[143px] rounded-full" />
          <Image src="/images/best-value/happy-patients/happy_customer2.webp" alt="" width={137} height={137} className="absolute left-[190px] top-[43px] h-[137px] w-[137px] rounded-full" />
          <Image src="/images/best-value/happy-patients/happy_customer3.webp" alt="" width={157} height={157} className="absolute right-0 top-0 h-[157px] w-[157px] rounded-full" />
        </div>

        {/* Headings */}
        <div className="relative z-20 mb-6 flex flex-col items-center px-[18px] lg:mb-[70px]">
          <h2 className="text-center text-[30px] font-semibold text-black min-[331px]:text-[32px]">Happy Patients</h2>
          <h6 className="mt-[10px] text-center text-[16px] font-semibold text-black min-[331px]:text-[20px]">
            Find out what men think about {drugLabel}
          </h6>
        </div>

        {/* Mobile customer photos — row above the card, middle one dropped (below lg) */}
        <div className="relative z-0 mx-auto flex w-[92%] max-w-[440px] items-start justify-between lg:hidden">
          <Image src="/images/best-value/happy-patients/happy_customer2.webp" alt="" width={86} height={86} className="h-[70px] w-[70px] rounded-full min-[371px]:h-[86px] min-[371px]:w-[86px]" />
          <Image src="/images/best-value/happy-patients/happy_customer3.webp" alt="" width={86} height={86} className="mt-10 h-[70px] w-[70px] rounded-full min-[371px]:h-[86px] min-[371px]:w-[86px]" />
          <Image src="/images/best-value/happy-patients/happy_customer1.webp" alt="" width={86} height={86} className="h-[70px] w-[70px] rounded-full min-[371px]:h-[86px] min-[371px]:w-[86px]" />
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / stepOf(e.currentTarget)))}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="relative z-10 -mt-2 flex cursor-grab select-none items-stretch gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] active:cursor-grabbing md:gap-10 lg:mt-0 [&::-webkit-scrollbar]:hidden"
        >
          {PATIENT_TESTIMONIALS.map((t, i) => {
            const long = t.content.length > MAX_CHARS;
            const text = long ? `${t.content.substring(0, MAX_CHARS)}...` : t.content;
            return (
              <div
                key={i}
                className="flex h-[339px] w-full shrink-0 flex-col rounded-[16px] bg-white px-6 pt-[50px] pb-6 text-center shadow-[0px_0px_45px_rgba(21,41,71,0.1)] [scroll-snap-align:center] md:h-auto md:min-h-[387px] md:w-[calc((100%-80px)/3)] md:max-w-[400px]"
              >
                <Image
                  src="/images/best-value/happy-patients/rating-stars.svg"
                  alt="5 star rating"
                  width={112}
                  height={18}
                  className="pointer-events-none mx-auto h-[18px] w-[112px]"
                  draggable={false}
                />
                <h6 className="mt-6 text-[16px] font-semibold text-black">{t.name}</h6>
                <p className="mt-[15px] mb-0 text-[14px] font-medium leading-[21px] text-[#5b5b5b]">{text}</p>
                {long && (
                  <button
                    onClick={() => {
                      if (drag.current.moved) return;
                      setActive(t);
                      setShow(true);
                    }}
                    className="mx-auto mt-2 flex w-fit items-center gap-1 border-0 bg-transparent text-[14px] text-[#056cb6] outline-none"
                  >
                    Read More
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 3L10 8L5.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {PATIENT_TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                const track = trackRef.current;
                if (track) track.scrollTo({ left: i * stepOf(track), behavior: "smooth" });
              }}
              className="h-2.5 w-2.5 rounded-full transition-colors"
              style={{ backgroundColor: i === current ? activeDot : "#a3c7dc" }}
            />
          ))}
        </div>

        {/* CTA */}
        {onGetStarted && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="flex items-center rounded-full px-[60px] py-3 text-[16px] font-normal capitalize text-white transition-colors"
              style={{ backgroundColor: accent }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}
            >
              <span>Start My Free Visit</span>
              <Image src="/images/best-value/process/arrow.svg" alt="" width={10} height={17} className="ml-4 h-[15px] w-[9px]" />
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={show} onClose={() => setShow(false)} title="Patient Testimonial" size="lg">
        {active && (
          <div>
            <Image src="/images/best-value/happy-patients/rating-stars.svg" alt="5 star rating" width={112} height={18} className="h-[18px] w-[112px]" />
            <p className="mt-3 text-sm leading-relaxed text-text-primary">{active.content}</p>
            <p className="mt-4 text-sm font-semibold text-text-muted">{active.name}</p>
          </div>
        )}
      </Modal>
    </section>
  );
};
