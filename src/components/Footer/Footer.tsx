import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { MedicationInfoLinks } from "@/components/Footer/MedicationInfoLinks";

type FooterTheme = "sildenafil" | "tadalafil";

interface FooterProps {
  /** Drug drives the dark background colour. Defaults to sildenafil. */
  theme?: FooterTheme;
  /** Overrides the background colour (e.g. best-value's brand blue). Also recolours the
   *  hidden legal disclaimer to match, so it stays invisible against the new background. */
  bgColor?: string;
  className?: string;
}

const SUPPORT_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Member Login", href: ROUTES.LOGIN },
  { label: "Contact Us", href: "/contact_us" },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "HIPAA", href: "/hipaa" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Return & Refund Policy", href: "/return_and_refund_policy" },
  { label: "Shipping Policy", href: "/shipping_policy" },
];

export const Footer = ({ theme = "sildenafil", className, bgColor }: FooterProps) => {
  // Background + the hidden legal disclaimer share one colour so the disclaimer stays invisible.
  const bg = bgColor ?? (theme === "tadalafil" ? "#2C2115" : "#0E2836");
  return (
    <footer className={cn("text-[14px] text-white", className)} style={{ backgroundColor: bg }}>
    <div className="mx-auto max-w-[1320px] px-6 py-[75px] md:py-[100px]">
      {/* Columns */}
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        {/* Contact */}
        <div className="flex flex-col lg:max-w-[280px]">
          <Image
            src="/icons/logo.svg"
            alt="Sildenafil.com"
            width={153}
            height={30}
            className="h-[18px] w-auto self-start [filter:brightness(0)_invert(1)]"
          />
          <a href="tel:(844) 745-3362" className="mt-7 text-[18px] font-semibold hover:underline">
            Contact Us (844) 745-3362
          </a>
          <p className="mt-5 font-semibold leading-6">Mon-Fri 9am-6pm PT</p>
          <p className="mt-1 leading-6 text-white/80">
            Our patient support team &amp; pharmacists are happy to assist you.
          </p>
        </div>

        {/* Support */}
        <div className="flex flex-col">
          <h3 className="mb-2.5 text-[16px] font-semibold">Support</h3>
          {SUPPORT_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="mb-1.5 leading-6 hover:underline">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Medication Info */}
        <div className="flex flex-col">
          <h3 className="mb-2.5 text-[16px] font-semibold">Medication Info</h3>
          <MedicationInfoLinks />
        </div>

        {/* For Doctors */}
        <div className="flex flex-col">
          <h3 className="mb-2.5 text-[16px] font-semibold">For Doctors</h3>
          <p className="leading-6 text-white/80">
            AUM Pharmacy
            <br />
            710 N Euclid Street,
            <br />
            Ste 103
            <br />
            Anaheim, CA 92801
            <br />
            E-Scribe: NCPDP 5639351
          </p>
        </div>
      </div>

      {/* Seal + legal links */}
      <div className="mt-12 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row-reverse md:items-end md:justify-between">
        <Image
          src="https://static.legitscript.com/seals/731797.png"
          alt="LegitScript verified"
          width={100}
          height={100}
          className="h-[100px] w-[100px]"
          unoptimized
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {LEGAL_LINKS.map((l, i) => (
            <span key={l.label} className="flex items-center gap-x-3">
              <Link href={l.href} className="hover:underline">
                {l.label}
              </Link>
              {i < LEGAL_LINKS.length - 1 && <span className="text-white/40">•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Copyright + disclaimer */}
      <div className="mt-8 text-white/60">
        <p className="leading-6">
          All information provided herein is for informational purposes only and is not meant to be a
          substitute for professional medical advice, diagnosis or treatment, nor is it intended to be
          relied upon as making any representations as to the efficacy or safety of any specific drug.
          Please seek medical advice before starting, changing or terminating any medical treatment.
          Sildenafil.com provides no warranty for any of the pricing data or other information. All
          trademarks, brands, logos and copyright images are property of their respective owners and
          rights holders and are used solely to represent the products of these rights holders.
        </p>
        <p className="mt-2">© Sildenafil.com LLC</p>
        {/* Present for legal/SEO but visually hidden — coloured to match the footer bg. */}
        <p className="mt-2" style={{ color: bg }}>
          Medication provided only if a prescription is deemed appropriate after an online consultation
          with a licensed provider. Results may vary. See website for full details and important safety
          information.
        </p>
      </div>
    </div>
  </footer>
  );
};
