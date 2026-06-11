"use client";

import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

const faqs = [
  {
    q: "What is Sildenafil?",
    a: "Sildenafil is the active ingredient in Viagra®. It is an FDA-approved medication used to treat erectile dysfunction (ED) in men. It works by increasing blood flow to the penis during sexual stimulation.",
  },
  {
    q: "Is Sildenafil safe?",
    a: "Yes, Sildenafil is safe for most men when prescribed by a licensed physician. Our doctors review your health history to ensure it is appropriate for you.",
  },
  {
    q: "How quickly does Sildenafil work?",
    a: "Sildenafil typically starts working within 30–60 minutes of taking it. It can last for 4–6 hours.",
  },
  {
    q: "How is this different from buying Viagra at a pharmacy?",
    a: "Sildenafil is the generic version of Viagra and contains the exact same active ingredient at a fraction of the cost. Our prices start at just $1.33 per tablet.",
  },
  {
    q: "Is my information kept private?",
    a: "Absolutely. We are fully HIPAA-compliant. Your personal and medical information is kept strictly confidential.",
  },
];

export const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="help" className="bg-bg-main py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-text-primary">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 flex flex-col divide-y divide-border-default rounded-xl border border-border-default bg-bg-card">
          {faqs.map(({ q, a }, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-text-primary">
                  {q}
                </span>
                {open === i ? (
                  <RiSubtractLine className="h-5 w-5 shrink-0 text-text-muted" />
                ) : (
                  <RiAddLine className="h-5 w-5 shrink-0 text-text-muted" />
                )}
              </button>
              {open === i && (
                <p className="px-6 pb-4 text-sm text-text-muted">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
