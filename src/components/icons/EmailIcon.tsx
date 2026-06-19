interface EmailIconProps {
  className?: string;
}

// Envelope glyph (21×16 viewBox). Uses currentColor so the consumer's text
// color class controls the fill — keeps it themeable instead of hardcoding #777.
export const EmailIcon = ({ className }: EmailIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 21 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.016 0a4 4 0 00-4 4v8a4 4 0 004 4h12a4 4 0 004-4V4a4 4 0 00-4-4h-12zm0 2h12c1.008 0 1.84.74 1.979 1.71-.958.893-2.382 1.989-3.323 2.665C12.507 7.93 10.602 9 10.016 9 9.43 9 7.525 7.931 5.36 6.375a41.492 41.492 0 01-2.563-2 12.541 12.541 0 01-.687-.625C2.248 2.78 3.008 2 4.016 2zm-1.99 4.354c2.538 2.053 6.257 4.634 7.99 4.646 1.129.008 3.06-1.07 5.03-2.431 1.019-.705 2.153-1.542 2.97-2.229V12a2 2 0 01-2 2h-12a2 2 0 01-2-2l.01-5.646z"
      fill="currentColor"
    />
  </svg>
);
