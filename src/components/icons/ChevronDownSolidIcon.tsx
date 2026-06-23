interface ChevronDownSolidIconProps {
  className?: string;
}

// Downward chevron, filled variant (20×20 viewBox). currentColor so the
// consumer's text color controls the fill — used as a custom select caret.
export const ChevronDownSolidIcon = ({ className }: ChevronDownSolidIconProps) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
