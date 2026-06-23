interface ChevronDownIconProps {
  className?: string;
}

// Downward chevron (24×24 viewBox, stroke-based). currentColor so the consumer's
// text color controls the stroke — used as a native-select caret.
export const ChevronDownIcon = ({ className }: ChevronDownIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
