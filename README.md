# FE AI Assignment — Inbox Search

A React single-page application that demonstrates **live email search** with debounced suggestions, local search history, and an interactive inbox backed by mock data. The codebase follows a **feature-based, layered architecture** (UI → logic → data) with unit, integration, and end-to-end test coverage.

## Project overview

This project is a frontend assignment built with **React 19**, **TypeScript**, and **Vite**. It presents a focused “find the right email, faster” experience: users type in a search bar, see suggestions derived from the inbox, and filter a list of messages by subject, sender, and body. Message **flagging** is handled in client state.

The app is structured for clarity and scalability: each capability lives under `src/features/<feature>` with explicit public exports, and shared utilities sit in `shared` / infrastructure-style folders as appropriate.

## Features

- **Search experience** — Debounced query input, keyboard-friendly suggestion list, and Enter / click to apply a search or narrow by sender address.
- **Search suggestions** — Suggestions built from inbox data; selection updates the active query used for filtering.
- **Search history** — Recent queries saved in **localStorage** (capped list) for quicker reuse across sessions.
- **Email list** — Filtered list with subject, sender, preview, and per-message **flag** toggle.
- **Mock data layer** — Email payloads and API-style accessors for development without a live backend.
- **Quality tooling** — ESLint (type-aware flat config), Prettier, and MSW-ready setup for API mocking in tests.

## Prerequisites

- **Node.js** 20 or newer (see `engines` in `package.json`)
- **npm** (or a compatible package manager that respects `package-lock.json` if present)

## Setup instructions

1. **Clone or copy** this repository and open a terminal in the project root.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers** (required for E2E tests; skip only if you will not run E2E)

   ```bash
   npx playwright install
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Follow the URL printed in the terminal (Vite default is often `http://localhost:5173` unless configured otherwise).

5. **Production build** (optional)

   ```bash
   npm run build
   npm run preview
   ```

   `build` runs TypeScript checking and Vite production output; `preview` serves the built assets locally.

### Other useful scripts

| Script                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run lint`         | Run ESLint                                       |
| `npm run lint:fix`     | ESLint with auto-fix                             |
| `npm run format`       | Check Prettier formatting                        |
| `npm run format:write` | Apply Prettier                                   |

## Testing instructions

### Unit and integration tests (Vitest)

Tests live next to source under `src/**/*.test.{ts,tsx}` and use **Vitest** with **jsdom** and **Testing Library**. Shared setup is in `src/test/setup.ts`.

```bash
# Single run (CI-style)
npm run test

# Watch mode during development
npm run test:watch

# Coverage report (v8), output under `./coverage`
npm run test:coverage
```

### End-to-end tests (Playwright)

E2E specs are in `e2e/`. The Playwright config starts the **Vite dev server** on `http://127.0.0.1:4173` automatically unless you opt into reusing an existing server (see `playwright.config.ts`).

```bash
# Headless run
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# See the browser while tests run
npm run test:e2e:headed
```

Ensure Playwright browsers are installed (`npx playwright install`) before the first E2E run.

## Documentation

- **[EXPERIENCE.md](./EXPERIENCE.md)** — Project retrospective: what worked, what did not, challenges, learnings, and suggestions.
- **[AI_USAGE.md](./AI_USAGE.md)** — How Cursor was used for this assignment, prompt strategy, skills/MCP/context, and observations.

For module boundaries and layering (UI → logic → data), see `context/architecture.md` and `context/modules.md`.

## Project structure (high level)

```text
src/
  app/            Application shell and composition
  components/     Shared UI building blocks
  features/       Feature modules (e.g. email, search)
  test/           Shared test setup
e2e/              Playwright E2E tests
```
