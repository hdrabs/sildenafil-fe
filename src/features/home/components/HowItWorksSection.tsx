import Image from "next/image";
import { cn } from "@/lib/utils";

type HowItWorksTheme = "sildenafil" | "tadalafil";

interface HowItWorksSectionProps {
  /** Drug drives the step-2 copy and the "same active ingredient" subtitle. Defaults to sildenafil. */
  theme?: HowItWorksTheme;
  className?: string;
}

const ICONS = {
  brain: "/images/how-it-works/brain.png",
  pde: "/images/how-it-works/pde.png",
  bloodVessel: "/images/how-it-works/bloodVessel.png",
};

// Thumbnail only for now — the interactive video player is wired up separately.
const THUMBNAIL = "/images/how-it-works/howitworks-thumb.jpg";

const getSteps = (drugName: string) => [
  {
    title: "Step 1: Sexual arousal triggers nitric oxide (NO)",
    desc: "When you're turned on, your body releases nitric oxide (NO), a natural chemical messenger. This signals blood vessels in the penis to relax and open.",
    icon: ICONS.brain,
    iconW: 171,
    iconH: 217,
    alt: "Nitric oxide signal",
  },
  {
    title: `Step 2: ${drugName} helps that signal last longer`,
    desc: `Normally, an enzyme called PDE-5 breaks down that signal too quickly. ${drugName} blocks PDE-5, which allows the nitric oxide signal to stay active, keeping those blood vessels open longer.`,
    icon: ICONS.pde,
    iconW: 183,
    iconH: 244,
    alt: "PDE-5 enzyme",
  },
  {
    title: "Step 3: Increased blood flow leads to a firm erection",
    desc: "With relaxed blood vessels and steady blood flow, more blood can enter the penis helping you achieve and maintain a firmer, longer-lasting erection.",
    icon: ICONS.bloodVessel,
    iconW: 159,
    iconH: 196,
    alt: "Blood vessel",
  },
];

const PlayButton = () => (
  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden>
      <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.7)" />
      <polygon points="32,24 56,40 32,56" fill="#fff" />
    </svg>
  </span>
);

export const HowItWorksSection = ({ theme = "sildenafil", className }: HowItWorksSectionProps) => {
  const isTada = theme === "tadalafil";
  const drugName = isTada ? "Tadalafil" : "Sildenafil";
  const brandName = isTada ? "Cialis" : "Viagra";
  const steps = getSteps(drugName);

  return (
    <section className={cn("bg-[#F4F6FB]", className)}>
      <div className="mx-auto max-w-[1320px] px-6 py-10 min-[1420px]:px-0 min-[1420px]:py-[100px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Left: heading + video thumbnail */}
          <div className="flex w-full flex-col lg:max-w-[560px]">
            <h2 className="mb-2 text-[32px] font-medium leading-[120%] text-[#183046] lg:text-[45px] lg:leading-[140%]">
              How it Works in Your Body
            </h2>
            <p className="mb-7 text-[16px] font-normal text-[#42526e] max-[600px]:text-[#0e2836] lg:text-[20px]">
              Same active ingredient as {brandName}
            </p>

            {/* Video thumbnail placeholder — player added later */}
            <div className="group relative aspect-[16/9] w-full max-w-[520px] cursor-pointer overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-lg:mx-auto">
              <Image
                src={THUMBNAIL}
                alt="How it works video"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover transition-[filter] duration-300 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-black/30" />
              <PlayButton />
            </div>
          </div>

          {/* Right: steps */}
          <ol className="flex w-full list-none flex-col gap-8 p-0 max-[600px]:px-[5px] lg:max-w-[576px] lg:gap-9 lg:pt-8 lg:pl-6">
            {steps.map((step) => (
              <li key={step.title} className="flex items-start">
                <div className="mr-2.5 flex min-w-[54px] shrink-0 justify-center">
                  <Image
                    src={step.icon}
                    alt={step.alt}
                    width={step.iconW}
                    height={step.iconH}
                    className="h-auto w-12 mix-blend-multiply sm:w-[54px]"
                  />
                </div>
                <div className="pl-[18px] lg:pl-8">
                  <div className="mb-1 text-[16px] font-semibold text-[#183046] max-[600px]:text-[13px]">
                    {step.title}
                  </div>
                  <div className="text-[16px] font-normal text-[#374151] max-[600px]:text-[13px]">
                    {step.desc}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
