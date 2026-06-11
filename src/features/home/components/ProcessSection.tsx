import { RiStethoscopeLine, RiMedicineBottleLine, RiTruckLine } from "react-icons/ri";

const steps = [
  {
    step: 1,
    icon: RiStethoscopeLine,
    title: "Online Doctor Visit",
    description:
      "Answer a few quick health questions. A US-licensed physician reviews your case — same day.",
  },
  {
    step: 2,
    icon: RiMedicineBottleLine,
    title: "Get Your Prescription",
    description:
      "If approved, your doctor sends a prescription to our US-licensed partner pharmacy.",
  },
  {
    step: 3,
    icon: RiTruckLine,
    title: "Discreet Delivery",
    description:
      "Your medication ships in plain, unmarked packaging with FREE 1-3 day priority shipping.",
  },
];

export const ProcessSection = () => (
  <section id="process" className="bg-bg-main py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <h2 className="text-center text-3xl font-extrabold text-text-primary">
        How Our Process Works
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map(({ step, icon: Icon, title, description }) => (
          <div key={step} className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {step}
              </span>
              <p className="font-semibold text-text-primary">{title}</p>
            </div>
            <p className="mt-2 text-sm text-text-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
