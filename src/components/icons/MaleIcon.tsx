interface MaleIconProps {
  className?: string;
}

// Mars / male symbol (24×24 viewBox, stroke-based). currentColor so the
// consumer's text color controls the stroke — the sex-at-birth selector.
export const MaleIcon = ({ className }: MaleIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" className={className}>
    <circle cx="10" cy="14" r="5" />
    <path d="M19 5l-5.5 5.5M19 5h-5M19 5v5" />
  </svg>
);
