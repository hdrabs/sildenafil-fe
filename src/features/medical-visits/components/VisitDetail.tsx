"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
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
    <p className="text-text-primary">{value}</p>
  </div>
);

const PhotoBox = ({ url, skippedLabel }: { url: string | null; skippedLabel: string }) =>
  url ? (
    <div className="h-44 w-32 overflow-hidden rounded-xl border border-border-default">
      <Image src={url} alt="" width={128} height={176} unoptimized className="h-full w-full object-cover" />
    </div>
  ) : (
    <div className="flex h-44 w-32 items-center justify-center rounded-xl bg-[#d9ebf7] text-sm font-medium text-[#5b9bc9]">
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

const MedicationInfoModal = ({
  open,
  onClose,
  visit,
}: {
  open: boolean;
  onClose: () => void;
  visit: MedicalVisit;
}) => (
  <Modal isOpen={open} onClose={onClose} title="Medication Info" size="md">
    <p className="font-semibold text-text-primary">{visit.medication_name}</p>
    {visit.medication_quantity && <p className="mt-1 text-text-muted">{visit.medication_quantity}</p>}
    <p className="mt-4 text-sm text-text-muted">
      For full medication information, please refer to the product page or contact our support team.
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

  const runAction = (action: VisitAction) => () => {
    if (!action.href) return;
    if (action.external) window.open(action.href, "_blank", "noopener,noreferrer");
    else router.push(action.href);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-bg-card transition-colors hover:bg-bg-input"
        >
          <BackArrow />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">{detail?.heading ?? "Visit Details"}</h1>
      </div>

      {detail && (
        <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <ToneIcon tone={detail.tone} />
            <p className="pt-1 text-text-primary">{detail.message}</p>
          </div>
          {detail.actions.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3 rounded-xl bg-[#eef5fb] p-4">
              {detail.actions.map((action) => (
                <button
                  key={action.type}
                  type="button"
                  onClick={runAction(action)}
                  className="rounded-full border border-border-default bg-white px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-input"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-bg-card p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#eef5fb] p-5 sm:grid-cols-4">
          <Meta label="Visit Date" value={formatDate(visit.created_at)} />
          <Meta label="Visit Type" value={visit.visit_type_label} />
          <Meta label="Cost" value={visit.cost} />
          <Meta label="Visit #" value={visit.visit_number} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eef5fb] p-2">
              <Image src={bottleSrc(visit.drug)} alt="" width={44} height={44} unoptimized className="h-full w-full object-contain" />
            </div>
            <div className="text-text-primary">
              <p className="font-bold">Medication Preference</p>
              <p>{visit.medication_name}</p>
              {visit.medication_quantity && <p>{visit.medication_quantity}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {visit.pharmacy && (
              <button
                type="button"
                onClick={() => setShowPharmacy(true)}
                className="rounded-full border border-border-default px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-text-primary transition-colors hover:bg-bg-input"
              >
                Pharmacy Info
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowMedication(true)}
              className="rounded-full border border-border-default px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-text-primary transition-colors hover:bg-bg-input"
            >
              Medication Info
            </button>
          </div>
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
      <MedicationInfoModal open={showMedication} onClose={() => setShowMedication(false)} visit={visit} />
    </div>
  );
};
