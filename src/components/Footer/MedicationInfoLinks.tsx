"use client";

import { useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useCatalog } from "@/api/hooks/useCatalogQueries";
import { buildCatalogParams } from "@/features/landing/catalogParams";
import { Modal } from "@/components/ui/Modal";
import { CatalogDrugInfo } from "@/types/catalog";
import { cn } from "@/lib/utils";

type Drug = "sildenafil" | "tadalafil";

// aum DrugInformationModal: the footer "Medication Info" links open a tabbed
// drug-info modal per drug, fed by the catalog variant's drug_info.
const TABS: { label: string; field: keyof CatalogDrugInfo }[] = [
  { label: "Overview", field: "overview" },
  { label: "Description", field: "description" },
  { label: "Usage", field: "usage" },
  { label: "Side Effects", field: "side_effects" },
  { label: "Drug Interactions", field: "drug_interactions" },
  { label: "Storage", field: "storage" },
  { label: "Other info", field: "other_info" },
];

const TITLE: Record<Drug, string> = {
  sildenafil: "Sildenafil (Generic Viagra)",
  tadalafil: "Tadalafil (Generic Cialis)",
};

const normalizeDrug = (drug: string) => (drug === "tadalafi" ? "tadalafil" : drug);

export const MedicationInfoLinks = () => {
  const params = useParams<{ slug?: string | string[] }>();
  const pathname = usePathname();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [active, setActive] = useState<keyof CatalogDrugInfo>("overview");

  // Rebuild the page's catalog context (slug + landing_context) from the URL so the
  // footer shares the page's price tier instead of firing a separate default-tier
  // (v5d) request. drug_info is tier-independent — this only keeps the footer's catalog
  // call on the same tier as the page (e.g. /try/ → v5_free).
  const urlSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const { data: variants } = useCatalog(
    buildCatalogParams({ slug: urlSlug, landingContext: pathname.split("/")[1] }),
  );

  const drugInfo = drug
    ? (variants?.find((v) => normalizeDrug(v.product.drug) === drug)?.drug_info ?? null)
    : null;
  const isTada = drug === "tadalafil";

  const open = (d: Drug) => {
    setActive("overview");
    setDrug(d);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => open("sildenafil")}
        className="mb-2 cursor-pointer whitespace-nowrap text-left leading-6 hover:underline"
      >
        Sildenafil (Viagra / Revatio)
      </button>
      <button
        type="button"
        onClick={() => open("tadalafil")}
        className="cursor-pointer whitespace-nowrap text-left leading-6 hover:underline"
      >
        Tadalafil (Cialis / Adcirca)
      </button>

      <Modal
        isOpen={!!drug}
        onClose={() => setDrug(null)}
        title={drug ? TITLE[drug] : undefined}
        size="xl"
        className="h-[60vh]"
      >
        <div className="flex h-full flex-col">
          <div className="-mx-1 mb-5 flex shrink-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const isActive = active === tab.field;
              return (
                <button
                  key={tab.field}
                  type="button"
                  onClick={() => setActive(tab.field)}
                  className={cn(
                    "cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-1.5 text-[13px] font-medium text-[#1a1a1a] transition-colors",
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

          <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-[15px] leading-[1.7] text-[#374151]">
            {drugInfo?.[active] || "No information available."}
          </div>
        </div>
      </Modal>
    </>
  );
};
