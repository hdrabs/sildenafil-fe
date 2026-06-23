interface UserSolidIconProps {
  className?: string;
}

// Solid user / person silhouette (24×24 viewBox). currentColor so the consumer's
// text color controls the fill — used as a name-field adornment. (Distinct from
// the thinner outline PersonIcon in this folder.)
export const UserSolidIcon = ({ className }: UserSolidIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);
