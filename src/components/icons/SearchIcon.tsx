interface SearchIconProps {
  className?: string;
}

// Magnifying-glass glyph (24×24 viewBox, stroke-based). currentColor so the
// consumer's text color controls the stroke — used as a search-field adornment.
export const SearchIcon = ({ className }: SearchIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
