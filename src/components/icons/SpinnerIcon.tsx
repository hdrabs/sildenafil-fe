interface SpinnerIconProps {
  className?: string;
}

// Loading spinner (24×24 viewBox). currentColor + the consumer's `animate-spin`
// class drive color and rotation — shown while search results load.
export const SpinnerIcon = ({ className }: SpinnerIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
