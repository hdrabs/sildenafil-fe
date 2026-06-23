interface PillIconProps {
  className?: string;
}

// Capsule / pill glyph (24×24 viewBox). currentColor so the consumer's text
// color controls the fill — used in the medication-info card.
export const PillIcon = ({ className }: PillIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M4.22 11.29l6.07-6.07a5 5 0 017.07 7.07l-6.07 6.07a5 5 0 01-7.07-7.07zm1.41 5.66a3 3 0 004.24 0l2.83-2.83-4.24-4.24-2.83 2.83a3 3 0 000 4.24zm5.66-5.66l2.83-2.83a3 3 0 10-4.24-4.24L7.05 7.05l4.24 4.24z" />
  </svg>
);
