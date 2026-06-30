import Link from "next/link";
import { ROUTES } from "@/constants/routes";

// AUM empty-state CTA (.get-started-btn.btn-account-action, medium): blue pill,
// 187px wide, 12px/700, Title Case (text-capitalize), 36px top margin.
export const StartVisitButton = () => (
  <Link
    href={ROUTES.REFILL_PRODUCT_DETAIL}
    className="mt-9 inline-flex w-[187px] items-center justify-center rounded-full bg-primary py-2.5 text-xs font-bold capitalize text-white transition-colors hover:bg-primary-hover"
  >
    Start a New Order
  </Link>
);
