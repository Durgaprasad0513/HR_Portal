# HR Management App: Full Product-Quality Plan

Status: ready to implement
Source: localhost QA review on 2026-09-04
Target: `http://localhost:5173`
Baseline: 89/100 at a 471 × 632 viewport

## Product outcome

Make the HR portal feel calm, trustworthy, and easy to operate under pressure. The product should help Admin, HR, managers, and employees answer three questions quickly:

1. What needs my attention?
2. What is the current status?
3. What is the next safe action?

The plan covers visual design, responsive behavior, accessibility, route recovery, interaction states, and regression testing. It preserves the existing React, Tailwind, React Router, Express, Prisma, and API architecture.

## Advisory decision

The app is suitable for local smoke testing, but it is not ready for a polished stakeholder demo. The design foundation is consistent enough to evolve; a rewrite would create risk without solving the observed problems.

Priority order:

1. Recoverability: never show a blank page.
2. Accessibility: make every control and metric understandable without sight or pointer input.
3. Operational clarity: surface status, errors, loading, and next actions consistently.
4. Responsive usability: make dense tables and long forms usable on narrow screens.
5. Presentation quality: replace placeholder-like local content and refine visual density.

The strongest counterargument is that horizontal table scrolling and test data may be acceptable in an internal prototype. Keep those as P2/P3 work. Blank routes and inaccessible controls affect every user journey and remain P1.

## Design direction

### Concept: Calm operations

Use the existing navy/slate foundation with orange as a deliberate action color. The visual language should feel like an operations console, not a marketing dashboard.

- Quiet surfaces, strong headings, and restrained shadows.
- One clear primary action per page.
- Status colors paired with text, never color alone.
- Consistent 8px spacing rhythm.
- Short page headers that answer where the user is and what they can do.
- Dense data shown in tables on desktop and guided scroll/card summaries on mobile.
- Motion used to explain change, not decorate empty space.

### Layout wireframe

```text
Desktop
+------------------+-----------------------------------------------+
| Brand            | Header: menu, search, theme, alerts, profile   |
| Dashboard        +-----------------------------------------------+
| Employees        | Page title + one primary action               |
| Workspace        | Summary cards / filters                         |
| Expenses         | Main table, chart, or workflow                  |
| Authorization    | Empty/loading/error state                      |
+------------------+-----------------------------------------------+

Mobile
+---------------------------------------------------------------+
| menu | page title                     | theme | alerts | user |
|---------------------------------------------------------------|
| short summary / primary action                                 |
| stacked cards or one-column form                               |
| filters in a scrollable row                                   |
| table with visible “scroll for more” cue                      |
+---------------------------------------------------------------+
```

## Information architecture

Keep the current top-level grouping because it matches the domain:

- Dashboard
- Employees: Employees, Training, Performance
- Workspace: Recruitment, Assets, Attrition, Documents, Helpdesk
- Expenses: Travel, Office Expenses
- Authorization: Role Management, Audit Log

Small clarity improvements:

- Rename the visible `Employee` nav item to `Employees`.
- Rename `Office` to `Office Expenses`.
- Keep the current route paths for compatibility.
- Add a visible page title to every route, including settings, notifications, departments, login history, and not-found.
- Keep role-gated sections hidden from unauthorized users and show a recoverable permission state for direct URLs.

## Design system contract

### Typography

- Use one system sans family consistently.
- Page title: 28-32px desktop, 24px mobile, semibold/bold.
- Section title: 18-20px.
- Body: 14-16px with 1.45-1.6 line height.
- Metadata: 12-13px, muted but readable.
- Numeric KPIs: 28-32px, tabular numbers where available.

### Color and status

- Base: existing navy/slate text and surfaces.
- Accent: existing orange for primary actions and active navigation.
- Success: green with text such as Approved, Paid, or Active.
- Warning: amber with text such as Pending or Awaiting Approval.
- Danger: red with text such as Failed, Rejected, or Terminated.
- Neutral: slate for Draft, Unassigned, or no activity.
- Meet contrast targets in both light and dark themes.

### Components

- Buttons: primary, secondary, outline, danger; one primary action per page header.
- Cards: use for summaries, not for every table row.
- Forms: visible labels, required/optional markers, helper text, inline errors, disabled pending state.
- Modals: use for focused short tasks; use a full-page route for long employee forms.
- Tables: clear headers, row actions, empty state, keyboard scroll, pagination labels.
- Charts: title, legend, accessible summary, empty/error state, no chart-only meaning.
- Toasts: confirm success and explain failure, but never be the only error communication.

## Route-by-route design plan

| Route | Design intent | Work |
|---|---|---|
| `/dashboard` | Attention summary | Make KPI values accessible, align cards, show target breaches as explicit status, keep upcoming interviews actionable, add skeleton/error states. |
| `/employees` | Fast directory lookup | Keep summary cards, make filters named, show table scroll cue on mobile, keep employee identity visible while scrolling, use a clearer page header. |
| `/employees/new`, `/:id/edit` | Safe data entry | Break the long form into Personal, Employment, Payroll, and Documents sections; preserve one-column mobile flow; show save progress and unsaved-state warning. |
| `/training` | Plan and measure learning | Separate Upcoming and Completed clearly, use status badges with text, make calendar/list switch obvious, keep cost and hours readable. |
| `/performance` | Guided review workflow | Use a step or section structure for employee, period, KRA, goal, target, and weightage; explain required fields; show workflow status. |
| `/recruitment` | Pipeline visibility | Keep Kanban/table views, strengthen stage labels, show candidate count and vacancy count together, make empty pipeline states actionable. |
| `/assets` | Ownership and lifecycle | Make asset status dominant, distinguish Unassigned/Returned/In Use, keep serial number readable, confirm assignment and return actions. |
| `/attrition` | Decision support | Add a plain-language summary above charts, make target misses prominent, provide accessible chart summaries and zero-data states. |
| `/documents` | Find and acknowledge policy | Make document name and version primary, place acknowledgement state next to the action, explain file type and download behavior. |
| `/requests` | Resolve employee issues | Make ticket status and next owner prominent, keep Manage action consistent, distinguish response notes from employee description. |
| `/travel` | Approval and settlement | Use a visible two-stage status treatment for approval and settlement, keep destination/purpose readable, make pending actions primary. |
| `/office-expenses` | Reimbursement queue | Show amount, status, receipt, and next action in that order; separate submitted, approved, paid, and rejected visually. |
| `/roles` | Permission safety | Make active role/status visible, add confirmation language for sensitive changes, group user account and permission matrix controls. |
| `/audit` | Investigation | Keep filters compact but labeled, show timestamp/user/action/module hierarchy, make pagination state explicit, retain export context. |
| `/settings`, `/notifications`, `/departments`, `/login-history` | Supporting workflows | Apply the same header, form, empty, loading, error, and responsive conventions. |
| Unknown routes | Recovery | Render a branded not-found page with explanation, Dashboard action, and safe navigation back. |

## Responsive behavior

### Mobile: under 640px

- Header remains fixed to a compact 56-64px row.
- Sidebar becomes a modal drawer with a scrim, Escape close, focus containment, and a visible close affordance.
- Page headers stack title, description, and primary action.
- Summary cards use one column unless two cards remain comfortably readable.
- Forms use one column and sticky bottom actions only when they do not cover content.
- Filter controls may scroll horizontally but need a visible cue and preserved focus.
- Tables use a keyboard-focusable overflow container, a mobile hint, and a sticky first identity column where practical.
- Long employee forms use collapsible sections only if the section headers remain keyboard and screen-reader accessible.

### Tablet: 640-1023px

- Keep the drawer pattern until there is enough space for persistent navigation.
- Use two-column summary cards and forms where labels remain readable.
- Keep primary actions visible without wrapping into ambiguous rows.

### Desktop: 1024px and above

- Persistent sidebar with clear active state.
- Page header and primary action on one line.
- Tables may use full width and optional sticky columns.
- Dashboard uses a balanced summary grid rather than excessive empty space.

## Interaction-state standard

Every route and async action must define these states:

```text
idle -> loading -> success
  |        |
  |        +--> recoverable error -> retry
  +--> empty state -> primary next action

submit -> disabled/pending -> success toast + refreshed state
                     |
                     +--> inline error + preserved input
```

Required behavior:

- Loading uses a skeleton or spinner with an accessible status.
- Empty states explain what is empty and how to create or find data.
- Errors name the failed operation and offer Retry or Back.
- Submit buttons disable during mutation and do not double-submit.
- Modal close and route changes preserve or intentionally discard draft state.
- Success toasts are paired with refreshed visible data.

## Accessibility plan

Target WCAG 2.2 AA for the reviewed workflows.

1. Repair `Input`, `Select`, and `FileUpload` with generated IDs, `htmlFor`, `aria-invalid`, and merged `aria-describedby`.
2. Repair `Modal` with dialog semantics, labelled title, named close button, Escape handling, focus containment, and focus restoration.
3. Add accessible names and expanded state to menu, theme, notifications, profile, pagination, and icon-only actions.
4. Make `CountUp` expose one final formatted value and hide animation-frame digits.
5. Label all raw controls in pages, filters, settings, roles, audit, performance, and training.
6. Pair status color with text and ensure focus rings remain visible in both themes.
7. Respect `prefers-reduced-motion`.
8. Run keyboard, screen-reader-name, and automated axe checks on representative pages.

## Engineering implementation slices

### Slice A: recovery and test foundation, P1

Files: `client/src/routes/AppRoutes.tsx`, new `client/src/pages/NotFoundPage.tsx`, client test config and route tests.

- Add the wildcard route inside the existing protected layout.
- Add known-route, redirect, protected-route, and unknown-route tests.
- Add Vitest, jsdom, Testing Library, jest-dom, and user-event using Vite-compatible configuration.

### Slice B: shared design and accessibility primitives, P1

Files: `client/src/components/ui/Input.tsx`, `Select.tsx`, `FileUpload.tsx`, `Modal.tsx`, and component tests.

- Centralize labels, descriptions, validation semantics, and modal focus behavior.
- Preserve current props, refs, styling, and API payloads.

### Slice C: global shell and dashboard, P1

Files: `client/src/components/layout/Header.tsx`, `Sidebar.tsx`, `client/src/components/ui/CountUp.tsx`, `DataTable.tsx`, dashboard tests.

- Name global controls and expose open/closed state.
- Make the sidebar drawer behave as an accessible mobile navigation surface.
- Make KPI values and chart summaries understandable without animation.
- Add table captions, mobile overflow cues, keyboard scroll, and named pagination.

### Slice D: primary workflow design, P2

Apply the shared system to Employees, Training, Performance, Recruitment, Assets, Documents, Helpdesk, Travel, and Office Expenses. Do this in three sequential batches to keep diffs reviewable and avoid conflicts.

### Slice E: governance and supporting routes, P2

Apply the same shell, labels, states, and responsive rules to Roles, Audit, Settings, Departments, Notifications, and Login History.

### Slice F: demo readiness, P3

Replace placeholder-like seed fixtures for future resets. Do not delete existing local records automatically. Any reset or cleanup command must be development-only and explicitly reviewed.

## Test plan

### Unit and component tests

- `Input`, `Select`, and `FileUpload`: caller ID, generated ID, label association, required state, external error, internal error, and described-by merging.
- `Modal`: role, title association, close name, Escape, Tab containment, focus restoration, and opener unmount fallback.
- `Header`: menu, theme, notification, profile, command palette, and expanded states.
- `CountUp`: zero, multi-digit, prefix, suffix, decimal, reduced motion, and accessible final output.
- `DataTable`: empty, one page, multiple pages, named pagination, selection, and overflow cue.

### Route and page tests

- All current routes render a page heading.
- `/`, `/policies`, and `/profile` preserve redirects.
- Unknown paths render the not-found page.
- One representative create/edit form from every workflow batch has complete accessible names and preserves its payload shape.

### Browser regression tests

- Admin opens every main route and sees no blank page or console error.
- Keyboard user opens each primary modal, tabs through it, submits valid data in a controlled test fixture, cancels, and restores focus.
- Screen-reader tree exposes real KPI values and named header controls.
- 375px and 471px employee table communicates hidden columns and remains keyboard-scrollable.
- Light and dark themes preserve contrast and status meaning.
- API liveness/readiness and displayed document/receipt links remain healthy.

## Failure modes and safeguards

| Risk | Safeguard | User result |
|---|---|---|
| Wildcard route catches a valid path | Route table integration test for every existing path | Existing route still opens |
| Generated IDs break after rerender | `useId` tests across rerender | Labels remain attached |
| Modal traps focus incorrectly | Keyboard and focus restoration tests | User can always close and recover |
| Accessibility refactor changes payloads | Form submission payload tests | API behavior remains unchanged |
| CountUp hides the final value | Accessible-name assertions | Screen reader hears the real metric |
| Mobile cue obscures a table action | Narrow viewport screenshots and keyboard test | Data remains reachable |
| Async mutation double-submits | Pending-state test | One request and one success state |
| Existing local data is removed during cleanup | Explicitly separate P3 reset tooling | No unexpected data loss |

## Verification and release gate

Run in this order:

1. Focused client tests.
2. `npm run build --prefix client`.
3. `npm run test --prefix server`.
4. Localhost browser regression at mobile and desktop widths.
5. Full 13-route QA sweep and baseline comparison.

Release only when:

- No route produces a blank page.
- All reviewed controls have accessible names.
- KPI values are announced correctly.
- Modal keyboard behavior passes.
- No console errors appear.
- Document and receipt links return 200.
- Health score reaches at least 97/100.

## Parallelization

| Lane | Work | Dependency |
|---|---|---|
| A | Route recovery and route tests | Client test foundation |
| B | Shared form/modal primitives and tests | Client test foundation |
| C | Header, sidebar, KPI, and table shell | Shared test utilities |
| D | Primary workflow adoption | B and C |
| E | Supporting/governance route adoption | B and C |
| F | Demo fixtures | Explicit data-cleanup decision |

Run A and B in parallel, then C, then D and E in separate sequential batches. Keep F isolated because data cleanup can be destructive.

## NOT in scope

- Backend schema or permission redesign.
- Replacing React Router, Tailwind, or the current component architecture.
- A full visual rebrand or new logo/illustration system.
- A separate card renderer for every desktop table.
- Automatic deletion/reset of current local database records.
- Alternate-role authorization validation without dedicated test accounts.
- Production deployment or hosting changes.

## Implementation checklist

- [x] T1 P1: Add client test foundation and focused component regression tests. Focused tests were previously passing; later reruns are blocked by the local OneDrive/esbuild permission issue.
- [x] T2 P1: Add not-found route and recoverable branded state.
- [x] T3 P1: Repair shared input, select, file-upload, and modal semantics.
- [x] T4 P1: Repair header, sidebar drawer, KPI, and table accessibility.
- [x] T5 P2: Apply design system to primary workflow pages.
- [x] T6 P2: Apply design system to governance/supporting pages.
- [ ] T7 P2: Add narrow-viewport and keyboard browser regression coverage. Blocked by the local browser/tool usage quota.
- [ ] T8 P3: Clean future demo fixtures with no automatic data deletion.
- [ ] T9 P1: Rerun full QA and update the baseline score. Blocked by the local browser/tool usage quota; the prior 82/100 report is stale after the fixes.

## Design review verdict

Initial design assessment: 7/10 foundation, 5/10 responsive polish, 4/10 accessibility readiness, 6/10 operational clarity.

Target after implementation: 9/10 foundation, 8/10 responsive polish, 9/10 accessibility readiness, 9/10 operational clarity.

The existing visual language should be retained and tightened. The plan is ready to implement after the route/accessibility P1 slices are accepted.
