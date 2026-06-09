# 03 — Code Standards

This file defines how every piece of code in the project is written. Read it before writing any component, hook, service, store, form, or style.

---

## API Layer

### The Call Chain — Enforced Without Exception

```
Component / Page
      ↓
TanStack Query Hook  (src/api/hooks/)
      ↓
Service Function  (src/api/services/)
      ↓
baseAPI  (src/api/baseAPI.ts)
      ↓
Rails API
```

- **Components and pages never import from `src/api/services/`**. They only import hooks.
- **Feature hooks never call `api` or `fetch` directly**. They only call TanStack hooks.
- If a hook does not exist for the operation, create it first. Shipping a component that bypasses the hook layer is not acceptable.

### baseAPI (`src/api/baseAPI.ts`)

The base API wrapper reads the JWT from the Zustand store at call time (not at module load time), attaches it as a Bearer token, handles JSON vs FormData serialisation, and throws a typed `APIError` on non-OK responses.

```ts
import { useUserStore } from "@/store/userStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> => {
  const token = useUserStore.getState().user?.token;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  const isJSON = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    throw new APIError(
      (data as { message?: string })?.message ?? "An error occurred",
      response.status,
      data,
    );
  }

  return data;
};

export const api = {
  get: (endpoint: string, options?: RequestInit) =>
    apiRequest(endpoint, { method: "GET", ...options }),
  post: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, {
      method: "POST",
      body: data as BodyInit,
      ...options,
    }),
  put: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, { method: "PUT", body: data as BodyInit, ...options }),
  patch: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest(endpoint, {
      method: "PATCH",
      body: data as BodyInit,
      ...options,
    }),
  delete: (endpoint: string, options?: RequestInit) =>
    apiRequest(endpoint, { method: "DELETE", ...options }),
};

export default api;
```

### Service Files

- One file per domain, in `src/api/services/`.
- Functions are properties of a plain object (not a class).
- Functions are typed: input types come from `src/types/`, return types are explicit.
- No React, no hooks, no state — pure async functions.

```ts
// src/api/services/appointmentService.ts
import api from "@/api/baseAPI";
import {
  Appointment,
  CreateAppointmentRequest,
  AppointmentListParams,
} from "@/types/appointment";

export const appointmentService = {
  list: (params?: AppointmentListParams): Promise<Appointment[]> =>
    api.get("/v1/appointments", { params }) as Promise<Appointment[]>,

  get: (id: number): Promise<Appointment> =>
    api.get(`/v1/appointments/${id}`) as Promise<Appointment>,

  create: (data: CreateAppointmentRequest): Promise<Appointment> =>
    api.post("/v1/appointments", data) as Promise<Appointment>,

  cancel: (id: number): Promise<void> =>
    api.delete(`/v1/appointments/${id}`) as Promise<void>,
};
```

### TanStack Query Hooks

- One file per domain, in `src/api/hooks/`.
- Always define a query key factory object at the top of the file.
- Use `enabled` to prevent queries from firing when required params are missing.
- Mutations use `onMutate` / `onError` / `onSettled` for optimistic updates — never `onSuccess` + `setQueryData` as the primary path.
- After a mutation succeeds, `invalidateQueries` to re-sync with the server.

```ts
// src/api/hooks/useAppointmentQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/api/services/appointmentService";
import { appointmentKeys } from "@/constants/queryKeys";
import { CreateAppointmentRequest } from "@/types/appointment";

export const useAppointments = (params?: AppointmentListParams) =>
  useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentService.list(params),
  });

export const useAppointment = (id: number) =>
  useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentService.get(id),
    enabled: !!id,
  });

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.create(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentService.cancel(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: appointmentKeys.list() });
      const previous = queryClient.getQueryData(appointmentKeys.list());
      queryClient.setQueryData(
        appointmentKeys.list(),
        (old: Appointment[] = []) => old.filter((a) => a.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(appointmentKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};
```

### Wrapping Mutations in Feature Hooks

Components never call `.mutate()` directly. Wrap in a feature hook that exposes a clean interface:

```ts
// src/features/appointments/hooks/useBookAppointment.ts
import { useCreateAppointment } from "@/api/hooks/useAppointmentQueries";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export const useBookAppointment = () => {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateAppointment();

  const book = (data: CreateAppointmentRequest) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Appointment booked successfully");
        router.push(ROUTES.APPOINTMENTS);
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to book appointment");
      },
    });
  };

  return { book, isPending, error };
};
```

---

## TypeScript

- `strict: true` — no exceptions.
- No `any`. Use `unknown` + type narrowing, or define the correct type.
- All domain types live in `src/types/`. Component prop types are defined inline at the top of the component file.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- Use `as const` on query key arrays to preserve literal types.
- Generic response wrappers live in `src/types/api.ts`:

```ts
// src/types/api.ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    perPage: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

---

## Components

### Structure

Every component file follows this order:

1. `"use client"` directive (if needed)
2. Imports (external libraries, then internal — `@/` paths only)
3. Prop interface (inline, above the component)
4. Component function
5. Nothing else — no helper functions, no sub-components defined in the same file unless they are trivially small

### Naming

- Component files: `PascalCase.tsx`
- Component functions: `const ComponentName = ...` — never `export default function`
- Prop interfaces: `interface ComponentNameProps`

### Rules

```tsx
"use client";

import { useState } from "react";
import { Medicine } from "@/types/medicine";

interface MedicineCardProps {
  medicine: Medicine;
  onSelect: (medicine: Medicine) => void;
}

export const MedicineCard = ({ medicine, onSelect }: MedicineCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border-default bg-bg-card p-4">
      <button onClick={() => onSelect(medicine)} className="w-full text-left">
        <h3 className="font-semibold text-text-primary">{medicine.name}</h3>
        <p className="text-text-muted text-sm">{medicine.description}</p>
      </button>
    </div>
  );
};
```

- Named exports only. No default exports from component files.
- Prop types are always explicit — no implicit `any` from untyped `props`.
- No inline `style={{}}` except for calculated pixel values.
- No hardcoded colour strings — use Tailwind classes that reference design tokens.

### Memoisation

Use `React.memo` only when both are true:

1. The component renders frequently (inside a list, or inside a parent that re-renders on user input).
2. Its props are referentially stable (primitives, or objects that are memoised at the call site).

Do not memo by default.

### Loading and Error States

Every component that fetches data must handle three states:

```tsx
export const AppointmentList = () => {
  const { data, isLoading, isError } = useAppointments();

  if (isLoading) return <Skeleton count={3} />;
  if (isError) return <ErrorMessage message="Could not load appointments." />;

  return (
    <ul>
      {data?.map((appt) => (
        <AppointmentRow key={appt.id} appointment={appt} />
      ))}
    </ul>
  );
};
```

Wrap route-level components in `<ErrorBoundary>` to contain crashes to a single section.

---

## State Management — Decision Tree

```
Where does this state live?

Is it data that comes from the server (appointments, medicines, user profile)?
└── TanStack Query — do NOT copy it into Zustand or useState

Is it UI state that only one component needs (modal open, active tab)?
└── useState inside that component

Is it auth state (user object, JWT, hydration flag)?
└── userStore (Zustand, persisted to localStorage)

Is it multi-step form progress that must survive navigation (questionnaire answers)?
└── A dedicated Zustand store (e.g. questionnaireStore), persisted to localStorage

Is it UI state shared across the page but not globally (selected items in a list)?
└── useState lifted to the nearest common parent, or useReducer if complex
```

### Zustand Store Rules

- One store per domain of client state (user, questionnaire, etc.).
- State shape and action signatures are defined via a TypeScript interface.
- `partialize` the persist middleware to exclude transient flags (loading booleans, functions).
- Always track a `hasHydrated` boolean for stores that are persisted — read it before rendering content that depends on the persisted value to prevent hydration flicker.
- Selector hooks are defined in `src/store/index.ts`. Components import selectors, not the raw store.

```ts
// Good — component uses a selector hook
import { useUser } from "@/store";

// Bad — component subscribes to the whole store
import { useUserStore } from "@/store/userStore";
const user = useUserStore((s) => s.user); // ← only acceptable inside store/index.ts
```

---

## Forms

All forms use `react-hook-form` + `zod`. No raw `useState` per field.

### Schema

```ts
// src/features/auth/schemas/loginSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/loginSchema";
import { useLoginUser } from "../hooks/useLoginUser";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const LoginForm = () => {
  const { login, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" loading={isPending}>
        Sign in
      </Button>
    </form>
  );
};
```

### Feature Hook for Form Submission

The form component calls the feature hook. The feature hook calls the mutation hook.

```ts
// src/features/auth/hooks/useLoginUser.ts
import { useLogin } from "@/api/hooks/useAuthQueries";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "../schemas/loginSchema";
import { ROUTES } from "@/constants/routes";

export const useLoginUser = () => {
  const router = useRouter();
  const { mutate, isPending } = useLogin();

  const login = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: () => router.push(ROUTES.DASHBOARD),
      onError: (err) => toast.error(err.message ?? "Login failed"),
    });
  };

  return { login, isPending };
};
```

---

## Performance Rules

### Preventing Render Loops

The most common causes of render loops and how to prevent them:

| Cause                                                         | Prevention                                                  |
| ------------------------------------------------------------- | ----------------------------------------------------------- |
| Object or array literal in JSX prop                           | Move it outside the component or wrap in `useMemo`          |
| Function literal in JSX prop for a memoised child             | Wrap in `useCallback`                                       |
| `useEffect` with a missing or incorrect dependency            | Fix the dependency array — do not suppress the lint warning |
| Zustand selector returning a new object each render           | Select primitive values, or use `useShallow` for objects    |
| React Query `enabled` depending on a value derived mid-render | Derive the value before the hook call                       |

### useEffect Rules

- Every `useEffect` dependency array must include every value from the outer scope that the effect reads.
- Never use an empty `[]` array to run an effect once if the effect reads from props or state — use a ref to track first-run if needed.
- If an effect calls an async function, define the function inside the effect and handle cleanup.

```ts
// Correct — async inside effect with cleanup
useEffect(() => {
  let cancelled = false;

  const load = async () => {
    const result = await someAsyncCall(id);
    if (!cancelled) setData(result);
  };

  load();
  return () => {
    cancelled = true;
  };
}, [id]);
```

### Query Stale Time

Set `staleTime` per query when the data changes infrequently — this prevents unnecessary refetches on focus/mount:

```ts
export const useMedications = () =>
  useQuery({
    queryKey: medicineKeys.all,
    queryFn: medicineService.list,
    staleTime: 10 * 60 * 1000, // medications catalogue changes rarely
  });
```

---

## Error Handling

### Component Level

Use `isError` from TanStack Query and render a meaningful error message. Never silently swallow errors.

```tsx
if (isError)
  return (
    <ErrorMessage message="Could not load your appointments." retry={refetch} />
  );
```

### Mutation Errors

Show errors with `toast.error()` in the feature hook, not in the component. The component only calls the hook function.

### Error Boundaries

Wrap each route-level feature component in an `<ErrorBoundary>`:

```tsx
// src/app/(patient)/appointments/page.tsx
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { AppointmentsPage } from "@/features/appointments/components/AppointmentsPage"

export default const Page = () => (
  <ErrorBoundary>
    <AppointmentsPage />
  </ErrorBoundary>
)
```

---

## Styling

- Tailwind utility classes only.
- Colours always reference design token classes (`bg-bg-card`, `text-text-muted`, `border-border-default`) — never arbitrary values like `bg-[#141414]`.
- Layout classes (`flex`, `grid`, `gap-*`, `p-*`) are fine as-is.
- `cn()` utility (from `clsx` + `tailwind-merge`) for conditional class merging:

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```tsx
<div className={cn("rounded-lg p-4", isActive && "border-2 border-primary")} />
```

---

## Constants

### Routes (`src/constants/routes.ts`)

```ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  APPOINTMENTS: "/appointments",
  MEDICINES: "/medicines",
  QUESTIONNAIRE: (id: string) => `/questionnaire/${id}`,
  PAYMENTS: "/payments",
  CHECKOUT: "/payments/checkout",
  PRESCRIPTIONS: "/prescriptions",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;
```

### Query Keys (`src/constants/queryKeys.ts`)

All TanStack Query key factories in one file so cache invalidation is consistent across the project.

```ts
export const userKeys = {
  all: ["users"] as const,
  profile: (id: string) => [...userKeys.all, "profile", id] as const,
  current: () => [...userKeys.all, "current"] as const,
};

export const appointmentKeys = {
  all: ["appointments"] as const,
  list: (params?: unknown) => [...appointmentKeys.all, "list", params] as const,
  detail: (id: number) => [...appointmentKeys.all, "detail", id] as const,
};

export const medicineKeys = {
  all: ["medicines"] as const,
  list: (params?: unknown) => [...medicineKeys.all, "list", params] as const,
  detail: (id: number) => [...medicineKeys.all, "detail", id] as const,
};

export const questionnaireKeys = {
  all: ["questionnaires"] as const,
  detail: (id: string) => [...questionnaireKeys.all, "detail", id] as const,
};

export const paymentKeys = {
  all: ["payments"] as const,
  list: () => [...paymentKeys.all, "list"] as const,
  intent: () => [...paymentKeys.all, "intent"] as const,
};

export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  list: () => [...prescriptionKeys.all, "list"] as const,
  detail: (id: number) => [...prescriptionKeys.all, "detail", id] as const,
};
```

---

## What Not To Do

| Do not                                                 | Do instead                               |
| ------------------------------------------------------ | ---------------------------------------- |
| Import a service in a component                        | Import a TanStack hook                   |
| Call `.mutate()` in a component handler                | Wrap in a feature hook, call the wrapper |
| Store server data in Zustand                           | Let TanStack Query own it                |
| Define types inside service or hook files              | Define in `src/types/`                   |
| Create an `index.ts` that re-exports a directory       | Import from the source file directly     |
| Use `any`                                              | Use `unknown` or define the correct type |
| Use the `function` keyword                             | Use `const` arrow functions              |
| Write `useEffect` with a suppressed dependency warning | Fix the dependency array                 |
| Hardcode hex colours in components                     | Use Tailwind token classes               |
| Use raw `useState` for form fields                     | Use `react-hook-form` + `zod`            |
| Use `console.log` in committed code                    | Remove before committing                 |
| Add comments describing what code does                 | Remove them; only keep WHY comments      |
