# Project experience — FE AI Assignment

This document captures a retrospective on building the **inbox search** assignment: what delivered value, what fell short, where friction showed up, what we took away, and what we would do next.

---

## What worked

### Feature-first structure

Organizing code under `src/features/search` and `src/features/email` with **UI → logic → data** folders made responsibilities obvious. New behavior could be found quickly (e.g. debouncing and fetch orchestration in `useSearchSuggestions`, filtering in `useEmails`), and tests could live beside the code they protect (`*.test.ts`, `*.test.tsx`).

### Hooks as the “logic layer”

Centralizing behavior in hooks (`useSearchExperience`, `useSearchSuggestions`, `useSearchHistory`, `useEmails`) kept components mostly declarative. The suggestions hook’s **reducer + debounced effect** gave a clear state machine for loading, empty query, success, and error without a tangle of boolean flags.

### Testing stack

- **Vitest + Testing Library + jsdom** gave fast feedback for pure functions (e.g. `highlightText`, `searchHistory` helpers), hooks, and composed UI.
- **Playwright** validated real user flows: debounced suggestions, suggestion selection, search filtering, and keyboard behavior against the running app. Pointing Playwright at a **dev server** with a fixed host/port kept setup reproducible.

### TypeScript and tooling

Strict typing around **domain types** (`Email`, `SearchSuggestion`) and explicit hook return types caught mistakes early. **ESLint** (flat config) and **Prettier** reduced style debates and kept diffs reviewable.

### User-facing quality

- **Accessible search UI**: roles such as `searchbox`, `listbox`, and `option` made automated and screen-reader-friendly behavior a first-class concern.
- **Persisted search history** via `localStorage` (with a capped list and safe parsing) improved repeat visits without backend work.
- **Mocked email data** allowed end-to-end flows without standing up an API.

### Infrastructure for HTTP mocking

MSW handlers and tests under `src/infrastructure/msw` showed how network boundaries could be exercised in isolation, which scales if the app moves from mocks to real HTTP.

---

## What didn’t

### Documentation ahead of the codebase

Some **context** documents describe a broader system than what ships today: for example, a full module map (auth, labels, insights) and flows like “email detail” and repository-heavy wiring. In the repo, **only `search` and `email`** are implemented under `src/features`, and the inbox is list-centric rather than a full thread/detail app.

Similarly, **architecture notes** mention **TanStack Query** for server state, but the current app uses **React state + `useEffect`** for loading emails and suggestion fetches. That is a valid choice for a small assignment; the mismatch is documentation accuracy, not necessarily the implementation.

### “Repository interfaces everywhere” vs. pragmatic data access

The stated ADR favors repository contracts for all data access. The implemented path uses **direct feature data modules** (`getEmails`, `getSearchSuggestions`) with tests—clean, but not the full indirection described in `context/decisions.md`. The gap is mostly **ceremony vs. assignment scope**.

### E2E dependency on environment

Playwright assumes browsers are installed and can start (or reuse) the dev server. First-time contributors who skip `npx playwright install` hit failures that unit tests do not surface—a **setup step**, not a flaw, but worth calling out in onboarding.

---

## Challenges

### Coordinating debounce, loading, and empty states

Suggestions must not flash stale results, must clear when the query is empty, and must show “no results” only when the debounced fetch finished with an empty list. Getting **ordering and cancellation** right (or at least harmless when the user types quickly) required careful attention in `useSearchSuggestions` and the UI.

### Splitting “query string” vs. “selected contact”

The product wants both **free-text search** and **narrowing by a specific sender** when a suggestion is chosen. Modeling `query`, `selectedSuggestion`, and when to reset selection on keystrokes added subtle state coupling between `SearchBar`, `Suggestions`, and `useSearchExperience`.

### Filtering vs. fetching

Emails load once; filtering is **client-side** against subject, sender, and body. That keeps the UX snappy for mock data but does not exercise server-side search, pagination, or relevance ranking—important if this were productized.

### localStorage robustness

History persistence must handle **quota errors**, disabled storage, or `JSON.parse` failures without breaking the app. The code defensively catches storage errors; testing that path is easy to under-invest in.

### Keeping tests stable

E2E tests that depend on **timing** (debounce) need sensible waits or assertions on visibility rather than fixed sleeps. Flakiness is a recurring risk whenever animations, network, or machine load vary.

---

## Learnings

### Layering pays off even in small apps

Even without every ADR fully applied, **separating UI from data access** made it straightforward to unit test `getSearchSuggestions` / `getEmails` behavior and to swap mock implementations. The direction of dependencies mattered more than perfect abstraction.

### Reducers clarify async UI state

Using a **reducer for suggestion fetch state** avoided impossible combinations (e.g. “loading and showing previous error” without an explicit decision). That pattern scales when more states (retry, stale-while-revalidate) appear.

### Invest in selectors and roles early

Writing tests with **`getByRole`** and stable accessible names reduced brittleness compared to CSS-only selectors and documented intent for accessibility.

### The test pyramid still applies

Unit tests for pure logic and data boundaries are cheap to run and precise. E2E tests are fewer but catch **integration mistakes** (routing, real DOM, keyboard). Leaning too heavily on either extreme would have slowed iteration or missed regressions.

### README and “context” docs need the same versioning discipline as code

When the stack or scope changes, **update architecture and workflow docs** in the same change set. Future readers (including your future self) trust written decisions—drift erodes that trust.

---

## Suggestions

### Short term (assignment polish)

1. **Align `context/` with reality** — Either trim roadmap-only sections or label them “Planned / not implemented” so reviewers map docs to folders without confusion.
2. **Add a minimal CI recipe** — One pipeline running `npm run lint`, `npm run build`, `npm run test`, and optionally `npm run test:e2e` (with Playwright install cached) proves reproducibility.
3. **Document debounce timings** — A single table (debounce ms, history max length) in the README helps QA and E2E authors tune waits.

### Medium term (if this grows into a real product)

1. **Introduce TanStack Query** (or similar) when server state gains **caching, invalidation, and retries**; keep the documented architecture honest about what layer owns what.
2. **Formalize repository interfaces** for email and search when multiple transports (mock, staging API, GraphQL) exist—avoid paying the abstraction cost before then.
3. **Expand MSW** to mirror production API contracts and run **contract tests** or schema validation at the data boundary, as already suggested in ADR-004.

### Testing

1. **Playwright smoke on PR** with shard-friendly parallelism if the suite grows.
2. **Visual regression** only if the UI stabilizes; otherwise prioritize accessibility and behavior assertions.

### Product

1. **Email detail / thread view** when the assignment allows—`context/workflows.md` already sketches the flow; implementation would justify richer `email` module boundaries.
2. **Server-driven search** if datasets grow beyond client-side filtering.

---

## Closing note

The assignment successfully delivers a **cohesive search + inbox experience** with **test coverage and clear module boundaries**. The main follow-up is **honest documentation**: treat context files as part of the deliverable and keep them synchronized with the code, or scope them explicitly as a north-star architecture for future work.
