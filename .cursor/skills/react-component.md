---
name: react-component
description: Build or refactor React components that respect feature-based modular architecture and strict UI/logic/data separation. Use when creating pages, feature components, or shared UI primitives.
---

# React Component

## Purpose

Create maintainable, typed React components that are easy to test and align with the project's modular frontend architecture.

## Rules

1. Read `context/architecture.md` and `context/modules.md` before implementation.
2. Place components in the correct module layer:
   - feature UI in `features/<feature>/ui`
   - shared generic UI in `shared/ui`
3. Keep components presentational where possible; move orchestration into logic hooks/services.
4. Do not call API/data repositories directly from components.
5. Use explicit TypeScript props/types; avoid `any`.
6. Keep components focused and composable; split when responsibilities diverge.
7. Expose intent-based callbacks (`onSearch`, `onRetry`) instead of leaking data concerns.
8. Ensure accessibility basics (labels, roles, keyboard support, semantic structure).
9. Add or update component tests for meaningful behavior and rendering states.

## Output Expectations

- Deliver component code with:
  - typed props/interfaces
  - clear separation of rendering vs logic
  - minimal, readable JSX structure
- Include or update tests validating:
  - key user interactions
  - loading/empty/error states when applicable
- Confirm component import paths respect module boundaries and no deep cross-feature imports are introduced.
