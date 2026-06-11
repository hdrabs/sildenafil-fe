"use client";

import Link from "next/link";
import { RiMedicineBottleLine, RiShoppingBagLine, RiStethoscopeLine } from "react-icons/ri";
import { useUser } from "@/store";
import { ROUTES } from "@/constants/routes";

const dashboardCards = [
  {
    label: "Order Refill",
    subtitle: "Order meds and refills",
    icon: RiMedicineBottleLine,
    href: ROUTES.PRODUCTS,
  },
  {
    label: "Order History",
    subtitle: "View order status and past orders",
    icon: RiShoppingBagLine,
    href: ROUTES.ORDERS,
  },
  {
    label: "Medical Visits",
    subtitle: "View existing or past doctor visits",
    icon: RiStethoscopeLine,
    href: ROUTES.PRESCRIPTIONS,
  },
];

export const DashboardPage = () => {
  const user = useUser();

  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-6">
      <h1 className="text-xl font-bold text-text-primary">
        Welcome back, {user?.firstName}!
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Here&apos;s an overview of your health portal.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map(({ label, subtitle, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-start gap-4 rounded-xl border border-border-default bg-bg-main p-5 hover:border-primary transition-colors"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-patient-welcome">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">{label}</p>
              <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
