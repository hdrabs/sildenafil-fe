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
  CHECKOUT_PRODUCT_DETAIL: (slug: string) => `/checkout/product-detail/${slug}`,
  // Marketing drug picker (/product-selection/sildenafil | tadalafil) — drug selector on.
  PRODUCT_SELECTION:       (drug: string) => `/product-selection/${drug}`,
  PRODUCT_DETAIL:   "/product-detail",
  REFILL_PRODUCT_DETAIL: "/refill-product-detail",

  // ── Checkout flow ──────────────────────────────────────────────────────────
  INTRO_QUESTIONS:            (slug: string) => `/intro-questions/${slug}`,
  INTRO_QUESTIONS_START:      "/intro-questions",
  VISIT_CONSENT:              "/checkout/visit-consent",
  PATIENT_INFO:               "/checkout/patient-info",
  VISIT_INTRO:                "/checkout/visit-intro",
  VISIT_CONSULTATION_STEP:    (slug: string) => `/checkout/visit-consultation/${slug}`,
  CHECKOUT_NO_CHECKUP:        "/checkout/no-checkup",
  CHECKOUT_NO_BLOOD_PRESSURE: "/checkout/no-blood-pressure",
  SHIPPING:                   "/checkout/shipping",
  IDENTITY_VERIFICATION:      "/checkout/identity-verification",
  ID_UPLOAD:                  "/checkout/id-upload",
  SELFIE_UPLOAD:              "/checkout/selfie-upload",
  SHIPPING_CONFIRMATION:      "/checkout/shipping-confirmation",
  ORDER_VERIFICATION:         "/checkout/order-verification",

  // Post-payment one-time upsell offer (order-verification redirects here when an
  // upsell tier applies; carries ?redirect_path= for the final destination).
  UPSELL_OFFER:               "/upsell-offer",

  // ── Patient post-approval payment flow (admin become-link → pay) ─────────────
  // Paths match the legacy aum_mine/client routes so existing links don't 404.
  BECOME:                      (token: string) => `/users/become/${token}`,
  CURRENT_ORDER:               "/account/current-order",
  EDIT_SHIPPING:               "/edit/shipping",
  ORDER_SHIPPING_CONFIRMATION: "/order-shipping-confirmation",
  ORDER_PAY:                   (id: number) => `/order/${id}`,
} as const;
