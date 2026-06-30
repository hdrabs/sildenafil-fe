"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useRefills } from "@/api/hooks/useRefillQueries";
import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";
import { Skeleton } from "@/components/Skeleton";
import { RefillCard } from "@/features/refills/components/RefillCard";
import { ROUTES } from "@/constants/routes";

const COUNT_TONE: Record<"active" | "needs_action", string> = {
  active: "bg-[#e6edf7] text-[#6b7a99]",
  needs_action: "bg-[#fdecd8] text-[#cf8a2e]",
};

const Section = ({
  label,
  count,
  tone,
  className,
  children,
}: {
  label: string;
  count: string;
  tone: "active" | "needs_action";
  className?: string;
  children: ReactNode;
}) => (
  <section className={className}>
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${COUNT_TONE[tone]}`}>{count}</span>
    </div>
    <div className="flex flex-col gap-5">{children}</div>
  </section>
);

const ExploreFooter = ({ onClick }: { onClick: () => void }) => (
  <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border-default px-6 py-5">
    <div>
      <p className="font-bold text-text-primary">Explore other treatments</p>
      <p className="text-sm text-text-muted">Start a new consultation today.</p>
    </div>
    <button
      type="button"
      onClick={onClick}
      aria-label="Explore other treatments"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6eefb] text-primary-blue transition-opacity hover:opacity-80"
    >
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 10h11M11 6l4 4-4 4" />
      </svg>
    </button>
  </div>
);

export const RefillPage = () => {
  const { data, isLoading } = useRefills();
  const router = useRouter();

  const active = data?.active ?? [];
  const needsAction = data?.needs_action ?? [];
  const hasItems = active.length + needsAction.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <EmptyState
        illustrationSrc="/illustrations/order-refill.svg"
        title="Order Refill"
        description="Ready to reorder? This section is where you can quickly refill past orders."
        cta={<StartVisitButton />}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-text-primary">Order Refill</h1>

      {active.length > 0 && (
        <Section
          label="Active Rx"
          tone="active"
          count={`${active.length} item${active.length !== 1 ? "s" : ""} active`}
        >
          {active.map((card) => (
            <RefillCard key={`${card.source}-${card.id}`} card={card} accent="active" />
          ))}
        </Section>
      )}

      {needsAction.length > 0 && (
        <Section
          label="Needs Action"
          tone="needs_action"
          count={`${needsAction.length} action required`}
          className={active.length > 0 ? "mt-12" : undefined}
        >
          {needsAction.map((card) => (
            <RefillCard key={`${card.source}-${card.id}`} card={card} accent="needs_action" />
          ))}
        </Section>
      )}

      <ExploreFooter onClick={() => router.push(ROUTES.REFILL_PRODUCT_DETAIL)} />
    </div>
  );
};
