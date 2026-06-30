"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { PATIENT_TESTIMONIALS, type PatientTestimonial } from "@/features/home/data/testimonials";

type HeroTestimonialTheme = "sildenafil" | "tadalafil";

const CFG = {
  CHARS_PER_LINE: 80,
  MAX_LINES: 2,
  NAME_PADDING: 3,
  READ_MORE_PADDING: 15,
  TRANSITION_DELAY: 250,
  ROTATION_INTERVAL: 6000,
};

const AVATARS = [
  "/images/hero-testimonial/patient-one.png",
  "/images/hero-testimonial/patient-two.png",
  "/images/hero-testimonial/patient-three.png",
  "/images/hero-testimonial/patient-four.png",
];

// Decides how a testimonial fits the 2-line band (mirrors aum getTestimonialLayout).
const getLayout = (t: PatientTestimonial) => {
  const { content } = t;
  const nameLength = t.name.length + CFG.NAME_PADDING;
  const maxTwoLines = CFG.CHARS_PER_LINE * CFG.MAX_LINES;

  if (content.length + nameLength <= maxTwoLines) {
    const lines = Math.ceil(content.length / CFG.CHARS_PER_LINE);
    if (lines <= 1) return { displayContent: content, showReadMore: false, nameOnNewLine: false };
    const remaining = CFG.CHARS_PER_LINE - (content.length % CFG.CHARS_PER_LINE);
    return { displayContent: content, showReadMore: false, nameOnNewLine: remaining < nameLength };
  }
  const maxLen = maxTwoLines - nameLength - CFG.READ_MORE_PADDING;
  return { displayContent: content.substring(0, maxLen) + "...", showReadMore: true, nameOnNewLine: false };
};

interface HeroTestimonialSectionProps {
  /** Drives the band background colour. Defaults to sildenafil. */
  theme?: HeroTestimonialTheme;
  className?: string;
}

export const HeroTestimonialSection = ({ theme = "sildenafil", className }: HeroTestimonialSectionProps) => {
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const [active, setActive] = useState<PatientTestimonial | null>(null);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (showModal) return;
    intervalRef.current = setInterval(() => {
      setExiting(current);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PATIENT_TESTIMONIALS.length);
        setExiting(null);
      }, CFG.TRANSITION_DELAY);
    }, CFG.ROTATION_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, showModal]);

  const themeBg = theme === "tadalafil" ? "bg-[#715733]" : "bg-[#365e75]";

  return (
    <div className={cn("w-full px-5 py-2.5 text-white md:px-10 md:py-4", themeBg, className)}>
      <div className="mx-auto flex max-w-[1320px]">
        {/* Left: avatars + stars */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {AVATARS.map((src, i) => (
              <div key={i} className="relative -ml-2 h-10 w-10 overflow-hidden rounded-full border border-white/40 bg-white first:ml-0">
                <Image src={src} alt={`Patient ${i + 1}`} width={40} height={40} className="h-full w-full object-cover brightness-[0.8] grayscale" />
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <Image src="/icons/rating-stars.svg" alt="5 star rating" width={95} height={22} className="h-[18px] w-[79px] md:h-[22px] md:w-[95px]" />
            <span className="mt-0.5 text-[10px] font-semibold leading-[142.5%] text-[#fefefe] underline md:no-underline">
              Real Patients. Real Results.
            </span>
          </div>
        </div>

        {/* Right: rotating testimonial (desktop only) */}
        <div className="hidden flex-1 md:block">
          <div className="relative h-[46px] overflow-hidden">
            {PATIENT_TESTIMONIALS.map((t, i) => {
              const layout = getLayout(t);
              const state =
                i === current
                  ? "translate-y-0 opacity-100"
                  : i === exiting
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0";
              return (
                <div key={i} className={cn("absolute left-0 top-0 flex w-full items-start pt-1 transition-all duration-500 ease-in-out", state)}>
                  <div className="ml-[42px] flex max-w-[calc(100%-42px)] flex-col text-[14px] font-medium italic leading-[1.4] text-white">
                    <span className="block break-words">
                      &quot;{layout.displayContent}&quot;
                      {layout.showReadMore && (
                        <button
                          onClick={() => {
                            setActive(t);
                            setShowModal(true);
                          }}
                          className="ml-1 inline cursor-pointer p-0 text-[12px] font-semibold italic text-[#f4f6fb] underline hover:text-white"
                        >
                          read more
                        </button>
                      )}
                      {!layout.nameOnNewLine && (
                        <span className="ml-1 inline text-[14px] font-bold italic leading-[1.4] text-[#f4f6fb]">- {t.name}</span>
                      )}
                    </span>
                    {layout.nameOnNewLine && (
                      <span className="mt-0.5 block text-[14px] font-bold italic leading-[1.4] text-[#f4f6fb]">- {t.name}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Patient Testimonial" size="lg">
        {active && (
          <div>
            <p className="text-sm italic leading-relaxed text-text-primary">&quot;{active.content}&quot;</p>
            <p className="mt-4 text-sm font-bold text-text-muted">- {active.name}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
