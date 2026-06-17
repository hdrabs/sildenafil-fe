export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Account hub
  DASHBOARD:       "/account",
  ORDER_REFILL:    "/account/order-refill",
  ORDERS:          "/account/orders-history",
  PRESCRIPTIONS:   "/account/medical-visits",
  PAYMENTS:        "/account/payment-options",
  SETTINGS:        "/account/shipping-address",
  PROFILE:         "/account/profile",
  NOTIFICATIONS:   "/account/notifications",
  CANCEL_ORDER:    "/account/cancel-order-process",

  // Other routes
  ORDER: (id: number) => `/account/orders-history/${id}`,
  QUESTIONNAIRE: (id: string) => `/questionnaire/${id}`,
  CHECKOUT: "/account/payment-options/checkout",
  PRODUCTS:   "/account/order-refill",

  NEW_USER:         (slug: string) => `/new-user/${slug}`,
  BEST_VALUE:       (slug: string) => `/best-value/${slug}`,
  LOWEST_PRICE:     (slug: string) => `/lowest-price/${slug}`,
  PRODUCT_SELECTION:(slug: string) => `/product-selection/${slug}`,
  PRODUCT_DETAIL:   "/product-detail",

  // ── Checkout flow ──────────────────────────────────────────────────────────
  INTRO_QUESTIONS:            (slug: string) => `/intro-questions/${slug}`,
  VISIT_CONSULTATION_STEP:    (slug: string) => `/checkout/visit-consultation/${slug}`,
} as const;
