"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type CtaTheme = "sildenafil" | "tadalafil";

interface CtaButton {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface CtaSectionProps {
  /** Drug drives the background colour + drug name. Defaults to sildenafil. */
  theme?: CtaTheme;
  /** Primary "Learn More" button. Omit to hide it. */
  cta?: CtaButton;
  className?: string;
}

const Caret = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M5.5 3L10 8L5.5 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CtaSection = ({ theme = "sildenafil", cta, className }: CtaSectionProps) => {
  const isTada = theme === "tadalafil";
  const drugName = isTada ? "Tadalafil" : "Sildenafil";
  const accent = isTada ? "#CD8F24" : "#204AD7";

  const btnClass =
    "mx-auto flex w-full max-w-[340px] items-center justify-center gap-2 rounded-[30px] bg-white px-6 py-3 text-[16px] font-semibold transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]";
  const btnInner = (
    <>
      <span>{cta?.label}</span>
      <Caret color={accent} />
    </>
  );

  return (
    <section
      className={cn(isTada ? "bg-[#CD8F24]" : "bg-[#204AD7]", "text-white", className)}
    >
      <div className="mx-auto max-w-3xl px-6 py-[75px] text-center md:py-[100px]">
        <h2 className="text-[28px] font-normal leading-[1.3] md:text-[36px]">
          Start saving on your{" "}
          <span className="font-semibold underline">{drugName}</span> today
        </h2>

        {cta &&
          (cta.href ? (
            <Link href={cta.href} onClick={cta.onClick} className={cn("mt-8", btnClass)} style={{ color: accent }}>
              {btnInner}
            </Link>
          ) : (
            <button type="button" onClick={cta.onClick} className={cn("mt-8 cursor-pointer", btnClass)} style={{ color: accent }}>
              {btnInner}
            </button>
          ))}

        <p className="my-10 text-[16px]">
          <strong className="block">Have any questions or prefer to sign up over the phone?</strong>
          Speak to a Patient Care Representative today!
        </p>

        <a
          href="tel:(844) 745-3362"
          className="mx-auto flex w-full max-w-[340px] items-center justify-center rounded-[30px] border border-white py-3 text-[16px] font-semibold transition-colors hover:bg-white/10"
        >
          (844) 745-3362
        </a>
      </div>
    </section>
  );
};
