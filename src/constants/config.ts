export const CONFIG = {
  // Brand/site name shown in patient-facing copy (AUM used REACT_APP_UAT_SITE).
  SITE_NAME: "Sildenafil.com",
  PAGINATION_LIMIT: 20,
  API_TIMEOUT_MS: 30_000,
  DEBOUNCE_MS: 300,
  STALE_TIME_SHORT: 2 * 60 * 1000,
  STALE_TIME_LONG: 10 * 60 * 1000,
} as const;
