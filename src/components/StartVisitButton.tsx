import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const StartVisitButton = () => (
  <Link
    href={ROUTES.PRODUCT_DETAIL}
    className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
  >
    Start A New Order
  </Link>
);
