"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { PATIENT_TESTIMONIALS, type PatientTestimonial } from "@/features/home/data/testimonials";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

const MAX_CHARS = 280;

interface HappyPatientsCta {
  label: string;
  freeLabel?: string;
  href?: string;
  onClick?: () => void;
}

interface HappyPatientsSectionProps {
  /** Drives the subheading drug name + CTA/dot accent. Defaults to sildenafil. */
  theme?: LandingTheme;
  cta?: HappyPatientsCta;
  className?: string;
}

export const HappyPatientsSection = ({ theme = "sildenafil", cta, className }: HappyPatientsSectionProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState<PatientTestimonial | null>(null);
  const [show, setShow] = useState(false);
  const isTada = theme === "tadalafil";
  const drugLabel = isTada ? "tadalafil" : "sildenafil";
  const activeDot = isTada ? "#CD8F24" : "#0057b8";

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

  const ctaClasses = cn(
    "flex w-full items-center justify-center gap-2 rounded-[30px] border border-transparent px-[50px] py-3 text-[16px] font-semibold text-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] lg:max-w-[330px]",
    isTada ? "bg-[#CD8F24] hover:bg-[#956004]" : "bg-[#204AD7] hover:bg-[#08299A]",
  );
  const ctaInner = (
    <span className="flex items-center justify-center gap-[5px] font-bold">
      <span>{cta?.label}</span>
      {cta?.freeLabel && <span className="hover:underline">{cta.freeLabel}</span>}
      <Image src="/images/why-love/arrow-figma.svg" alt="" width={17} height={17} className="h-[17px] w-[17px]" />
    </span>
  );

  return (
    <div className={cn("w-full bg-[#F4F6FB]", className)}>
      <div className="mx-auto max-w-[1320px] px-6 py-[100px] max-[1024px]:py-[30px]">
        <div className="mb-14 flex w-full flex-col items-start justify-center max-[900px]:mb-0 max-[900px]:items-center">
          <h2 className="text-[32px] font-medium leading-[142.5%] text-black min-[901px]:text-[45px]">Happy Customers</h2>
          <span className="mt-5 text-base font-normal leading-[172.5%] text-[#0E2836] min-[901px]:text-[20px]">
            Find out what men think about {drugLabel}
          </span>
        </div>

        {/* Carousel */}
        <div
          ref={trackRef}
          onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / stepOf(e.currentTarget)))}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="-mx-6 -my-8 flex cursor-grab select-none items-stretch gap-4 overflow-x-auto px-6 py-8 [-ms-overflow-style:none] [scroll-snap-type:x_mandatory] [scrollbar-width:none] active:cursor-grabbing md:gap-10 [&::-webkit-scrollbar]:hidden"
        >
          {PATIENT_TESTIMONIALS.map((t, i) => {
            const long = t.content.length > MAX_CHARS;
            const text = long ? `${t.content.substring(0, MAX_CHARS)}...` : t.content;
            return (
              <div
                key={i}
                className="flex h-[339px] w-full shrink-0 flex-col rounded-[16px] bg-white px-6 pt-[50px] pb-6 text-center shadow-[0px_8px_24px_rgba(21,41,71,0.08)] [scroll-snap-align:center] md:h-auto md:min-h-[387px] md:w-[calc((100%-80px)/3)] md:max-w-[400px]"
              >
                <Image
                  src="/icons/rating-stars.svg"
                  alt="5 star rating"
                  width={112}
                  height={20}
                  className="pointer-events-none mx-auto h-[18px] w-auto"
                  draggable={false}
                />
                <h3 className="mt-6 text-[16px] font-semibold text-black">{t.name}</h3>
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
              // 24×24 tap target (a11y) wrapping the 10px visual dot.
              className="flex h-6 w-6 items-center justify-center rounded-full"
            >
              <span
                className="h-2.5 w-2.5 rounded-full transition-colors"
                style={{ backgroundColor: i === current ? activeDot : "#D9D9D9" }}
              />
            </button>
          ))}
        </div>

        {cta && (
          <div className="mt-10 flex justify-center">
            {cta.href ? (
              <Link href={cta.href} onClick={cta.onClick} className={ctaClasses}>
                {ctaInner}
              </Link>
            ) : (
              <button type="button" onClick={cta.onClick} className={ctaClasses}>
                {ctaInner}
              </button>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={show} onClose={() => setShow(false)} title="Patient Testimonial" size="lg">
        {active && (
          <div>
            <Image src="/icons/rating-stars.svg" alt="5 star rating" width={112} height={20} className="h-[18px] w-auto" />
            <p className="mt-3 text-sm leading-relaxed text-text-primary">{active.content}</p>
            <p className="mt-4 text-sm font-semibold text-text-muted">{active.name}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
