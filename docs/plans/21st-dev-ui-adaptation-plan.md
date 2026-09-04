# HRMS Portal UI Adaptation Plan

Status: Phase 0 complete; shared UI rollout complete, QA pending
Scope: UI/UX only; no API, database, permission-model, or deployment redesign
Primary reference: [Shadcn Dashboard and Landing](https://21st.dev/@shadcnstore/templates/shadcn-dashboard-landing)
Secondary reference: [Next Shadcn Admin Dashboard](https://21st.dev/@arhamkhnz/templates/next-shadcn-admin-dashboard)

## Product direction

Build a general business operations workspace that happens to manage HR workflows.
The visual language should be familiar and adaptable; the workflow content should remain specific to employees, approvals, records, and compliance.

The product must help users answer three questions quickly:

1. What needs my attention?
2. What is the current status?
3. What is the next safe action?

## Template strategy

### Primary template: Shadcn Dashboard and Landing

Use the Vite-compatible dashboard structure as the base reference for:

- Main layout
- Sidebar
- Header
- Dashboard grid
- Theme tokens
- General spacing and typography

Do not use its landing-page sections inside the authenticated HRMS.

### Secondary template: Next Shadcn Admin Dashboard

Use its patterns selectively for:

- Alternate admin layouts
- Data table organization
- Authentication screens
- Theme presets
- Settings screens

Do not copy its Next.js routing, data fetching, or framework-specific code into the current React/Vite app.

## Design guardrails

- Keep the current navy/slate/orange identity unless a later decision changes it.
- Use neutral admin/SaaS patterns rather than HR illustrations or people-focused decoration.
- Prefer accessible, low-motion interaction over visual novelty.
- Use one primary action per page.
- Keep status meaning in text as well as color.
- Avoid shaders, marketing heroes, purple gradients, and excessive glassmorphism.
- Adapt components to the existing design tokens instead of mixing unrelated styles.
- Do not introduce a new dependency without checking whether the current stack already provides the behavior.

## Phase 0: Create the design source of truth

Implementation status: complete. `DESIGN.md` and `AGENTS.md` now capture the approved direction and guardrails.

Deliverables:

- Approved typography scale
- Color and semantic status tokens
- Spacing and radius scale
- Button, card, table, form, modal, and badge variants
- Responsive breakpoints
- Motion and reduced-motion rules
- Accessibility rules
- Approved 21st.dev references and rejected patterns

Acceptance criteria:

- A developer can build a new page without inventing visual rules.
- The same component looks and behaves consistently across modules.

## Phase 1: Pilot the shared shell

Implementation status: the shared page-header treatment is applied across the major operational routes, including Dashboard, Employees, Requests, Settings, Travel, Office Expenses, Performance, Training, Departments, Policies, Audit, Notifications, Roles, and Login History. Client/server TypeScript checks pass.

Target files/components:

- `MainLayout`
- `Sidebar`
- `Header`
- Shared page-header/breadcrumb pattern
- Shared search, notification, and profile patterns

Work:

- Establish the new shell using the primary Vite dashboard reference.
- Improve active navigation and section grouping.
- Add consistent page title, description, breadcrumb, and primary action placement.
- Preserve role-based navigation visibility.
- Make mobile navigation a usable drawer with focus handling.

Acceptance criteria:

- Dashboard, Employees, Requests, and Settings all share one shell.
- Desktop and mobile navigation are understandable without a mouse.

## Phase 2: Role-based dashboard

Create dashboard content priorities by role:

- Admin: organization health, approvals, permissions, audit signals
- HR: employee records, recruitment, performance, training
- Manager: team requests, reviews, attendance, approvals
- Employee: personal requests, documents, travel, notifications

Dashboard structure:

1. Welcome/context header
2. Needs-attention queue
3. Four or fewer linked KPI cards
4. Pending approvals
5. Recent activity
6. Relevant trends
7. Upcoming tasks or events

Acceptance criteria:

- The first screen shows actionable work, not only metrics.
- Each role sees useful priorities without changing the shared visual system.

## Phase 3: Data-workflow patterns

Use the secondary admin reference and 21st.dev table patterns for:

- Employees
- Requests
- Travel
- Office expenses
- Assets
- Recruitment candidates
- Audit logs

Every data page must provide:

- Search
- Named filters
- Sort state
- Pagination
- Clear row actions
- Empty state
- Loading state
- Recoverable error state
- Mobile overflow guidance

Acceptance criteria:

- Users can find a record quickly.
- Important identity and status fields remain visible on narrow screens.

## Phase 4: Role-specific workflow screens

Apply specialized patterns only where they improve task completion:

- Employee details: profile header, tabs, activity timeline
- Recruitment: Kanban pipeline with stage counts
- Performance: structured sections or stepper
- Training: progress and attendance cards
- Travel/expenses: approval and settlement timeline
- Assets: custody history
- Documents: acknowledgement state and file metadata

Acceptance criteria:

- Each workflow has a clear next action.
- Sensitive information is visible only in the right context.
- Status and ownership are understandable without opening every record.

## Phase 5: Forms and dialogs

Standardize all create/edit/approval flows:

- Logical form sections
- Visible labels and helper text
- Required-field indicators
- Inline validation
- Preserved input after errors
- Disabled pending submit state
- Confirmation for sensitive actions
- Success feedback and refreshed data
- Unsaved-change protection where appropriate

Acceptance criteria:

- A user can complete common forms without guessing.
- No action can be accidentally submitted twice.

## Phase 6: Responsive and accessibility pass

Review at 375px, 471px, 768px, and 1280px.

Verify:

- No horizontal page overflow
- Tables have a clear scroll cue or compact alternative
- Touch targets are usable
- Keyboard focus is visible
- Dialogs trap and restore focus
- Controls have accessible names
- Status is not communicated through color alone
- Light/dark themes preserve contrast
- Reduced motion is respected

## Phase 7: Pilot review before broad rollout

Pilot only these routes first:

1. `/dashboard`
2. `/employees`
3. `/requests`
4. `/settings`

Review with realistic data, including empty, long, restricted, and error states.

Do not apply the system to every route until the pilot meets the acceptance criteria.

## Phase 8: Full rollout

Implementation status: complete for the shared operational-header and responsive page-structure pass. The 21st.dev influence is selective: dashboard, table, sidebar, empty-state, and responsive layout patterns were adapted without replacing the application with a template.

Apply the approved patterns in this order:

1. Employees and employee profile
2. Requests, travel, expenses, and assets
3. Recruitment, performance, and training
4. Documents, policies, audit, notifications, departments, and settings

Keep each batch independently reviewable and avoid mixing visual refactors with backend changes.

## Phase 9: UX validation

Measure these tasks:

- Find a pending approval in under 10 seconds.
- Open an employee record in three clicks or fewer.
- Understand a request status without opening the detail view.
- Complete a common form without assistance.
- Recover from a validation or API error without losing entered data.

If any target fails, fix workflow clarity before adding decorative components.

## Final QA gate

Current state: implementation checks pass, but the final browser regression gate remains pending because the local browser automation quota is exhausted. Client Vite/Vitest execution is also constrained by the OneDrive/esbuild permission issue, and server integration tests require a successful seeded test database.

Release the UI adaptation only when:

- All major routes use the same shell and design tokens.
- No route shows a blank, loading, or error dead end.
- Common workflows work on mobile and desktop.
- Keyboard and screen-reader naming checks pass.
- No new console errors appear.
- No existing API payloads or permission behavior change.
- The dashboard is useful for each supported role.

## Explicitly out of scope

- Replacing the application with a downloaded template
- Changing the React/Vite architecture
- Changing the database or API contracts
- Redesigning authorization rules
- Automatic cleanup of local data
- Adding marketing pages to the authenticated portal
