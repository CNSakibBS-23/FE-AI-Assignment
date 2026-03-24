# Architecture Decisions

## ADR-001: Feature-Based Modular Structure

- **Decision:** Organize by business feature, not by technical type globally.
- **Why:** Improves ownership, discoverability, and parallel development.
- **Consequence:** Some duplication is accepted to preserve module autonomy.

## ADR-002: Strict Layering (UI / Logic / Data)

- **Decision:** Enforce one-way dependency flow: `UI -> Logic -> Data -> Infrastructure`.
- **Why:** Prevents coupling and keeps domain behavior testable.
- **Consequence:** Slightly more boilerplate (interfaces/mappers), better long-term maintainability.

## ADR-003: Repository Interfaces for Data Access

- **Decision:** Logic depends on repository contracts, not HTTP implementations.
- **Why:** Enables fast unit tests with fakes and simpler refactoring of transport details.
- **Consequence:** Requires explicit wiring of implementations in app composition.

## ADR-004: DTO Validation at Boundary

- **Decision:** Validate API payloads in data layer before domain mapping.
- **Why:** Contains backend contract drift and reduces runtime surprises in UI.
- **Consequence:** Additional schema maintenance effort.

## ADR-005: Multi-Layer Testing Strategy

- **Decision:** Combine unit (logic/data), integration (feature + mocked network), and E2E (user flows).
- **Why:** Balances speed, confidence, and production realism.
- **Consequence:** Test pyramid discipline is required to avoid over-reliance on E2E tests.
