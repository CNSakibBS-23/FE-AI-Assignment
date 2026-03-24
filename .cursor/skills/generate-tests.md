---
name: generate-tests
description: Generate or update unit, integration, and E2E tests aligned with the project TDD workflow and modular architecture. Use when adding features, fixing bugs, or refactoring behavior.
---

# Generate Tests

## Purpose

Create high-signal automated tests for changed behavior using the project test pyramid:

- unit tests for pure logic and mappers
- integration tests for feature workflows with mocked network
- E2E tests for critical user journeys

## Rules

1. Always read `context/architecture.md`, `context/workflows.md`, and `context/decisions.md` before writing tests.
2. Follow feature boundaries; place tests under the owning feature module when possible.
3. Prefer TDD: write failing test first, then implementation, then refactor.
4. Test behavior, not implementation details.
5. Mock at boundaries:
   - unit: fake repositories/services
   - integration: MSW/network mocks
   - E2E: real UI flow with Playwright
6. Cover success, empty, error, and retry paths for user-visible workflows.
7. Keep tests deterministic (no real timers/network randomness without control).
8. Do not bypass layers in test setup; preserve `UI -> Logic -> Data`.

## Output Expectations

- Provide only the minimum set of tests needed to protect the changed behavior.
- Include at least:
  - one unit test for logic or mapping changes
  - one integration test for feature-level behavior when relevant
  - one E2E update for critical path changes when relevant
- Ensure commands pass:
  - `npm run test`
  - `npm run test:e2e` (if E2E touched)
- Briefly report what scenarios are covered and what remains intentionally out of scope.
