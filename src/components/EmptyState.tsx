import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  illustration?: ReactNode;
  illustrationSrc?: string;
  title: string;
  description: ReactNode;
  cta?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

// Ports AUM's `.empty-screen` pattern: 145px pale-blue ellipse, 16px/600 title,
// 14px black body (343px wide, 172.5% line-height), and a blue capitalized pill CTA.
const ctaClass =
  "mt-9 inline-flex h-11 min-w-[187px] items-center justify-center rounded-full bg-primary px-8 text-xs font-bold text-white hover:opacity-90 transition-opacity";

export const EmptyState = ({
  illustration,
  illustrationSrc,
  title,
  description,
  cta,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex min-h-[420px] flex-col items-center justify-center py-10 text-center",
      className,
    )}
  >
    <div className="flex h-[145px] w-[145px] items-center justify-center rounded-full bg-bg-empty-ellipse">
      {illustrationSrc ? (
        <Image
          src={illustrationSrc}
          alt={title}
          width={96}
          height={96}
          className="object-contain"
          // Illustrations are non-square; fix width and let height follow the
          // natural ratio (height:auto) so next/image doesn't flag the ratio.
          style={{ width: 96, height: "auto" }}
        />
      ) : (
        illustration
      )}
    </div>
    <h2 className="mt-[22px] text-base font-semibold text-text-primary">{title}</h2>
    <p className="mt-[18px] max-w-[343px] text-sm leading-[1.725] text-text-primary">
      {description}
    </p>
    {cta ?? (ctaHref ? (
      <Link href={ctaHref} className={ctaClass}>
        {ctaLabel}
      </Link>
    ) : ctaLabel ? (
      <button onClick={onCtaClick} className={ctaClass}>
        {ctaLabel}
      </button>
    ) : null)}
  </div>
);
