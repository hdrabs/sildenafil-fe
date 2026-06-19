interface PasswordIconProps {
  className?: string;
}

// Key glyph (24×24 viewBox). currentColor so the consumer's text color
// controls the fill — used as the password field adornment.
export const PasswordIcon = ({ className }: PasswordIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      fill="currentColor"
      d="M13.092 1.958a1.015 1.015 0 00-.813.281L8.406 6.136C7.52 7.022 7.175 8.48 7.56 9.77c.172.578-.032 1.251-.375 1.594L2.279 16.24a1.018 1.018 0 00-.28.72v1a4 4 0 003.999 4h1c.265 0 .531-.095.719-.282l4.875-4.907c.343-.343 1.06-.543 1.594-.375 1.234.39 2.754.016 3.64-.87l3.891-3.848c.211-.212.31-.515.281-.813a9.875 9.875 0 00-8.906-8.906zm.273 2.043c3.434.522 6.063 3.162 6.585 6.596l-3.534 3.52c-.352.351-1.05.581-1.641.391-1.231-.396-2.71-.023-3.589.856l-4.575 4.58-.613.014a2 2 0 01-2-2l.008-.602 4.586-4.586c.879-.879 1.264-2.394.875-3.597-.183-.567.04-1.315.391-1.666l3.507-3.506zm1.633 3.957c-.256 0-.523.086-.719.281a1.03 1.03 0 000 1.438 1.03 1.03 0 001.438 0 1.03 1.03 0 000-1.438 1.014 1.014 0 00-.719-.28z"
    />
  </svg>
);
