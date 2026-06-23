interface FemaleIconProps {
  className?: string;
}

// Venus / female symbol (24×24 viewBox, stroke-based). currentColor so the
// consumer's text color controls the stroke — the sex-at-birth selector.
export const FemaleIcon = ({ className }: FemaleIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v6M9 17h6" />
  </svg>
);
