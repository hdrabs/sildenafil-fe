interface PersonIconProps {
  className?: string;
}

// Person glyph (24×24 viewBox). currentColor so the consumer's text color
// controls the fill — used as the first/last name field adornment.
export const PersonIcon = ({ className }: PersonIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      fill="currentColor"
      d="M11.998 1.953a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm-3.531 9.313c-2.614.714-4.469 2.987-4.469 5.687v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.7-1.855-4.973-4.469-5.687a.95.95 0 00-.656.062 6.982 6.982 0 01-2.875.625c-.985 0-1.96-.212-2.875-.625a.95.95 0 00-.656-.062zm.406 2c1.01.382 2.045.687 3.125.687s2.115-.305 3.125-.687c1.703.516 2.875 1.954 2.875 3.687v1h-12v-1c0-1.733 1.172-3.171 2.875-3.687z"
    />
  </svg>
);
