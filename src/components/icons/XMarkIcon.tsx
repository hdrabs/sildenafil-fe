interface XMarkIconProps {
  className?: string;
}

// X / close glyph (20×20 viewBox). currentColor so the consumer's text color
// controls the fill — used as a dismiss control and as the white badge over the
// medication pill icon (consumer passes `text-white`).
export const XMarkIcon = ({ className }: XMarkIconProps) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);
