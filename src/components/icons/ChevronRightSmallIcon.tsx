interface ChevronRightSmallIconProps {
  className?: string;
}

// Small right-pointing chevron (9×9 viewBox, stroke #000) — a drawer list-item
// affordance.
export const ChevronRightSmallIcon = ({ className }: ChevronRightSmallIconProps) => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true" className={className}>
    <path d="M1 1L5 4.5L1 8" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
