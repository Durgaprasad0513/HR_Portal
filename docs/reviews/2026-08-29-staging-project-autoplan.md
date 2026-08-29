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
