# v2 Migration — Milestone Plan (full stack: APIs + pocket_med + FE)

Companion to [04-MIGRATION-GAPS.md](04-MIGRATION-GAPS.md). Scope of "migration" = **new v2 APIs (with RSpec specs + Postman collection) + pocket_med engine/provider work + the Next.js FE.** Not FE-only.

**Locked decisions (2026-06):**
- Profile gets a **dedicated new API** — do NOT overload `/v2/me` (that stays the patient-info endpoint).
- **No resume/refill eligibility modal** — out of scope.
- Cancel-order shows the **legacy number `(714) 276-2040`**.
- **Chat = reuse the pocket_med iframe** (Option A) for parity; native+polling/ActionCable is a documented follow-up. Pusher avoided.

## Definition of Done (applies to every milestone)

**Backend (aum_mine v2):** thin controller + service/form; Blueprinter (snake_case) through the `{data}`/`{error}` envelope; Pundit where an actor owns the resource; centralized `rescue_from`. **Tests:** RSpec **request spec** (happy path, auth/guest-token, validation 422 with per-field `details`, not-found, envelope shape via the shared `api_v2_envelope` example) + **service/form spec**. **Postman:** add/update the request in the v2 collection with example success + error responses and the auth header. **pocket_med:** RSpec for any new/changed engine endpoint or provider view.

**FE (sildenafil-fe):** strict `Component → TanStack hook → service → baseAPI` chain; types in `src/types/`; zod + react-hook-form; no v1 calls; no `any`; design tokens (no hex). Each feature lands behind its hooks with `{submit,isLoading,error}`.

**Sizing:** S ≈ 1–2 days, M ≈ 3–5 days, L ≈ 1–2 weeks (rough, one engineer).

---

## M0 — Provider ED v6 answer display fix (pocket_med) · **S** · URGENT, independent
Not FE migration, but it's breaking clinical review now: ED v6 answers live in JSON (`responses`/`ongoing_responses`), yet ED visits route to the legacy provider view that reads the old `Response` AR table → providers see no answers / nil crashes; disqualify/unacceptable/med pills empty.
- **pocket_med:** route ED-v6 visits to the JSON-based `VisitPresenter`/`providers/v2/visits` path (adjust the `from_aum?`/`is_wl_condition?` gate in `application_helper.rb:304-308,325` + `review_chat_controller.rb:21`), reconciling the WL-specific bits in `VisitPresenter` (bmi/statement filtering, `visits` scoped to WL); OR rewrite legacy `patient_answer`/`response_id`/`has_unacceptable_answer?`/`medication_pill_html` to read the JSON when `question_set.title=='ed_v6'`. Reconcile answer ordering (step+label vs JSON `position`).
- **Tests:** provider-view request/feature spec rendering a real ED v6 `QuestionaireResponse` — answers, unacceptable flag, medications all present.
- **Acceptance:** a provider opens an ED v6 visit and sees all answers + flags, no errors.

---

## M1 — Patient post-approval payment flow · **L** · revenue-critical

**Correct model (confirmed 2026-06):** the Order is **NOT** created in the checkout funnel. The funnel ends at `order-verification` (= end of the patient's *intake*; cart → `request` via `PocketMed::CompleteVisit`). The doctor approves via the PocketMed webhook (cart → `received`); an **AUM admin on the panel/CRM** advances carts to `processed`, then **creates the Order** (`Panel::OrderForm` groups 1+ carts that share user/shipping/delivery → Order `draft`) and generates payment (`Panel::PaymentCreateForm` → Order `pending`, pending Payment, carts → `contact`). The admin then makes a 1-minute `SignInToken` and the panel redirects to **sildenafil-fe** `/users/become/:token`.

**The panel/admin order-creation is OUT OF SCOPE — it stays as-is.** M1 = the **patient-facing payment flow over the admin-created pending Order**, on v2 + sildenafil-fe. One Order : N carts. Charge reuses `OrderSubmitForm` + `Payments::PaymentProfileCharger` unchanged; on success carts → `fulfillment` (Rx decrement, order email, ShipStation).

- **API (new v2):**
  1. `POST /api/v2/sessions/become` — exchange a `SignInToken` (uuid, 1-min expiry, `app/models/sign_in_token.rb`) for a **JWT** (sildenafil-fe is JWT-based; the existing `UsersController#become` is Devise-cookie only). Entry to the whole flow.
  2. `GET /api/v2/orders/current` — the user's current pending Order to pay.
  3. `GET /api/v2/orders/:id` + new `OrderDetailBlueprint` (carts via `CartSummaryBlueprint`, pricing, shipping, delivery, payment status).
  4. `PATCH /api/v2/orders/:id` — update `shipping_address_id` + `delivery_type`; recompute via `OrderCalculator` (the edit-shipping + delivery-options steps).
  5. `PUT /api/v2/orders/:id/complete_order` — charge via `OrderSubmitForm.new(order).save` → `PaymentProfileCharger`; zero-dollar path handled by the form; carts → `fulfillment`; returns confirmation + redirect.
  6. *(optional, deferrable)* coupon apply/remove on the order's carts.
  - Card add/select already exists (v2 `credit_cards`, Accept.js `opaque_data:{dataDescriptor,dataValue}`).
- **Tests:** request specs — become (valid/expired token), current-order, order show (owner/forbidden), order update (shipping/delivery recompute), complete_order (success/zero-dollar/declined/no-card/double-submit). AuthNet mocked via the existing `AuthorizeMocks` helpers. Postman entries per endpoint.
- **FE (pixel-match legacy):** `/users/become/[token]` (exchange→store JWT→`/account/current-order`); `/account/current-order` entry + "Complete Order"; order edit → shipping address → delivery options → shipping-confirmation; `/order/[id]` pay page (legacy `OrderConfirmation`/`OrderEditor`: review carts, select/add card via `useAddCreditCardForm`, "Complete My Order"); confirmation. Fire the **Purchase** analytics event on success (ties to M8).
- **Build order:** (1) become-session + current-order + order-show + blueprint, (2) order update (shipping/delivery), (3) complete_order charge, (4) FE pages. Each backend slice ships with RSpec + Postman before its FE.
- **Acceptance:** admin become-link logs the patient into the new app; they review the pending order, set shipping/delivery, pay; card charged server-side; carts → fulfillment; confirmation shown.

---

## M2 — Profile/Account API + Profile/Notifications/Cancel tabs · **M**
New dedicated account API (NOT `/v2/me`) + the profile-area FE rules.
- **API (new):** `GET /api/v2/account` (rich account payload: identity + `default_payment_profile_id`, `pocketmed_uuid`, `prescriptions`, `can_show_photos`, and the `has_*`/`is_*` flags) via an expanded/aliased blueprint; `PATCH /api/v2/profile` (profile edits, authoritative validations: age 25–80, male-only gender, name regex, **`info_provided` field lock** — re-enable the param strip server-side); `PUT /api/v2/profile/password` (authenticated change-password with `current_password` + complexity — none exists today). OTP reuse (`POST /v2/otp`, `PUT /v2/otp/verify`). Confirm/keep `POST /v2/email_verifications` (resend).
- **Tests:** request specs for account read, profile update (each validation → 422 details, info_provided lock strips fields), password change (wrong current pw, complexity), OTP limit (429). Postman: account, profile PATCH, password, otp.
- **FE:** Profile — consume `info_provided` to disable name/DOB/gender + support message; add age/gender/name validation mirrors; wire the **OTP modal** (replace the dead `/login` link); wire **password change** (replace the `console.info` no-op + remove the plaintext log); invalidate `useCurrentUser` after save. Notifications — wire **Save** to `PATCH /v2/profile` (or a prefs action), hydrate from server, fix empty-state guard (`!mobile_phone`). Cancel-order — display `(714) 276-2040` (legacy).
- **Acceptance:** profile edits honor all legacy locks/validations; OTP + password + notifications all persist.

---

## M3 — Payment Options + Shipping Address tabs → v2 · **S–M** · mostly FE
Both tabs are fully built but on v1; v2 card parity already exists.
- **API (new, small):** `DELETE /api/v2/shipping_addresses/:id` (soft-delete → inactive) — the one missing v2 piece. (v2 address validation/suggestions already exist.)
- **Tests:** request spec for shipping delete (owned vs not, active-cart guard). Postman: shipping delete.
- **FE:** Payment Options — swap to existing `useCreditCardsV2/useAddCreditCardV2/useSetDefaultCardV2`, add a `useDeleteCreditCardV2` wrapper (`removeV2` exists), Accept.js `apiVersion:"v2"`, default id from v2 response. Shipping — swap to v2 hooks, add v2 delete hook, **wire `POST /v2/address_validations` + `GET /v2/address_suggestions`** into the form (currently zod-only), reproduce per-item gates (`editable_for_user`, `has_no_active_carts`, `is_valid` banner).
- **Acceptance:** both tabs fully on v2 incl. delete + Smarty validation/autocomplete; no v1 calls remain in these features.

---

## M4 — Orders History + order detail · **L**
No v2 orders API exists.
- **API (new):** `GET /api/v2/orders` (current + history merged, status-driven), `GET /api/v2/orders/:id` (detail), and an order_status / prescription-instructions endpoint (or config-delivered). Expand `OrderBlueprint` to all card fields (carts/line-items, payments + card last-4, shipping_address, shipstation/tracking, delivery, discounts, totals).
- **Tests:** request specs for list (mixed states), detail, status transitions, auth. Postman: orders list/detail/status.
- **FE:** real Orders list (status-driven cards: Proceed-to-Checkout for pending/quantity_changed, Track Package for shipped, Buy-it-again for delivered), **new `account/orders-history/[id]` detail route** (referenced in `routes.ts:20`, missing), reorder wiring (depends on M6 refill or visit-gating from M2 flags).
- **Acceptance:** users see real order cards + a working detail view; track/reorder/checkout actions wired.

---

## M5 — Medical Visits · **M–L**
No v2 visit-history endpoint.
- **API (new):** `GET /api/v2/visits` (list a user's PocketMed visit history; proxy `users/{uuid}/visits`) + a visit blueprint; resume via existing `GET /v2/active_cart`. Relies on M2's account payload for `pocketmed_uuid` + `can_show_photos`.
- **pocket_med:** ensure `users/{uuid}/visits` returns the fields the detail view needs (status, clinical_review_stage, medication, pharmacy, photos).
- **Tests:** request spec (history list, statuses, photo visibility by `can_show_photos`), pocket_med proxy spec. Postman: visits history.
- **FE:** visits list with status badges (`formatStatus` mapping), status-specific detail headers (Submitted/Completed/Rejected/etc.), medication + pharmacy + medication-info modals, ID/selfie display, Resume (draft) + Start-new-visit.
- **Acceptance:** users see visit history + detail with correct status-driven UI; resume works.

---

## M6 — Refills (backend-driven) · **L**
Replace the legacy two-call client-side merge + status→button matrix with a server-computed list.
- **API (new):** `GET /api/v2/refill_items` → `Api::V2::RefillItemsController` + `RefillItemsService` (gather active/needs-action/expired prescriptions + open-visit carts + in-progress orders/contact carts; merge/dedup by `product_variant_id`) + `RefillStatusResolver` (canonical status→tag/CTA matrix, the single source of truth) + `RefillItemBlueprint`/`RefillSectionBlueprint`. Each item carries catalog identity, `status.code`, `tag`, server-computed `primary_cta {label,action,target}` + optional `secondary_cta`. Actions route through existing `POST/PATCH/DELETE /v2/carts` + `RefillCartConverter`. Reuse `CartRedirectPath`, `CatalogService`, `CartCalculator`.
- **Tests:** service spec for the resolver (every status → expected tag/CTA), request spec (sections, dedup, empty state, guest/auth). Postman: refill_items.
- **FE:** new `src/features/refill/` with `useRefillItems()`; wire `account/order-refill` (replace `ProductsPage` stub) as a thin renderer dispatching on `action` (navigate to `target` or call cart mutation). Variant/qty selection reuses catalog + existing cart hooks.
- **Acceptance:** refill page renders sections + status-driven CTAs entirely from the server payload; no client-side status/merge logic.

---

## M7 — Post-order & auxiliary flows · **M**
All currently v1 jti-auth → need v2 (Bearer).
- **API (new):** v2 `magic_links/consume` (→ Bearer JWT); v2 email-confirmation `update`/confirm (→ Bearer); v2 retake-status + reset (reuse `PocketMed::UploadVisitPhoto`); v2 `upsells` create/update + `discount_templates` (push pricing to BE, **fix the `skipped`→`not_interested` enum bug**).
- **pocket_med:** retake-status source (`ProcessRetakePhotos`); confirm upload proxy.
- **Tests:** request specs per endpoint (token valid/expired/mismatch, retake ordering, upsell purchase/skip). Postman: each.
- **FE:** `app/magic-link/[token]` (works logged-out, 4-branch, token→userStore, refill-resume target); `confirmation` page (`useSearchParams`, auto-login→profile); `/retake-photos` reusing `PhotoUploadStep`/`CameraCaptureModal` (selfie-first) + `RetakeModal` entry; `/upsell-offer` page (reads `redirect_path`, countdown + video, purchase/skip) — v2 already emits the redirect.
- **Acceptance:** each flow works end-to-end on v2 auth.

---

## M8 — Analytics + legal/static pages · **M** · mostly FE
- **FE analytics:** add `NEXT_PUBLIC_` env (GTM `GTM-PNVBPQQ`, PostHog key/host, FB Pixel `1340062723368908`, Mouseflow, optional Rollbar); wire GTM via `@next/third-parties` (copy `pocket_med_fe/src/app/layout.tsx`); **port `GtmTrigger.ts` verbatim** + PostHog config + route-based pageview tracker (`usePathname`/`useSearchParams`) + `identifyUser`/`resetPostHog`; fire the 7 funnel events at equivalent steps — **Purchase on payment success** (M1), `event_id=cart.id` for FB dedup.
- **FE legal:** lift verbatim drawer content (`LegalDrawer`, Privacy/Terms/HIPAA/Shipping drawers) into pages matching the dead footer hrefs; author Disclaimer, Return&Refund, Contact; add a shared `Footer`; fix HIPAA "Albertsons" leftover; extract shared content components to avoid divergence.
- **Acceptance:** funnel events fire and validate in GTM/PostHog; all footer links resolve to real pages.

---

## M9 — Chat (iframe reuse) · **M** · decision-gated (Option A locked)
- **API (new):** v2 endpoint returning the iframe URL (mirror `chat_modal_controller`, but `api/v2` + `render_resource({url})`, JWT-gated; same token build `Base64(Base64(secret)+"."+pocketmed_uuid)`); v2 (or proxy) mark-read endpoint.
- **pocket_med:** set `POST_MESSAGE_TARGET_URL` to the sildenafil-fe origin per env; allow the new origin in `X-Frame-Options`/CSP `frame-ancestors`.
- **Tests:** request spec for the URL endpoint (auth, missing pocketmed_uuid). Postman: chat url + read.
- **FE:** `<MessageCenter>` drawer rendering `<iframe>`; `window.addEventListener('message')` (validate origin) for the unread dot; mark-read on close; navbar entry + `?show_chat` deep-link; surface on completed-visit screens (M5).
- **Acceptance:** patient opens Message Center, sees/sends messages, unread dot works. **Follow-up (separate):** native UI + polling (Option B) or ActionCable (Option C) if design consistency / live patient push is later required.

---

## Cross-cutting / cleanup
- **v1 deletion** (after the above): remove dead `cartService.listCarts/getCart/createCart`, `paymentService`, and v1 hooks once no feature references v1. Drop `/v1/users/get_user` dependency.
- **Bug sweep** (fold into nearest milestone): `visit-consultation/page.tsx` hardcoded `slug=""`; the various Profile/Notifications fixes (M2); upsell enum (M7).
- **Postman collection** lives alongside the v2 work (the repo already ships Postman docs per feature) — keep it the contract artifact for FE.

## Dependency graph (build order)
```
M0 (independent, urgent)
M1 ─────────────► (Purchase event feeds M8)
M2 ─► M3, M4(reorder gating), M5(account payload)
        M4
        M5 ──► M9(completed-visit chat entry)
        M6
M7 (independent-ish; needs Bearer endpoints)
M8 (needs M1 for Purchase)
M9 (needs M2 pocketmed_uuid; Option A locked)
```
Recommended sequence: **M0 → M1 → M2 → M3 → M4/M5/M6 (parallelizable) → M7 → M8 → M9.**
