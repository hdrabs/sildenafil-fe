# Migration Gaps — Account Hub, Order/Payment Tail, Engine & Cross-Cutting

Discovery audit (2026-06) of the legacy `aum_mine/client` → `sildenafil-fe` migration. Goal of the rewrite: **logic on the backend, FE thin, driven by the v2 catalog + server-computed verdicts.** This doc is the source of truth for what's left.

Repos: `aum_mine` (Rails API, branch `next-js-migration-p1`), `sildenafil-fe` (Next, branch `questionnaire-update-UX-UI`), `pocket_med` (telemedicine engine).

---

## 0. Backend prerequisites (most FE work is blocked on these)

| # | v2 endpoint / change | Status today | Blocks |
|---|---|---|---|
| P1 | **Expand `GET /v2/me` / `UserBlueprint`** — add `pocketmed_uuid`, `prescriptions`, `can_show_photos`, `default_payment_profile_id`, and the `has_*`/`is_*` flags (`has_refill`, `has_in_progress_refill`, `has_under_review_visit`, `has_cart_in_progress`, `is_order_being_processed`) | Thin blueprint, missing all of these (`user_blueprint.rb:6-9`) | Medical Visits, Refills, reorder gating, profile locks |
| P2 | **`GET /v2/orders` (list) + `GET /v2/orders/:id` (detail) + order_status** | **No v2 orders API at all**; `OrderBlueprint` exists but is internal-only | Orders History tab |
| P3 | **`GET /v2/visits` (history)** — proxy `users/{uuid}/visits` | `visits_controller` only does index(states)/show/create/update; no history | Medical Visits tab |
| P4 | **`GET /v2/refill_items`** — new controller + service + status resolver + blueprint (see §2) | None | Refills tab |
| P5 | **v2 charge / order-finalize endpoint** — wrap existing `OrderSubmitForm` + `Payments::PaymentProfileCharger` | **Missing** — `PUT /v2/checkout/order_verification` explicitly does NOT charge | Entire payment tail |
| P6 | **`DELETE /v2/shipping_addresses/:id`** (soft-delete → inactive) | v2 has create/update only | Shipping Address tab |
| P7 | **v2 `magic_links/consume`, email-confirm `update`, retake status/reset, `upsells` create/update, `discount_templates`** returning **Bearer JWT** (v1 returns jti, incompatible with v2 auth) | v1 only | Magic-link, email confirm, retake, upsell |
| P8 | **v2 authenticated change-password** (`current_password` + new) | Only reset-password token flow exists | Profile password change |
| P9 | **Provider ED v6 answer display fix** (pocket_med) — see §6 | **Broken now** | Clinical review (not FE migration, but urgent) |

Credit-cards v2 is the one area with **full parity** (incl. DELETE + select) — no backend work, FE rewire only.

---

## 1. Account Hub — per-tab status

Legacy reads almost everything from one fat `GET /v1/users/get_user` (cards, addresses, prescriptions, pocketmed_uuid, can_show_photos, has_*/is_* flags). v2 must replace that with focused endpoints + an expanded `/v2/me` (P1).

### 1a. Orders History — **STUB** (`features/orders/OrdersPage.tsx` = EmptyState)
- Legacy `OrdersHistory.tsx` merges `GET /v1/account/current_orders` `{orders, carts}`, sorts by `created_at`. `OrderCard` is status-driven off `order.state`/flags:
  - `quantity_changed && !paid` or `state==pending` → "Ready to Order" + **Proceed to Checkout** (`/edit/shipping` order_view).
  - `awaiting_shipment` / `last_cart.stage==fulfillment` → "Being fulfilled".
  - `state==shipped` → "Shipped" + **Track Package** (`tracking_url`, only if `tracking_active`).
  - `state==delivered` line items → **Buy it again** (gated through refill/retake/under-review modals).
  - Line items, payment method (card last-4), totals (subtotal/discount/shipping/tax/grand).
- `OrderStatus` page = "how to send a prescription" (E-script address/fax/call from config).
- **Need:** P2 endpoints + expand `OrderBlueprint` to all card fields; build list page, **new `account/orders-history/[id]` detail route** (referenced in `routes.ts:20`, doesn't exist), reorder/checkout/track wiring.

### 1b. Medical Visits — **STUB** (`features/prescriptions/PrescriptionsPage.tsx` = EmptyState)
- Legacy `MedicalVisits.tsx` → `GET /v1/ui/medical_visits?pocketmed_uuid=` (thin PocketMed proxy). Status badge mapping (`formatStatus`): draft→Pre-Visit Intake (+**Resume visit**), submitted→Ready for Provider, completed/`clinical_completed_rejected`→Visit Completed, cancelled/rejected→Cancelled, abandoned, refunded.
- `VisitDetail` header is status-specific (Submitted/Completed/CompletedRejected/Rejected/Cancelled/Abandoned/Refunded), body shows medication pref, cost, visit#, pharmacy info modal, medication info modal, ID/selfie images (hidden when `can_show_photos`), and a **Chat with a doctor** button (see §7).
- **Need:** P1 (pocketmed_uuid, can_show_photos) + P3 (history). Build list + status-specific detail + modals; Resume via `GET /v2/active_cart`.

### 1c. Payment Options — **BUILT but on v1** (`features/payments/PaymentHistoryPage.tsx`)
- Fully working UI incl. Accept.js tokenization (`useAddCreditCardForm.ts:52-66`), no-address blocker, set-default, delete. Currently calls v1 (`useCreditCards`/`useAddCreditCard`/`useSetDefaultCard`/`useDeleteCreditCard` → `/v1/users/get_user`, `/v1/credit_cards`, `/v1/select_cards`).
- **v2 hooks already written but unused** (`useCreditCardsV2`, `useAddCreditCardV2`, `useSetDefaultCardV2`, `removeV2`). **Lowest-effort tab.**
- **Need (FE only):** swap to v2 hooks, add a `useDeleteCreditCardV2` wrapper (service `removeV2` exists), set Accept.js form `apiVersion:"v2"`, source `default_payment_profile_id` from the v2 cards response.

### 1d. Shipping Address — **BUILT but on v1** (`features/shipping-address/ShippingAddressPage.tsx`)
- Working CRUD on v1; v2 list/create/update hooks written but unused. **Two gaps:** (1) **no v2 delete** anywhere (P6); (2) the new form does **client-side zod validation only** — the legacy Smarty autocomplete + address-verification flow (suggested/missing-secondary/undeliverable modals) is **not wired**, even though v2 endpoints exist (`POST /v2/address_validations`, `GET /v2/address_suggestions`).
- **Need:** P6 + FE rewire to v2 hooks + wire address_validations/suggestions; reproduce per-item gates (`editable_for_user`, `has_no_active_carts`, `is_valid` banner).

### 1e. Profile — **BUILT, several rules missing** (`features/profile/ProfilePage.tsx`)
Backend authority is the shared `UserUpdateForm`/`User` model via `Api::V2::UpdateUserService` + `MeController`, so most rules are still enforced server-side and 422 — but the FE doesn't preempt or surface them.
- **`info_provided` lock missing.** Legacy disables first/last/DOB/gender + shows "email/call support" once `info_provided` (set when cart passes patient-info). FE never reads `profile.info_provided`. *(Recommend making this BE-authoritative — the param-strip in `UserPolicy#user_params:21` is currently commented out, so even legacy relied on FE-only disabling.)*
- **Age 25–80 rule missing** on FE (BE enforces via `validate_telemedicine_age`).
- **Gender male-only missing** on FE; FE even offers an "Other" option the BE rejects.
- **Name regex weaker** (FE only `min(1)` + keydown block; paste bypasses).
- **OTP "Verify Now" is a dead link** → `<a href="/login">`. v2 OTP endpoints exist (`POST /v2/otp`, `PUT /v2/otp/verify`, 3-codes/window limit). Need an OTP modal wired.
- **Password change is a no-op** (`console.info` only — also a security finding: logs plaintext). Needs P8 + wiring.
- **Resend email verification** posts `/v2/email_verifications` — confirm the v2 route exists or it 404s.
- Phone-change→OTP-unverify and email-change→unconfirm are BE callbacks (work for free) but FE should invalidate `useCurrentUser` after save instead of guessing local state (`useUpdateProfile` doesn't invalidate today).

### 1f. Notifications — **PARTIAL/unwired** (`features/notifications/NotificationsPage.tsx`)
- Two booleans (`phone_contact_allowed`, `drugs_names_included`). **Save button has no onClick** → nothing persists. Initial state hardcoded false instead of hydrated from user. **Empty-state guard is wrong**: warns to add phone when `!user.email` (should be `!mobile_phone`).
- **Need:** wire to `useUpdateProfile` (`PATCH /v2/me` already permits both fields), hydrate from `useCurrentUser`, fix the guard.

### 1g. Cancel Order — **DONE** (static). Confirm correct support number with business (legacy text/href disagreed; new app uses `(844) 745-3362` consistently).

---

## 2. Refills — the most complex legacy logic (backend-driven redesign)

Legacy `OrderRefill` makes **two** calls (`/v1/account/order_refill` + `/v1/account/current_orders`) and does heavy **client-side** merge/de-dup + a status→button matrix:
- De-dup identity = **`product_variant_id` (product + dosage)**; backend already groups needs-action by `[product_id, dosage_value]` and excludes slugs with active Rx; FE then merges in-progress orders/contact carts by variant id.
- Status→CTA matrix lives in `ActivePrescription.tsx:21-38` + parent branches: `open_telemedicine_cart_id`→"Visit In Progress"+Continue/Remove; `open`/`contact`→"Incomplete"+Complete Your Order; `request`/`pending`→"In Progress"+View; `received`/`processed`/`fulfillment`→"Being Fulfilled"; `shipping`→"Shipped"; none→"Order Refill". Needs-action description from expiration/remaining/min_order_quantity.
- `RefillProductDetail` = variant/qty selection with FE-side pricing from `price_thresholds`, magic-link resume, prescription-limit branching.

**Backend-driven target:** new `GET /v2/refill_items` returns ready-to-render `sections[] → items[]`, each with catalog identity, a `status.code` + `tag`, a server-computed `primary_cta {label, action, target}` + optional `secondary_cta`, subtitle/description. FE becomes a thin renderer that dispatches on `action`. Reusable BE: `User#active/expired/needs_action_prescriptions`, `CartRedirectPath`, `Api::V2::RefillCartConverter`, `CatalogService`, `CartCalculator`. New BE: `RefillItemsController` + `RefillItemsService` + `RefillStatusResolver` (the canonical matrix) + blueprints; reuse `POST/PATCH /v2/carts` for actions.

---

## 3. Order / Payment tail — **the critical revenue gap**

Funnel ends at `order-verification`; "Complete My Order" → `PUT /v2/checkout/order_verification` which **completes the PocketMed visit + advances the cart but DOES NOT charge**, then `router.push(redirect_path)`.

Legacy tail (two converging paths): `Proceed to checkout → /edit/shipping (address+delivery sub-views) → shipping-confirmation / order-shipping-confirmation → /order/:id (the PAY page)`. The charge runs **server-side**: FE tokenizes via Accept.js (opaque token only) → `PUT /v1/orders/:id/complete_order` → `OrderSubmitForm` → `Payments::PaymentProfileCharger` (single `AuthCaptureTransaction`) → advances carts to `fulfillment`, decrements Rx, emails, enqueues ShipStation.

**v2 reality:** card save/select exists (`/v2/credit_cards*`), but there is **no v2 charge/order-finalize endpoint anywhere** (`grep` confirms only card-management + auth). New FE has **no `/order/[id]` pay page and no confirmation/thank-you page**; `redirect_path` can point at `/upsell-offer` (missing → 404) or `/account/orders-history` (exists).

**Target:** P5 — `POST /v2/checkout/order_payment` (or `PUT /v2/orders/:id/complete_order`) **wrapping the existing `OrderSubmitForm`/`PaymentProfileCharger` chain** (don't reimplement the AuthNet transaction); render the order via a new `OrderConfirmationBlueprint` + a `redirect_path`. FE: either add the charge call to `useOrderVerification` + a confirmation route, or build `/order/[id]` as the pay+confirm page. Reuse existing `useAddCreditCardForm` Accept.js. Charge stays server-side (keep the legacy security model). Delivery-options is a sub-view of shipping (as in legacy), not a separate route.

---

## 4. Product-selection eligibility / modals — **already correct, mostly**

Good news: the new landing flow is properly backend-driven. `GET /v2/visit_eligibility` returns a single verdict `{action: create_cart|update_cart|show_modal, modal: retake|under_review|order_processing|null, cart_id, cart_step, cart_branch}`; `useStartVisit.ts:51-93` consumes it (show_modal→block+modal, update_cart→PATCH, else→POST), CTA is backend-gated at click-time, modals render off the verdict (only copy is a FE lookup). State/age eligibility is correctly server-enforced (not a FE gate). Catalog carries pricing/marketing only — no eligibility flags (fine).

**Gap vs legacy:** backend verdict only emits 3 modal kinds. Legacy also had **refill_available / resume_refill / resume_visit** modals; today `has_cart_in_progress` is folded into `update_cart` and the refill/resume cases aren't represented. **If that UX is still wanted, extend the backend `action`/`modal` enum in `visit_eligibility_service.rb`** (return cart_id/prescription payload) rather than reintroducing FE branching. Don't port any client-side eligibility logic.

---

## 5. Smaller flows

- **Magic-link login** (`/magic-link/:token`, SMS-delivered, resumes a refill purchase): P7 (v2 consume → Bearer JWT). Build `app/magic-link/[token]/page.tsx` (works logged-out), 4-branch handling, store token in `userStore`; needs a refill-resume target route (none exists).
- **Email-confirmation callback** (`/confirmation?confirmation_token=`, auto-login → profile): only **resend** exists in v2; need a v2 confirm/`update` action (Bearer) + a `confirmation` page using `useSearchParams`.
- **Retake photos** (post-order, PocketMed-driven, selfie-first): ties to orphaned AASM `id_retake`/`selfie_retake`/`visit_detail` states. **Reusable infra already exists** (`PhotoUploadStep`, `CameraCaptureModal`, `usePhotoUpload`, v2 id/selfie upload). Need v2 retake-status + reset endpoints + `/retake-photos` page + `RetakeModal` entry.
- **Upsell offer** (`/upsell-offer`, post-order, 10-min countdown): v2 order_verification **already emits the redirect**, page just doesn't exist. Need P7 (v2 upsells + discount_templates), push pricing to BE, fix latent `skipped`→`not_interested` enum bug, build the page.
- **Static/legal pages** (privacy, terms, HIPAA, disclaimer, shipping, return/refund, contact): footer links exist but are **dead**. Content lives verbatim in drawers (`LegalDrawer`, `PrivacyPolicyDrawer`, `TermsOfUseDrawer`, `ShippingPolicyDrawer`, `PrivacyPracticesDrawer`=HIPAA). Lift drawer content into pages (extract shared content components); author 3 new (Disclaimer, Return&Refund, Contact); add a `Footer`; fix HIPAA "Albertsons" leftover. No backend.

---

## 6. PocketMed provider-side ED v6 answers — **BROKEN (urgent, not FE migration)**

The new step-based ED v6 questionnaire writes answers **only to the JSON `responses`/`ongoing_responses` columns** on `QuestionaireResponse` (`save_step_response!`), and **never creates legacy `Response` AR rows**. But ED visits are `from_aum?` → routed to the **legacy** provider view (`providers/visits`), whose answer helpers (`patient_answer`, `response_id`, `has_unacceptable_answer?`, `medication_pill_html` in `application_helper.rb:24,111,205,209`) read the `Response` table.

**Result:** for ED v6 visits the provider sees **no answers / `NoMethodError` on nil**, unacceptable/disqualify flags never show, medication/allergy pills empty. The v2 `VisitPresenter` (`providers/v2/visits`) reads the JSON correctly — WL visits use it.

**Fix options:** (a) route ED-v6 visits to `providers_v2_visit_path` (change the `from_aum?`/`is_wl_condition?` gate in `application_helper.rb:304-308,325` + `review_chat_controller.rb:21`) — but `VisitPresenter` has WL-specific bits (filters bmi/statement types, `visits` scoped to "WL") to reconcile; or (b) rewrite the legacy helpers to read the JSON when `question_set.title == 'ed_v6'`. Also reconcile answer ordering (`ed_v6_questions_list` sorts by step+label; JSON records by `position`).

---

## 7. Chat infrastructure

Legacy = **pocket_med-hosted iframe** (`/iframes/chats?access_key=…`), global account-level "Message Center" (navbar button, `?show_chat` deep-link, unread green-dot via `postMessage {read:false}` + polled `statuses.chat_message`), also on completed-visit screens. Auth = `Base64(Base64(shared_secret) + "." + pocketmed_uuid)`; pocket_med decodes, checks `AUM_VERIFICATION_SECRET`, `bypass_sign_in`. Realtime: Pusher channel `patient_chat_<user.id>` / `chat-event` — but the **patient iframe doesn't subscribe** (live push goes to staff; patient gets unread-dot only). sildenafil-fe has **zero chat** (no deps, no pusher keys).

**Options:** (A) **reuse the iframe** (fast): add a v2 endpoint returning the URL (same token build), render `<iframe>` in a drawer, point pocket_med `POST_MESSAGE_TARGET_URL` at the new origin, re-add the message listener + unread/mark-read. Caveats: legacy styling, jQuery/haml, static-secret auth, no live patient push. (B) **native v2** (better long-term): v2 JSON chat endpoints + Blueprinter, native UI, subscribe to `patient_chat_<id>` via `pusher-js` + `NEXT_PUBLIC_PUSHER_*`. Open Qs: realtime-for-patient expectation, channel uses numeric `user.id` (FE only has uuid; channel currently unauthenticated), keep static-secret vs short-lived signed token, message source-of-truth (pocket_med owns).

---

## 8. Analytics / 3rd-party (none wired in sildenafil-fe; `pocket_med_fe` is a working reference)

Legacy hub = **GTM** (`GTM-PNVBPQQ`, self-hosted `/metrics/` proxy); FB Pixel / Mouseflow / LogRocket fire as **tags inside GTM** (not app code); **PostHog** called directly (autocapture + session recording + `identifyUser`/`resetPostHog`); Rollbar for JS errors. Central util `GtmTrigger.ts` pushes to `dataLayer` and mirrors to PostHog via a Meta-name map.

**Funnel events to preserve** (keep `event_id = cart.id` for FB dedup): `view_content`→ViewContent, `add_to_cart`→AddToCart, `contact`→Contact, `registration`→CompleteRegistration, `lead`→Lead, `initiate_checkout`→InitiateCheckout, **`confirm_and_pay`→Purchase** (on payment success), PostHog `$pageview`. No server-side conversions (PostHog server is error-only).

**Re-implement:** add `NEXT_PUBLIC_` env vars; wire GTM via `@next/third-parties` (copy `pocket_med_fe/src/app/layout.tsx`); port `GtmTrigger.ts` verbatim + PostHog config + route-based pageview tracker (`usePathname`/`useSearchParams`); fire the 7 events at equivalent steps — **especially Purchase on payment success** (depends on the payment tail, §3).

---

## Suggested sequencing

1. **Provider ED v6 fix (§6)** — urgent, breaks clinical review now; independent of FE.
2. **Payment tail (§3, P5)** — blocks revenue + the Purchase analytics event.
3. **Backend prerequisites P1–P4, P6** — unblock the account hub.
4. **Account hub:** Payment Options (FE-only rewire) → Shipping Address (P6 + validations) → Profile rules + Notifications wiring → Medical Visits → Orders History → Refills (§2).
5. **Eligibility enum extension (§4)** if refill/resume modals are still wanted.
6. **Analytics (§8)** alongside the payment tail.
7. **Smaller flows (§5):** magic-link, email-confirm, retake, upsell, legal pages.
8. **Chat (§7)** — decide reuse-iframe vs native.
