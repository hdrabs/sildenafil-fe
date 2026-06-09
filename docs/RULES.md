# Project Rules — Telehealth Frontend

This is the master rules file. Read this first. Every rule here is a hard constraint, not a suggestion.
The 3 numbered files below cover the full system. Load whichever is relevant to the task at hand.

---

## File Index

| File                                 | When to load                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| [01-STRUCTURE.md](./01-STRUCTURE.md) | Setting up the project, adding a new route group, configuring providers or middleware |
| [02-MODULES.md](./02-MODULES.md)     | Scaffolding a new feature, adding a page, building a new domain                       |
| [03-STANDARDS.md](./03-STANDARDS.md) | Writing any code — components, hooks, services, stores, forms, styles                 |

---

## Non-Negotiables

These apply everywhere in the codebase, no exceptions.

### API Call Chain — The Most Important Rule

**Components and pages NEVER call services directly.**

The call chain is always and only:

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

- If a TanStack hook does not exist for the operation you need, **create it before writing the component**. Never skip this step.
- Queries (read operations) use `useQuery` or `useInfiniteQuery`.
- Mutations (create / update / delete) use `useMutation`.
- Never call `.mutate()` directly inside a component's JSX or handlers. Wrap mutation hooks in a feature-level custom hook that exposes a clean `{ submit, isLoading, error }` interface.
- Never import a service file into a component or page. Components only import from hooks.

### State Ownership

- **Server state** (anything that comes from the API): TanStack Query owns it. Do not duplicate it into Zustand.
- **Client-only state** (auth session, multi-step form progress, UI preferences not tied to the server): Zustand owns it.
- **Local UI state** (open/closed modal, controlled input value, tab selection): `useState` inside the component.

### TypeScript

- Strict mode is on. `any` is not allowed — use `unknown` and narrow, or define the correct type.
- All domain interfaces and types live in `src/types/`. Never define an interface inside a service file or hook file.
- Path alias `@/*` maps to `src/*`. Use it everywhere — no relative `../../` imports.

### Code Style

- Always `const` arrow functions. Never the `function` keyword for components or utilities.
- No barrel `index.ts` files that re-export everything from a directory. Import directly from the source file.
- No comments that describe what the code does. Only add a comment when the WHY is non-obvious (a workaround, a hidden constraint, a subtle invariant).
- No `console.log` left in committed code.

### Forms

- All forms use `react-hook-form` + `zod`. No raw `useState` per field.
- Zod schemas live in `src/lib/schemas/` (shared) or `src/features/<name>/schemas/` (feature-local).

### Auth

- Auth is enforced client-side via `AuthGuard`. JWT comes from the Rails API response and is stored in Zustand with localStorage persistence.
- The `AuthGuard` component wraps protected layouts and handles hydration timing before rendering children.

### Styling

- Tailwind utility classes only. No inline `style={{}}` props except for truly dynamic values (e.g. calculated pixel widths).
- Design tokens are CSS variables defined in `globals.css` under `@theme`. Never hardcode hex values in components.

### Performance

- Memoize with `React.memo` only when a component receives stable props but sits inside a frequently re-rendering parent.
- `useCallback` and `useMemo` only when there is a measurable reason — not by default.
- Every `useEffect` dependency array must be complete and correct. No suppressed lint warnings hiding stale closure bugs.

### Git

- Never run or suggest `git commit` commands. The developer handles all commits.
