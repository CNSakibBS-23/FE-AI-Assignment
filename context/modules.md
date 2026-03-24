# Modules

> **Scope:** This map includes **roadmap** modules. Only **`search`** and **`email`** are implemented under `src/features` in this assignment; see [`scope.md`](./scope.md).

## Module Map

Primary feature modules:

- `auth`: login/session lifecycle and route protection.
- `search`: query input, filters, suggestions, ranking, and result list orchestration.
- `email`: message/thread details and email actions.
- `labels`: label retrieval/management and filter integration.
- `insights`: search quality and assistant-like recommendation panels.

## Email Module

- **EmailList** — List container, empty state, and wiring for filtered rows.
- **EmailItem** — Single row: subject, sender, preview, and flag button.
- **Email API** — Data access via `getEmails` and mock inbox payloads (`email/data`).
- **Filtering logic** — `useEmails` applies the search string to subject, sender, and body.
- **Flagging system** — Per-message flag state in `useEmails` (toggle and list updates).

## Internal Module Structure

Each feature follows:

```text
features/<feature>/
  ui/         # pages and presentational components
  logic/      # hooks, selectors, orchestration services, local state
  data/       # api clients, repositories, mappers, DTO contracts
  model/      # domain types and runtime schemas
  test/       # unit + integration tests for this feature
  index.ts    # public exports only
```

## Cross-Module Rules

- Import other feature modules only through `features/<feature>/index.ts`.
- Avoid deep imports into another feature's internals.
- Share generic assets via `shared/*`; share technical adapters via `infrastructure/*`.

## Ownership and Change Isolation

- Teams can own modules independently with minimal merge conflicts.
- Most changes stay local to a feature unless shared contracts change.
- Breaking contract updates require versioned migration notes in PRs.
