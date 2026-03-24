# Model Context Protocol (MCP) Usage Guide

## Purpose

This document defines how AI agents should discover, consume, and apply project context using MCP-style resource and tool concepts during code generation.

## Connected Context Sources

### 1) Local Files (Primary Source of Truth)

- Source code under `src/`, test files under `src/test` and `e2e/`.
- Configuration files (`tsconfig.json`, `vite.config.ts`, `eslint.config.js`, `playwright.config.ts`).
- Package and script definitions in `package.json`.

Use local files first for implementation decisions, naming consistency, and dependency boundaries.

### 2) Architecture Context Folder

- `context/architecture.md`: layering and dependency direction.
- `context/modules.md`: module boundaries and ownership.
- `context/workflows.md`: runtime and delivery workflows.
- `context/decisions.md`: architecture decisions and tradeoffs.
- `context/mcp.md`: MCP usage and context handling rules.

Treat this folder as operational architecture policy. Generated code must align unless explicitly overridden by the user.

### 3) Mock API Context

- Mock handlers, fixtures, and contracts used for integration testing (for example MSW handlers and fixture payloads).
- Request/response examples and DTO schemas in feature data layers.

Use mock API context to validate assumptions about payload shape, error states, and edge cases before implementing data access logic.

## Available Tool Categories (MCP-Aligned)

### Resource Access Tools

- Read-only access to structured context artifacts (architecture docs, configs, schemas, fixtures).
- Use for discovery, grounding, and validation before editing code.

### Codebase Inspection Tools

- File search, semantic search, and targeted file reads.
- Use to locate existing patterns and avoid duplicate abstractions.

### Execution and Validation Tools

- Build, lint, unit test, and E2E test commands.
- Use after edits to verify behavioral and quality constraints.

### Editing Tools

- Structured patching and file creation updates.
- Use for minimal, explicit, reviewable changes aligned with module boundaries.

## Context Consumption Strategy for Code Generation

Follow this order:

1. **Read architecture constraints first** (`context/*.md`).
2. **Inspect feature-local code** (UI, logic, data, model) for current patterns.
3. **Check contracts and mock API payloads** before changing repository/API logic.
4. **Implement in the correct layer** (no direct UI -> data coupling).
5. **Validate with lint/tests/build** and adjust only within intended scope.

## Separation Rules During Generation

- UI layer: rendering and interaction wiring only.
- Logic layer: orchestration, feature state, intent handlers.
- Data layer: API transport, validation, mapping, repositories.
- Infrastructure layer: shared technical adapters (HTTP, auth storage, interceptors).

Never bypass layers unless the user explicitly requests an exception.

## Context Precedence and Conflict Handling

When sources conflict, use this precedence:

1. Direct user request
2. Existing code contracts and runtime behavior
3. `context/decisions.md`
4. Other `context/*.md` guidance
5. General framework conventions

If ambiguity remains, choose the smallest safe change that preserves existing contracts.

## Quality Gates

Before finalizing generated code:

- Pass lint and type checks.
- Keep imports and dependencies within approved module boundaries.
- Add/adjust unit or integration tests for changed logic.
- Ensure mocks/fixtures remain consistent with updated contracts.

## MCP-Oriented Working Principles

- Prefer explicit context retrieval over assumptions.
- Keep tool usage deterministic and auditable.
- Minimize hidden coupling by coding against interfaces/contracts.
- Preserve traceability: decisions in docs, behavior in tests, contracts in types/schemas.
