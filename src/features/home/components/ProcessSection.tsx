import Image from "next/image";

type ProcessTheme = "sildenafil" | "tadalafil";

interface ProcessSectionProps {
  /** Drug drives the step-2 image and the number-badge colour. Defaults to sildenafil. */
  theme?: ProcessTheme;
}

const getSteps = (theme: ProcessTheme) => [
  {
    number: 1,
    title: "Answer questions about your health",
    desc: "Privately inform a U.S. licensed healthcare provider about your medical history and symptoms.",
    img: "/images/process/sildenafil-process-phone.png",
    imgW: 173,
    imgH: 164,
  },
  {
    number: 2,
    title: "Choose your treatment",
    desc: "Review FDA-approved options and select your preference. Your provider will make the final call. You're in good hands.",
    img:
      theme === "tadalafil"
        ? "/images/process/tadalafil-jar.png"
        : "/images/process/sildenafil-jar.png",
    imgW: theme === "tadalafil" ? 167 : 165,
    imgH: theme === "tadalafil" ? 174 : 177,
  },
  {
    number: 3,
    title: "Free 1 to 3 Priority Delivery",
    desc: "Your medication will ship out in discreet packaging within 24 hours of successful processing.",
    img: "/images/process/pillow-pack.png",
    imgW: 217,
    imgH: 161,
  },
];

const ProcessCard = ({
  step,
  badgeColor,
}: {
  step: ReturnType<typeof getSteps>[number];
  badgeColor: string;
}) => (
  <div className="relative flex min-h-[360px] w-[360px] max-w-full flex-col rounded-2xl bg-white px-6 pt-8 pb-6 shadow-[0_4px_24px_rgba(44,62,80,0.08)]">
    <div className="mb-4 flex w-full items-start">
      <span
        style={{ backgroundColor: badgeColor }}
        className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[14px] text-white"
      >
        {step.number}
      </span>
      <div className="text-[20px] font-bold text-[#18181b]">{step.title}</div>
    </div>
    <div className="mb-8 w-full text-[1.05rem] text-[#444]">{step.desc}</div>
    <Image
      src={step.img}
      alt={`Step ${step.number}`}
      width={step.imgW}
      height={step.imgH}
      sizes={`${step.imgW}px`}
      // Pin both dimensions so the rendered box equals the props exactly — avoids
      // the next/image aspect warning that fires when CSS/preflight resizes only one axis.
      style={{ width: step.imgW, height: step.imgH }}
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
    />
  </div>
);

export const ProcessSection = ({ theme = "sildenafil" }: ProcessSectionProps) => {
  const steps = getSteps(theme);
  const badgeColor = theme === "tadalafil" ? "#CD8F24" : "#2563eb";

  return (
    <section id="process" className="bg-[#F4F6FB]">
      {/* Desktop layout (≥901px) */}
      <div className="mx-auto hidden w-full max-w-7xl py-16 min-[901px]:block">
        <h2 className="mb-14 text-[45px] font-medium leading-[120%] text-[#262A32]">
          How Our Process works
        </h2>
        <div className="flex flex-wrap justify-center gap-x-20 gap-y-12">
          {steps.map((step) => (
            <ProcessCard key={step.number} step={step} badgeColor={badgeColor} />
          ))}
        </div>
      </div>

      {/* Mobile layout (≤900px) — text steps + phone image, identical for both drugs */}
      <div className="px-6 pt-10 min-[901px]:hidden">
        <h2 className="mb-6 text-[32px] font-medium leading-[120%] text-[#262A32]">
          How Our Process works
        </h2>
        <div>
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-[5px]">
              <span className="text-[14px] font-semibold leading-[172.5%] text-black">
                Step {step.number}: {step.title}
              </span>
              <span className="mb-5 text-[14px] font-normal leading-[172.5%] text-black">
                {step.desc}
              </span>
            </div>
          ))}
        </div>
        <div className="relative flex h-[278px] w-full flex-col items-center overflow-hidden max-[600px]:h-[180px]">
          <Image
            src="/images/process/sildenafil-process-phone.png"
            alt="Sildenafil process phone"
            width={478}
            height={532}
            sizes="(max-width: 600px) 100vw, 212px"
            className="absolute top-[42px] z-[2] h-[236px] w-[212px] rounded-t-[30px] object-cover max-[600px]:inset-x-0 max-[600px]:top-0 max-[600px]:mx-auto max-[600px]:h-full max-[600px]:w-full max-[600px]:rounded-t-[20px] max-[600px]:object-contain"
          />
        </div>
      </div>
    </section>
  );
};
