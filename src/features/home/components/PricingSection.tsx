"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

const pricingData = {
  viagra: [
    { company: "VIAGRA®", type: "branded", p25: "$80.00", p50: "$80.00", p100: "$80.00", highlight: false },
    { company: "Sildenafil", type: "generic", p25: "$1.12", p50: "$2.02", p100: "$2.47", highlight: true },
    { company: "Walmart", type: "generic", p25: "$29.53", p50: "$30.50", p100: "$28.88", highlight: false },
    { company: "CVS", type: "generic", p25: "$30.39", p50: "$35.00", p100: "$47.39", highlight: false },
    { company: "Roman", type: "generic", p25: "$6.00", p50: "$6.00", p100: "$10.00", highlight: false },
  ],
  cialis: [
    { company: "CIALIS®", type: "branded", p25: "$80.00", p50: "$80.00", p100: "$80.00", highlight: false },
    { company: "Tadalafil", type: "generic", p25: "$2.48", p50: "$3.50", p100: "$4.20", highlight: true },
  ],
};

export const PricingSection = () => {
  const [tab, setTab] = useState<"viagra" | "cialis">("viagra");
  const rows = pricingData[tab];

  return (
    <section id="labtested" className="bg-bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-text-primary sm:text-4xl">
            Lab Tested. Doctor Approved.
          </h2>
          <p className="mt-2 text-lg font-semibold text-primary">
            Guaranteed Lowest Price!
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Left description */}
          <div className="max-w-sm">
            <p className="text-sm text-text-muted">
              We test our pills to make sure you know exactly what you&apos;re
              getting. Viagra is the #1 counterfeited medication in the world,
              our low price and quality guarantee means you never have to worry.
            </p>
            <p className="mt-4 text-sm">
              <span className="font-semibold text-primary">
                We guarantee a pharmaceutically safe and potent drug at the
                lowest price.
              </span>{" "}
              Save up to 85% on generic ED medications compared to any telehealth
              provider — if you find a lower price we will beat it, guaranteed.
            </p>
          </div>

          {/* Right table */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex rounded-lg border border-border-default overflow-hidden">
                <button
                  onClick={() => setTab("viagra")}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${
                    tab === "viagra"
                      ? "bg-bg-sidebar-dark text-white"
                      : "bg-bg-card text-text-primary hover:bg-bg-input"
                  }`}
                >
                  Viagra ®
                </button>
                <button
                  onClick={() => setTab("cialis")}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${
                    tab === "cialis"
                      ? "bg-bg-sidebar-dark text-white"
                      : "bg-bg-card text-text-primary hover:bg-bg-input"
                  }`}
                >
                  Cialis ®
                </button>
              </div>
              <Link
                href="#"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Important Drug Safety Information
                <RiArrowRightLine className="h-3.5 w-3.5" />
              </Link>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default text-xs font-semibold uppercase text-text-muted">
                  <th className="py-2 text-left">Company</th>
                  <th className="py-2 text-right">25mg</th>
                  <th className="py-2 text-right">50mg</th>
                  <th className="py-2 text-right">100mg</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.company}
                    className={`border-b border-border-default ${
                      row.highlight ? "bg-bg-patient-welcome font-bold text-primary" : ""
                    }`}
                  >
                    <td className="py-3">
                      {row.type === "branded" && (
                        <p className="mb-1 text-xs font-semibold uppercase text-text-muted">
                          Branded Drug
                        </p>
                      )}
                      {row.type === "generic" && row.company !== "Sildenafil" && (
                        <p className="mb-1 text-xs font-semibold uppercase text-text-muted">
                          Generic Drug
                        </p>
                      )}
                      <span className={row.highlight ? "text-primary" : "text-text-primary"}>
                        {row.company}
                      </span>
                    </td>
                    <td className="py-3 text-right">{row.p25}</td>
                    <td className="py-3 text-right">{row.p50}</td>
                    <td className="py-3 text-right">{row.p100}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
