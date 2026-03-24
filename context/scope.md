# Repository scope (this assignment)

This file aligns **`context/`** with what is actually implemented under `src/`, so reviewers and tooling are not misled by roadmap-only content elsewhere.

## Implemented in this repo

- **`src/features/search`** — Debounced query, suggestions from inbox data, search history in `localStorage`, keyboard-friendly UI.
- **`src/features/email`** — Mock-backed inbox list, client-side filtering, per-message flagging, highlight helpers.
- **`src/app`**, **`src/infrastructure`** — App shell, MSW wiring for tests/mocks as applicable.

## North-star / not implemented here

The following appear in **`context/modules.md`** or **`context/architecture.md`** as longer-term or product-scale ideas; they are **not** present as feature folders in this submission unless added explicitly later:

- `auth`, `labels`, `insights` modules.
- Full **TanStack Query** usage for server state (the app uses React state and `useEffect` for mock data loading).
- Full **repository-interface** indirection everywhere (logic uses feature `data/` modules such as `getEmails` / `getSearchSuggestions`).

## How to read the rest of `context/`

- **`architecture.md`**, **`decisions.md`**, **`workflows.md`** — Intended patterns and ADRs; use **`scope.md`** (this file) to separate **current code** from **target architecture**.
