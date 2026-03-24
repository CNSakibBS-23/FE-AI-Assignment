# Workflows

## Search Workflow

1. User updates query or filters in `search/ui`.
2. `useSearchController` in `search/logic` debounces and normalizes input.
3. Logic calls `SearchRepository` interface.
4. `search/data` executes API request, validates DTO, maps to domain model.
5. UI receives view-model and renders list, empty, or error states.

## Email Detail Workflow

1. User opens a search result item.
2. `email/logic` requests thread data through `EmailRepository`.
3. Data layer fetches and maps thread/messages.
4. UI renders thread view and action controls.

## Error and Retry Workflow

1. Data layer converts transport failures to typed app errors.
2. Logic layer decides retry strategy and user-facing message.
3. UI shows `ErrorState` with retry action.
4. Retry action re-triggers the same controller intent path.

## Testing Workflow (CI)

1. Run lint and type-check.
2. Run unit tests for pure logic/mappers/selectors.
3. Run integration tests with MSW for feature behavior.
4. Run E2E smoke + critical journeys in Playwright.
5. Block merge on failed checks.
