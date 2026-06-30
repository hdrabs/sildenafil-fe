"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
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

// AUM `.badge` colors, mapped from the backend's 4 tones (draft→grey,
// submitted→green, completed→blue, cancelled/rejected→red).
const BADGE_TONE: Record<VisitPresentation["badge_tone"], string> = {
  neutral: "bg-[#efefef] text-[#6d757f]",
  info: "bg-[#eef7f1] text-[#52b76e]",
  completed: "bg-[#e2f0f6] text-[#65a2bc]",
  ended: "bg-[#ffeeef] text-[#e1787c]",
};

const VisitListCard = ({ visit, onView }: { visit: MedicalVisit; onView: () => void }) => {
  const router = useRouter();
  const { presentation: p } = visit;

  const onClick = () => (p.resume_href ? router.push(p.resume_href) : onView());

  return (
    <div className="rounded-xl bg-bg-card p-5 shadow-[0px_0px_20px_rgba(128,148,178,0.2)]">
      <div className="flex items-center justify-between gap-4 max-[649px]:flex-col max-[649px]:items-stretch">
        <div className="min-w-0">
          {/* AUM .visit-status: 14px/600 */}
          <p className="text-sm font-semibold text-text-primary">{visit.visit_type_title}</p>
          <div className="mt-2 flex items-center gap-3">
            {/* AUM .badge: pill, 8px/12px pad, weight 400 */}
            <span className={cn("rounded-full px-3 py-2 text-xs font-normal", BADGE_TONE[p.badge_tone])}>
              {p.badge}
            </span>
            <span className="text-xs text-text-primary">{formatDate(visit.created_at)}</span>
          </div>
        </div>
        {/* AUM secondary button: coral, 12px/600, not uppercase */}
        <button
          type="button"
          onClick={onClick}
          className="shrink-0 cursor-pointer rounded-full bg-coral px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-coral-hover max-[649px]:w-full"
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
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
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
      {/* AUM .main-heading h3: 18px/600 */}
      <h1 className="mb-4 text-lg font-semibold text-text-primary">Medical Visits</h1>
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
