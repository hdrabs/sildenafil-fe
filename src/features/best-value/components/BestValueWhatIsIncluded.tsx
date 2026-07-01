import Image from "next/image";
import { cn } from "@/lib/utils";

interface BestValueWhatIsIncludedProps {
  className?: string;
}

const ITEMS = [
  { icon: "/images/best-value/whats-included/6.svg", text: "US Licensed Medical Providers" },
  { icon: "/images/best-value/whats-included/us-flag.webp", text: "Dispensed from a US Licensed Pharmacy" },
  { icon: "/images/best-value/whats-included/1.svg", text: "FDA Approved Medications" },
  { icon: "/images/best-value/whats-included/5.svg", text: "Professional ED Focused Medical Support" },
  { icon: "/images/best-value/whats-included/3.svg", text: "Urgent Free Shipping in Discreet Packaging" },
  { icon: "/images/best-value/whats-included/4.svg", text: "No Waiting Rooms, No Appointments" },
];

export const BestValueWhatIsIncluded = ({ className }: BestValueWhatIsIncludedProps) => (
  <section id="what-is-included" className={cn("bg-[#f4f6fb]", className)}>
    <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start justify-between gap-8 px-[18px] py-[40px] md:flex-row md:gap-0 md:py-[120px]">
      <div className="w-full md:w-5/12">
        <h2 className="text-[24px] font-semibold leading-[34px] text-black md:text-[32px] md:leading-[46px]">
          What is included?
        </h2>
      </div>

      <div className="flex w-full flex-col md:w-6/12">
        <ul className="m-0 flex list-none flex-col gap-3 p-0 md:gap-0">
          {ITEMS.map((item) => (
            <li key={item.text} className="flex items-center gap-4 md:min-h-[60px]">
              <Image
                src={item.icon}
                alt=""
                width={34}
                height={34}
                className="h-[34px] w-[34px] shrink-0 object-contain"
              />
              <h3 className="mb-0 text-[14px] font-semibold leading-[24px] text-black lg:text-[16px]">
                {item.text}
              </h3>
            </li>
          ))}
        </ul>

        <small className="mt-[34px] block text-[14px] font-normal leading-[150%] text-black">
          * A prescription will only be written, if a licensed medical provider deems it appropriate
          during a virtual consultation
        </small>
      </div>
    </div>
  </section>
);
