import { RiCheckboxCircleLine } from "react-icons/ri";

const included = [
  "Unlimited messaging with US-licensed physicians",
  "FDA-approved generic sildenafil",
  "Expert pharmacist guidance",
  "FREE 1 to 3-day priority shipping",
  "Discreet packaging",
];

export const WhatsIncludedSection = () => (
  <section className="bg-bg-main py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Statistics */}
        <div>
          <p className="text-5xl font-extrabold text-primary">52%</p>
          <p className="mt-2 text-lg font-semibold text-text-primary">
            of men experience erectile dysfunction
          </p>
          <p className="mt-3 text-sm text-text-muted">
            Erectile dysfunction is far more common than most people think. ED
            affects men of all ages and backgrounds. Sildenafil is safe,
            effective, and available to you right now without an in-person
            doctor visit.
          </p>
          <div className="mt-4 flex gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 w-6 rounded-full ${i < 5 ? "bg-primary" : "bg-primary/20"}`}
              />
            ))}
          </div>
        </div>

        {/* What's included */}
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary">
            What is included?
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <RiCheckboxCircleLine className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
