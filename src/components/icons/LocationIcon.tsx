interface LocationIconProps {
  className?: string;
}

// Map-pin / location glyph (21×20 viewBox), stroked in brand blue (#BFD9E4).
export const LocationIcon = ({ className }: LocationIconProps) => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" aria-hidden="true" className={className}>
    <path d="M17.5 8.33268C17.5 12.4935 12.6534 16.8268 11.0259 18.1652C10.8743 18.2738 10.6897 18.3325 10.5 18.3325C10.3103 18.3325 10.1257 18.2738 9.97413 18.1652C8.34663 16.8268 3.5 12.4935 3.5 8.33268C3.5 6.56457 4.2375 4.86888 5.55025 3.61864C6.86301 2.36839 8.64348 1.66602 10.5 1.66602C12.3565 1.66602 14.137 2.36839 15.4497 3.61864C16.7625 4.86888 17.5 6.56457 17.5 8.33268Z" stroke="#BFD9E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 10.8327C11.9497 10.8327 13.125 9.71339 13.125 8.33268C13.125 6.95197 11.9497 5.83268 10.5 5.83268C9.05025 5.83268 7.875 6.95197 7.875 8.33268C7.875 9.71339 9.05025 10.8327 10.5 10.8327Z" stroke="#BFD9E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
