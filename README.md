# React + TypeScript + Vite Starter

Production-ready frontend baseline with scalable structure, lint/format guardrails, and test foundations.

## Stack

- React + TypeScript + Vite
- ESLint (flat config, type-aware) + Prettier
- Vitest + Testing Library (unit/integration)
- Playwright (E2E)

## Project structure

```text
src/
  app/            # app bootstrap and top-level composition
  components/     # reusable UI building blocks
  features/       # domain-oriented feature modules
  hooks/          # shared hooks
  lib/            # utilities and adapters
  services/       # API clients and external integrations
  styles/         # global styles/tokens
  test/           # shared test setup/helpers
e2e/              # Playwright E2E tests
```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - type-check and production build
- `npm run preview` - preview production build
- `npm run lint` / `npm run lint:fix` - lint checks/fixes
- `npm run format` / `npm run format:write` - prettier checks/fixes
- `npm run test` / `npm run test:watch` / `npm run test:coverage` - unit tests
- `npm run test:e2e` / `npm run test:e2e:ui` / `npm run test:e2e:headed` - E2E tests

## First run

1. `npm install`
2. `npx playwright install`
3. `npm run dev`
