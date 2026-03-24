# Modules

## Module Map

Primary feature modules:

- `auth`: login/session lifecycle and route protection.
- `search`: query input, filters, suggestions, ranking, and result list orchestration.
- `email`: message/thread details and email actions.
- `labels`: label retrieval/management and filter integration.
- `insights`: search quality and assistant-like recommendation panels.

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
