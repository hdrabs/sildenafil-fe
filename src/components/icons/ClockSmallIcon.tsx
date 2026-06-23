interface ClockSmallIconProps {
  className?: string;
}

// Small clock glyph (12×12 viewBox), stroked in #204AD7 — the delivery-ETA badge.
export const ClockSmallIcon = ({ className }: ClockSmallIconProps) => (
  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path d="M6 3V6L8 7M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z" stroke="#204AD7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
