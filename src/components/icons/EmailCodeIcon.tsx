interface EmailCodeIconProps {
  className?: string;
}

// "Code via email" glyph (39×38 viewBox) — an envelope on a pale circular
// backdrop (#EFF8FC) with a coral notification dot (#EC534B). Multi-color by
// design; not a currentColor icon.
export const EmailCodeIcon = ({ className }: EmailCodeIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 39 38" fill="none" aria-hidden="true" className={className}>
    <circle cx="19.688" cy="19" r="19" fill="#EFF8FC" />
    <path d="M12.688 11a4 4 0 00-4 4v8a4 4 0 004 4h12a4 4 0 004-4v-8a4 4 0 00-4-4h-12zm0 2h12c1.008 0 1.84.74 1.979 1.71-.959.893-2.383 1.989-3.324 2.665C21.178 18.93 19.273 20 18.688 20c-.586 0-2.491-1.069-4.656-2.625a41.492 41.492 0 01-2.563-2 12.543 12.543 0 01-.688-.625c.138-.97.899-1.75 1.906-1.75zm-1.99 4.354c2.537 2.053 6.256 4.634 7.99 4.646 1.129.008 3.06-1.07 5.03-2.431 1.018-.705 2.152-1.542 2.97-2.229V23a2 2 0 01-2 2h-12a2 2 0 01-2-2l.01-5.646z" fill="#777" />
    <circle cx="27.172" cy="12.5" r="3.5" fill="#EC534B" />
  </svg>
);
