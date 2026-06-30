"use client";

import { useRouter } from "next/navigation";
import { useRefills } from "@/api/hooks/useRefillQueries";
import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";
import { PageLoader } from "@/components/PageLoader";
import { RefillCard } from "@/features/refills/components/RefillCard";
import { ROUTES } from "@/constants/routes";

// AUM .rx-section-header / .needs-action-section__header: 12px/700 uppercase label + pill count.
const SectionHeader = ({ label, count, pill }: { label: string; count: string; pill: string }) => (
  <div className="flex items-center gap-5 max-[649px]:gap-3">
    <span className="flex-1 text-xs font-bold uppercase tracking-[0.08em] text-text-section-label">
      {label}
    </span>
    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-medium ${pill}`}>
      {count}
    </span>
  </div>
);

const ExploreFooter = ({ onClick }: { onClick: () => void }) => (
  // AUM .explore-treatments-cta: dashed card, round arrow button (40×40 on mobile).
  <div
    onClick={onClick}
    className="mt-auto flex cursor-pointer items-center justify-between rounded-xl border-[1.8px] border-dashed border-border-soft p-5 transition-colors hover:border-ghost-dark max-[649px]:p-4"
  >
    <div className="flex flex-1 flex-col gap-1 pr-4">
      <p className="m-0 text-sm font-bold text-text-card-strong">Explore other treatments</p>
      <p className="m-0 text-xs font-medium leading-5 text-text-card-subtle">
        Start a new consultation today.
      </p>
    </div>
    <button
      type="button"
      aria-label="Explore other treatments"
      className="flex shrink-0 items-center justify-center rounded-full bg-bg-explore-arrow px-4 py-[18px] text-primary transition-opacity hover:opacity-90 max-[649px]:h-10 max-[649px]:w-10 max-[649px]:p-0"
    >
      <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.75 0.75L10.75 2.75M10.75 2.75L8.75 4.75M10.75 2.75H0.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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

  if (isLoading) return <PageLoader />;

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
    <div className="flex min-h-full flex-col gap-10 max-[649px]:gap-8">
      <h1 className="m-0 text-2xl font-semibold leading-[1.1] text-text-primary max-[649px]:text-lg">
        Order Refill
      </h1>

      <div className="flex flex-col gap-8">
        {active.length > 0 && (
          <section className="flex flex-col gap-5 max-[649px]:gap-3">
            <SectionHeader
              label="Active Rx"
              count={`${active.length} item${active.length !== 1 ? "s" : ""} active`}
              pill="bg-bg-pill-active text-text-pill-active"
            />
            <div className="flex flex-col gap-5 max-[649px]:gap-3">
              {active.map((card) => (
                <RefillCard key={`${card.source}-${card.id}`} card={card} accent="active" />
              ))}
            </div>
          </section>
        )}

        {needsAction.length > 0 && (
          <section className="flex flex-col gap-5 max-[649px]:gap-3">
            <SectionHeader
              label="Needs Action"
              count={`${needsAction.length} action required`}
              pill="bg-bg-tag-yellow text-text-tag-yellow"
            />
            <div className="flex flex-col gap-5 max-[649px]:gap-3">
              {needsAction.map((card) => (
                <RefillCard key={`${card.source}-${card.id}`} card={card} accent="needs_action" />
              ))}
            </div>
          </section>
        )}
      </div>

      <ExploreFooter onClick={() => router.push(ROUTES.REFILL_PRODUCT_DETAIL)} />
    </div>
  );
};
