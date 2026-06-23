interface CheckSmallIconProps {
  className?: string;
}

// Small checkmark tick (12×12 viewBox, stroke-based). currentColor so the
// consumer's text color controls the stroke — the selected answer-option tick.
export const CheckSmallIcon = ({ className }: CheckSmallIconProps) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
