"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { LandingTheme } from "@/features/landing/components/ProductConfigurator";

interface LabTestedCta {
  label: string;
  freeLabel?: string;
  href?: string;
  onClick?: () => void;
}

interface LabTestedSectionProps {
  /** Drives the highlight accent. Defaults to sildenafil. */
  theme?: LandingTheme;
  /** Optional mobile CTA. Omit to render without a button. */
  cta?: LabTestedCta;
  className?: string;
}

export const LabTestedSection = ({ theme = "sildenafil", cta, className }: LabTestedSectionProps) => {
  const [reportOpen, setReportOpen] = useState(false);
  const isTada = theme === "tadalafil";
  const highlight = isTada ? "text-[#CD8F24]" : "text-[#1B53AF]";

  const ctaClasses = cn(
    "mt-[26px] flex w-full items-center justify-center gap-2 rounded-[30px] border border-transparent px-[50px] py-3 text-[16px] font-semibold text-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] lg:max-w-[330px]",
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
    <section className={cn("w-full bg-white", className)}>
      <div className="mx-auto max-w-[1320px] px-0 py-[100px] max-[1024px]:px-6 max-[1024px]:py-14">
        <div>
          <span className="block text-[32px] font-medium leading-[142.5%] text-[#262A32] min-[901px]:text-[45px]">
            Lab Tested. Doctor Approved.
          </span>
          <p className="mt-2 mb-4 text-lg font-semibold text-[#c6272c] min-[992px]:mt-3 min-[992px]:mb-8 min-[992px]:text-[30px]">
            Guaranteed Lowest Price!
          </p>
        </div>

        <div className="mt-6 flex flex-row items-center justify-between max-[1024px]:flex-col max-[1024px]:items-stretch">
          {/* Guarantee panel */}
          <div className="min-[1224px]:mr-8">
            <div className="flex items-center justify-between rounded-[5px] bg-[#e7ebf6] p-5 pb-3 max-[1024px]:p-[22px]">
              <div>
                <p className="mb-2 text-base font-semibold max-[1024px]:text-sm">
                  We test our pills to make sure you know exactly what you&apos;re getting. Viagra is the #1 counterfeited medication in the world, our low price and quality guarantee means you never have to worry.
                </p>
                <p className="text-base max-[1024px]:text-sm">
                  <span className={cn("font-semibold", highlight)}>
                    We guarantee a pharmaceutically safe and potent drug at the lowest price.
                  </span>
                  <span>
                    {" "}
                    Save up to 90% on generic ED medications compared to any telehealth provider - if you find a lower price we will beat it, guaranteed.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Badge + certificate */}
          <div className="flex justify-between gap-0.5 max-[1024px]:mt-8">
            <div>
              <Image src="/images/lab-tested/quality-approved-badge.svg" alt="quality-approved-badge" width={139} height={139} />
            </div>
            <div className="flex flex-col">
              <small className="flex justify-center">
                <Image src="/images/lab-tested/new-signature.png" alt="signature" width={91} height={77} className="block" />
              </small>
              <span className="w-max text-left text-[13px] font-normal leading-[172.5%] text-black">
                Certificate of Analysis for
                <br />
                Sildenafil Citrate
                <br />
                <button type="button" onClick={() => setReportOpen(true)} className="text-[12px] font-light text-[#1B53AF] underline">
                  View the report
                </button>
              </span>
            </div>
          </div>

          {/* Mobile CTA */}
          {cta && (
            <div className="mt-2 flex w-full md:hidden">
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
      </div>

      <Modal isOpen={reportOpen} onClose={() => setReportOpen(false)} title="Certificate of Analysis" size="xl">
        <Image src="/images/lab-tested/lab_report.webp" alt="lab-report" width={612} height={792} className="h-auto w-full" />
      </Modal>
    </section>
  );
};
