# Frontend Architecture

> **Scope:** What ships in this repo is summarized in [`scope.md`](./scope.md) (feature set and intentional differences from full ADRs).

## Overview

This frontend uses a feature-based modular architecture with strict layering:

- `UI` layer renders and captures user intent.
- `Logic` layer orchestrates feature behavior and state transitions.
- `Data` layer handles API calls, DTO validation, mapping, and persistence concerns.

Each feature is isolated under `src/features/<feature>` and exposes a public API through `index.ts`.

## Layers and Boundaries

- UI components do not call HTTP clients directly.
- Logic hooks/services depend on repository interfaces, not concrete transport.
- Data layer has no React imports and returns domain models.
- Shared code is split into `shared` (reusable app utilities/UI) and `infrastructure` (technical adapters).

Dependency direction:

`UI -> Logic -> Data -> Infrastructure`

No reverse imports are allowed.

## State Strategy

- Server state: managed via TanStack Query.
- Feature UI state: local store/hooks inside each feature module.
- App-level cross-cutting state: minimal and explicit (session/theme/routing context only).

## Scalability Principles

- Add new business capabilities as new feature modules, not shared dumping grounds.
- Keep module internals private; expose only stable contracts from module entrypoints.
- Prefer pure services/selectors for business logic to maximize testability and reuse.
- Validate external payloads at the data boundary before they enter domain logic.
