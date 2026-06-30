"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { useCatalog } from "@/api/hooks/useCatalogQueries";
import { DrugInfoModal } from "@/features/landing/components/DrugInfoModal";
import { MedicalVisit, VisitAction, VisitPharmacy } from "@/types/medicalVisit";

const bottleSrc = (drug: string): string =>
  drug === "tadalafil"
    ? "/images/products/tadalafil-bottle.png"
    : "/images/products/sildenafil-bottle.png";

const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(-2)}`;
};

const ToneIcon = ({ tone }: { tone: string }) => {
  const map: Record<string, { ring: string; color: string; path: string }> = {
    success: { ring: "border-[#cfe8d4]", color: "text-[#1D9629]", path: "M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 011.4-1.4l2.8 2.79 6.8-6.79a1 1 0 011.4 0z" },
    error: { ring: "border-[#f3d4d0]", color: "text-[#e0584b]", path: "M6 6l8 8M14 6l-8 8" },
    warning: { ring: "border-[#f3e4cf]", color: "text-[#cd8f24]", path: "M10 5v6M10 14v.5" },
    pending: { ring: "border-border-default", color: "text-primary-blue", path: "M10 5v5l3 2" },
    info: { ring: "border-border-default", color: "text-primary-blue", path: "M10 9v5M10 6v.5" },
  };
  const t = map[tone] ?? map.info;
  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.ring}`}>
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={`h-6 w-6 ${t.color}`}>
        <path d={t.path} />
      </svg>
    </span>
  );
};

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-bold text-text-primary">{label}</p>
    <p className="text-sm text-text-primary">{value}</p>
  </div>
);

// AUM .image-box: 150×150, 5px radius; skipped state = #d9ebf3 with #6b8bbf text.
const PhotoBox = ({ url, skippedLabel }: { url: string | null; skippedLabel: string }) =>
  url ? (
    <div className="h-[150px] w-[150px] overflow-hidden rounded-[5px]">
      <Image src={url} alt="" width={150} height={150} unoptimized className="h-full w-full object-cover" />
    </div>
  ) : (
    <div className="flex h-[150px] w-[150px] items-center justify-center rounded-[5px] bg-[#d9ebf3] text-sm font-medium text-[#6b8bbf]">
      {skippedLabel}
    </div>
  );

const PharmacyInfoModal = ({
  open,
  onClose,
  pharmacy,
}: {
  open: boolean;
  onClose: () => void;
  pharmacy: VisitPharmacy;
}) => (
  <Modal isOpen={open} onClose={onClose} size="sm">
    <p className="text-text-primary">
      Your order is being fulfilled by <strong>{pharmacy.name}</strong> and will be delivered to your
      home address.
    </p>
    <p className="mt-3 text-text-primary">
      Pharmacy Phone Number: <strong>{pharmacy.phone}</strong>
    </p>
  </Modal>
);

const BackArrow = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary-blue">
    <path d="M12 16l-6-6 6-6" />
  </svg>
);

export const VisitDetail = ({ visit, onBack }: { visit: MedicalVisit; onBack: () => void }) => {
  const router = useRouter();
  const [showPharmacy, setShowPharmacy] = useState(false);
  const [showMedication, setShowMedication] = useState(false);
  const detail = visit.presentation.detail;

  // Full drug info for the "Medication Info" modal — same catalog source the
  // product pages use (AUM's MedicationDetailsModal shows the same sections).
  const { data: catalog } = useCatalog();
  const drugInfo = catalog?.find((v) => v.product.drug === visit.drug)?.drug_info ?? null;

  const runAction = (action: VisitAction) => () => {
    if (!action.href) return;
    if (action.external) window.open(action.href, "_blank", "noopener,noreferrer");
    else router.push(action.href);
  };

  return (
    <div>
      {/* AUM .active-visit-heading: 40px bordered back button + 20px/600 title. */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#deeef5] bg-white transition-colors hover:bg-bg-input"
        >
          <BackArrow />
        </button>
        <h1 className="text-xl font-semibold leading-[33px] text-text-primary">{detail?.heading ?? "Visit Details"}</h1>
      </div>

      {detail && (
        <div className="mt-6 rounded-xl bg-bg-card p-6 shadow-[0px_0px_20px_rgba(128,148,178,0.2)]">
          <div className="flex items-start gap-4">
            <ToneIcon tone={detail.tone} />
            <p className="pt-1 text-sm text-text-primary">{detail.message}</p>
          </div>
          {detail.actions.length > 0 && (
            // AUM .bg-light-blue action box (#f1f8fb) with outline-white buttons.
            <div className="mt-4 flex flex-wrap gap-3 rounded-[5px] bg-bg-main p-3">
              {detail.actions.map((action) => (
                <button
                  key={action.type}
                  type="button"
                  onClick={runAction(action)}
                  className="rounded-full border border-[#d1d1d1] bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e7f3f8]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 rounded-xl bg-bg-card p-6 shadow-[0px_0px_20px_rgba(128,148,178,0.2)]">
        <div className="grid grid-cols-2 gap-4 rounded-[5px] bg-bg-main p-5 sm:grid-cols-4">
          <Meta label="Visit Date" value={formatDate(visit.created_at)} />
          <Meta label="Visit Type" value={visit.visit_type_label} />
          <Meta label="Cost" value={visit.cost} />
          <Meta label="Visit #" value={visit.visit_number} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* AUM .img-wrapper: 80×80 circle, #f1f8fb bg. */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-bg-main p-2">
              <Image src={bottleSrc(visit.drug)} alt="" width={44} height={44} unoptimized className="h-full w-full object-contain" />
            </div>
            <div className="text-text-primary [&>p]:text-sm">
              <p className="text-sm font-semibold">Medication Preference</p>
              <p>{visit.medication_name}</p>
              {visit.medication_quantity && <p>{visit.medication_quantity}</p>}
            </div>
          </div>
          {/* AUM shows both info buttons together, only for a completed visit with a pharmacy. */}
          {visit.pharmacy && visit.presentation.badge_tone === "completed" && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowPharmacy(true)}
                className="rounded-full border border-[#d1d1d1] bg-white px-[30px] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e7f3f8]"
              >
                Pharmacy Info
              </button>
              <button
                type="button"
                onClick={() => setShowMedication(true)}
                className="rounded-full border border-[#d1d1d1] bg-white px-[30px] py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e7f3f8]"
              >
                Medication Info
              </button>
            </div>
          )}
        </div>
      </div>

      {visit.show_photos && (
        <div className="mt-6 flex gap-4">
          <PhotoBox url={visit.id_card_url} skippedLabel="ID Skipped" />
          <PhotoBox url={visit.selfie_url} skippedLabel="Selfie Skipped" />
        </div>
      )}

      {visit.pharmacy && (
        <PharmacyInfoModal open={showPharmacy} onClose={() => setShowPharmacy(false)} pharmacy={visit.pharmacy} />
      )}
      <DrugInfoModal
        isOpen={showMedication}
        onClose={() => setShowMedication(false)}
        drugInfo={drugInfo}
        drugDisplayName={`${visit.medication_name} oral tablet`}
        activeDrug={visit.drug}
      />
    </div>
  );
};
