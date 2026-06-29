import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export const CancelOrderPage = () => (
  <EmptyState
    illustrationSrc="/illustrations/cancel-order.svg"
    title="Cancel Order Process"
    description={
      <>
        For order cancellations, call{" "}
        <Link href="tel:7142762040" className="text-primary hover:underline">
          (714) 276-2040
        </Link>
        , Mon - Fri - 9 am - 6pm PT
      </>
    }
  />
);
