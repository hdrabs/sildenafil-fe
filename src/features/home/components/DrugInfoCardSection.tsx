"use client";

import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { CatalogDrugInfo } from "@/types/catalog";

type DrugInfoTheme = "sildenafil" | "tadalafil";

const TABS: { label: string; field: keyof CatalogDrugInfo }[] = [
  { label: "Overview", field: "overview" },
  { label: "Description", field: "description" },
  { label: "Usage", field: "usage" },
  { label: "Side Effects", field: "side_effects" },
  { label: "Drug Interactions", field: "drug_interactions" },
  { label: "Storage", field: "storage" },
  { label: "Other info", field: "other_info" },
];

const BRAND: Record<DrugInfoTheme, string> = { sildenafil: "Viagra", tadalafil: "Cialis" };

interface DrugInfoCardSectionProps {
  /** Drives the brand subtitle + tab accent. Defaults to sildenafil. */
  theme?: DrugInfoTheme;
  /** Drug info from the resolved catalog variant. Section hides when null. */
  drugInfo: CatalogDrugInfo | null;
  className?: string;
}

export const DrugInfoCardSection = ({ theme = "sildenafil", drugInfo, className }: DrugInfoCardSectionProps) => {
  const [active, setActive] = useState<keyof CatalogDrugInfo>("overview");
  const isTada = theme === "tadalafil";

  if (!drugInfo) return null;

  return (
    <section className={cn("w-full bg-white", className)}>
      <div className="mx-auto max-w-[1320px] pb-8 pt-10 min-[1024px]:pt-[100px]">
        <div className="max-[1024px]:px-6">
          <span className="text-[32px] font-medium capitalize leading-[120%] text-[#0E2836] min-[1025px]:mr-1 min-[1025px]:text-[45px]">
            {theme}
          </span>
          <span className="inline-block text-[32px] font-medium leading-[120%] text-[#0E2836] min-[1025px]:text-[45px]">
            {" "}
            (Generic {BRAND[theme]}
            <span className="align-super text-[0.5em]">®</span>)
          </span>
        </div>

        <div className="my-3 mb-8 flex gap-3 overflow-x-auto max-[600px]:gap-2 max-[600px]:pl-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const isActive = active === tab.field;
            return (
              <button
                key={tab.field}
                type="button"
                onClick={() => setActive(tab.field)}
                className={cn(
                  "cursor-pointer whitespace-nowrap rounded-[200px] border-2 px-5 py-2 text-base font-medium text-[#1a1a1a] transition-colors max-[600px]:px-3 max-[600px]:py-1 max-[600px]:text-[13px]",
                  isActive
                    ? isTada
                      ? "border-[#CD8F24] bg-[#F8E9D6]"
                      : "border-[#204AD7] bg-[#D6E0F8]"
                    : "border-[#C5D4DC] bg-transparent",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-[100px] whitespace-pre-wrap text-[16px] leading-[1.7] tracking-[0.01em] text-[#374151] max-[1024px]:px-6 max-[1024px]:text-[13px]">
          {(drugInfo[active] || "").split("\n").map((line, i) => (
            <Fragment key={i}>
              {line}
              <br />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
