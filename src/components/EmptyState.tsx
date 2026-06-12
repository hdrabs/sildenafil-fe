import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  illustration?: ReactNode;
  illustrationSrc?: string;
  title: string;
  description: string;
  cta?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

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
      "flex flex-col items-center justify-center py-16 text-center",
      className,
    )}
  >
    <div className="mb-5 flex h-32 w-32 items-center justify-center rounded-full bg-bg-patient-welcome">
      {illustrationSrc ? (
        <Image
          src={illustrationSrc}
          alt={title}
          width={90}
          height={90}
          className="object-contain"
        />
      ) : (
        illustration
      )}
    </div>
    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
    <p className="mt-1.5 max-w-xs text-sm text-text-muted">{description}</p>
    {cta ?? (ctaHref ? (
      <Link
        href={ctaHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
      >
        {ctaLabel}
      </Link>
    ) : ctaLabel ? (
      <button
        onClick={onCtaClick}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
      >
        {ctaLabel}
      </button>
    ) : null)}
  </div>
);
