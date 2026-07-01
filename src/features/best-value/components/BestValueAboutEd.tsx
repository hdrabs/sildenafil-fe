"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface BestValueAboutEdProps {
  /** Drug drives the body-copy drug name. Defaults to sildenafil. */
  theme?: LandingTheme;
  className?: string;
}

const QUESTIONS = [
  {
    q: "Can my ED be treated?",
    a: "Yes! There are several treatment options for ED and members of our healthcare team can help you with assessing your ED and your options.",
  },
  {
    q: "What causes ED?",
    a: "There are many common causes of ED, including heart, and blood vessel diseases, diabetes, side effect of some medications, obesity, cigarette smoking, depression, anxiety, stress, and more. Sometimes, ED is caused by a combination of factors and a specific cause might not be determined.",
  },
  {
    q: "When should I seek a healthcare professional's opinion for the treatment of my ED?",
    a: "You should schedule a virtual visit with one of our experienced US-licensed healthcare professionals, if you are experiencing ED, or if you have other health conditions that might contribute to ED, such as heart disease or diabetes.",
  },
];

export const BestValueAboutEd = ({ theme = "sildenafil", className }: BestValueAboutEdProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const drugName = theme === "tadalafil" ? "Tadalafil" : "Sildenafil";

  return (
    <section id="about-ed" className={cn("bg-white", className)}>
      <div className="mx-auto w-full max-w-[1320px] px-[18px] py-[40px] md:py-[70px]">
        <h2 className="mb-5 text-[24px] font-semibold leading-[34px] text-black md:mb-[30px] md:text-[32px] md:leading-[46px]">
          About ED
        </h2>

        <div className="flex flex-col gap-5 md:flex-row md:justify-between md:gap-0">
          {/* Stats card (col-md-5, pic-block 90%) */}
          <div className="w-full md:w-5/12">
            <div className="overflow-hidden rounded-[10px] bg-bg-main p-5 font-semibold md:w-[90%]">
              <Image
                src="/images/best-value/about-ed/about_ed_percentage.svg"
                alt="52% of men will experience ED"
                width={300}
                height={140}
                className="h-auto w-full max-w-[300px]"
              />
              <p className="mt-4 text-[16px] leading-[26px] text-black md:ml-[15px]">
                52% of men at some point in their life will experience erectile dysfunction.{" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/8254833/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#056cb6] underline"
                >
                  (Source)
                </a>
              </p>
            </div>
          </div>

          {/* Copy + accordion (col-md-6) */}
          <div className="w-full md:w-6/12">
            <p className="mb-0 text-[16px] leading-[28px] text-black">
              Erectile dysfunction (ED) is the inability to get or maintain an erection due to
              decreased blood flow into desired areas. {drugName} predominantly works on reducing an
              enzyme called phosphodiesterase-5 (PDE5) resulting in increased blood flow and
              maintaining an erection adequate for sex.
            </p>

            <h3 className="my-6 text-[18px] font-bold uppercase tracking-[0.3px] text-primary">
              Common Questions
            </h3>

            <div>
              {QUESTIONS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={item.q}
                    className={cn("border-b border-[#e4e4e4]", i === QUESTIONS.length - 1 && "border-b-0")}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-[22px] text-left"
                    >
                      <span className="text-[18px] font-semibold leading-[26px] text-black">{item.q}</span>
                      {isOpen ? (
                        <Image
                          src="/images/best-value/about-ed/close.svg"
                          alt=""
                          width={24}
                          height={24}
                          className="h-6 w-6 shrink-0"
                        />
                      ) : (
                        <Image
                          src="/images/best-value/about-ed/chevron-down.svg"
                          alt=""
                          width={17}
                          height={10}
                          className="mr-[3px] h-[10px] w-[17px] shrink-0"
                        />
                      )}
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isOpen ? "max-h-[400px]" : "max-h-0",
                      )}
                    >
                      <p className="pb-5 text-[16px] leading-[28px] text-black">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
