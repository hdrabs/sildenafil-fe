"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

const DESKTOP_BREAKPOINT = 900;

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const redirectIfDesktop = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        router.replace(ROUTES.ORDER_REFILL);
      }
    };

    redirectIfDesktop();

    window.addEventListener("resize", redirectIfDesktop);
    return () => window.removeEventListener("resize", redirectIfDesktop);
  }, [router]);

  // On mobile PatientShell hides this area and shows only the sidebar.
  return null;
};

export default Page;
