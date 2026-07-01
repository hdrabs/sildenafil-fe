"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { PATIENT_TESTIMONIALS } from "@/features/home/data/testimonials";

// aum Home PatientTestimonialsModal: the hero "Patient Testimonials" link opens a
// fixed-height, swipeable carousel of patient quotes (rating stars + name + content)
// with dots. Swipe = native touch scroll + pointer-drag for mouse.
export const PatientTestimonials = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 });

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setCurrent(Math.round(track.scrollLeft / track.clientWidth));
  };

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    track?.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { down: true, startX: e.clientX, scrollLeft: trackRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !trackRef.current) return;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = () => {
    drag.current.down = false;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer border-none bg-transparent text-[15px] font-bold text-[#1b53af] hover:underline"
      >
        Patient Testimonials
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="lg">
        <div className="py-2">
          <div
            ref={trackRef}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="flex h-[300px] cursor-grab snap-x snap-mandatory select-none overflow-x-auto overflow-y-hidden [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          >
            {PATIENT_TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="flex h-full w-full shrink-0 snap-center flex-col items-center justify-center gap-3 px-6 text-center"
              >
                <Image src="/icons/rating-stars.svg" alt="5 star rating" width={84} height={15} className="h-[15px] w-auto" />
                <h5 className="text-[18px] font-semibold text-[#262a32]">{t.name}</h5>
                <p className="max-h-[180px] overflow-y-auto text-[16px] leading-[28px] text-[#5b5b5b]">{t.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {PATIENT_TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-2 w-2 rounded-full transition-colors"
                style={{ backgroundColor: i === current ? "#1b53af" : "#d9d9d9" }}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
