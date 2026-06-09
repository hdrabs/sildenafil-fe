# 01 — Project Structure

This file defines the project skeleton. Use it when initialising the project, adding a route group, or wiring up a new global provider.

---

## Tech Stack

| Concern       | Library                          | Version      |
| ------------- | -------------------------------- | ------------ |
| Framework     | Next.js (App Router)             | 15.x         |
| Language      | TypeScript                       | 5.x (strict) |
| UI            | React                            | 19.x         |
| Server state  | TanStack Query                   | 5.x          |
| Client state  | Zustand                          | 5.x          |
| Forms         | react-hook-form + zod            | latest       |
| Styling       | Tailwind CSS                     | 4.x          |
| Animations    | Motion                           | 12.x         |
| Notifications | react-toastify                   | 11.x         |
| Dates         | dayjs                            | 1.x          |
| Payments      | Authorise.net                    | latest       |
| Icons         | react-icons                      | 5.x          |
| HTTP          | Native fetch via baseAPI wrapper | —            |

**Package manager: pnpm** — always use `pnpm`, never `npm`, `yarn`, or `npx`. Install via `npm install -g pnpm` once, then use `pnpm install`, `pnpm add <pkg>`, `pnpm dev`, etc.

---

## Folder Structure

```
/
├── middleware.ts                     # (reserved, not used for auth — see Auth section)
├── next.config.ts                    # Image domains, headers, env
├── tailwind.config.ts                # Not needed — config lives in globals.css @theme
├── postcss.config.mjs
├── tsconfig.json                     # strict: true, path alias @/* → src/*
│
└── src/
    ├── app/
    │   ├── layout.tsx                # Root layout: fonts, QueryProvider, ToastContainer
    │   ├── globals.css               # Tailwind @import + @theme design tokens
    │   │
    │   ├── (marketing)/              # Public marketing pages — no auth required
    │   │   ├── layout.tsx            # Marketing layout: top nav + footer
    │   │   ├── page.tsx              # Homepage / hero
    │   │   ├── about/page.tsx
    │   │   ├── pricing/page.tsx
    │   │   ├── how-it-works/page.tsx
    │   │   ├── contact/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   └── terms/page.tsx
    │   │
    │   ├── (auth)/                   # Login / signup — redirect to dashboard if authed
    │   │   ├── layout.tsx            # Minimal centered layout with AuthGuard (redirect if authed)
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   ├── forgot-password/page.tsx
    │   │   └── reset-password/page.tsx
    │   │
    │   └── (patient)/                # Protected patient portal
    │       ├── layout.tsx            # AuthGuard (requireAuth) + Sidebar nav
    │       ├── dashboard/page.tsx
    │       ├── appointments/
    │       │   ├── page.tsx
    │       │   └── [id]/page.tsx
    │       ├── medicines/
    │       │   ├── page.tsx
    │       │   └── [id]/page.tsx
    │       ├── questionnaire/
    │       │   └── [id]/page.tsx     # External or internal multi-step flow
    │       ├── payments/
    │       │   ├── page.tsx          # Payment history
    │       │   └── checkout/page.tsx
    │       ├── prescriptions/
    │       │   ├── page.tsx
    │       │   └── [id]/page.tsx
    │       ├── profile/page.tsx
    │       └── settings/page.tsx
    │
    ├── api/                          # Entire data layer — never imported directly by components
    │   ├── baseAPI.ts                # Fetch wrapper, APIError class, auth header injection
    │   ├── services/                 # Raw API call functions — one file per domain
    │   │   ├── authService.ts
    │   │   ├── userService.ts
    │   │   ├── appointmentService.ts
    │   │   ├── medicineService.ts
    │   │   ├── questionnaireService.ts
    │   │   ├── paymentService.ts
    │   │   └── prescriptionService.ts
    │   └── hooks/                    # TanStack Query hooks — one file per domain
    │       ├── useAuthQueries.ts
    │       ├── useUserQueries.ts
    │       ├── useAppointmentQueries.ts
    │       ├── useMedicineQueries.ts
    │       ├── useQuestionnaireQueries.ts
    │       ├── usePaymentQueries.ts
    │       └── usePrescriptionQueries.ts
    │
    ├── components/                   # Shared components used across 2+ features
    │   ├── ui/                       # Primitives: Button, Input, Modal, Badge, Spinner, etc.
    │   ├── ErrorBoundary.tsx
    │   ├── PageLoader.tsx
    │   ├── Skeleton.tsx
    │   ├── AuthGuard.tsx
    │   └── Navbar/                   # Shared nav (marketing or patient sidebar)
    │
    ├── features/                     # Self-contained feature modules (see 02-MODULES.md)
    │   ├── auth/
    │   ├── appointments/
    │   ├── medicines/
    │   ├── questionnaire/
    │   ├── payments/
    │   └── prescriptions/
    │
    ├── hooks/                        # Shared custom hooks (non-query, non-feature-specific)
    │   ├── useDebounce.ts
    │   ├── useInfiniteScroll.ts
    │   └── useMediaQuery.ts
    │
    ├── store/                        # Zustand stores — client-only state
    │   ├── userStore.ts              # Auth session, JWT, hydration flag
    │   ├── questionnaireStore.ts     # Multi-step questionnaire progress
    │   └── index.ts                  # Selector hooks only (useUser, useIsAuthenticated, etc.)
    │
    ├── types/                        # All domain interfaces and shared types
    │   ├── user.ts
    │   ├── appointment.ts
    │   ├── medicine.ts
    │   ├── questionnaire.ts
    │   ├── payment.ts
    │   ├── prescription.ts
    │   └── api.ts                    # APIError shape, PaginatedResponse<T>, ApiResponse<T>
    │
    ├── lib/                          # Pure utility functions — no React, no side effects
    │   ├── utils.ts                  # General helpers
    │   ├── formatters.ts             # Date, currency, phone number formatting
    │   └── schemas/                  # Shared zod schemas
    │       ├── authSchema.ts
    │       └── profileSchema.ts
    │
    ├── constants/                    # Static values — no logic
    │   ├── routes.ts                 # Route path strings + helper functions
    │   ├── queryKeys.ts              # All TanStack Query key factories in one place
    │   └── config.ts                 # App-level config (pagination limits, timeouts, etc.)
    │
    └── providers/
        └── QueryProvider.tsx         # TanStack QueryClient setup + DevTools
```

---

## Route Groups

### `(marketing)`

- No authentication required.
- Layout includes a public top navigation bar and a footer.
- Pages are statically rendered where possible.

### `(auth)`

- No authentication required, but `AuthGuard` with `requireAuth=false` redirects already-authenticated users away to `/dashboard`.
- Minimal layout — centered card, no navigation.

### `(patient)`

- Requires authentication. `AuthGuard` with `requireAuth=true` redirects unauthenticated users to `/login?redirectTo=<current-path>`.
- Layout includes the patient sidebar navigation.
- All pages are client-rendered — they depend on user session data.

---

## Root Layout (`src/app/layout.tsx`)

The root layout is responsible for exactly three things and nothing else:

1. Load and apply Google Fonts (CSS variables injected via `next/font`).
2. Wrap the tree in `QueryProvider`.
3. Render `<ToastContainer>` for global notifications.

```tsx
import { Poppins } from "next/font/google"
import { QueryProvider } from "@/providers/QueryProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={poppins.variable}>
      <QueryProvider>
        {children}
        <ToastContainer position="top-right" theme="dark" />
      </QueryProvider>
    </body>
  </html>
)
```

---

## QueryProvider (`src/providers/QueryProvider.tsx`)

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error: unknown) => {
              const status = (error as { status?: number })?.status;
              if (status && status >= 400 && status < 500 && status !== 401)
                return false;
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              const status = (error as { status?: number })?.status;
              if (status && status >= 400 && status < 500) return false;
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

---

## Auth Store (`src/store/userStore.ts`)

The user store persists the JWT and user profile to `localStorage`. It also tracks a `hasHydrated` flag that is checked by `AuthGuard` before rendering any protected content — this prevents a flash of the login page on refresh.

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (v: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,
      setUser: (user) => set({ user, isLoading: false }),
      updateUser: (updates) =>
        set((s) => (s.user ? { user: { ...s.user, ...updates } } : s)),
      clearUser: () => set({ user: null, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "telehealth-user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
```

`src/store/index.ts` exports selector hooks only — no store re-exports:

```ts
import { useUserStore } from "./userStore";

export const useUser = () => useUserStore((s) => s.user);
export const useIsAuthenticated = () => useUserStore((s) => !!s.user?.token);
export const useHasHydrated = () => useUserStore((s) => s.hasHydrated);
export const useSetUser = () => useUserStore((s) => s.setUser);
export const useUpdateUser = () => useUserStore((s) => s.updateUser);
export const useClearUser = () => useUserStore((s) => s.clearUser);
export const useAuthState = () =>
  useUserStore((s) => ({
    user: s.user,
    isAuthenticated: !!s.user?.token,
    hasHydrated: s.hasHydrated,
    isLoading: s.isLoading,
  }));
```

---

## AuthGuard (`src/components/AuthGuard.tsx`)

Wrap every protected layout with `<AuthGuard requireAuth>` and every auth layout with `<AuthGuard requireAuth={false}>`.

- Waits for `hasHydrated` before making any redirect decision — prevents flicker on page load.
- Handles manual logout detection (user was authenticated, now is not).
- Passes a `redirectTo` query param so the user returns to their intended page after login.

---

## Design Tokens (`src/app/globals.css`)

All colour, typography, and spacing tokens are defined as CSS variables under `@theme inline` inside `globals.css`. Tailwind 4 picks them up automatically — no `tailwind.config.ts` needed.

```css
@import "tailwindcss";

@theme inline {
  /* Brand */
  --color-primary: #0ea5e9; /* Sky blue — primary CTA */
  --color-primary-hover: #0284c7;

  /* Backgrounds */
  --color-bg-main: #f8fafc;
  --color-bg-sidebar: #0f172a;
  --color-bg-card: #ffffff;
  --color-bg-input: #f1f5f9;

  /* Borders */
  --color-border-default: #e2e8f0;
  --color-border-input: #cbd5e1;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-muted: #64748b;
  --color-text-link: #0ea5e9;
  --color-text-error: #ef4444;

  /* Status */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Fonts */
  --font-sans: var(--font-poppins);
}
```

---

## Environment Variables

```
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api   # Rails API base URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Only `NEXT_PUBLIC_` prefixed variables are available in the browser. Server-only secrets go in `.env.local` without the prefix and are used in API routes or server components only.

---

## tsconfig.json (required settings)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
