"use client";

import { useState, useEffect } from "react";
import { CatalogDrugInfo } from "@/types/catalog";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface DrugInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugInfo: CatalogDrugInfo | null;
  drugDisplayName?: string;
  activeDrug?: string | null;
}

const TABS: { key: keyof CatalogDrugInfo; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "description", label: "Description" },
  { key: "usage", label: "Usage" },
  { key: "side_effects", label: "Side Effects" },
  { key: "drug_interactions", label: "Drug Interactions" },
  { key: "storage", label: "Storage" },
  { key: "other_info", label: "Other info" },
];

export const DrugInfoModal = ({
  isOpen,
  onClose,
  drugInfo,
  drugDisplayName,
  activeDrug,
}: DrugInfoModalProps) => {
  const themeColor = activeDrug === "tadalafil" ? "#cd8f24" : "#204ad7";
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isOpen) setActiveTab(0);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !drugInfo) return null;

  const visibleTabs = TABS.filter(({ key }) => {
    const val = drugInfo[key];
    return val && String(val).trim().length > 0;
  });

  const activeContent = drugInfo[visibleTabs[activeTab]?.key] as string | null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drug-info-modal-title"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 flex h-[60vh] w-full flex-col bg-white pb-5 sm:max-w-2xl" style={{ borderRadius: "4.8px" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2
            id="drug-info-modal-title"
            className="text-2xl font-bold text-text-primary"
          >
            {drugDisplayName ?? drugInfo.name}
          </h2>
          <button
            onClick={onClose}
            className="ml-4 flex shrink-0 cursor-pointer items-center justify-center rounded-full p-1.5 text-text-muted hover:bg-bg-card"
            aria-label="Close"
          >
            <CloseIcon className="h-7 w-7 shrink-0" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="border-b border-border-default">
          <div className="flex overflow-x-auto px-6">
            {visibleTabs.map(({ label }, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  style={isActive ? { borderColor: themeColor, color: themeColor } : undefined}
                  className={`-mb-px mr-6 shrink-0 cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors last:mr-0 ${
                    isActive
                      ? ""
                      : "border-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="overflow-y-auto px-6 py-5">
          {activeContent ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
              {activeContent}
            </p>
          ) : (
            <p className="text-sm text-text-muted">No information available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
