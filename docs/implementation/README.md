# HR Management Portal Implementation Plan

This is the execution reference for turning the reviewed `staging` prototype into a secure, testable HR Management Portal. It converts the completed CEO, design, engineering, and developer-experience reviews into ordered implementation gates.

Use this document to decide **what to build next**. Use [How to execute Gate 0A](how-to-execute-gate-0a.md) for the first hands-on implementation slice. The full evidence, scorecards, architecture findings, risk registries, and requirement coverage remain in the [gstack project review](../reviews/2026-08-29-staging-project-autoplan.md).

## Current status

| Item | Status |
|---|---|
| Branch | `staging` |
| Review | Complete |
| Application implementation | Not started from this plan |
| UAT readiness | No-go |
| Production readiness | No-go |
| First approved slice | Gate 0A: database and executable contract baseline |

The current tree contains extensive uncommitted user work. Preserve it. Do not reset, discard, or broadly stage files.

## What the reviews concluded

### CEO/product review

- The PDF scope solves the right business problem.
- Horizontal screen expansion created breadth without trustworthy workflows.
- Security, privacy, migrations, audit, and tests must gate every phase.
- The first useful release is a secure employee system of record, followed by travel/assets, talent workflows, and trusted analytics.

### Design review

- Current design readiness is 2.6/10.
- The visual foundation is reusable, but mock data is often presented like live HR data.
- Navigation, dashboards, routes, fields, and actions must reflect effective permissions.
- Every workflow needs loading, honest empty, filtered-empty, error, retry, forbidden, success, and transition states.
- Previously approved removals stay removed.

### Engineering review

- Current engineering readiness is 2/10.
- The current Prisma schema has 42 validation errors, including a duplicate `REMOVED_ROLE` and missing `User`/`Employee` model declarations.
- Module permissions do not consistently enforce employee, direct-report, organization, and restricted-field scope.
- Client methods, paths, fields, enums, validation shapes, and ID assumptions drift from the server.
- No migration history, automated tests, or CI gates exist.

### Developer-experience review

- Current maintainer readiness is 2.1/10.
- A fresh checkout can take 30–60+ minutes or remain blocked.
- Docker credentials, environment templates, ports, schema setup, and README instructions disagree.
- Target: a prepared Windows workstation reaches a database-backed role login in 10 minutes or less.

## Implementation principles

1. **Preserve user work.** Inspect and stage files by exact path. Never use broad resets or `git add -A`.
2. **Fix foundations before features.** Do not add module breadth while schema, authorization, contracts, or quality gates are red.
3. **Use fresh development data for migration proof.** Do not reset or repurpose an existing Docker volume without explicit approval and a verified backup.
4. **The server is the security boundary.** UI hiding is useful but never replaces server query scope and safe field projections.
5. **One contract owns each fact.** Roles, IDs, enums, request shapes, responses, environment defaults, and workflow transitions must not be duplicated by hand.
6. **A screen is not complete until failure paths work.** Loading, empty, error, forbidden, retry, success, concurrency, and audit behavior are acceptance criteria.
7. **Checkpoint small verified slices.** Review after each gate; do not combine schema recovery with broad feature work.

## Delivery roadmap

```text
Gate 0A  Database and executable baseline
  -> Gate 0B  Authorization, sessions, and safe contracts
  -> Gate 0C  Audit, diagnostics, tests, and CI
  -> Gate 1   Secure employee core
  -> Gate 2   Travel and assets
  -> Gate 3   Recruitment, performance, and training
  -> Gate 4   Dashboards, attrition, and reports
  -> Gate 5   Deferred integrations
```

## Gate 0A: database and executable baseline

Goal: make the repository start from a fresh development database, build both applications, complete a real login, and deny a cross-employee read.

| Task | Work | Exit evidence |
|---|---|---|
| G0A-1 | Preserve and inventory the dirty tree | Exact intended files listed; unrelated changes remain unstaged |
| G0A-2 | Restore canonical `User` and `Employee` models and one role enum | Prisma validate and generate pass |
| G0A-3 | Reconcile schema relations, IDs, Decimal money, current modules, and safe lifecycle fields | Server compiles against the generated client |
| G0A-4 | Establish a migration baseline on a fresh development database | Empty DB migrates without `db push` or destructive reset |
| G0A-5 | Rewrite seed as development-only and non-destructive by default | Seed refuses unsafe environments; role fixtures are repeatable |
| G0A-6 | Make one server environment template authoritative and align Compose | PostgreSQL readiness passes with documented defaults |
| G0A-7 | Make server and client builds pass | Root build succeeds |
| G0A-8 | Add first login and cross-employee denial smoke tests | Valid login succeeds; unrelated employee record is denied |

Execution guide: [How to execute Gate 0A](how-to-execute-gate-0a.md).

Stop and review after Gate 0A. Do not proceed merely because the login page loads.

## Gate 0B: authorization, sessions, and contracts

Goal: establish a reusable security and API contract spine before completing workflows.

- Implement `SELF`, `TEAM`, `ORG`, and `RESTRICTED` scope in database predicates for every read and mutation.
- Limit Reporting Managers to current direct reports plus explicit, audited, time-bounded delegation.
- Prevent REMOVED_ROLEs from restricted salary, bank, government ID, candidate compensation, and final recommendation fields by default.
- Replace broad relation includes with purpose-specific safe selections.
- Add short-lived access tokens and rotating, server-revocable sessions.
- Revoke sessions after deactivation, password change, role/permission change, or administrator action.
- Align request methods, paths, params, query, body, CUID IDs, enums, responses, and error codes.
- Adopt an OpenAPI-centered contract and generated client request/response types.
- Protect notification read/update/delete with recipient ownership.

Exit evidence:

- Five-role positive and negative authorization matrix passes.
- Guessed record IDs never expose or mutate unrelated data.
- Password hashes and restricted fields do not appear in response snapshots.
- Expired, revoked, and inactive sessions fail predictably.
- Client/server contract tests pass.

## Gate 0C: audit, diagnostics, tests, and CI

Goal: make every future change measurable and safe to merge.

- Add central audit and login-history producers for logins, permission changes, mutations, approvals, downloads, exports, and security events.
- Split process liveness from database/schema readiness.
- Add stable error codes, correlation IDs, PII-safe structured logs, and actionable recovery messages.
- Configure ESLint and a test runner instead of keeping unusable scripts.
- Add unit, route-contract, authorization, migration, and browser smoke tests.
- Add one root verification command.
- Add a pull-request workflow that runs schema validation/generation, migration proof, builds, lint, tests, and DB-backed smoke checks.

Exit evidence: a clean checkout passes the same root command locally and in CI; deliberate DB-down, validation, session, forbidden, and internal-error drills produce useful signals.

## Gate 1: secure employee core

Goal: deliver the first usable HR vertical slice.

- Employee account invitation, activation, password setup/reset/change, deactivation, session revocation, and effective-dated history.
- Self, Manager, HR, and Restricted employee profile projections.
- Private employee documents with quarantine/scanning, short-lived downloads, retention state, and audit.
- Versioned policies with applicability, acknowledgement assignment, reminders, and history.
- Requests/helpdesk with `HR-YYYY-NNNNNN`, assignment, SLA, comments, attachments, transitions, close/reopen rules, notification, and audit.
- Role-specific work queues and dashboards backed only by real sources.

Exit evidence: all five roles complete their intended browser/API journeys; unrelated and restricted access tests remain green; offboarding revokes access without erasing required history.

## Gate 2: travel and assets

Goal: complete two controlled operational workflows using the Gate 0/1 infrastructure.

- Travel request, manager approval, advance, evidence, verification, Decimal/INR totals, settlement, history, retries, and concurrency.
- Asset register, assignment, custody ledger, condition, return, loss/damage, employee view, history, retries, and concurrency.

Exit evidence: valid and invalid transitions, duplicate submissions, concurrent actions, manager scope, financial totals, and report reconciliation pass.

## Gate 3: talent workflows

Goal: deliver recruitment, performance, and training with explicit stage ownership.

- Recruitment: requisitions, candidate confidentiality, resume security, interview history, offer history, join/reject states, and metric provenance.
- Performance: Employee -> Manager -> HR -> Final workflow, field ownership per stage, confidential/released views, and immutable history.
- Training: targeting, assignment, attendance, feedback, assessment, certificate security, cost, completion, and effectiveness.

Exit evidence: every stage has an actor, allowed input, legal transition, recovery behavior, audit event, notification, and negative authorization proof.

## Gate 4: dashboards, attrition, and reports

Goal: publish analytics only after their source workflows are trustworthy.

- Define every metric owner, formula, denominator, time window, source, freshness, role scope, and privacy threshold.
- Calculate attrition from effective-dated join/exit events.
- Add permission-scoped drill-downs and controlled, audited exports.
- Start with CSV; add required XLSX/PDF only after authorization and reconciliation are proven.

Exit evidence: dashboard totals reconcile to source records; no aggregate or drill-down leaks restricted information; empty/stale/error states are explicit.

## Gate 5: deferred integrations

Do not start until Gates 0–4 are stable:

- Email, WhatsApp, and SMS notifications.
- Advanced automation and analytics.
- Generic custom-role infrastructure.
- External payroll, attendance, and leave integrations.

## Scope that stays removed

- Attendance and time tracking.
- Leave/time-off management.
- News and tasks/to-do.
- Payroll processing as a module.
- Dashboard calendar/events and to-do widgets.
- Employee directory and organization chart.
- Avatar/profile-photo UI.
- Generic or bulk downloads.
- Social login and signup.

Restricted salary, bank, statutory, and compensation data may exist inside protected employee records. That does not restore payroll processing or broad export screens.

## Working cadence

For every implementation slice:

1. Record the intended files and acceptance checks.
2. Inspect current user changes before editing overlapping files.
3. Implement one coherent unit.
4. Run the smallest relevant checks while developing.
5. Run the complete gate verification once.
6. Review security, data loss, and permission effects.
7. Stage only intentional paths and checkpoint the verified unit.
8. Update this plan's status table.
9. Stop at the gate boundary for review.

## Definition of done for every module

A module is ready only when all applicable items pass:

- Schema and migration are versioned and reproducible.
- Server input, state transition, record scope, and restricted projection are enforced.
- Client and server share the same executable contract.
- Loading, honest empty, filtered-empty, error/retry, forbidden, success, and disabled-transition states exist.
- Audit and in-system notifications come from real domain events.
- Positive and negative role tests pass.
- Duplicate, retry, timeout, concurrency, and rollback behavior is defined.
- Mobile and keyboard journeys pass.
- Documentation and operational recovery instructions match reality.
- No fixtures or plausible fake data appear as live production data.

## Review and implementation documents

- [Full gstack project review](../reviews/2026-08-29-staging-project-autoplan.md): evidence, scorecards, architecture, risks, decisions, and coverage matrix.
- [How to execute Gate 0A](how-to-execute-gate-0a.md): safe hands-on sequence for the immediate implementation slice.
