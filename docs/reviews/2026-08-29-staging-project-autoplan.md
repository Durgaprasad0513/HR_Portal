<!-- /autoplan restore point: /c/Users/VDurgaprasad/.gstack/projects/techsupportlohitha-hr_management_web_app/staging-autoplan-restore-20260829-141807.md -->
# HR Management Portal - Full Project Review Plan

Status: Review in progress
Branch: `staging`
Requirements baseline: `C:\Users\VDurgaprasad\Downloads\SCOPE (1).pdf`

## Goal

Review the complete HR Management Portal implementation against the supplied 12-page scope and produce an evidence-backed, prioritized plan that makes the system secure, usable, testable, and ready for phased completion.

## Product Objective From Scope

Build a secure, centralized HR portal for Pattabhi Agro Foods Pvt. Ltd. that supports Management Admin, HR Admin, extensible operational roles, and individual employee accounts. Confidential employee information must be protected by both role-level and employee-level authorization.

## Required Product Areas

1. Employee management
2. Travel allowance and settlement
3. Asset management
4. Recruitment tracking
5. Attrition analytics
6. Performance reviews
7. Training management
8. Employee requests and HR helpdesk
9. HR policies and documents
10. Role-specific dashboards, reports, notifications, user management, settings, and audit logs

## Required Security Principle

Employees may access only their own permitted information. HR and Management administrators receive broader access according to explicit permissions. Salary, performance, recruitment, attrition, asset, and internal HR records must never be exposed to unauthorized employees.

## Review Scope

- Product scope, phase boundaries, and completeness against the PDF
- Navigation, screens, responsive behavior, forms, states, and accessibility
- Frontend, backend, API, Prisma schema, PostgreSQL/Docker setup, authentication, authorization, validation, and error handling
- Data privacy, auditability, session control, document access, exports, and operational risks
- Build, type-check, lint, tests, seed data, environment configuration, and developer onboarding
- User-flow and failure-mode test plan for administrators, managers, and employees

## Review Constraints

- Do not modify application code during the review.
- Do not commit, push, deploy, or alter database data as part of the review.
- Preserve all existing uncommitted work.
- Propose fixes as prioritized implementation tasks for approval.

## Confirmed Premises

Confirmed by the user on 2026-08-29.

1. The supplied PDF is the authoritative final product scope.
2. `staging` is an unfinished phased implementation, not a production-ready release.
3. Role-based and employee-level access must be enforced on the server, not only hidden in the interface.
4. The target roles are Super Admin, HR Admin, REMOVED_ROLE, Reporting Manager, and Employee. The two Main Admins are accounts within the administrator role model.
5. Foundation and security must be completed before unfinished modules are treated as ready.
6. PostgreSQL through Docker is the standard local database setup; pgAdmin is optional administration tooling.
7. In-system notifications are required now; email, WhatsApp, and SMS are future work.
8. Attendance, leave, news, and task modules are outside the supplied scope, so their current removal is intentional.
9. `HRMagnet` and `PeopleFlow` are placeholder names. The target is HR Management Portal or Pattabhi Agro Foods branding.
10. Previously approved UI removals remain requirements and will not be reversed by this review.

## Baseline Verification

- Server TypeScript build: passing.
- Prisma schema validation: passing.
- Client TypeScript/Vite build: failing with unused imports and type errors.
- Client and server lint commands: unavailable because ESLint is not installed.
- Automated test files: none found.

Current-tree recheck on 2026-08-29: the uncommitted Prisma schema changed after the initial baseline and now fails validation with 42 errors. `Role` contains duplicate `REMOVED_ROLE` values, the `User` and `Employee` model declarations are missing around lines 254-274, and downstream relations cannot resolve those models. The earlier passing Prisma/server baseline is therefore historical, not the present release state.

## Expected Deliverables

- Requirements-to-implementation coverage matrix
- CEO/product, design, engineering, and developer-experience reviews
- Architecture and data-flow diagram
- Role and permission risk analysis
- Error/rescue and failure-mode registries
- Test strategy and missing-test matrix
- Prioritized P1/P2/P3 implementation backlog
- Explicit deferred scope and final approval gate before fixes

## Phase 1 - CEO / Product Review

Status: Complete

Review mode: Selective expansion. Preserve the authoritative scope, but change the delivery order so trust, privacy, and operational evidence are prerequisites rather than a final hardening phase.

Independent voices:

- Outside CEO voice: completed after one quota-limited retry.
- Codex CEO voice: completed read-only against the repository and the identical 12-page scope PDF.
- Consensus: keep the product direction and prior UI removals; stop horizontal feature expansion until the secure employee-data spine works end to end.

### Executive Verdict

The product addresses the right problem, but the current `staging` state is a broad prototype rather than a dependable HR portal. It is not ready for UAT, production, or real confidential employee data.

The narrowest useful first release is a secure employee system of record with account lifecycle, self-service profile/document access, policies, notifications tied to real events, and a traceable HR helpdesk. Travel and assets follow after the same authorization, workflow, attachment, and audit primitives are proven. Recruitment, performance, training, attrition, and management analytics follow only when their source workflows are trustworthy.

### CEO Scorecard

| Dimension | Score | Reason |
|---|---:|---|
| Problem selection | 8/10 | Centralizing employee data and HR workflows is the correct business problem. |
| Scope quality | 7/10 | The PDF is comprehensive, but security and testing are sequenced too late. |
| Current implementation trust | 2/10 | Record-level privacy, API contracts, auditability, and release validation are incomplete. |
| Current workflow completeness | 3/10 | Several models and APIs exist, but many screens are mocks or incompatible with their APIs. |
| Pilot readiness | 1/10 | Client build fails, no automated tests exist, and multiple P0 paths remain. |
| Long-term leverage | 7/10 | Prisma, Express, React Query, shared UI primitives, domain models, and the initial role catalog are reusable. |

### 0A. Premise Challenge

The ten confirmed premises remain valid. The following interpretation is mandatory:

- Security must not wait for the PDF's final implementation phase. Authorization, privacy, audit, validation, migrations, and tests are exit criteria in every phase.
- The five target roles are initial role templates. They should not permanently limit future roles, but a generic policy engine is not required for the pilot.
- Reporting Managers should receive team-scoped workflow access, not company-wide recruitment, attrition, salary, asset, request, or performance visibility.
- Two Main Admin accounts must not mean invisible or unaudited unrestricted activity. Destructive actions and sensitive exports require attribution and stronger controls.
- In-system notifications remain in scope, but only events from real workflows should be exposed.

No prior user UI removal should be reversed. Attendance, leave, news, tasks, social login, signup prompts, dashboard events/to-do, employee directory/org chart, downloads, and avatars remain removed as previously approved.

### 0B. Existing Code Leverage

Keep and strengthen:

- React, Vite, TanStack Query, the shared UI component library, and the current layout foundation.
- Express, Prisma, PostgreSQL, the modular server structure, Zod, and the central authentication middleware.
- The five initial role labels and module-permission catalog as pilot templates.
- Employee, travel, asset, recruitment, performance, training, request, policy, notification, audit, login-history, and settings models where their semantics are sound.
- Existing self-service endpoints such as `my-requests`, `my-assets`, `my-reviews`, and `my-trainings` as the pattern for object-scoped access.

Centralize rather than reproduce:

- Record scopes: `SELF`, `TEAM`, `ORG`, and `RESTRICTED`.
- Safe response projections for users, employees, candidates, performance records, and financial fields.
- Workflow transitions, approval attribution, attachments, notifications, and audit events.
- Shared client/server identifiers, enums, request fields, and response types.

### 0C. Dream State

The target is a trusted employee operations hub:

1. Employees see only their own permitted profile, documents, assigned assets, training, travel, released performance information, requests, policies, and notifications.
2. Reporting Managers act only on current direct-report workflows, with explicit delegation and escalation.
3. HR completes employee, document, request, travel, asset, recruitment, performance, and training workflows without hidden spreadsheet dependencies.
4. Management receives drillable metrics whose definitions and source records are traceable.
5. Every material change, approval, download, permission change, login, and export is attributable.
6. Offboarding immediately revokes access while retaining required HR and financial history.
7. Attendance, leave, payroll, and external messaging can later integrate without duplicating identity or authorization logic.

### 0C-bis. Implementation Alternatives

| Approach | Advantages | Risks | Decision |
|---|---|---|---|
| Continue one screen per module | Visible breadth and quick demos | False readiness, repeated security defects, fragile contracts | Reject |
| Secure vertical slice first | Produces usable value and reusable workflow primitives | Delays visible breadth | Adopt |
| Buy/configure a commercial HRIS | Lower custom security and compliance burden | May not fit Pattabhi travel, asset, and plant workflows; vendor cost and lock-in | Re-evaluate only if business wants standard HRIS workflows |
| Introduce a large generic policy engine now | Maximum theoretical flexibility | Excess complexity before basic scopes are correct | Defer |
| Use a small centralized authorization policy layer | Correct self/team/org behavior with manageable complexity | Requires systematic endpoint migration | Adopt |

### 0D. Selective Expansion Decisions

Add to the product foundation because it is required for the stated scope to be safe and operable:

- Account invitation, activation, deactivation, password setup/reset/change, session revocation, and login protection.
- Resource-scoped authorization and field-level safe projections.
- Private attachment/document storage with authorized downloads, file validation, expiry, retention, and audit.
- Effective-dated history for employee, asset, approval, and other regulated workflows.
- Transactional ticket numbers, workflow transition history, and approval attribution.
- Database migrations, CI quality gates, backup/restore rehearsal, and role/ownership test coverage.

Defer:

- Email, WhatsApp, SMS, advanced automation, generic custom-role infrastructure, and advanced analytics.
- Attendance, leave, news, and task modules.
- Polished charts until metric definitions and source workflows are trusted.

### 0E. Six-Month Regret Test

If the current horizontal approach continues, the likely regrets are:

1. A privacy incident caused by permission checks without record ownership.
2. UAT failure because forms, validators, IDs, enums, and HTTP methods disagree.
3. Management making decisions from hardcoded dashboards or placeholder attrition metrics.
4. Employee or financial history lost through hard deletion and cascades.
5. An inability to investigate incidents because audit, notification, and login-history producers were never wired.
6. Manual production schema changes because no migration history exists.
7. Rework across every module because authorization, attachments, workflows, and events were implemented differently each time.

### 0F. Product Sequence

#### Gate 0 - Trust foundation

- Make client and server builds pass.
- Align request validation, CUID identifiers, enums, fields, methods, and response types.
- Enforce `SELF`, `TEAM`, `ORG`, and restricted-field scopes in database queries and mutations.
- Fail startup on insecure secrets; enforce active-account/session state; add rate limiting and reset/change flows.
- Add migrations, CI, audit/login producers, notification ownership, and authorization contract tests.
- Define PII classification, masking, retention, export, backup, and private-file handling.

Exit: no employee can read or mutate another employee's record through guessed IDs, and all negative authorization tests pass.

#### Gate 1 - Employee lifecycle and self-service

- Complete employee fields, account provisioning, status lifecycle, and non-destructive offboarding.
- Deliver own-profile and secure employee-document access.
- Deliver policies with versioning, authorized download, applicability, acknowledgement, and reminders.
- Deliver HR requests with `HR-YYYY-NNNNNN` identity, assignment, comments/attachments, SLA, history, and closure.

#### Gate 2 - Controlled operations

- Travel request, manager approval, advance, evidence, verification, settlement, and history.
- Asset register, assignment, return, condition, custody history, and employee view.
- Reuse the common workflow, attachment, notification, and audit infrastructure.

#### Gate 3 - Recruitment and development

- Recruitment requisition, candidate, interview-history, offer, join/reject, resume protection, and metrics.
- Performance cycle with Employee -> Manager -> HR -> Final Approval field/stage ownership.
- Training participants, attendance, feedback, assessment, certificates, cost, and effectiveness.

#### Gate 4 - Trusted analytics and reports

- Attrition calculations from effective-dated join/exit events and documented denominators.
- Role-specific dashboards backed by permitted aggregate APIs.
- Narrow CSV/XLSX/PDF reports with masking, authorization, and export audit.

#### Gate 5 - Scale and future integrations

- External messaging, bulk imports, advanced automation, additional roles, and external payroll/attendance/leave integrations.

### CEO Risk Register

| ID | Priority | Risk | Evidence | Required correction |
|---|---|---|---|---|
| CEO-R1 | P0 | Cross-employee data exposure | Employee list/detail requires only module view and does not apply self/team query scope. | Enforce object scopes in service queries and use purpose-specific projections. |
| CEO-R2 | P0 | New workflows reject valid-looking requests | Validation parses `req.body`, while most schemas expect `{ body, params }`; Prisma uses CUIDs while schemas often demand UUIDs. | Establish one request contract and CUID validation, then add endpoint contract tests. |
| CEO-R3 | P0 | Credential/account data may leak | Policy and audit queries broadly include related User data. | Replace broad includes with explicit safe selections and response tests. |
| CEO-R4 | P0 | Security controls exist only as fields/readers | Audit and login history are not written; failed attempts, session timeout, password policy, and 2FA are not enforced. | Implement the minimum security spine before pilot data. |
| CEO-R5 | P1 | Managers receive organization-wide visibility | Default Manager permissions and `requireStaffView` do not apply team scope. | Define team-scoped manager policy and tests. |
| CEO-R6 | P1 | HR history can be destroyed | Employee deletion removes the user and cascades into HR records. | Replace normal deletion with status lifecycle and retention-governed purge. |
| CEO-R7 | P1 | Financial records are not accounting-safe | Salary, expenses, advances, purchase values, and costs use `Float` and lack currency. | Use fixed precision/minor units, currency, server totals, and immutable approvals. |
| CEO-R8 | P1 | UI communicates false readiness | Mock documents/candidates/performance, hardcoded dashboards, and placeholder reports/roles/attrition remain navigable. | Hide unfinished capabilities and never present fixtures as live data. |
| CEO-R9 | P1 | Confidential file handling is absent | File fields are client-supplied strings with no secure upload/download layer. | Add private storage, scanning, signed access, retention, and download audit. |
| CEO-R10 | P1 | Database and release changes are not reproducible | No migrations or automated tests; lint is unavailable; client build fails. | Add migrations and CI build/lint/test gates. |
| CEO-R11 | P2 | Role extensibility is code-bound | Prisma Role enum and permission rows support five fixed roles. | Keep five pilot templates; design a later migration before the sixth role. |
| CEO-R12 | P3 | Onboarding documentation is misleading | README still advertises removed attendance/leave modules and old roles/endpoints. | Rewrite documentation after the delivery sequence is approved. |

### Challenge-Gate Conclusion

Both CEO voices agree on the same structural correction: security, authorization, audit, validation, migrations, and testing cannot remain a last phase. This does not overturn a confirmed premise; it reinforces confirmed premise 5. No additional user decision is required before continuing the review.

### CEO Decision Audit Trail

| Decision | Principle used | Outcome |
|---|---|---|
| Preserve full PDF scope | Solve the stated business problem without silently shrinking it | Accepted |
| Stop horizontal expansion | Prefer a complete safe workflow over many shallow screens | Accepted |
| Move security into every gate | Confidential HR data makes trust a prerequisite | Accepted |
| Keep five roles for pilot | Avoid premature generic infrastructure | Accepted with future extensibility note |
| Keep prior UI removals | User-approved simplification and authoritative scope alignment | Accepted |
| Defer external channels | In-system value must work before channel expansion | Accepted |

## Phase 2 - Design / Usability Review

Status: complete. Two independent design voices reviewed the live application, source, supplied scope, and available reference screenshots. The optional gstack design generator and browse daemon were unavailable, so no speculative mockups were produced and no application code was changed.

### Executive Design Verdict

Design readiness is **2.6/10**. The portal has a reusable visual foundation, but it is not ready for UAT or real employee data. Its primary design failure is truthfulness and permission awareness rather than polish: realistic fixtures are presented as live HR, financial, audit, and KPI information; all roles receive the same HR dashboard; navigation is not derived from permissions; failure and recovery states are largely absent; and mobile wayfinding is incomplete.

The next design milestone is a permission-aware employee system-of-record slice with complete states and privacy-safe Self, Manager, HR, and Restricted views. Do not continue literal replication of the Visily references, and do not reverse any previously approved removal.

### Seven-Pass Scorecard

| Pass | Score | Decision |
|---|---:|---|
| Information architecture | 3/10 | Generate navigation, routes, tabs, commands, and actions from effective permissions and release readiness. |
| Interaction-state coverage | 2/10 | Introduce a shared loading, empty, filtered-empty, error/retry, success, forbidden, and transition contract. |
| User journeys and trust | 2/10 | Replace generic role experiences and fake values with scoped work queues and source-backed records. |
| Mock-data / AI-slop risk | 1/10 | Remove production-path fixtures and no-op high-trust actions; isolate any demo data behind a persistent label. |
| Design-system consistency | 5/10 | Keep the shared primitives and navy/orange foundation, then consolidate tokens, spacing, icons, and terminology. |
| Responsive behavior and accessibility | 3/10 | Fix mobile navigation/profile wayfinding and semantic dialogs, inputs, tables, controls, focus, and keyboard paths. |
| Unresolved design decisions | 2/10 | Lock disclosure, dashboards, readiness gates, document boundaries, localization, and metric definitions before expansion. |

### Role and Navigation Map

| Role | Intended home and scope | Current trust break | Required design |
|---|---|---|---|
| Super Admin | System readiness, access, security, audit, and organization oversight | Fake HR dashboard; inert settings; placeholder roles/reports | Admin control center with real state, permission-change confirmation, and audit attribution |
| HR Admin | Employee lifecycle, restricted records, workflows, policies, and operations | Live and fabricated values are indistinguishable | HR work queue organized by lifecycle and urgency, with restricted sections clearly marked |
| REMOVED_ROLE | Permitted HR operations without restricted fields | Missing from client role model; routes and navigation disagree with server catalog | Full role support with effective permissions, masked fields, and only authorized actions |
| Reporting Manager | Direct reports, approvals, performance, and team training | Receives HR dashboard and may see organization-level affordances | Team-scoped dashboard, approval inbox, direct-report summaries, and escalation states |
| Employee | Own profile, assets, training, travel, requests, policies, and notifications | Sees HR metrics, administrative routes, and fabricated profile/payroll data | Self-service home with own records, privacy language, correction/request actions, and trustworthy statuses |

Navigation must be produced from one effective-permission source. Unauthorized links must not appear, and a direct unauthorized URL must show a clear permission-denied state with a safe next destination instead of silently redirecting.

### Core Journey Pattern

Every workflow should use the same emotional and interaction sequence:

1. **Orientation:** identify the user's role and whether the scope is My records, My team, or Organization.
2. **Confidence:** show only real, permitted data and clearly identify restricted or not-yet-collected fields.
3. **Action:** explain required information, owner/approver, SLA, and possible next states.
4. **Transition:** validate before advancement, prevent duplicates, preserve drafts, and announce progress.
5. **Confirmation:** provide a durable identifier, timestamp, new status, and next expected event.
6. **Recovery:** retain entered data, explain the failure, and offer retry or escalation.
7. **Privacy reassurance:** do not expose or hint at fields outside the user's disclosure scope.

### Interaction-State Matrix

| Area | Loading | Honest empty | Filtered empty | Error / retry | Success | Permission state | Transition protection |
|---|---|---|---|---|---|---|---|
| Employees / profile | Present | Partial | Partial | Missing | Toast only | Missing | Partial |
| Travel | Present | Generic | N/A | Missing | Toast | Partial | Partial; wizard validation can be bypassed |
| Assets | Present | Generic | N/A | Missing | Toast | CTA-only | Partial |
| Recruitment | Partial | Replaced by fixtures | Missing | Missing | No real workflow | Route-only | Drag is visual only |
| Attrition | Missing | Replaced by hardcoded metrics | Missing | Missing | N/A | Route-only | Missing |
| Performance | Missing | Replaced by fixtures | Missing | Missing | Missing | Tabs not scoped | Missing |
| Training | Present | Generic | N/A | Missing | Toast | CTA-only | Partial |
| Requests | Present | Generic | N/A | Missing | Toast | Data-source-only | Partial |
| Policies / documents | Missing | Replaced by fixtures | Missing | Missing | No real upload | CTA-only | Missing |
| Notifications | Present | Present | N/A | Missing | Missing | Ownership implied | Partial |
| Audit / login / settings | Missing | Replaced by fake/default values | Missing | Missing | No-op save | Route-only | Missing |
| Dashboard / reports / roles | Missing | Fake or placeholder | Missing | Missing | Missing | Route-only | Missing |

### Design Findings and Corrections

#### P0 - Trust and disclosure blockers

1. Derive navigation, route guards, dashboard content, tabs, commands, and row actions from effective permissions for all five roles.
2. Replace the universal HR dashboard with role-specific, API-backed work queues and metrics with documented definitions.
3. Redesign employee detail into My Profile, Team Member Summary, HR Record, and Restricted Record disclosure modes. Missing data must render as missing, never as plausible examples.
4. Remove all production-path fixtures: dashboard KPIs, employee office/type defaults, candidate fallbacks, performance people, policy documents, attrition percentages, and fake audit/login events.
5. Feature-gate unfinished recruitment, performance, attrition, reports, role management, and settings instead of presenting them as operational.
6. Remove no-op high-trust actions and the reintroduced Time Off, Leave Requests, Payroll Processing, generic download, and other previously removed UI.
7. Separate secure employee documents from organization policies; apply masking and download/open auditing before exposing restricted files.

#### P1 - Workflow, state, mobile, and accessibility

1. Complete the shared state contract with module-specific first-use and filtered empties, recoverable errors, retry, durable success, permission denial, disabled reasons, and transition feedback.
2. Make travel, assets, requests, policies, and employee lifecycle complete vertical workflows before expanding breadth.
3. Replace the mobile horizontal navigation strip with a permission-filtered drawer or primary navigation plus More; provide mobile section navigation for long profiles.
4. Add semantic dialog behavior, focus management, Escape and restoration; connect labels and errors; label icon buttons, checkboxes, and pagination; support keyboard alternatives to drag-and-drop.
5. Use INR, Indian dates/addresses/statutory terminology, and the configured organization time zone.

#### P2 - System consistency

1. Consolidate page width, gutters, typography, control radius, state colors, focus presentation, density, icons, and terminology.
2. Replace HRMagnet/PeopleFlow and unsupported marketing claims with Pattabhi Agro Foods / HR Management Portal branding once final assets are supplied.
3. Define document information architecture and every dashboard/attrition metric before presenting them.

#### P3 - Polish

- Refine motion, microcopy, and visual detail only after real data, permissions, workflows, states, and accessibility are dependable.

### Module Design Coverage

| Module | Current state | Required next design |
|---|---|---|
| Employee management | Live list mixed with fabricated columns; unsafe hybrid profile | Disclosure-safe profile modes, real fields, account lifecycle, and permissioned actions |
| Travel | Basic request wizard/list | Travel mode, expense evidence, approvals, settlement, history, validation, and INR |
| Assets | Basic list/create | Assignment, custody history, condition, return, loss/damage, warranty, and employee view |
| Recruitment | Hybrid API/mock tables and no-op board | Gate until requisition/candidate transitions, interview history, offers, and resumes are real and protected |
| Attrition | Hardcoded metrics and chart placeholder | Gate until definitions, source provenance, filters, permissions, and calculations exist |
| Performance | Mock timeline | Stage/field ownership, confidential versus released views, and full approval history |
| Training | Basic list/create | Target audience, participants, attendance, feedback, assessment, certificate, cost, and completion |
| Requests | Basic list/create | Ticket identity, category, assignment, SLA, discussion, attachments, history, resolution, and closure |
| Policies / documents | Mock policy list with generic actions | Versioned policies, applicability and acknowledgement; separate protected employee documents |
| Supporting systems | Fake dashboard/audit/login; placeholder reports/roles; thin notifications | Truthful role dashboards, real security events, actionable notifications, and readiness gating |

### Preserve and Reuse

- React, Vite, TanStack Query, modular page structure, and existing shared component concepts.
- Navy/orange palette, restrained surfaces, and internal-tool information density.
- Button, Card, Badge, LoadingSpinner, EmptyState, and search/filter/table patterns after state and accessibility corrections.
- Recruitment tabs/board as eventual alternative views once transitions and keyboard paths are real.
- Employee-profile sectioning and sticky desktop anchor concept, redesigned around disclosure modes.
- Initials only as a non-photo fallback; do not restore profile-photo/avatar UI.
- Simplified email/password login and all other approved removals.

### Explicitly Not in Scope

Do not restore attendance/time tracking, leave/time-off management, news, task/to-do modules, dashboard calendar/events, employee directory, organization chart, social login/signup, generic or bulk downloads, profile-photo/avatar UI, external email/WhatsApp/SMS workflows, or payroll processing as a new module. Restricted salary, bank, and statutory fields may exist as protected employee-record data; that does not justify a Payroll Processing screen.

### Unresolved Decisions with Recommended Defaults

| Decision | Recommended default | Finalization point |
|---|---|---|
| Effective permission source | Server-computed permissions drive all UI and API enforcement | Engineering review |
| Employee disclosure | Four explicit Self, Manager, HR, and Restricted modes | Before profile implementation |
| Unfinished modules | Hidden behind release flags; never populated with fixtures | Immediate implementation backlog |
| Document boundaries | Policies and employee documents are separate products/storage paths | Engineering review |
| Mobile navigation | Permission-filtered drawer or primary set plus More | Design implementation |
| Branding | Pattabhi Agro Foods HR Portal; final logo/name supplied by owner | Before visual release pass |
| Metrics | No dashboard metric without owner, formula, denominator, time window, and API source | Analytics implementation |

### Challenge-Gate Conclusion

Both design voices independently reached the same conclusion: challenge the current literal Visily/mock-data implementation direction, but do not challenge any approved removal. Keep the restrained visual language and reusable component foundation. Replace screen breadth with truthful, permission-aware, privacy-safe work queues and complete vertical journeys.

### Design Decision Audit Trail

| Decision | Principle used | Outcome |
|---|---|---|
| Keep prior removals | User-approved simplification and authoritative scope | Accepted |
| Reject production-path fixtures | HR users must be able to trust every displayed value | Accepted |
| Use role-specific dashboards | Relevance and least-privilege disclosure | Accepted |
| Split employee profile modes | Privacy by purpose and role | Accepted |
| Feature-gate incomplete screens | Honest readiness over decorative breadth | Accepted |
| Keep shared visual foundation | Reuse coherent primitives while correcting behavior | Accepted |
| Defer polish | Trust, workflow completion, accessibility, and recovery come first | Accepted |

## Phase 3 - Engineering Review

Status: complete. One independent engineering voice completed a full read-only review. A second Codex reviewer independently scanned the architecture, contracts, schema, runtime logs, and build diagnostics; it confirmed the same core failure pattern before account usage limits prevented its final prose. A replacement independent voice supplied the closing verdict. No application code or data was changed.

### Executive Engineering Verdict

Engineering readiness is **2/10**. The React/Express/Prisma/PostgreSQL structure is a reasonable prototype foundation, but the current release is a **no-go for UAT, production, or real confidential employee data**.

The latest working-tree verification found an additional immediate blocker: `server/prisma/schema.prisma` fails `prisma validate` with 42 errors. It duplicates `REMOVED_ROLE` and contains orphaned User/Employee fields rather than valid model declarations. No Prisma generation, migration, or database-dependent release should proceed until that uncommitted schema is repaired and revalidated.

The original login outage is evidenced in `server-dev.log`: Express started, but Prisma could not reach PostgreSQL at `localhost:5432`. A read-only probe on 2026-08-29 confirmed the database is reachable now. However, `/api/health` checks only Express and returned healthy during a database-dependent failure pattern; deployment needs distinct liveness and database-backed readiness checks.

Even with the database reachable, core workflows remain blocked by request-shape, ID, enum, field-name, path, and HTTP-method drift. The dominant security failure is module-level RBAC without consistent record-level `SELF`, `TEAM`, `ORG`, and `RESTRICTED` enforcement.

### Current and Target Architecture

```text
Current
Browser / React / Vite
  -> React Router + AuthContext
  -> JWT in localStorage + Axios
  -> Express CORS / JSON
  -> JWT signature check
  -> module/action permission check
  -> Zod validator (body only)
  -> controller -> domain service -> Prisma -> PostgreSQL

Required cross-cutting spine
  -> server-backed/revocable session and account lifecycle
  -> record-scope policy: SELF | TEAM | ORG | RESTRICTED
  -> canonical request/response contracts
  -> workflow transition + history + idempotency service
  -> private file/attachment service
  -> transactional domain event -> notification + audit producers
  -> structured logging, metrics, readiness, migrations, CI and tests
```

### Request and Data Flow

```text
Login
POST /auth/login
  -> validate email/password
  -> query User + safe Employee projection
  -> check active account
  -> compare bcrypt hash
  -> issue token + effective permissions
  -> record login/security event (missing today)

Authorized mutation
request id + actor/session
  -> authenticate current account/session
  -> module action permission
  -> record scope + restricted-field policy
  -> validate params/query/body canonical contract
  -> transaction with expected current state/version
  -> write domain record + immutable transition/audit event
  -> enqueue in-system notification
  -> return safe projection + durable operation id
```

Today, authentication trusts JWT claims until expiry; validation often rejects before the controller; service updates do not verify actor relationship/current state/version; and audit/notification/login producers are absent.

### Role and Record-Scope Matrix

| Role | Required record scope | Current engineering condition | Exit requirement |
|---|---|---|---|
| Super Admin | ORG + RESTRICTED, with stronger controls for destructive/export/access changes | Module bypass returns true; no dual control, session enforcement, or audit producer | Attributed actions, revocable sessions, export/destruction safeguards, negative tests |
| HR Admin | ORG plus explicit restricted fields and stage ownership | Broad full permissions; response and workflow policies are inconsistent | Purpose-specific projections and complete workflow authorization |
| REMOVED_ROLE | ORG operations, restricted fields only where explicitly granted | Server catalog exists; client role type and routes disagree | Shared role contract and module/field negative tests |
| Reporting Manager | TEAM/direct reports plus delegated approvals | `requireStaffView` allows manager, while services commonly query organization-wide data | Manager predicate applied in every database query/mutation |
| Employee | SELF only, with released/permitted fields | Employee list/detail and several ID mutations lack ownership checks | Guessed-ID tests prove no cross-employee read/write/export/file access |

### Engineering Findings

#### P0 - Release blockers

1. **The current Prisma schema is invalid.** `Role` duplicates `REMOVED_ROLE`; lines 254-274 contain orphaned fields/braces; `User` and `Employee` are unresolved; validation reports 42 errors. Repair the canonical models before any database or service validation.
2. **Record-level authorization is incomplete.** Employee list/detail use module view and field stripping, but the service queries all records or arbitrary IDs. Notification mark-read/delete mutate by ID without recipient ownership. Manager-accessible staff services lack team predicates. The permission matrix GET is available to any authenticated user.
3. **Validation is structurally broken across modules.** The working tree contains mixed validator styles, while many routes still pass schemas wrapped as `{ body, params }` to body-only validation. Canonicalize params/query/body parsing before exercising workflows.
4. **Identifiers and enums disagree.** Prisma primarily generates CUIDs, while many schemas require UUIDs. Training, request, policy, and client role enums diverge from Prisma; the client omits `REMOVED_ROLE`.
5. **Client/server endpoint contracts disagree.** Recruitment uses client PUT/server PATCH; requests client PATCH/server PUT; assets client PUT/server PATCH; performance client PUT but server exposes PATCH `/ratings`; notifications use `/read-all` versus `/mark-all-read`. Several forms submit different field names than their schemas.
6. **Sensitive response projections are unsafe.** Audit uses `include: { user: true }`; policies include the full uploader; requests include full employee/assignee records. Password hashes and unrelated PII can be returned.
7. **Authentication is not a complete security boundary.** JWT secret has an insecure fallback; default lifetime is seven days; tokens are in localStorage; current session/account checks cannot be trusted until the malformed schema and token-version fields are reconciled. Reset/change/invite/activate/logout/revoke/2FA flows remain incomplete.
8. **There is no authorization proof.** No automated tests or CI exist, client build fails, and lint commands cannot run because ESLint is absent.

#### P1 - Pilot blockers

1. **Database changes are unreproducible.** There is no Prisma migrations directory and scripts rely on `db push`; rollback and release migration strategy are absent.
2. **Normal deletion destroys HR history.** Employee deletion removes the user and employee while many HR relations cascade. Replace it with status/effective-dated offboarding and a retention-governed purge.
3. **Money is not accounting-safe.** Salary, travel, asset, candidate, and training amounts use `Float`, lack currency, accept client totals, and have no immutable approval snapshot. Use Decimal or integer minor units, INR/currency, and server calculations.
4. **Workflows are unconstrained updates.** Travel approval/settlement, request status, candidate changes, performance approval, and asset assignment/return lack transition rules, actor ownership, history, idempotency, transactions, or optimistic concurrency. Asset return incorrectly leaves status `IN_USE`.
5. **Private files are only client-supplied strings.** Employee documents, bills, resumes, certificates, and policies have no upload validation, scanning, quarantine, private storage, signed access, retention, or download audit.
6. **Audit, login history, and notifications have readers but no reliable producers.** High-trust changes cannot be reconstructed or surfaced as real events.
7. **Docker and operations are fragile.** Compose and `.env.example` use different database passwords; images/secrets are not production-hardened; no DB readiness dependency, backup/restore rehearsal, or migration deploy step exists. pgAdmin remains optional tooling, not a runtime dependency.
8. **Required workflow persistence is shallow.** No ticket number/history/comments, interview history, asset custody ledger, performance stage history, policy supersession, or employee account lifecycle exists.

#### P2 - Scale and operability

- Most staff list services use unpaginated `findMany`; common scope/filter indexes are absent.
- Permission checks query the database repeatedly and `ensureDefaults` runs on access paths.
- No request/query timeout, rate limiting, correlation ID, structured log, metrics, tracing, or PII-redaction policy exists.
- Controller-level catch blocks often convert known failures into generic 400/500 responses, bypassing consistent error classification and recovery guidance.
- Health checks, alerts, and dashboards do not cover database latency, failed logins, repeated denials, workflow failures, or backup status.

#### P3 - Deferred engineering refinements

- External messaging, advanced analytics, broad exports, generic custom roles, and automation remain deferred until the secure vertical workflows are proven.

### Workflow Integrity Matrix

| Workflow | Existing foundation | Required control before ready |
|---|---|---|
| Employee lifecycle | Employee/User models and CRUD | Invitation, activation, field ownership, history, deactivation, session revoke, retention-safe purge |
| Travel | Request, approval, settlement fields/routes | Manager relationship, legal transitions, evidence, server totals, verification, immutable settlement events |
| Assets | Asset CRUD/assign/return | Correct status machine, custody ledger, condition, ownership, concurrency, loss/damage handling |
| Recruitment | Requisition/Candidate models/routes | Protected resumes, interview/offer history, allowed transitions, confidentiality, metrics provenance |
| Performance | Review fields/routes | Employee -> Manager -> HR -> Final ownership, stage projections, released-state policy, history |
| Training | Training/participant models | Targeting, assignment, attendance, feedback, assessment, certificate security, completion history |
| Requests | Request/assignment/status | `HR-YYYY-NNNNNN`, comments, attachments, SLA, reassignment/transition history, closure rules |
| Policies | Policy/acknowledgement models | File security, applicability, version supersession, reminders, authorized acknowledgement/download |
| Notifications | Inbox read/mutate endpoints | Transactional event producer, recipient ownership, dedupe, deep link, delivery/retry record |
| Audit/login | Read services and tables | Central producer, safe projections, immutable attribution, security events, retention |

### Failure and Rescue Registry

| ID | Priority | Failure | Evidence | Required rescue |
|---|---:|---|---|---|
| ENG-F0 | P0 | Prisma cannot validate or generate safely | Duplicate role and missing User/Employee models; 42 validation errors | Restore canonical schema, validate, generate, then establish migration baseline |
| ENG-F1 | P0 | Login fails while API appears alive | `server-dev.log` database connection failure; `/api/health` is Express-only | Align credentials; fail startup clearly; liveness + DB readiness |
| ENG-F2 | P0 | Valid-looking form returns 400 | Validator parses body while schema expects wrapper | Canonical validation of params/query/body + contract tests |
| ENG-F3 | P0 | Employee reads another employee | Employee routes/services lack SELF/TEAM predicate | Central scope policy in database queries + guessed-ID tests |
| ENG-F4 | P0 | Deactivated user keeps access | JWT verified without current account/session check | Revocable session and active-user enforcement |
| ENG-F5 | P0 | User mutates another notification | Notification update/delete use ID only | Compound recipient/id predicate and 404/403-safe behavior |
| ENG-F6 | P0 | REMOVED_ROLE client cannot compile/route correctly | Server has role; client `Role` omits it | One generated/shared role contract |
| ENG-F7 | P0 | Client calls nonexistent method/path | API wrapper/route mismatches | Executable API contract matrix |
| ENG-F8 | P0 | Credential/PII relation leaks | Broad `user: true`/`assignedTo: true` includes | Safe select projections and response snapshot tests |
| ENG-F9 | P1 | Asset return remains in use | Return service sets `IN_USE` | Legal state transition and lifecycle test |
| ENG-F10 | P1 | Concurrent approvals overwrite | Unconditional Prisma updates | Transaction, expected version/state, idempotency key |
| ENG-F11 | P1 | Offboarding destroys history | Hard delete plus cascade | Archive/effective dates; isolated purge process |
| ENG-F12 | P1 | Financial rounding/tampering | Float and client-provided totals | Fixed precision, currency, server calculation |
| ENG-F13 | P1 | Private file is guessed/substituted | Plain path strings, no file service | Private storage, scanning, signed access, audit |
| ENG-F14 | P1 | Security incident cannot be reconstructed | Producers absent | Transactional audit/login/event instrumentation |
| ENG-F15 | P1 | Development reset erases real data | Seed script deletes core tables | Environment guard and explicit isolated reset command |
| ENG-F16 | P2 | Large lists exhaust API/browser | Unpaginated staff `findMany` | Pagination, indexes, bounded exports |

### Test and Release Matrix

| Area | Mandatory automated coverage |
|---|---|
| Build/schema | Client type-check/Vite build, server build, lint, Prisma validate, migration deploy/rollback rehearsal |
| Login/session | Valid/invalid login, DB unavailable, inactive account, expired/revoked token, lockout, reset/change, timeout, secret validation |
| Authorization | Five roles x SELF/TEAM/ORG/RESTRICTED x read/add/edit/delete/approve/export, including guessed IDs |
| Contracts | Every client wrapper versus server method/path/body/query/params/enum/ID/response and error shape |
| Employee lifecycle | Invite, activate, update, restricted fields, deactivate, revoke, offboard, retain history |
| Travel | Create/deduplicate, approve/reject, advance, evidence, verify, settle, concurrency, illegal transitions |
| Assets | Assign/reassign/return/damaged/lost, custody history, ownership, concurrency |
| Recruitment | Requisition, candidate, interview, offer, join/reject, salary masking, resume authorization |
| Performance | Stage actor/field ownership, disclosure, final release, concurrent review protection |
| Training | Assignment, attendance, feedback, assessment, certificate authorization |
| Requests | Ticket sequence, assignment, discussion, SLA, transitions, close/reopen policy |
| Policies/files | Applicability, versioning, acknowledgement, upload scan, signed download, retention |
| Audit/notifications | Domain event generation, attribution, before/after values, recipient ownership, dedupe/retry |
| Integrity/operations | Money precision, transaction rollback, retention/cascade guards, DB readiness, backup restore |
| UI/system states | Loading, honest empty, error/retry, permission denied, disabled transition, session expiry, mobile/keyboard |

### Recommended Engineering Decisions

| Decision | Recommended default | Tradeoff |
|---|---|---|
| Session model | Server-backed revocable sessions in secure cookies | More state; strongest confidential-portal control |
| Authorization | Small centralized policy layer with SELF/TEAM/ORG/RESTRICTED | Less flexible than a generic engine; much lower complexity now |
| Contracts | Canonical schemas shared/generated for client and server | Build tooling work; eliminates drift |
| Money | Integer minor units or Prisma Decimal plus currency | Migration/formatting work; prevents rounding errors |
| Files | Private object storage with scanning and signed URLs | Integration cost; required confidentiality |
| History | Effective-dated lifecycle and append-only transitions | More tables; preserves auditability |
| Concurrency | Transaction + current-state/version precondition + idempotency key | Extra protocol fields; prevents duplicate/overwritten operations |
| Reports | CSV first, then required XLSX/PDF after authorization/export audit | Delays rich output; reduces early risk |

### Preserve and Reuse

- React, Vite, TanStack Query, Express, Prisma, PostgreSQL, Zod, and modular server/page structure.
- Shared UI primitives and the existing five role templates as starting points.
- `my-*` self-service endpoint pattern after ownership enforcement.
- Restricted-field helper concept after it is moved behind safe projections and record-scope checks.
- PostgreSQL through Docker as the canonical local database; pgAdmin as optional administration tooling.
- Every approved UI removal.

### Explicitly Not in Scope

Do not reintroduce attendance, leave/time-off, news, tasks/to-do, payroll processing, dashboard events, employee directory/org chart, avatars, generic downloads, social login/signup, external messaging, advanced automation, or advanced analytics before source workflows are trusted.

### Unresolved Engineering Decisions

1. Exact direct-report/delegation rules for Reporting Managers.
2. Field-by-field restricted access for REMOVED_ROLE.
3. Session/refresh duration and revocation storage.
4. File provider, scanning/quarantine, retention, and download policy.
5. Decimal versus minor units and supported currencies.
6. Ticket-number generation and transactional locking strategy.
7. Effective-dated employee history and legal retention/purge periods.
8. Workflow delegation/escalation and separation of duties.
9. Backup target, encryption, RPO/RTO, rehearsal cadence, and owner.
10. Shared contract generation approach.

### Challenge-Gate Conclusion

Challenge continued horizontal feature construction. Do not challenge or reverse prior removals. The correct sequence is foundation -> secure employee lifecycle/self-service/documents/requests -> travel/assets -> recruitment/performance/training -> trusted analytics/reports -> future integrations. A module is not ready until its contract executes, legal transitions are audited, and positive plus negative authorization tests pass.

## Phase 4 - Developer Experience Review

### Executive DX Verdict

The repository is not yet a dependable maintainer experience. A developer can clone the project and see a plausible quick-start guide, but the guide, environment templates, Docker configuration, Prisma lifecycle, application contracts, and quality commands disagree. The current malformed Prisma schema makes time to first working login unbounded. Initial DX readiness is **2.1/10**; this is a P0 release concern because unreliable setup prevents every security, workflow, and UAT claim from being reproduced.

The recommended mode is **DX POLISH**: keep the agreed product scope, make the complete maintainer journey deterministic, and defer ecosystem polish until the secure core works.

### Developer Persona Card

| Field | Definition |
|---|---|
| Who | An internal maintainer or future engineer working mainly on Windows |
| Context | Clones `staging`, uses Docker PostgreSQL because native database support is constrained, optionally uses pgAdmin, and maintains React, Express, Prisma, and role-scoped HR workflows |
| Tolerance | About 10 minutes from a prepared workstation to a verified local login; one actionable recovery path when a prerequisite is missing |
| Expects | One canonical environment template, reproducible migrations and seed data, one root quality command, clear readiness diagnostics, accurate docs, and safe role fixtures |

### Developer Perspective

I open the README expecting the fastest route to a working HR portal. It tells me to install three dependency trees, start Docker, copy the root environment example into the server, push the Prisma schema, seed, then start two processes. I follow that path, but the Docker password differs from the copied database URL. A second server environment example uses another port and expiry period, so I do not know which file is authoritative. If I get past the connection issue, Prisma cannot validate the current schema, and the repository contains no migration history that would tell me what the database should be. The README still describes removed attendance and leave features, old roles, and obsolete endpoints, so I cannot use it to decide whether a missing screen is intentional. The health endpoint can say OK while PostgreSQL-backed login is unavailable. Generic API errors and split frontend/backend logs tell me that something failed, but not whether the cause is Docker, schema drift, stale seed data, authorization, or a mismatched client contract. I start reading source files and one-off repair scripts. At that point the repository has stopped being self-explanatory, and a first login depends on local knowledge rather than a reproducible workflow.

### Competitive DX Benchmark

| Reference | Starting pattern | Notable choice | Application here |
|---|---|---|---|
| Docker Compose | One command starts a declared multi-service stack | Runtime dependencies are encoded together | Start PostgreSQL and pgAdmin with health checks and pinned images |
| Supabase local workflow | `start` applies migrations and seed, then prints service URLs | Database state is reproducible from version control | Bootstrap database, seed safe fixtures, and print app/API/pgAdmin URLs |
| Prisma Migrate | Migration history is created, committed, and applied predictably | Schema change history is a source artifact | Replace normal `db push` setup with a committed baseline and migration commands |
| Current portal | Five documented stages plus manual repair | Steps and credentials disagree; schema cannot validate | Current TTHW: 30-60+ minutes or blocked |
| Target portal | Install, bootstrap, run, verify | Opinionated defaults with explicit overrides | Target TTHW: <=10 minutes on a prepared workstation |

Benchmark references: Docker Compose documentation, Supabase local development workflow, and Prisma Migrate documentation. Exact third-party timing is not used as a release claim; the portal target is measured against its own clean Windows checkout.

### Magical Moment Specification

The maintainer's first meaningful moment is not a green Vite page. It is signing in as a seeded role and seeing a real, database-backed, permission-correct dashboard.

Target delivery:

```text
npm ci
npm run bootstrap:dev
npm run dev

READY database=<healthy> schema=<current> seed=<development>
APP   http://localhost:5173
API   http://localhost:5000/api
ADMIN admin@local.example / <documented development-only secret>
```

`bootstrap:dev` must verify supported Node/Docker versions, create a local environment from one template without overwriting an existing secret, start and wait for PostgreSQL, apply committed migrations, run an environment-gated idempotent development seed, and verify database readiness. It must report the problem, likely cause, and exact next action when a step fails. pgAdmin remains optional.

### Developer Journey Map

| Stage | Current experience | Required resolution | Status |
|---|---|---|---|
| Discover | README advertises removed modules, old roles, and old endpoints | Rewrite from the PDF and approved decisions; label implemented, planned, and deferred areas | P1 planned |
| Install | Root, client, and server installs are manual; supported versions are not pinned | One root install contract, Node/package-manager pinning, Windows + Docker prerequisites | P1 planned |
| First run | Two environment examples and Compose disagree; Prisma is invalid; no migrations | Canonical env, fail-fast configuration, Compose health, baseline migration, safe seed, bootstrap command | P0 planned |
| First login | Credentials are embedded in stale docs; no automated smoke path | Development-only role fixtures and a DB-backed login/authorization smoke test | P0 planned |
| Real usage | Client methods, fields, enums, and IDs drift from server contracts | Shared executable contracts and one create/read smoke path per scoped module | P0 planned |
| Debug | Process-only health check, generic errors, split logs, no troubleshooting map | Liveness/readiness split, stable error codes, correlation IDs, role-safe logs, troubleshooting guide | P1 planned |
| Test | No tests; lint scripts reference a missing tool; client build fails | Root verify command plus unit, contract, authorization, migration, and browser smoke suites in CI | P0/P1 planned |
| Upgrade | `db push`, ignored migrations, latest pgAdmin image, destructive seed | Versioned migrations, pinned runtime images, backup/restore and rollback guidance, changelog | P1 planned |

### First-Time Developer Confusion Report

| Time | Observation | Resolution in plan |
|---|---|---|
| T+0:00 | README says `git clone <repo-url>` and `cd hr-management-app`, not this repository's verified path | Replace placeholders with clone-agnostic, root-relative instructions |
| T+2:00 | Developer installs dependencies in three directories and cannot tell whether all lockfiles are authoritative | Define one root installation command and workspace/package policy |
| T+5:00 | Docker starts, but the copied root database password does not match Compose | One canonical env template generated from compatible Compose defaults |
| T+8:00 | Server may use 3000 or 5000 depending on which example was followed | One port contract; bootstrap prints the resolved URLs |
| T+10:00 | Prisma validation fails and there is no migration history to recover from | Repair schema first, commit baseline migration, block bootstrap on validation failure |
| T+15:00 | Health can report OK while login cannot reach PostgreSQL | Separate liveness from database/schema readiness |
| T+20:00 | README and UI disagree about roles and intentionally removed modules | Scope/status matrix generated from the authoritative plan |
| T+30:00+ | Developer reads source, logs, and undocumented `fix_*` scripts to infer intended state | Troubleshooting guide and governed `tools/` directory; retire obsolete artifacts only after review |

### Eight-Pass DX Scorecard

| Dimension | Current | Planned | Evidence and 10/10 gap |
|---|---:|---:|---|
| Getting Started | 2/10 | 9/10 | README lines 38-97 requires many manual steps; canonical bootstrap and clean-clone proof are missing |
| API/interface consistency | 2/10 | 9/10 | Client/server methods, payload fields, enum values, validation shape, and CUID/UUID assumptions drift |
| Error messages/debugging | 3/10 | 8/10 | Generic errors and process-only health do not identify database/schema/contract failures or corrective action |
| Documentation/learning | 3/10 | 9/10 | README lines 5-21 and 140-155 describe removed features, old roles, and stale APIs; no architecture or permissions guide |
| Upgrade/migration | 1/10 | 9/10 | `.gitignore` excludes migrations; normal setup uses `db push`; no backup, restore, compatibility, or rollback contract |
| Developer environment/tooling | 3/10 | 8/10 | No CI/tests/version pinning; lint is unavailable; many unmanaged scripts and generated artifacts occupy the root |
| Community/maintainer contract | 1/10 | 7/10 | No contributing guide, issue templates, ownership map, changelog, or compatibility policy |
| Measurement/feedback | 1/10 | 8/10 | No setup, smoke, test, coverage, migration-rehearsal, or DX timing evidence is collected |
| **Overall** | **2.1/10** | **8.4/10** | Planned score depends on implementation and a fresh-checkout boomerang review; it is not current readiness |

TTHW classification: **Red Flag / blocked** now; target **Needs Work-to-Competitive for an internal full-stack app** at <=10 minutes on a prepared workstation. The first Docker image pull may exceed the target and must be reported separately from repeat setup time.

### Error Paths That Must Become Actionable

| Failure | Current signal | Required developer signal |
|---|---|---|
| PostgreSQL unavailable | Login fails while `/api/health` can remain green | `DB_UNAVAILABLE`, readiness red, checked host/port, Docker recovery command, correlation ID |
| Prisma/schema drift | Validator emits many low-level relation errors | Bootstrap stops before startup, names schema validation as the failed gate, points to migration/schema recovery guide |
| Invalid request contract | Generic `Validation failed` or page toast | Stable code, field path, expected shape, safe received summary, contract-doc link |
| Expired/revoked/inactive session | Broad 401 redirect | Safe reason code, preserved destination, re-authentication action, server audit event |
| Client/server route mismatch | 404/405 or generic mutation failure | Contract test fails in CI with expected versus actual method/path before browser use |
| Unauthorized record access | Generic forbidden or accidental data | Server-owned scope predicate, stable safe 403/404 behavior, negative role test |

### What Already Exists and Should Be Reused

- Root `npm run dev` already launches the server and client together.
- Docker Compose already declares PostgreSQL and optional pgAdmin with a persistent volume.
- Root, client, and server lockfiles can support repeatable installs once their ownership policy is documented.
- Prisma seed data already provides representative roles and employees, but it must be brought into current scope and guarded against destructive use.
- Express has shared authentication, validation, response, and error middleware that can carry stable error codes and correlation IDs.
- TypeScript, Vite hot reload, `tsx watch`, and TanStack Query provide a fast feedback foundation.
- Existing development logs and repair scripts contain diagnostic history; classify them before retiring or moving them rather than deleting blindly.

### DX Implementation Tasks

- [ ] **DX-T1 (P0, human: ~1 day / CC: ~1h)** - Database contract - Restore a canonical valid Prisma schema and establish a committed migration baseline.
  - Surfaced by: First run and Upgrade passes; current validation has 42 errors and `.gitignore` excludes migrations.
  - Files: `server/prisma/schema.prisma`, `server/prisma/migrations/`, `.gitignore`, root/server package scripts.
  - Verify: validate/generate; empty DB migrate + seed + login; prior snapshot migrate + smoke; restore rehearsal.
- [ ] **DX-T2 (P0, human: ~1 day / CC: ~1h)** - Bootstrap - Add a safe, idempotent clean-clone setup and diagnostics command.
  - Surfaced by: Getting Started pass; current five-stage path has conflicting defaults.
  - Files: root `package.json`, a reviewed `tools/` bootstrap script, environment templates, `docker-compose.yml`.
  - Verify: clean Windows checkout reaches database readiness and first login without source inspection.
- [ ] **DX-T3 (P0, human: ~4h / CC: ~30m)** - Configuration - Make one environment template authoritative and reject unsafe/missing configuration before listening.
  - Surfaced by: Docker/env password, 3000/5000 port, token-expiry, and default-secret conflicts.
  - Files: `.env.example`, `server/.env.example`, `docker-compose.yml`, `server/src/config/index.ts`, `server/src/server.ts`.
  - Verify: missing/unsafe values fail with actionable messages; approved development defaults work unchanged.
- [ ] **DX-T4 (P0, human: ~2 days / CC: ~2h)** - Contracts - Align client/server methods, IDs, fields, enums, responses, and validation shapes.
  - Surfaced by: API/interface pass and engineering ENG-F2/6/7.
  - Files: `client/src/api/`, shared types, `server/src/modules/**`, `server/src/middleware/validate.middleware.ts`.
  - Verify: executable contract matrix plus one positive and relevant negative smoke flow per in-scope module.
- [ ] **DX-T5 (P0, human: ~1 day / CC: ~1h)** - Quality gate - Make build, schema, lint, tests, and DB-backed login smoke executable from the root.
  - Surfaced by: broken client build, missing ESLint dependency, and absence of tests/CI.
  - Files: package manifests, lint/test configuration, test suites, `.github/workflows/`.
  - Verify: one root command and pull-request workflow pass from a clean checkout.
- [ ] **DX-T6 (P1, human: ~4h / CC: ~30m)** - Documentation - Rewrite README to match the PDF, five roles, current modules, Docker workflow, and approved deferrals.
  - Surfaced by: Documentation pass; current README is materially stale.
  - Files: `README.md` and focused docs under `docs/`.
  - Verify: a maintainer unfamiliar with the repo completes setup using docs only.
- [ ] **DX-T7 (P1, human: ~1 day / CC: ~1h)** - Diagnostics - Split liveness/readiness and add safe structured errors, correlation IDs, UI error states, and recovery guidance.
  - Surfaced by: Error Messages pass and the observed database/login outage.
  - Files: server config/app/error middleware, client API/query/error UI, `docs/troubleshooting.md`.
  - Verify: DB-down, invalid payload, expired session, forbidden record, route drift, and 500 drills each identify next action.
- [ ] **DX-T8 (P1, human: ~1 day / CC: ~1h)** - Release safety - Define migration, development seed, backup/restore, image pinning, changelog, and rollback procedures.
  - Surfaced by: Upgrade pass; seed deletes records and `pgadmin:latest` is unpinned.
  - Files: seed/migration scripts, Compose, `CHANGELOG.md`, `docs/operations.md`.
  - Verify: destructive seed refuses non-development environments; migration and restore rehearsals are recorded.
- [ ] **DX-T9 (P2, human: ~1 day / CC: ~1h)** - Maintainer contract - Add architecture, permissions, API contract, testing, contribution, ownership, and compatibility documentation.
  - Surfaced by: Documentation and Community passes.
  - Files: `docs/architecture.md`, `docs/permissions.md`, `docs/api-contracts.md`, `docs/testing.md`, `CONTRIBUTING.md`, issue templates.
  - Verify: review checklist can locate each source of truth in under two minutes.
- [ ] **DX-T10 (P2, human: ~4h / CC: ~30m)** - Repository hygiene - Classify, move, document, or retire one-off repair scripts, logs, reports, and generated artifacts.
  - Surfaced by: Developer Environment pass; the root contains many unmanaged `fix_*`, `update_*`, log, PDF, DOCX, and temporary files.
  - Files: repository root, `.gitignore`, governed `tools/` and artifact locations.
  - Verify: clean checkout contains only intentional source/doc assets and every retained tool has ownership, purpose, safety, and usage notes.
- [ ] **DX-T11 (P2, human: ~4h / CC: ~30m)** - Measurement - Record setup time, readiness, first login, smoke results, quality-pass rate, and top failure categories without HR PII.
  - Surfaced by: Measurement pass.
  - Files: CI artifacts, smoke tooling, issue templates, telemetry/observability configuration.
  - Verify: fresh-checkout `/devex-review` can compare measured TTHW and failure rates with this plan.

The gstack JSONL task export is not available in this environment because `jq` is not installed. The markdown task list above is the authoritative DX handoff for this run.

### Explicitly Not in DX Scope

- Do not introduce a public SDK, CLI product, hosted playground, or external developer platform; this is an internal application maintainer journey.
- Do not replace React, Express, Prisma, PostgreSQL, Docker, or pgAdmin merely to improve onboarding.
- Do not restore attendance, leave, news, tasks, payroll processing, dashboard events/to-do, directory/org chart, avatars, generic downloads, or social login/signup.
- Do not add external notification channels, advanced analytics, custom-role infrastructure, or broad exports before secure source workflows are proven.
- Do not delete one-off scripts, logs, or supplied artifacts during review; classify them during implementation with the user’s ownership preserved.

### DX Decisions Applied Automatically

1. Primary product type: internal full-stack web application and service, with repository documentation and local Docker platform surfaces.
2. Primary persona: Windows maintainer using Docker PostgreSQL and optional pgAdmin.
3. Mode: DX POLISH because the agreed scope is correct but every maintainer touchpoint needs a reliable contract.
4. Target: <=10 minutes to first DB-backed role login on a prepared workstation; report first image-pull time separately.
5. Magical moment: one safe bootstrap followed by a real, permission-correct dashboard login.
6. Resolve every critical confusion point in the plan; defer public ecosystem polish.

### DX Challenge-Gate Conclusion

Challenge demo-first horizontal expansion. Preserve the approved product and UI scope, but stop treating a locally running page as proof of a reproducible system. The required maintainer contract is: clone -> install -> validate environment -> start ready PostgreSQL -> apply versioned migrations -> seed isolated development data -> start services -> prove database readiness -> log in -> prove role isolation -> run one root quality gate. No module should advance until this path works from a clean Windows checkout.
