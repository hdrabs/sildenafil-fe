"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BestValueProcessProps {
  /** Primary CTA — scrolls back to the configurator by default. Omit to hide it. */
  onGetStarted?: () => void;
  ctaLabel?: string;
  className?: string;
}

const STEPS = [
  {
    number: 1,
    title: "Answer Some Questions About Your Health",
    body: "Privately inform our U.S-licensed healthcare provider about your medical history and symptoms.",
  },
  {
    number: 2,
    title: "Receive A Prescription for Treatment",
    body: "If a medical treatment is prescribed, it will be sent to the pharmacy same day.",
  },
  {
    number: 3,
    title: "Free 1 to 3 Days Priority Shipping",
    body: "Your medication will be shipped out in discreet packaging within 24 hours of successful ordering.",
  },
];

const FEATURES = [
  { icon: "/images/best-value/process/clock.svg", w: 56, h: 56, text: "Confidential online consultation takes minutes" },
  { icon: "/images/best-value/process/calendar.svg", w: 59, h: 56, text: "No waiting rooms or appointments" },
  { icon: "/images/best-value/process/mobile.svg", w: 37, h: 63, text: "Medical visit can be done on your smartphone or computer" },
];

export const BestValueProcess = ({ onGetStarted, ctaLabel = "Start My Free Visit", className }: BestValueProcessProps) => (
  <section id="process" className={cn("bg-[#f4f6fb]", className)}>
    <div className="mx-auto w-full max-w-[1320px] px-[18px] py-[40px] md:py-[120px]">
      <h2 className="mb-5 text-[24px] font-semibold leading-[34px] text-black md:mb-[30px] md:text-[32px] md:leading-[46px]">
        How our process works
      </h2>

      {/* Numbered step cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-3 rounded-[7px] bg-white p-[30px] lg:min-h-[232px]">
            <span className="mt-[5px] flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full bg-[#1b53af] text-[13px] font-medium text-white">
              {step.number}
            </span>
            <div>
              <h3 className="text-[16px] font-semibold leading-[28px] text-black">{step.title}</h3>
              <p className="mt-4 text-[16px] leading-[28px] text-black">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-12 w-full text-center text-[16px] font-semibold leading-[28px] text-black md:w-11/12">
        With our current technologies, gone are the days of scheduling a day off of work to see a
        doctor. You can simply connect with a healthcare provider licensed in your state from the
        comforts of your own home using a smartphone or computer.
      </p>

      {/* Feature strip — col-lg-3 items distributed with justify-around (AUM) */}
      <div className="mt-12 flex flex-col gap-5 min-[992px]:flex-row min-[992px]:justify-around min-[992px]:gap-0">
        {FEATURES.map((f) => (
          <div
            key={f.text}
            className="flex items-center gap-6 rounded-[5px] border border-[#ccd4e6] p-5 min-[992px]:w-1/4 min-[992px]:border-0 min-[992px]:p-0"
          >
            <Image src={f.icon} alt="" width={f.w} height={f.h} className="shrink-0" />
            <p className="mb-0 text-[16px] leading-[28px] text-black">{f.text}</p>
          </div>
        ))}
      </div>

      {onGetStarted && (
        <div className="flex w-full justify-center pt-10 md:pt-[92px]">
          <button
            type="button"
            onClick={onGetStarted}
            className="flex w-full items-center justify-center rounded-full border border-[#1b53af] bg-[#1b53af] px-[60px] py-3 text-[16px] font-normal capitalize text-white transition-colors hover:bg-[#2269db] min-[650px]:w-auto"
          >
            <span>{ctaLabel}</span>
            <Image
              src="/images/best-value/process/arrow.svg"
              alt=""
              width={10}
              height={17}
              className="ml-4 h-[13px] w-[7px] lg:h-[17px] lg:w-[10px]"
            />
          </button>
        </div>
      )}
    </div>
  </section>
);
