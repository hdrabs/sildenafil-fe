"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMedicalVisits } from "@/api/hooks/useMedicalVisitQueries";
import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";
import { Skeleton } from "@/components/Skeleton";
import { VisitDetail } from "@/features/medical-visits/components/VisitDetail";
import { MedicalVisit, VisitPresentation } from "@/types/medicalVisit";
import { ROUTES } from "@/constants/routes";

const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(-2)}`;
};

const BADGE_TONE: Record<VisitPresentation["badge_tone"], string> = {
  neutral: "bg-bg-input text-text-muted",
  info: "bg-[#d9ebf7] text-[#3b7bb0]",
  completed: "bg-[#d9ebf7] text-[#3b7bb0]",
  ended: "bg-bg-input text-text-muted",
};

const VisitListCard = ({ visit, onView }: { visit: MedicalVisit; onView: () => void }) => {
  const router = useRouter();
  const { presentation: p } = visit;

  const onClick = () => (p.resume_href ? router.push(p.resume_href) : onView());

  return (
    <div className="rounded-2xl bg-bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-text-primary">{visit.visit_type_title}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${BADGE_TONE[p.badge_tone]}`}>
              {p.badge}
            </span>
            <span className="text-sm text-text-primary">{formatDate(visit.created_at)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="rounded-full bg-[#e0584b] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
        >
          {p.resume_href ? "Resume visit" : "View details"}
        </button>
      </div>
    </div>
  );
};

export const MedicalVisitsPage = () => {
  const { data, isLoading } = useMedicalVisits();
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitUuid = searchParams.get("visit");

  const visits = data?.visits ?? [];
  // The open visit is derived from the URL (?visit=<uuid>) so the Order History
  // deep-link, card clicks, and the back button all flow through one source.
  const selected = visitUuid ? visits.find((visit) => visit.uuid === visitUuid) ?? null : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  if (selected) {
    return <VisitDetail visit={selected} onBack={() => router.push(ROUTES.PRESCRIPTIONS)} />;
  }

  if (visits.length === 0) {
    return (
      <EmptyState
        illustrationSrc="/illustrations/medical-visits.svg"
        title="Medical Visits"
        description="Access your current and past ED medical visits details right here. Click 'Get Started' to initiate an online ED visit."
        cta={<StartVisitButton />}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Medical Visits</h1>
      <div className="flex flex-col gap-5">
        {visits.map((visit) => (
          <VisitListCard
            key={visit.uuid}
            visit={visit}
            onView={() => router.push(`${ROUTES.PRESCRIPTIONS}?visit=${visit.uuid}`)}
          />
        ))}
      </div>
    </div>
  );
};
