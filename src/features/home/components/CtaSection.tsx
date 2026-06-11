import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import { ROUTES } from "@/constants/routes";

export const CtaSection = () => (
  <section className="bg-bg-announcement py-16 text-white">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 className="text-3xl font-extrabold sm:text-4xl">
        Start earning on your terms today
      </h2>
      <p className="mt-3 text-base text-white/80">
        Join thousands of men who have taken control of their sexual health with
        affordable, doctor-prescribed Sildenafil.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={ROUTES.SIGNUP}
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-bg-announcement hover:opacity-90 transition-opacity"
        >
          Get Started Free
          <RiArrowRightLine className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);
