"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface BestValueFaqProps {
  /** Drug drives the open-question accent colour. Defaults to sildenafil. */
  theme?: LandingTheme;
  className?: string;
}

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Is the medication FDA approved?",
    a: "Yes, 100% of the medications dispensed are FDA approved.",
  },
  {
    q: "Are you licensed and certified?",
    a: (
      <>
        Yes, we are approved by the National Association of Boards of Pharmacy{" "}
        <a href="https://safe.pharmacy/buy-safely/?url=sildenafil.com" className="underline" target="_blank" rel="noreferrer">
          (NABP)
        </a>{" "}
        and{" "}
        <a href="https://www.legitscript.com/websites/sildenafil.com/" className="underline" target="_blank" rel="noreferrer">
          LegitScripts
        </a>
        .
      </>
    ),
  },
  {
    q: "Do I need a prescription?",
    a: (
      <>
        <p>
          Yes, a prescription is required. If you have an active prescription at another pharmacy, we
          can transfer it in. If your prescription is with you, it can be mailed to us. Due to
          regulations, we are unable to accept faxed, scanned, or photocopied prescriptions from
          patients.
        </p>
        <p className="mt-3">
          If you require a new prescription to be issued, you can simply connect with one of our
          healthcare providers licensed in your state from the comforts of your own home using a
          smartphone or computer.
        </p>
      </>
    ),
  },
  {
    q: "How much is shipping?",
    a: "Shipping is free with minimum order. Need it fast? Expedited delivery is available for an additional charge.",
  },
  {
    q: "How long does it take to be delivered?",
    a: "Packages are shipped via USPS Priority and USPS Priority Express. Most patients receive their prescriptions in 1-3 days.",
  },
  {
    q: "Is this a subscription?",
    a: "We are not a subscription-based service. No unexpected deliveries, no forgetting to cancel.",
  },
  {
    q: "Are there any additional fees?",
    a: "There are no additional fees, extra charges, or any hidden fees. The price you see is the price you pay.",
  },
  {
    q: "What are my payment options?",
    a: "We accept all credit and debit cards, in addition to, HSA, FSA, and other health savings cards.",
  },
  {
    q: "Do you accept returns?",
    a: "Unfortunately, we are unable to accept any returns as US regulations prohibit the reuse of returned prescription medications. If this is your first time using this type of medication, we recommend starting with a smaller order so you can see how it works for you.",
  },
];

export const BestValueFaq = ({ theme = "sildenafil", className }: BestValueFaqProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const accent = theme === "tadalafil" ? "#CD8F24" : "#1b53af";

  return (
    <section id="faq" className={cn("bg-[#f4f6fb]", className)}>
      <div className="mx-auto w-full max-w-[1320px] px-[18px] py-[75px] md:py-[100px]">
        <h2 className="mb-[30px] text-left text-[24px] font-semibold leading-[34px] text-black md:text-[32px] md:leading-[46px]">
          Frequently Asked Questions
        </h2>

        <div>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className={cn(
                  "mb-6 rounded-[6px] border border-[#d1d8ea]/50 transition-shadow",
                  isOpen && "bg-white shadow-[0px_0px_45px_rgba(21,41,71,0.1)]",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-[6px] px-6 py-5 text-left text-[16px] font-semibold transition-colors min-[441px]:px-12 min-[441px]:py-[22px]",
                    isOpen ? "bg-white" : "bg-transparent text-black hover:bg-[rgba(209,216,234,0.5)]",
                  )}
                  style={isOpen ? { color: accent } : undefined}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Image
                      src="/images/best-value/faq/close.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 shrink-0"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="ml-3 shrink-0"
                    >
                      <path
                        d="M10.3881 11.8374L11.5002 10.8837L15.9165 14.6738C16.0406 14.78 16.1845 14.8608 16.3398 14.9115C16.4952 14.9621 16.659 14.9816 16.8219 14.9689C16.9847 14.9562 17.1435 14.9115 17.2891 14.8373C17.4348 14.7632 17.5644 14.6611 17.6705 14.5368C17.7767 14.4125 17.8574 14.2686 17.908 14.1131C17.9586 13.9576 17.9781 13.7937 17.9654 13.6306C17.9527 13.4676 17.908 13.3087 17.834 13.1629C17.7599 13.0172 17.6579 12.8875 17.5337 12.7812L12.3088 8.29881C12.0835 8.10591 11.7967 7.9999 11.5002 7.9999C11.2037 7.9999 10.9169 8.10591 10.6916 8.29881L5.46672 12.7812C5.34256 12.8875 5.24054 13.0172 5.16647 13.1629C5.0924 13.3087 5.04773 13.4676 5.03502 13.6306C5.02231 13.7937 5.04181 13.9576 5.09241 14.1131C5.143 14.2686 5.22369 14.4125 5.32988 14.5368C5.43607 14.6611 5.56567 14.7632 5.71129 14.8373C5.85691 14.9115 6.01569 14.9562 6.17857 14.9689C6.34145 14.9816 6.50524 14.9621 6.66058 14.9115C6.81592 14.8608 6.95979 14.78 7.08394 14.6738L10.3881 11.8374Z"
                        fill="#000000"
                      />
                    </svg>
                  )}
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isOpen ? "max-h-[700px] bg-white" : "max-h-0",
                  )}
                >
                  <div className="px-12 py-[22px] text-[16px] leading-[28px] text-black">{faq.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
