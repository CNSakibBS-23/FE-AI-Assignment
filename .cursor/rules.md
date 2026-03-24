# Development Rules (Strict)

These rules are mandatory for all code generation and edits in this repository.

## 1) Context-First Development

- Always read and align with files in `context/` before implementing changes.
- Treat `context/architecture.md`, `context/modules.md`, `context/workflows.md`, and `context/decisions.md` as project constraints.
- If code and context conflict, prefer explicit user instruction first, then update code in the smallest safe way.

## 2) Modular Architecture Compliance

- Follow feature-based structure under `src/features/<feature>/`.
- Keep strict layer boundaries:
  - `ui` for rendering and interaction wiring.
  - `logic` for orchestration, state transitions, and use-case behavior.
  - `data` for API/repository/mapping and external contracts.
  - `model` for domain types and schema validation.
- Do not bypass layers (`ui` must not call HTTP/data directly).
- Do not deep-import from other feature internals; import via public `index.ts` only.

## 3) TDD Workflow (Required)

- Write or update tests before or alongside implementation.
- Minimum expectation for behavior changes:
  - unit tests for logic/services/selectors/mappers
  - integration tests for feature flows with mocked network where applicable
- Add or update E2E tests for critical user workflows impacted by the change.
- Do not mark work complete without passing relevant tests.

## 4) Use Skills When Applicable

- If a request matches an available skill, use that skill workflow first.
- Follow skill instructions strictly (format, scope questions, and output requirements).
- Do not bypass a relevant skill due to convenience.

## 5) Clean, Typed, and Maintainable Code

- Prefer TypeScript-first implementations with explicit types at module boundaries.
- Avoid `any`; use narrow types, discriminated unions, and validated contracts.
- Keep functions focused, small, and side-effect aware.
- Extract reusable logic into hooks/services rather than bloated components.
- Keep naming consistent with existing feature language and domain terms.
- Remove dead code, unused imports, and temporary debug statements.

## 6) Quality Gates Before Completion

- `npm run lint`
- `npm run test`
- `npm run build`
- For impacted end-to-end flows: `npm run test:e2e`

Any unresolved failure must be explicitly called out with cause and mitigation.
