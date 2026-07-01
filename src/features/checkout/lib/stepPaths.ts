// Maps a checkout pathname to its backend funnel step so the guard can ask the
// backend "am I allowed on this step?". Deliberately NOT a reverse-lookup of ROUTES
// (several checkout routes are slug functions, e.g. VISIT_CONSULTATION_STEP(slug));
// keyed on the route's leading segments instead, with the [slug] stripped.
// NOTE: checkout/product-detail is intentionally absent — it's the funnel entry
// where the cart is created, so it must not require an existing cart (guarding it
// would redirect a cart-less first visit into a loop). It's always a completed step
// anyway, so leaving it ungated yields the same "allowed" outcome.
const SEGMENT_TO_STEP: Record<string, string> = {
  "intro-questions": "intro_questions",
  "checkout/visit-consent": "visit_consent",
  "checkout/patient-info": "patient_info",
  "checkout/visit-intro": "visit_intro",
  "checkout/visit-consultation": "visit_consultation",
  "checkout/no-checkup": "no_checkup",
  "checkout/no-blood-pressure": "no_blood_pressure",
  "checkout/shipping-confirmation": "shipping_confirmation",
  "checkout/shipping": "shipping_address_info",
  "checkout/identity-verification": "identity_verification",
  "checkout/id-upload": "visit_id_upload",
  "checkout/selfie-upload": "visit_selfie_upload",
  "checkout/order-verification": "order_verification",
};

// Longest key first so "checkout/shipping-confirmation" wins over "checkout/shipping".
const SEGMENTS = Object.keys(SEGMENT_TO_STEP).sort((a, b) => b.length - a.length);

export const stepFromPathname = (pathname: string): string | null => {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const match = SEGMENTS.find((segment) => clean === segment || clean.startsWith(`${segment}/`));
  return match ? SEGMENT_TO_STEP[match] : null;
};
