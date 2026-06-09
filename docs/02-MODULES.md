# 02 — Module Guide

This file defines how to scaffold and organise any feature module. Read it before creating a new page, feature, or domain.

---

## What Is a Module?

A module is a self-contained vertical slice for one domain of the application. Everything a feature needs — its components, local hooks, and schemas — lives together under `src/features/<name>/`. It is isolated: no feature imports directly from another feature.

---

## Module Folder Structure

Every feature follows this exact layout. Add only what the feature actually needs — do not create empty folders.

```
src/features/<feature-name>/
├── components/             # UI components used only by this feature
│   ├── <Feature>Page.tsx   # Top-level component imported by app/.../page.tsx
│   └── ...
├── hooks/                  # Feature-level hooks (compose API hooks + local logic)
│   └── use<Feature>.ts
└── schemas/                # Zod validation schemas for this feature's forms
    └── <feature>Schema.ts
```

### Real examples

```
src/features/medicines/
├── components/
│   ├── MedicinesPage.tsx
│   ├── MedicineCard.tsx
│   ├── MedicineList.tsx
│   ├── MedicineSearchBar.tsx
│   └── MedicineDetailModal.tsx
├── hooks/
│   └── useMedicineSelection.ts
└── schemas/
    └── medicineSchema.ts

src/features/questionnaire/
├── components/
│   ├── QuestionnairePage.tsx
│   ├── QuestionStep.tsx
│   ├── QuestionnaireProgress.tsx
│   └── QuestionnaireComplete.tsx
├── hooks/
│   └── useQuestionnaireFlow.ts
└── schemas/
    └── questionnaireSchema.ts
```

---

## Where Does Code Live? — Decision Tree

Use this to decide where a new piece of code belongs.

```
Is this a UI component?
│
├─ Is it used in only ONE feature?
│   └─ YES → src/features/<name>/components/
│
├─ Is it used in TWO or more features?
│   └─ YES → src/components/
│
└─ Is it a primitive (Button, Input, Modal, Badge)?
    └─ YES → src/components/ui/

Is this a hook?
│
├─ Does it call a TanStack Query hook and add feature-specific logic?
│   └─ YES → src/features/<name>/hooks/
│
├─ Does it wrap a TanStack Query useQuery or useMutation directly?
│   └─ YES → src/api/hooks/use<Domain>Queries.ts
│
└─ Is it a general utility hook (debounce, scroll, media query)?
    └─ YES → src/hooks/

Is this a type or interface?
│
├─ Is it a domain model (User, Appointment, Medicine)?
│   └─ YES → src/types/<domain>.ts
│
└─ Is it local to one feature (component prop types)?
    └─ YES → define inline at the top of the file that uses it

Is this a form validation schema?
│
├─ Used in only one feature?
│   └─ YES → src/features/<name>/schemas/
│
└─ Used across features (e.g. email format)?
    └─ YES → src/lib/schemas/

Is this a constant or config value?
└─ YES → src/constants/  (routes.ts, queryKeys.ts, or config.ts)
```

---

## Pages Are Thin Shells

Pages in `src/app/` do one thing: import the top-level feature component and pass route params. No data fetching, no logic, no local state in page files.

```tsx
// src/app/(patient)/medicines/page.tsx
import { MedicinesPage } from "@/features/medicines/components/MedicinesPage"

export default const Page = () => <MedicinesPage />
```

```tsx
// src/app/(patient)/medicines/[id]/page.tsx
import { MedicineDetailPage } from "@/features/medicines/components/MedicineDetailPage"

export default const Page = ({ params }: { params: { id: string } }) => (
  <MedicineDetailPage id={params.id} />
)
```

The feature component (`MedicinesPage`, `MedicineDetailPage`) owns all state, query calls, and rendering logic.

---

## Module Creation Checklist

Follow this order every time a new domain is added. Do not skip steps.

```
[ ] 1. Define domain types
        → src/types/<name>.ts
        → Add request/response interfaces, enums, and shared shapes

[ ] 2. Register query keys
        → src/constants/queryKeys.ts
        → Add a key factory object for this domain

[ ] 3. Write the service
        → src/api/services/<name>Service.ts
        → Raw fetch functions only — no React, no hooks, no state

[ ] 4. Write TanStack Query hooks
        → src/api/hooks/use<Name>Queries.ts
        → useQuery hooks for reads, useMutation hooks for writes
        → Import from service, never call service in components directly

[ ] 5. Create the feature folder
        → src/features/<name>/
        → Add components/, hooks/, schemas/ as needed

[ ] 6. Write feature-level hooks (if needed)
        → src/features/<name>/hooks/
        → Compose API hooks with local UI logic

[ ] 7. Build feature components
        → src/features/<name>/components/
        → Top-level component named <Name>Page.tsx

[ ] 8. Register the route
        → src/constants/routes.ts
        → Add the path string

[ ] 9. Add the page file
        → src/app/(patient)/<name>/page.tsx
        → Thin shell only — import feature component, pass params
```

---

## API Layer for a Module — Full Pattern

This is the complete pattern for the API layer of a new module. Follow it exactly.

### Step 1 — Types (`src/types/medicine.ts`)

```ts
export interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  requiresPrescription: boolean;
  inStock: boolean;
}

export interface MedicineSearchParams {
  query?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export interface AddMedicineToCartRequest {
  medicineId: number;
  quantity: number;
}
```

### Step 2 — Query Keys (`src/constants/queryKeys.ts`)

```ts
import { MedicineSearchParams } from "@/types/medicine";

export const medicineKeys = {
  all: ["medicines"] as const,
  list: (params?: MedicineSearchParams) =>
    [...medicineKeys.all, "list", params] as const,
  detail: (id: number) => [...medicineKeys.all, "detail", id] as const,
};
```

### Step 3 — Service (`src/api/services/medicineService.ts`)

```ts
import api from "@/api/baseAPI";
import { Medicine, MedicineSearchParams } from "@/types/medicine";

export const medicineService = {
  list: (params?: MedicineSearchParams): Promise<Medicine[]> =>
    api.get("/v1/medicines", { params }),

  get: (id: number): Promise<Medicine> => api.get(`/v1/medicines/${id}`),

  search: (params: MedicineSearchParams): Promise<Medicine[]> =>
    api.get("/v1/medicines/search", { params }),
};
```

### Step 4 — TanStack Query Hooks (`src/api/hooks/useMedicineQueries.ts`)

```ts
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/api/services/medicineService";
import { medicineKeys } from "@/constants/queryKeys";
import { MedicineSearchParams } from "@/types/medicine";

export const useMedicines = (params?: MedicineSearchParams) =>
  useQuery({
    queryKey: medicineKeys.list(params),
    queryFn: () => medicineService.list(params),
  });

export const useMedicine = (id: number) =>
  useQuery({
    queryKey: medicineKeys.detail(id),
    queryFn: () => medicineService.get(id),
    enabled: !!id,
  });

export const useMedicineSearch = (
  params: MedicineSearchParams,
  enabled = true,
) =>
  useQuery({
    queryKey: medicineKeys.list(params),
    queryFn: () => medicineService.search(params),
    enabled,
  });
```

### Step 5 — Feature Hook (`src/features/medicines/hooks/useMedicineSelection.ts`)

Feature hooks compose API hooks with local logic. This is where you add debouncing, derived state, combined loading flags, and handlers that the component will use.

```ts
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useMedicineSearch } from "@/api/hooks/useMedicineQueries";
import { Medicine } from "@/types/medicine";

export const useMedicineSelection = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Medicine | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data: results = [], isLoading } = useMedicineSearch(
    { query: debouncedQuery },
    debouncedQuery.length > 1,
  );

  const select = (medicine: Medicine) => setSelected(medicine);
  const clear = () => setSelected(null);

  return { query, setQuery, results, isLoading, selected, select, clear };
};
```

### Step 6 — Component (`src/features/medicines/components/MedicinesPage.tsx`)

```tsx
"use client";

import { useMedicineSelection } from "../hooks/useMedicineSelection";
import { MedicineCard } from "./MedicineCard";
import { Input } from "@/components/ui/Input";
import { PageLoader } from "@/components/PageLoader";

export const MedicinesPage = () => {
  const { query, setQuery, results, isLoading } = useMedicineSelection();

  return (
    <div className="p-6">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search medicines..."
      />
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {results.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Multi-Step Flow Modules (Questionnaire, Onboarding)

For modules that have sequential steps (questionnaire, checkout), use a Zustand store for progress state alongside TanStack Query for data.

```
src/store/questionnaireStore.ts     ← step index, answers, completion state
src/api/hooks/useQuestionnaireQueries.ts  ← fetch questions, submit answers
src/features/questionnaire/
├── components/
│   ├── QuestionnairePage.tsx       ← orchestrates steps
│   ├── QuestionStep.tsx            ← single step UI
│   └── QuestionnaireComplete.tsx   ← confirmation screen
└── hooks/
    └── useQuestionnaireFlow.ts     ← composes store + API hooks
```

Rules for multi-step flows:

- Zustand store owns step index, collected answers, and save state.
- TanStack mutation hook owns the final submission.
- The feature hook (`useQuestionnaireFlow`) is the only file that imports from both the store and the API hooks.
- Components only import from the feature hook.
- Persist the store to `localStorage` so back-navigation restores state.

---

## Payments Module

Authorise.net is wired up at the checkout page level only. Never initialise the payment client inside a reusable component.

```
src/features/payments/
├── components/
│   ├── PaymentHistoryPage.tsx
│   ├── CheckoutPage.tsx            ← wraps payment provider
│   ├── CheckoutForm.tsx            ← handles card input and submission
│   └── PaymentCard.tsx
└── hooks/
    └── useCheckout.ts              ← wraps useAuthorizePayment mutation
```

---

## Isolation Rule

Features are islands. The import graph must never go:

```
features/medicines → features/payments    ✗
features/questionnaire → features/auth    ✗
```

If two features need to share something, that something belongs in:

- `src/components/` (UI)
- `src/hooks/` (logic)
- `src/types/` (types)
- `src/constants/` (values)
- `src/lib/` (utilities)

Never in either feature folder.
