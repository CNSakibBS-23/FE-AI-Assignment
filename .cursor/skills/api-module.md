---
name: api-module
description: Create or update feature API/data modules using repository interfaces, DTO validation, and mapping to domain models. Use when adding endpoints or changing backend contracts.
---

# API Module

## Purpose

Implement robust feature data access that isolates transport concerns and exposes stable, typed domain contracts to the logic layer.

## Rules

1. Read `context/architecture.md`, `context/modules.md`, and `context/decisions.md` first.
2. Keep data code inside `features/<feature>/data`:
   - `api/` for endpoint calls
   - `repositories/` for data access contracts and implementations
   - `mappers/` for DTO-to-domain conversion
   - `contracts/` for DTO schemas/types
3. Logic must depend on repository interfaces, not concrete HTTP clients.
4. Validate DTO payloads at the data boundary before mapping.
5. Return domain models (not raw DTOs) to logic/UI layers.
6. Centralize error adaptation into typed app errors.
7. Avoid React imports and UI concerns in data-layer files.
8. Add tests for contract validation, mapping, and repository behavior.

## Output Expectations

- Produce a complete data slice for the feature change:
  - repository interface
  - repository implementation
  - API client calls
  - DTO contract/type updates
  - mapper updates
- Include tests for:
  - valid payload mapping
  - invalid payload handling
  - error translation/retry behavior where applicable
- Confirm no layer violations and that feature public exports remain clear and minimal.
