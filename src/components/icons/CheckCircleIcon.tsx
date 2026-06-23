interface CheckCircleIconProps {
  className?: string;
}

// Solid check-in-circle (20×20 viewBox). currentColor so the consumer's text
// color controls the fill — the selected-radio indicator.
export const CheckCircleIcon = ({ className }: CheckCircleIconProps) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
