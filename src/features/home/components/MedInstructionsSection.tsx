"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MedInstructionsTheme = "sildenafil" | "tadalafil";

interface QA {
  question: string;
  answer: string[];
  disclaimer?: string;
}

const SILDENAFIL_QA: QA[] = [
  {
    question: "Meet Sildenafil?",
    answer: [
      "The original ED treatment FDA approved in 1998",
      "Same active ingredient as in Viagra®, so the generic sildenafil works 100% the same",
      "Free priority 1-3 day shipping, if prescribed",
      "Every order is filled by a state-licensed pharmacy—no overseas knock-offs, ever",
      "Skip the awkward in-person doctor visit; complete a secure 5-minute health assessment and a U.S. doctor reviews it within hours",
      "Your information is HIPAA-protected, meaning it is safeguarded by law",
    ],
  },
  {
    question: "How to take?",
    answer: [
      "Swallow one tablet with water about 1 hour before sex",
      "Effects can start in about 30 minutes and last up to 4 hours with sexual stimulation",
      "A heavy, high-fat meal (e.g., cheeseburger and fries) can slow onset; a lighter meal or empty stomach works faster",
      "Never exceed the dose your provider prescribed; message the care team if anything is unclear",
    ],
  },
  {
    question: "Side effects",
    answer: [
      "Common, usually mild: flushing, headache, stuffy nose, light dizziness, or nausea",
      "Rare but serious: sudden vision changes, chest or arm pain, or an erection lasting longer than 4 hours (priapism)",
      "Seek emergency medical care immediately for any serious effects, especially priapism",
      "Limit alcohol to fewer than about five drinks to reduce dizziness and maintain results",
    ],
    disclaimer:
      "Medical disclaimer: Sildenafil is prescription-only and not suitable for everyone. Do not use it if you take nitrates, certain blood-pressure medicines, or have been advised to avoid sexual activity. Always follow the individualized guidance from your licensed healthcare provider",
  },
];

const TADALAFIL_QA: QA[] = [
  {
    question: "Meet Tadalafil?",
    answer: [
      "The original ED treatment FDA approved in 2003",
      "Same active ingredient as in Cialis®, so the generic tadalafil works 100% the same",
      "Free priority 1-3 day shipping, if prescribed.",
      "Every order is filled by a state-licensed pharmacy—no overseas knock-offs, ever",
      "Skip the awkward in-person doctor visit; complete a secure 5-minute health assessment and a U.S. doctor reviews it within hours",
      "Your information is HIPAA-protected, meaning it is safeguarded by law",
    ],
  },
  {
    question: "How to take?",
    answer: [
      "Swallow one tablet with water at least 30 minutes before sex",
      "Effects can last up to 36 hours with sexual stimulation",
      "Can be taken with or without food",
      "Never exceed the dose your provider prescribed; message the care team if anything is unclear",
    ],
  },
  {
    question: "Side effects",
    answer: [
      "Common, usually mild: headache, back pain, muscle aches, flushing, or stuffy nose",
      "Rare but serious: sudden vision changes, chest or arm pain, or an erection lasting longer than 4 hours (priapism)",
      "Seek emergency medical care immediately for any serious effects, especially priapism",
      "Limit alcohol to fewer than about five drinks to reduce dizziness and maintain results",
    ],
    disclaimer:
      "Medical disclaimer: Tadalafil is prescription-only and not suitable for everyone. Do not use it if you take nitrates, certain blood-pressure medicines, or have been advised to avoid sexual activity. Always follow the individualized guidance from your licensed healthcare provider",
  },
];

const ChevronDown = ({ open }: { open: boolean }) => (
  <span
    aria-hidden
    className="ml-4 shrink-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.61807 7.49525C6.87366 7.47029 7.11528 7.36678 7.30975 7.19892L12.5346 2.71652C12.6643 2.61148 12.7718 2.48163 12.8509 2.33455C12.9299 2.18747 12.9789 2.02611 12.9949 1.85989C13.0105 1.69367 12.9926 1.526 12.9422 1.36686C12.8917 1.20771 12.8098 1.06035 12.7013 0.933527C12.5928 0.807222 12.46 0.704012 12.3108 0.630011C12.1617 0.556011 11.9992 0.512726 11.833 0.502721C11.6664 0.491614 11.4993 0.51459 11.3419 0.570248C11.1845 0.625907 11.0401 0.71308 10.9174 0.82645L6.50114 4.61656L2.08487 0.82645C1.96174 0.713803 1.81722 0.627092 1.65992 0.571478C1.50263 0.515863 1.33578 0.492481 1.16927 0.502721C1.00267 0.512399 0.839718 0.555527 0.690115 0.629538C0.540512 0.70355 0.407318 0.80693 0.298458 0.933527C0.190806 1.06087 0.109431 1.2083 0.0590394 1.3673C0.00864755 1.5263 -0.00976094 1.69372 0.00487174 1.85989C0.0205437 2.02647 0.0695945 2.18818 0.149106 2.33537C0.228618 2.48255 0.336956 2.61218 0.467643 2.71652L5.69252 7.19892C5.81904 7.30794 5.96619 7.39037 6.1252 7.44128C6.28421 7.49219 6.45182 7.51054 6.61807 7.49525Z"
        fill="black"
      />
    </svg>
  </span>
);

interface MedInstructionsSectionProps {
  /** Drug drives the question set + "About {Drug}" title. Defaults to sildenafil. */
  theme?: MedInstructionsTheme;
  className?: string;
}

export const MedInstructionsSection = ({ theme = "sildenafil", className }: MedInstructionsSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const questions = theme === "tadalafil" ? TADALAFIL_QA : SILDENAFIL_QA;
  const drugLabel = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <section className={cn("w-full bg-white", className)}>
      <div className="mx-auto w-full max-w-[1000px] px-6 py-10 min-[1420px]:max-w-[1320px] min-[1420px]:px-0 min-[1420px]:py-[5.6vw]">
        <div className="mb-14 hidden text-[45px] font-medium leading-[142.5%] min-[992px]:block">
          About {drugLabel}
        </div>

        {questions.map((q, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="mb-4 overflow-hidden rounded last:mb-0 min-[1025px]:mb-[34px]">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between rounded-lg border-[1.5px] border-[#e1edf3] bg-transparent px-5 py-4 text-left text-sm font-medium text-[#262A32] transition min-[1025px]:rounded min-[1025px]:text-[20px] min-[1025px]:font-normal"
              >
                {q.question}
                <ChevronDown open={isOpen} />
              </button>
              <div className={cn("overflow-hidden transition-all duration-[450ms]", isOpen ? "max-h-[500px]" : "max-h-0")}>
                <ul className="list-disc pl-5 pt-5 min-[600px]:mt-[34px] min-[600px]:bg-[#F4F6FB] min-[600px]:p-6 min-[600px]:pl-[34px]">
                  {q.answer.map((ans, i) => (
                    <li key={i} className="text-sm font-normal leading-[172.5%] text-[#262A32] min-[1025px]:text-base">
                      {ans}
                    </li>
                  ))}
                </ul>
              </div>
              {q.disclaimer && (
                <div className="mt-[30px] text-[11px] font-normal italic leading-[172.5%] text-[#777]">{q.disclaimer}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
