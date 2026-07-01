import Image from "next/image";
import { cn } from "@/lib/utils";

interface BestValueRealResultsProps {
  className?: string;
}

const COUPLE_IMG = "/images/best-value/real-results/real_results_png.webp";

export const BestValueRealResults = ({ className }: BestValueRealResultsProps) => (
  <section id="real-results" className={cn("overflow-hidden bg-white", className)}>
    <div className="mx-auto w-full max-w-[1320px] px-[18px] py-[40px] md:py-[120px]">
      <h2 className="text-[24px] font-semibold leading-[34px] text-black md:text-[32px] md:leading-[46px]">
        Real Results
      </h2>

      <div className="mt-6 flex flex-col gap-8 md:mt-[30px] md:flex-row md:justify-between md:gap-0">
        {/* Copy + stats */}
        <div className="flex w-full flex-col md:w-1/2">
          <p className="text-[16px] leading-[28px] text-black md:pb-[48px]">
            It&apos;s a real FDA approved therapy. Our treatments are supported by the most current
            guidelines for the treatment of ED issued by the American Urological Association (AUA),
            years of medical studies, and backed by medical professionals.
          </p>

          <div className="mt-6 rounded-[10px] bg-bg-main p-5 font-semibold md:mt-0">
            <Image
              src="/images/best-value/real-results/real_results.svg"
              alt="74% of men saw enhancement"
              width={460}
              height={220}
              className="mt-[10px] h-auto w-full"
            />
            <p className="mt-[15px] text-[16px] leading-[26px] text-black">
              74% of men who took 50mg dose of Sildenafil (generic for Viagra) saw an enhancement in
              their erection.{" "}
              <a
                href="https://labeling.pfizer.com/ShowLabeling.aspx?format=PDF&id=652"
                target="_blank"
                rel="noreferrer"
                className="text-[#056cb6] underline"
              >
                (Source)
              </a>
            </p>
          </div>

          {/* Mobile couple image */}
          <div className="mt-8 h-[300px] w-full md:hidden">
            <Image
              src={COUPLE_IMG}
              alt="Happy couple"
              width={585}
              height={454}
              className="h-full w-full rounded-[10px] object-cover"
            />
          </div>
        </div>

        {/* Desktop couple image — natural 585×454, 30px left padding, bottom-aligned */}
        <div className="hidden w-1/2 items-end md:flex md:pl-[30px]">
          <Image
            src={COUPLE_IMG}
            alt="Happy couple"
            width={585}
            height={454}
            className="h-auto w-full max-w-[585px] rounded-[10px] object-contain"
          />
        </div>
      </div>
    </div>
  </section>
);
