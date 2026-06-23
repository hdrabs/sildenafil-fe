interface CheckIconProps {
  className?: string;
}

// Checkmark tick (16×16 viewBox, stroke-based). currentColor so the consumer's
// text color controls the stroke — used as the tick inside custom checkboxes,
// where visibility is toggled via `peer-checked:block` on the className.
export const CheckIcon = ({ className }: CheckIconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
    className={className}
  >
    <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
