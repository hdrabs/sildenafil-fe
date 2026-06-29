"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useUser } from "@/store";

const SidebarIcon = ({ src }: { src: string }) => (
  <span
    aria-hidden
    style={{
      display: "inline-block",
      width: 20,
      height: 20,
      // Mask + currentColor lets the parent recolor the icon via text-color
      // utilities, so the active tint can stay desktop-only (matches AUM).
      backgroundColor: "currentColor",
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      flexShrink: 0,
    }}
  />
);

const navItems = [
  { label: "Order Refill",         subtitle: "Order meds and refills",             href: ROUTES.PRODUCTS,      icon: "/icons/sidebar/sidebar-pill.svg" },
  { label: "Order History",        subtitle: "View order status and past orders",   href: ROUTES.ORDERS,        icon: "/icons/sidebar/sidebar-file-clock.svg" },
  { label: "Medical Visits",       subtitle: "View existing or past doctor visits", href: ROUTES.PRESCRIPTIONS, icon: "/icons/sidebar/sidebar-first-aid.svg" },
  { label: "Payment Options",      subtitle: "View and edit your payment options",  href: ROUTES.PAYMENTS,      icon: "/icons/sidebar/sidebar-cc.svg" },
  { label: "Shipping Address",     subtitle: "View and edit your address",          href: ROUTES.SETTINGS,      icon: "/icons/sidebar/sidebar-dropup.svg" },
  { label: "Profile",              subtitle: "View and edit your info",             href: ROUTES.PROFILE,       icon: "/icons/sidebar/sidebar-profile.svg" },
  { label: "Notifications",        subtitle: "View and edit your notifications",    href: ROUTES.NOTIFICATIONS, icon: "/icons/sidebar/sidebar-bell.svg" },
  { label: "Cancel Order Process", subtitle: "View the cancellation method",        href: ROUTES.CANCEL_ORDER,  icon: "/icons/sidebar/sidebar-close.svg" },
];

export const PatientSidebar = () => {
  const pathname = usePathname();
  const user = useUser();

  return (
    <aside
      className={cn(
        // Mobile: full width, transparent, no shadow, padding-bottom
        "w-full bg-transparent pb-10",
        // Desktop: fixed 310px, white, 5px radius, soft shadow, 60px right margin (wider gap to content)
        "min-[900px]:w-[310px] min-[900px]:min-w-[310px] min-[900px]:max-w-[310px] min-[900px]:mr-[60px] min-[900px]:rounded-[5px] min-[900px]:bg-white min-[900px]:pb-0",
        "min-[900px]:shadow-[0px_0px_10px_rgba(128,148,178,0.42)] min-[900px]:overflow-auto",
      )}
    >
      {/* Welcome header */}
      <div
        className={cn(
          "font-semibold",
          // Mobile: transparent, no margin, bottom padding only
          "mb-2 px-0 py-3.5 bg-transparent",
          // Desktop: inner card with margin and blue bg
          "min-[900px]:mx-3 min-[900px]:mt-3 min-[900px]:mb-0 min-[900px]:rounded-lg min-[900px]:px-5 min-[900px]:py-3 min-[900px]:bg-[#edf1f9]",
        )}
        style={{ fontSize: 16, color: "#1B53AF" }}
      >
        Welcome {user?.firstName}!
      </div>

      {/* Nav items */}
      <nav
        className={cn(
          "flex flex-col",
          // Mobile: 16px vertical gap between card-style items (AUM .account-nav__items).
          // Margin-based (space-y) rather than flex `gap` so it renders even where
          // flex-gap isn't supported (older mobile Safari).
          "space-y-4",
          // Desktop: items touch so the bottom-border dividers read as one list.
          "min-[900px]:mt-3 min-[900px]:space-y-0",
        )}
      >
        {navItems.map(({ label, subtitle, href, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "group flex items-center p-5 bg-white no-underline",
                "transition-[border-color,color] duration-200",

                // Mobile: individual card (border all round, radius, shadow)
                "rounded-lg border border-[#dfe5f2] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)]",

                // Desktop: bottom divider only, no radius, blue left border on active/hover/focus
                "min-[900px]:rounded-none",
                "min-[900px]:border-0 min-[900px]:border-b min-[900px]:border-b-[#d7dce5] min-[900px]:last:border-b-0",
                "min-[900px]:shadow-none min-[900px]:border-l-[3px]",
                isActive
                  ? "min-[900px]:border-l-[#1b53af]"
                  : "min-[900px]:border-l-transparent min-[900px]:hover:border-l-[#1b53af] min-[900px]:focus-visible:border-l-[#1b53af]",
              )}
              style={{ textDecoration: "none" }}
            >
              {/* Active/hover/focus tint is desktop-only; mobile cards stay neutral (AUM). */}
              <span
                className={cn(
                  "mr-4 mt-0.5 shrink-0 text-[#262A32]",
                  isActive
                    ? "min-[900px]:text-[#1b53af]"
                    : "min-[900px]:group-hover:text-[#1b53af] min-[900px]:group-focus-visible:text-[#1b53af]",
                )}
              >
                <SidebarIcon src={icon} />
              </span>

              <span className="flex flex-1 flex-col">
                <span
                  className={cn(
                    "font-medium leading-snug text-black",
                    isActive
                      ? "min-[900px]:text-[#1b53af]"
                      : "min-[900px]:group-hover:text-[#1b53af] min-[900px]:group-focus-visible:text-[#1b53af]",
                  )}
                  style={{ fontSize: 16 }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 12, color: "#6d757f", fontWeight: 400 }}>
                  {subtitle}
                </span>
              </span>

              {/* Chevron — mobile drill-down affordance only; hidden on desktop (AUM) */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-[900px]:hidden" style={{ flexShrink: 0 }}>
                <path d="M6 12L10 8L6 4" stroke="#6d757f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
