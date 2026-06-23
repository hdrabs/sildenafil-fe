interface CaretDownIconProps {
  className?: string;
}

// Downward caret (13×7 viewBox), a filled brand-blue (#BFD9E4) design asset —
// the custom caret on the state <select>.
export const CaretDownIcon = ({ className }: CaretDownIconProps) => (
  <svg width="15" height="9" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
    <path d="M6.618 6.995c.256-.025.497-.128.692-.296l5.225-4.482a1.259 1.259 0 00.407-1.35 1.246 1.246 0 00-.631-.737 1.243 1.243 0 00-1.394.196l-4.416 3.79L2.085.327A1.244 1.244 0 00.69.13C.54.204.407.307.298.434a1.263 1.263 0 00-.293.926 1.246 1.246 0 00.463.857l5.225 4.482a1.244 1.244 0 00.925.296z" fill="#BFD9E4" />
  </svg>
);
