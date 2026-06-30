"use client";

import { useOrdersHistory } from "@/api/hooks/useOrderQueries";
import { OrderHistoryCard } from "@/features/orders/components/OrderHistoryCard";
import { EmptyState } from "@/components/EmptyState";
import { StartVisitButton } from "@/components/StartVisitButton";
import { PageLoader } from "@/components/PageLoader";

export const OrdersPage = () => {
  const { data, isLoading } = useOrdersHistory();

  if (isLoading) return <PageLoader />;

  // Orders + loose in-progress carts, interleaved newest-first (matches legacy).
  const items = [...(data?.orders ?? []), ...(data?.carts ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (items.length === 0) {
    return (
      <EmptyState
        illustrationSrc="/illustrations/order-history.svg"
        title="Order History"
        description="Nothing to see now, but your past orders will be seen here."
        cta={<StartVisitButton />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {items.map((item) => (
        <OrderHistoryCard key={`${item.type}-${item.id}`} card={item} />
      ))}
    </div>
  );
};
