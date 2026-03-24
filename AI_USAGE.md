# AI usage — Cursor on this project

This document describes how **Cursor** (AI-assisted editing and agents) was used while building the FE AI Assignment, including prompt habits, project-specific **rules**, **skills**, **MCP**, and **context** files, plus practical observations.

---

## How Cursor was used

### Day-to-day workflow

- **Chat / Composer** for scoped tasks: new components, hook behavior, tests, README and docs, refactors within a feature module.
- **@ mentions and file context** so the model saw the right surface area—e.g. `@context/architecture.md`, `@src/features/search`, or a specific test file—instead of relying on the open editor tab alone.
- **Terminal integration** where appropriate: running `npm run test`, `npm run lint`, `npm run build`, and Playwright, so failures were fixed in the same session rather than described secondhand.
- **Iterative passes** rather than one giant prompt: implement → run tests → fix → narrow the next request to the failing file or assertion.

### Alignment with repository rules

The project defines mandatory behavior in **`.cursor/rules.md`**. In practice, Cursor was steered to:

1. Read **`context/`** before implementing (architecture, modules, workflows, decisions).
2. Respect **feature folders** and **UI → logic → data** boundaries under `src/features/<feature>/`.
3. Follow **TDD expectations**: unit/integration tests with behavior changes; E2E when user flows change.
4. Run **quality gates** (`lint`, `test`, `build`, and E2E when relevant) before treating work as done.

Those rules turned Cursor from a generic code generator into something closer to a **project-aware contributor**—provided the user actually attached or referenced the rules and context in the conversation.

---

## Prompt strategy

### Constraints first

Effective prompts named **non-negotiables** up front:

- Which **feature** (`search`, `email`) and **layer** (`ui`, `logic`, `data`).
- **Out of scope** (e.g. “do not add new dependencies”, “do not change public `index.ts` exports unless necessary”).
- **Definition of done** (tests passing, specific commands run).

This reduced churn from suggestions that violated layering or invented new global patterns.

### Small, verifiable steps

Large requests (“build the whole search feature”) were split into:

- Data contract + tests → hook + tests → UI + tests → E2E for the critical path.

Each step had a **checkable outcome** (a failing test turning green, or a single Playwright scenario).

### Pointing at truth sources

When documentation and code disagreed, prompts explicitly said **which source wins** (e.g. “follow `context/decisions.md`” vs. “match existing `getEmails` pattern in repo”). That avoided the model “fixing” code to match aspirational docs—or the reverse—without a decision.

### Review-friendly output

Asking for **minimal diffs**, **no drive-by refactors**, and **matching existing naming and imports** (also reflected in user-level preferences) kept PRs reviewable and consistent with human-written code.

---

## Skills

The repo ships **Cursor skills** under `.cursor/skills/`:

| Skill             | Role |
| ----------------- | ---- |
| **`react-component`** | React UI in the right layer, typed props, accessibility, tests; defers orchestration to hooks. |
| **`generate-tests`**  | Test pyramid: unit vs integration (MSW) vs Playwright; behavior-focused, deterministic tests. |
| **`api-module`**      | Data layer: repositories, DTO validation, mapping to domain types, tests at boundaries. |

**How they were used**

- When a task clearly matched a skill (e.g. “add tests for the search bar”), the relevant skill was treated as the **workflow spec**: read `context/` first, place files correctly, cover states, run npm scripts.
- Skills reduced repeated system-prompting: the same architectural expectations did not need to be retyped every session.

**Limitation**

Skills describe an **ideal** data layer (repositories everywhere). The current codebase sometimes uses simpler `data/*.ts` helpers for the assignment scope. Human judgment was still needed to decide whether to fully apply the `api-module` skill or stay pragmatic.

---

## MCP (Model Context Protocol)

Cursor can connect to **MCP servers** for extra tools (browser automation, Git integrations, etc.). For this project:

- **Browser MCP** (when enabled) supports **manual verification** of the inbox search UI: navigation, snapshots, and interaction flows complementary to Playwright—useful for exploratory checks or debugging flaky E2E.
- **Other MCP integrations** depend on the developer’s local Cursor setup; they were **optional**, not required to build or test the app (`npm` scripts remain the source of truth).

**Principle**

MCP augments **human or scripted** verification; it did not replace `npm run test` / `npm run test:e2e` as the repeatable quality gate.

---

## Context folder (`context/`)

The **`context/`** directory is the project’s **written contract** for humans and AI:

- **`architecture.md`** — Layers and dependency direction.
- **`modules.md`** — Module map and feature ownership.
- **`workflows.md`** — User and technical flows (search, errors, testing in CI).
- **`decisions.md`** — ADRs (feature structure, layering, testing strategy, etc.).

**How it was used with Cursor**

- Referenced at the start of feature work so generated code **defaulted** to the same boundaries as hand-written code.
- When the implementation intentionally stayed smaller than the full ADR (e.g. no TanStack Query yet), **explicit prompts** prevented the model from over-building—or the docs needed updating afterward (see `EXPERIENCE.md`).

---

## Observations

### What helped

- **Rules + context + skills** formed a **consistent instruction stack**: global rules in `.cursor/rules.md`, narrative constraints in `context/`, task-specific playbooks in `.cursor/skills/`.
- **Tests as executable specs** gave Cursor a clear success signal and reduced ambiguous “done”.
- **TypeScript and ESLint** caught mistakes that natural-language prompts missed.

### What to watch for

- **Documentation drift**: ADRs and `context/workflows.md` can describe capabilities not yet in `src/` (e.g. extended module map). AI will happily implement or cite those unless the prompt anchors on **current repo state**.
- **Over-abstraction**: Skills push repositories and MSW everywhere—which is right at scale but may be heavy for a small assignment; keep prompts explicit about **pragmatic vs textbook** architecture.
- **E2E flakiness**: Debounced UI and timing-sensitive flows need prompts that ask for **stable selectors** (`getByRole`) and **assertions on UI state**, not arbitrary `sleep` calls.
- **Security and secrets**: No API keys were required for this mock-driven app; in real projects, rules should forbid pasting secrets into chat and should prefer env-based configuration.

### Closing

Cursor was most effective when treated as a **fast, context-bound implementer**: constrained by `.cursor/rules.md`, grounded in `context/`, specialized via `.cursor/skills/`, and verified by the same **lint, unit, and E2E** commands a human would run. The remaining responsibility—product tradeoffs, doc accuracy, and final review—stays with the developer.
