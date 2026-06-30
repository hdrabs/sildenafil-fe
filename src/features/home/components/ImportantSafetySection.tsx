import Image from "next/image";
import { cn } from "@/lib/utils";

type ImportantSafetyTheme = "sildenafil" | "tadalafil";

interface ImportantSafetySectionProps {
  /** Drives the tick icon + its background. Defaults to sildenafil. */
  theme?: ImportantSafetyTheme;
  /** "Read more" target (full safety-info page). Defaults to "#". */
  href?: string;
  className?: string;
}

export const ImportantSafetySection = ({ theme = "sildenafil", href = "#", className }: ImportantSafetySectionProps) => {
  const isSild = theme === "sildenafil";

  return (
    <section className={cn("w-full bg-white min-[1024px]:pb-[100px]", className)}>
      <div className="mx-auto max-w-[1320px] rounded-2xl bg-[#F4F6FB] px-6 py-10">
        <div className="mb-5 flex items-center text-sm font-semibold leading-[140%] text-black min-[1024px]:text-base">
          <span
            className="mr-[14px] flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: isSild ? "#BFD9E4" : "#ffe6b3" }}
          >
            <Image
              src={`/images/important-safety/${isSild ? "blue-tick" : "yellow-tick"}.svg`}
              alt="checkmark"
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          </span>
          Important Safety Information
        </div>
        <div className="rounded-[10px] border-2 border-[#cfe0ee] bg-white p-4 text-xs font-normal leading-[1.5] text-[#222] min-[1024px]:text-sm">
          Do not take sildenafil (sildenafil citrate) or tadalafil if you use medications that contain nitrates or guanylate cyclase stimulators used for pulmonary hypertension, as this combination may cause an unsafe drop in blood pressure.
          <br />
          <a className="cursor-pointer font-normal text-[#2a5bd7] underline" href={href} target="_blank" rel="noopener noreferrer">
            Read more.
          </a>
        </div>
      </div>
    </section>
  );
};
