import Image from "next/image";
import { cn } from "@/lib/utils";

type WhatsIncludedTheme = "sildenafil" | "tadalafil";

interface WhatsIncludedSectionProps {
  /** Drug drives the dark background colour. Defaults to sildenafil. */
  theme?: WhatsIncludedTheme;
  className?: string;
}

const ITEMS = [
  { icon: "/images/whats-included/icon-stethoscope.svg", text: "Free online consultation" },
  { icon: "/images/whats-included/icon-pharmacy.svg", text: "Dispensed From a US Licensed Pharmacy" },
  { icon: "/images/whats-included/icon-check.svg", text: "FDA Approved Medications" },
  { icon: "/images/whats-included/icon-pill.svg", text: "US Licensed Medical Support" },
  { icon: "/images/whats-included/icon-truck.svg", text: "Priority Shipping in Discreet Packaging" },
];

export const WhatsIncludedSection = ({ theme = "sildenafil", className }: WhatsIncludedSectionProps) => (
  <section className={cn(theme === "tadalafil" ? "bg-[#1D1204]" : "bg-[#0E2836]", className)}>
    <div className="mx-auto flex max-w-[1000px] flex-col gap-6 px-6 py-10 text-white min-[901px]:flex-row min-[901px]:gap-12 min-[1028px]:px-0 min-[1028px]:py-[100px] min-[1420px]:max-w-[1320px]">
      <h2 className="text-[32px] font-medium leading-tight min-[901px]:mr-16 min-[901px]:text-[36px] min-[1420px]:mr-52 min-[1420px]:text-[45px]">
        What Is Included?
      </h2>
      <div className="flex flex-col gap-4 min-[901px]:gap-6">
        {ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-5 max-[900px]:flex-wrap max-[900px]:items-start max-[900px]:gap-2.5"
          >
            <Image
              src={item.icon}
              alt=""
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 shrink-0 max-[900px]:h-[22px] max-[900px]:w-[22px]"
            />
            <span className="text-[16px] font-normal leading-normal max-[900px]:flex-1 max-[900px]:text-[13px]">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
