interface ClockIconProps {
  className?: string;
}

// Clock glyph (20×20 viewBox), stroked in brand blue (#BFD9E4).
export const ClockIcon = ({ className }: ClockIconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path d="M10.0013 4.99935V9.99935L13.3346 11.666M18.3346 9.99935C18.3346 14.6017 14.6037 18.3327 10.0013 18.3327C5.39893 18.3327 1.66797 14.6017 1.66797 9.99935C1.66797 5.39698 5.39893 1.66602 10.0013 1.66602C14.6037 1.66602 18.3346 5.39698 18.3346 9.99935Z" stroke="#BFD9E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
