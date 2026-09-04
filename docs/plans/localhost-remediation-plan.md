# Localhost Remediation Plan

Status: ready to implement
Source: `.gstack/qa-reports/qa-report-localhost-2026-09-04.md`
Target: raise localhost QA health from 89/100 to at least 97/100 without changing backend behavior.

## Outcome

Ship a recoverable and keyboard/screen-reader-usable React application while preserving the current routes, API contracts, visual design, and role model.

Success means:

- Every unknown URL renders an explanatory page with a working route back to the dashboard.
- Shared `Input`, `Select`, `FileUpload`, and `Modal` components expose valid accessible names and error relationships.
- All create/edit flows tested in the QA sweep use associated labels, including raw HTML controls.
- Header icon actions and dashboard KPI values have accurate accessible names.
- Dense tables clearly communicate horizontal scrolling and expose named pagination controls.
- Client regression tests cover the fixed behavior.
- `npm run build --prefix client`, client tests, server tests, and the localhost browser regression pass all succeed.

## Scope challenge

The smallest complete approach is to fix the shared primitives first, then migrate raw controls in module-sized batches. A one-file patch to the Employee page would improve one screenshot while leaving the same accessibility failure across Training, Performance, Recruitment, Assets, Documents, Helpdesk, Travel, Office Expenses, Settings, Roles, and Audit.

No new form framework, routing library, design system, or backend service is needed. Use React's built-in `useId`, React Router's catch-all route, the existing UI components, and Vite-native tests.

Each implementation slice below stays below the eight-production-file complexity threshold. Do not combine the slices into one large commit.

## What already exists

- `client/src/routes/AppRoutes.tsx` already centralizes all application routes and protected layouts. Add one catch-all route rather than creating a second router.
- `client/src/components/ui/Input.tsx` and `Select.tsx` already own visual labels and validation messages. Extend these primitives instead of repairing every consumer independently.
- `client/src/components/ui/Modal.tsx` already handles body scroll locking and a shared close action. Add dialog semantics and focus behavior there, then migrate bespoke modals incrementally.
- `client/src/components/ui/DataTable.tsx` already owns overflow and pagination. Add mobile affordances and button names there once for all consumers.
- `client/src/components/ui/Button.tsx` already forwards native button attributes, so consumers can add `aria-label`, `aria-expanded`, and `aria-controls` without changing the primitive.
- `client/src/components/ui/CountUp.tsx` is the single source of the dashboard digit animation.
- Server Jest tests already exist. The missing test infrastructure is client-side, not backend-side.

## Architecture

```text
QA finding
   |
   +-- unknown URL ----------> AppRoutes catch-all -----> NotFoundPage
   |
   +-- unlabeled controls ---> shared Input/Select/FileUpload
   |                               |
   |                               +--> raw-control migration by module
   |
   +-- inaccessible dialogs -> shared Modal semantics/focus
   |
   +-- unnamed header/KPIs --> Header + CountUp
   |
   +-- mobile table cue -----> shared DataTable
                                   |
                                   +--> focused client regression tests
```

No backend schema, API, or authorization changes are required.

## Implementation plan

### Slice 1: Route recovery and client test foundation

Priority: P1
Estimated effort: human 2-3 hours / Codex 20-30 minutes

1. Add `client/src/pages/NotFoundPage.tsx` inside the existing visual system.
   - Explain that the page does not exist.
   - Provide a primary action to `/dashboard` and a secondary browser-back action when history exists.
   - Keep it inside `MainLayout` so authenticated users retain navigation.
2. Add a final `path="*"` child route in `client/src/routes/AppRoutes.tsx`.
3. Add a Vite-native client test stack: Vitest, jsdom, React Testing Library, jest-dom, and user-event.
4. Add route regression tests for `/`, a known protected route, and an unknown route.

Acceptance criteria:

- `/not-a-real-route` shows a heading, explanation, and working dashboard action.
- Refreshing the unknown route does not produce a blank viewport.
- Existing `/login`, `/dashboard`, redirects, and protected routes still behave as before.

### Slice 2: Accessible shared primitives

Priority: P1
Estimated effort: human 4-6 hours / Codex 45-60 minutes

1. Update `Input.tsx` and `Select.tsx`.
   - Derive a stable control ID from the caller's `id` or React `useId()`.
   - Connect `label htmlFor` to the control ID.
   - Give validation text a stable ID.
   - Set `aria-invalid` and merge `aria-describedby` when an error is visible.
   - Preserve all existing native props and forwarded refs.
2. Update `FileUpload.tsx` with the same label/control association and an announced upload state.
3. Update `Modal.tsx`.
   - Add `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
   - Name the close button.
   - Focus the first meaningful control when opened, close on Escape, contain Tab focus, and restore focus to the opener.
4. Add focused component tests for labels, errors, keyboard focus, Escape, and focus restoration.

Acceptance criteria:

- `getByLabelText()` resolves every shared Input, Select, and FileUpload in tests.
- Modal focus never escapes behind the overlay.
- Closing a modal returns focus to the button that opened it.
- Existing forms submit unchanged payloads.

### Slice 3: Global controls and KPI output

Priority: P1
Estimated effort: human 2-3 hours / Codex 25-40 minutes

1. Update `Header.tsx`.
   - Name the menu, theme, and notification buttons.
   - Use dynamic labels such as `Switch to dark theme`.
   - Add `aria-expanded` and `aria-controls` for menus/panels.
   - Convert the clickable profile container and notification rows to semantic buttons.
2. Update `CountUp.tsx`.
   - Expose only the final formatted value to assistive technology.
   - Hide animation-frame digits with `aria-hidden`.
   - Disable or simplify movement for `prefers-reduced-motion`.
3. Add tests that assert accessible button names, expanded state, final KPI names, and reduced-motion behavior.

Acceptance criteria:

- A screen reader announces KPI values `9`, `1`, `10`, and `1`, never `0 1 2 3...`.
- Header actions are discoverable by role and accessible name.
- Menu, theme, notifications, command palette, and profile behavior remain functional.

### Slice 4: Form adoption sweep

Priority: P2
Estimated effort: human 1-2 days / Codex 2-3 hours

Migrate pages in separate module-sized commits. Prefer the repaired `Input`, `Select`, `FileUpload`, and `Modal` primitives. Where a raw control is justified, give it an explicit `id`, matching `htmlFor`, and error description.

Batch A:

- Employees and Departments.
- Performance create/review modals.

Batch B:

- Training, Recruitment, and Assets.
- Documents and Helpdesk.

Batch C:

- Travel and Office Expenses.
- Settings, Roles, Audit, and list filters.

Acceptance criteria for each batch:

- Every visible input, select, textarea, checkbox, and file input has an accessible name.
- Required state is programmatically exposed, not only shown with an asterisk.
- Modal forms use dialog semantics.
- Keyboard-only users can open, complete, cancel, and return to the invoking control.
- Existing request payloads and validation rules do not change.

### Slice 5: Dense-table mobile affordance

Priority: P2
Estimated effort: human 2-3 hours / Codex 25-40 minutes

1. Extend `DataTable.tsx` with an optional caption/accessible name.
2. Make the scroll container keyboard-focusable and provide a mobile-only `Swipe or scroll horizontally for more columns` hint.
3. Add accessible names to previous/next pagination buttons and expose the current page.
4. Add a subtle right-edge overflow cue that disappears at the horizontal end.
5. Keep the table layout. Do not build a separate card renderer unless a later design review establishes mobile-first table workflows.

Acceptance criteria:

- At 375-471px widths, users can discover and keyboard-scroll hidden columns.
- Column headers remain associated with cells.
- Pagination is named and announces the current page.

### Slice 6: Demo-data cleanup

Priority: P3
Estimated effort: human 1-2 hours / Codex 15-25 minutes

1. Separate deterministic demo fixtures from ad-hoc local records.
2. Use realistic names, titles, descriptions, requests, and document titles in future seeds.
3. Clean existing local records only through a reviewed, development-only reset or migration command.

This slice must not silently delete the current database. Existing-record cleanup requires explicit approval because it is destructive.

## Test coverage diagram

```text
CODE PATHS                                      USER FLOWS
[GAP] AppRoutes wildcard                        [GAP] Unknown URL
  +-- known route unchanged                       +-- explanatory page appears
  +-- unknown route -> NotFoundPage               +-- dashboard action works
  +-- protected-route behavior unchanged          +-- browser back recovers

[GAP] Shared form primitives                    [GAP] Create/edit forms
  +-- caller-supplied ID                           +-- screen reader finds label
  +-- generated ID                                 +-- keyboard completes form
  +-- external + internal described-by             +-- validation error announced
  +-- valid / invalid states                        +-- cancel restores focus

[GAP] Modal                                     [GAP] Dialog interaction [E2E]
  +-- open -> focus enters                         +-- Tab remains in dialog
  +-- Escape / close button                        +-- Escape closes
  +-- close -> focus restored                      +-- opener regains focus

[GAP] CountUp                                   [GAP] Dashboard metrics
  +-- integer / decimal / prefix / suffix          +-- final value announced once
  +-- motion / reduced motion                      +-- visual animation unchanged

[GAP] DataTable                                 [GAP] Narrow viewport [E2E]
  +-- overflow / no overflow                       +-- overflow cue is visible
  +-- first / middle / last page                   +-- keyboard reaches columns
  +-- empty data                                   +-- pagination is announced
```

Required tests:

- Unit/component: Input, Select, FileUpload, Modal, CountUp, DataTable.
- Router integration: known, redirected, protected, and wildcard routes.
- Page integration: at least one form from each adoption batch.
- Browser regression: unknown route recovery, keyboard modal loop, dashboard KPI accessibility tree, and 375px employee table.

## Failure modes

| Code path | Production failure | Prevention | User-visible recovery |
|---|---|---|---|
| Wildcard route | Catch-all intercepts valid nested routes | Router integration tests for every current route | Valid routes continue rendering |
| Generated IDs | Hydration or rerender changes associations | React `useId` plus rerender tests | Labels remain connected |
| Described-by merge | Caller-supplied helper text is overwritten | Merge IDs instead of replacing them | All help and error text remains announced |
| Modal focus | Focus is lost when opener unmounts | Guarded focus restoration and Escape tests | Focus falls back to the page heading/main region |
| Header semantics | Button conversion changes click propagation | Interaction tests for each panel and navigation | Controls remain operable |
| CountUp | Hidden digits also hide final value | Accessible-name tests for formatted output | Static final value is announced |
| DataTable cue | Cue remains after reaching scroll end | Scroll-position test | Cue updates without blocking the table |
| Form sweep | Refactor changes field names or payloads | Submit-payload regression tests per batch | Existing API validation remains intact |

No planned failure mode should be silent and untested.

## Verification order

For each slice:

1. Run focused client tests for changed components/pages.
2. Run `npm run build --prefix client`.
3. Run `npm run test --prefix server` to guard shared integration assumptions.
4. Start localhost and repeat the affected browser flows.
5. After all slices, rerun the 13-route QA sweep and compare against `.gstack/qa-reports/baseline.json`.

Release acceptance:

- Zero blank routes.
- Zero unlabeled controls in the reviewed routes.
- Zero inaccessible KPI digit sequences.
- Zero browser console errors.
- All displayed document and receipt links still return 200.
- QA health score at least 97/100.

## Parallelization

| Lane | Modules | Depends on |
|---|---|---|
| A: route recovery | routes/, pages/, route tests | test foundation |
| B: shared accessibility | components/ui/, component tests | test foundation |
| C: header and KPI | components/layout/, components/ui/, dashboard tests | shared test utilities |
| D: form adoption | pages/, page tests | shared accessibility |
| E: mobile table | components/ui/, table tests | shared test utilities |
| F: demo data | prisma/dev tooling | explicit destructive-data decision |

Execution order:

1. Establish the test foundation.
2. Run lanes A and B in parallel.
3. Run lanes C and E in parallel after shared test utilities settle.
4. Run lane D in three sequential module batches to avoid conflicts across page files.
5. Keep lane F separate and optional.

Conflict flag: lanes B, C, and E all touch `components/ui/`; use separate commits but merge them sequentially.

## NOT in scope

- Backend schema, permissions, or API changes: the observed defects are frontend concerns.
- Replacing React Router, Tailwind, or the UI component library: existing foundations are sufficient.
- A separate mobile card implementation for every table: defer until a design review confirms the product needs mobile-first admin workflows.
- Deleting or resetting current local database records: destructive and unrelated to functional remediation.
- Broad visual redesign: retain the current visual language while repairing semantics and recovery.
- Alternate-role authorization testing: important, but it needs dedicated accounts and a separate RBAC regression plan.

## Implementation tasks

- [ ] **T1 (P1, human: 2-3h / Codex: 20-30m)** — Routing — Add a catch-all not-found experience and router regression tests.
- [ ] **T2 (P1, human: 2-3h / Codex: 25-35m)** — Testing — Add Vitest and React Testing Library client infrastructure.
- [ ] **T3 (P1, human: 4-6h / Codex: 45-60m)** — UI primitives — Associate labels/errors and implement accessible modal focus behavior.
- [ ] **T4 (P1, human: 2-3h / Codex: 25-40m)** — Global UI — Name header actions and expose only final KPI values.
- [ ] **T5 (P2, human: 1-2d / Codex: 2-3h)** — Forms — Migrate raw controls in three module-sized batches with payload tests.
- [ ] **T6 (P2, human: 2-3h / Codex: 25-40m)** — Tables — Add discoverable mobile overflow and named pagination.
- [ ] **T7 (P3, human: 1-2h / Codex: 15-25m)** — Demo data — Replace placeholder fixtures without deleting current data automatically.
- [ ] **T8 (P1, human: 2-3h / Codex: 30-45m)** — QA — Rerun route, keyboard, accessibility, and narrow-viewport regression coverage.

## Engineering review summary

- Scope challenge: complete remediation retained, split into small implementation slices.
- Architecture: one shared-primitives strategy; no new backend or infrastructure.
- Code quality: remove repeated label/modal fixes by repairing primitives first.
- Tests: client harness required; router, component, page, and browser paths mapped above.
- Performance: no performance blocker found; reduced motion is included for usability.
- Critical gaps: blank wildcard route and missing client regression tests.
- Parallelization: two parallel pairs, followed by a sequential page-adoption lane.
- Lake score: 6/6 QA findings covered; destructive data cleanup explicitly gated.

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|---|---|---|---:|---|---|
| CEO Review | `/plan-ceo-review` | Scope and strategy | 0 | Not run | Bug-fix scope does not change product direction |
| Codex Review | `/codex review` | Independent second opinion | 0 | Not run | Not required for planning artifact |
| Eng Review | `/plan-eng-review` | Architecture and tests | 1 | Clear | Six QA findings mapped to eight tasks; two critical gaps covered |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | Suggested | Useful before choosing a mobile table redesign |
| DX Review | `/plan-devex-review` | Developer experience | 0 | Not run | No DX change proposed beyond client tests |

**VERDICT:** ENG CLEARED — ready to implement in slices; design review is optional for the mobile table treatment.

NO UNRESOLVED DECISIONS
