# CLAUDE.md — sildenafil-fe

Patient-facing telehealth storefront for generic Sildenafil (Viagra). **This is the active rewrite** of the legacy React frontend that lives inside `../aum_mine/client`. The rewrite exists to fix the old app's problems: tangled client state, no SSR/SEO, and too much business logic computed on the frontend. Keep those goals in mind — push computation to the Rails API, keep the FE thin.

The Rails API backend is the **same `aum_mine` monolith** (see `../aum_mine/CLAUDE.md`). This app talks to its `/api/v2/*` endpoints. The `aum_mine` React client is the thing being replaced — not a dependency.

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js **16.2.6** (App Router) | README says 15.x — stale; `package.json` is source of truth |
| Language | TypeScript 5 (strict, `noUnusedLocals`, `noUnusedParameters`) | `any` is banned |
| UI | React **19.2.4** | |
| Server state | TanStack Query 5 | Owns everything from the API |
| Client state | Zustand 5 (with `persist`) | Auth, multi-step form progress, cart restore only |
| Forms | react-hook-form 7 + zod 4 | No raw per-field `useState` |
| Styling | Tailwind CSS 4 | Design tokens are CSS vars in `globals.css` `@theme`; no hardcoded hex |
| Animation | motion 12 | |
| Toasts | react-toastify 11 | |

**Package manager: pnpm only.** Never `npm`, `yarn`, or `bun`.

## Commands

```bash
pnpm install
pnpm dev      # next dev --experimental-https (HTTPS, needs ./certificates) → https://localhost:3000
pnpm build
pnpm lint     # eslint
```

`pnpm dev` runs with `--experimental-https` (certs in `./certificates`) because the API and OAuth/payment flows need HTTPS locally. The Rails API is expected at the URL in `.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api/v1
```

## Read the docs/ first

This repo has detailed, authoritative docs in [`docs/`](docs/). **They are the source of truth for conventions — read the relevant one before writing code.** Do not invent patterns that contradict them.

| File | When |
|---|---|
| [docs/RULES.md](docs/RULES.md) | First — hard, non-negotiable constraints |
| [docs/01-STRUCTURE.md](docs/01-STRUCTURE.md) | Route groups, providers, root layout, design tokens, env |
| [docs/02-MODULES.md](docs/02-MODULES.md) | Scaffolding a feature/page/domain |
| [docs/03-STANDARDS.md](docs/03-STANDARDS.md) | Writing components, hooks, services, stores, forms |

## Architecture rules that bite if ignored

**The API call chain is enforced without exception:**

```
Component / Page  →  TanStack hook (src/api/hooks/)  →  Service (src/api/services/)  →  baseAPI  →  Rails API
```

- Components **never** import from `src/api/services/`. They import hooks only.
- If no hook exists for an operation, create it before writing the component.
- Wrap mutations in a feature-level hook exposing `{ submit, isLoading, error }`. Never call `.mutate()` inline in JSX.

**State ownership:**
- Server data → TanStack Query (never duplicate into Zustand).
- Auth/JWT (`userStore`), multi-step form progress (`questionnaireStore`), cart-restore (`cartStore`) → Zustand.
- Modal open/closed, controlled inputs, tab selection → `useState`.

**Other hard rules (from RULES.md):**
- `const` arrow functions only — never the `function` keyword for components/utilities.
- No barrel `index.ts` re-export files. Import from source.
- Path alias `@/*` → `src/*`. No `../../` relative imports.
- All domain types live in `src/types/`. Never declare interfaces inside service/hook files.
- Comments explain WHY, never WHAT. No `console.log` in committed code.

## Layout

```
src/
├── app/                    # App Router. Route groups: (auth) (checkout) (marketing) (patient) + product-detail
├── api/
│   ├── baseAPI.ts          # fetch wrapper. Injects Bearer token + AuthToken (jti). Unwraps { data: … } envelope
│   ├── services/           # One service object per domain (cartService, …). Calls baseAPI
│   └── hooks/              # TanStack Query hooks. The ONLY API surface components may import
├── features/               # Feature modules (checkout, orders, products, auth, dashboard, …)
├── components/             # Shared components (Navbar, modals, ui)
├── store/                  # Zustand: userStore, cartStore, questionnaireStore
├── types/                  # All domain interfaces (cart.ts, product.ts, …)
├── constants/              # routes.ts, queryKeys.ts, config.ts
├── lib/schemas/            # Shared zod schemas
└── providers/              # QueryProvider, etc.
```

## Backend API: v1 vs v2 (important)

The Rails backend exposes two API versions. This app should target **v2** for new work.

- **v2** (`/api/v2/*`): Blueprinter-serialized, snake_case, JWT `Authorization: Bearer`, and wraps responses in a `{ data: … }` envelope (errors in `{ error: … }`). `baseAPI.ts` strips the `data` envelope automatically.
- **v1** (`/api/v1/*`): legacy jbuilder, mixed casing, no consistent envelope. Some hooks here still hit v1.

### `GET /api/v2/active_cart`

Returns the user's most recent in-progress cart, or "no cart." Both branches use the standard `{ data: … }` envelope (cart-present: `{ data: { cart, variant_label, redirect_path } }`; empty: `{ data: { cart: null } }`), so `baseAPI` unwraps them uniformly.

The snake→camel remap lives in the **service** (`cartService.getActiveCart`), which returns a ready-to-store `ActiveCartEntry | null`. Consumers (e.g. [MainNav.tsx](src/components/Navbar/MainNav.tsx)) just check truthiness and drop it into the Zustand cart store — no per-field mapping or shape-guarding in the component. `variant_label`/`redirect_path` are server-computed presentation hints (not part of the cart entity), mapped to `variantLabel`/`redirectPath` in the service.

## Git

**Never run or suggest `git commit`.** The developer handles all commits.
