interface ChevronRightThinIconProps {
  className?: string;
}

// Thin right-pointing chevron (16×16 viewBox, stroke #6d757f) — a sidebar
// nav-item affordance.
export const ChevronRightThinIcon = ({ className }: ChevronRightThinIconProps) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
    <path d="M6 12L10 8L6 4" stroke="#6d757f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
