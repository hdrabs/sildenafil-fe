# Sildenafil Frontend

Patient-facing telehealth frontend for Generic Sildenafil (Viagra). Built with Next.js 15 App Router, TypeScript, TanStack Query, and Zustand. Connects to the Rails API backend.

---

## Tech Stack

| Concern       | Library                  | Version      |
| ------------- | ------------------------ | ------------ |
| Framework     | Next.js (App Router)     | 15.x         |
| Language      | TypeScript               | 5.x (strict) |
| UI            | React                    | 19.x         |
| Server state  | TanStack Query           | 5.x          |
| Client state  | Zustand                  | 5.x          |
| Forms         | react-hook-form + zod    | latest       |
| Styling       | Tailwind CSS             | 4.x          |
| Animations    | Motion                   | 12.x         |
| Notifications | react-toastify           | 11.x         |
| Dates         | dayjs                    | 1.x          |
| Payments      | Authorise.net            | latest       |
| Icons         | react-icons              | 5.x          |
| HTTP          | Native fetch via baseAPI | —            |

**Package manager: pnpm only.** Never use `npm`, `yarn`, or `bun`.

---

## Getting Started

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000). The Rails API is expected at `http://127.0.0.1:3001`.

### Environment

Create a `.env.local` at the project root:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api/v1
```

---

## Project Docs

All architectural decisions, standards, and patterns live in [`docs/`](./docs/). **Read these before writing any code.**

| File | When to read |
| ---- | ------------ |
| [docs/RULES.md](./docs/RULES.md) | First — hard constraints that apply everywhere |
| [docs/01-STRUCTURE.md](./docs/01-STRUCTURE.md) | Setting up the project, adding route groups, configuring providers |
| [docs/02-MODULES.md](./docs/02-MODULES.md) | Scaffolding a new feature, adding a page, building a new domain |
| [docs/03-STANDARDS.md](./docs/03-STANDARDS.md) | Writing any code — components, hooks, services, stores, forms, styles |

---

## Route Groups

| Group | URL prefix | Auth required |
| ----- | ---------- | ------------- |
| `(marketing)` | `/` | No |
| `(auth)` | `/login`, `/signup`, `/forgot-password`, `/reset-password` | No — redirects away if already authenticated |
| `(patient)` | `/dashboard`, `/orders`, `/medicines`, `/questionnaire`, `/prescriptions`, `/profile`, `/settings` | Yes — redirects to `/login` if not authenticated |

---

## Key Architectural Rules

**The API call chain is enforced without exception:**

```
Component / Page
      ↓
TanStack Query Hook  (src/api/hooks/)
      ↓
Service Function     (src/api/services/)
      ↓
baseAPI              (src/api/baseAPI.ts)
      ↓
Rails API
```

Components never import from `src/api/services/`. They only import hooks.

**State ownership:**

| State type | Owner |
| ---------- | ----- |
| Server data (API responses) | TanStack Query |
| Auth session, JWT | Zustand — `userStore` |
| Multi-step form progress | Zustand — `questionnaireStore` |
| Local UI (modal, tab, input) | `useState` |

---

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm lint     # Run ESLint
```
