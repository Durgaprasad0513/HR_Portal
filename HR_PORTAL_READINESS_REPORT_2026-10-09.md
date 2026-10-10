# HR Portal production readiness review

**Recommendation: NO-GO for release of the reviewed checkout.** The portal loads and its Admin navigation works, but account takeover, authorization, financial integrity and operational defects prevent a readiness sign-off.

**Date:** 9 October 2026. **Production target:** https://hr.pafpl.in/. **Source:** commit `dad45a105096dd69c2df3a3276412489b062fa1b`.

The deployed commit and environment configuration were not available for comparison. Source findings apply to this checkout; only findings explicitly labeled **live** were observed in production. A working page is not proof that its writes, permissions or recovery work.

## Approach and limits

- Installed [Codex Advisor](https://github.com/codyrobertson/codex-advisor) and [gstack](https://github.com/garrytan/gstack) from their repositories. Codex Advisor guided independent security and frontend/operations reviews. gstack's report-only QA principles guided charters, evidence labels and reporting; its browse tool was used for an anonymous smoke check.
- gstack 1.91.68.0, Bun and Chromium installed successfully. **gstack CSO: NOT ASSESSED**: its hardened native launcher was unavailable; setup requires Visual Studio 2022 Build Tools with Desktop development with C++. The independent security source review below is not a completed CSO audit.
- Prior live Admin browser baseline covered 16 sections, searches, filters, empty states and form validation. Fresh mobile login inspection used 390 × 844 and found no horizontal overflow.
- gstack's own headless browser independently loaded the production login, captured its accessibility tree and reported no console errors. Its screenshot command wrote a valid PNG, but then exited with a Sharp architecture error; the PNG was opened and visually verified. A dependency repair attempt was rejected by an npm override conflict. This is a tool limitation, not a portal defect. The browser daemon was stopped after testing.
- Six isolated service probes used compiled local code with fake database/notification/JWT-verifier boundaries. They made no database connection, HTTP request or outbound notification. These demonstrate service behavior, not production exploitation or full database integration.
- No deliberate production record, approval, permission or password changes were submitted. **Correction to the earlier report:** employee profile GETs create joining notifications in this source. Earlier live profile opens may therefore have generated notifications automatically. No further profile opens were made after finding this.
- Total session elapsed: unmeasured. No numeric health score is assigned because role, write, performance and recovery coverage is incomplete.

## Release blockers

### R01 · Critical · Public password setup accepts a raw user ID

**Observed:** `POST /api/auth/setup-password` is public. `setupPassword` treats `input.token` as the user ID, writes a new password, activates the account and increments token version without validating an invitation, expiry or single use.

**Expected:** only a valid, short-lived, single-use invitation/reset token can authorize this change; arbitrary user IDs cannot.

**Evidence:** `server/src/modules/auth/auth.routes.ts:14`; `auth.service.ts:155–184`. Employee detail includes linked user IDs. Local probe accepted a fixture user ID, wrote a password and reactivated an inactive account.

**Confirmation:** source and isolated service probe; no live reset attempted. **Action:** disable this endpoint until secure token verification is implemented. Test replay, expiry, invalid token and inactive-account cases.

### R02 · High · Role demotion leaves existing sessions with the old role

**Observed:** `changeRole` updates only the database role. Authentication checks activity/token version, then assigns `req.user.role` from the JWT. Local fixture with database role EMPLOYEE and an old ADMIN token continued with effective role ADMIN.

**Expected:** demotion removes privileges on the next request.

**Evidence:** `server/src/modules/users/user.service.ts:103`; `server/src/middleware/auth.middleware.ts:34–55`; default token expiry is seven days.

**Confirmation:** source and isolated middleware probe with a stubbed decoded token. Cryptographic token verification was outside this probe. **Action:** use current database role/employee linkage and revoke sessions when either changes.

### R03 · High · Employee edit permissions reach unrelated performance/training records

**Observed:** default EMPLOYEE permissions include performance/training edit. Generic performance update, training update and participant add/remove routes accept record IDs; their services lack ownership or staff checks.

**Expected:** self-appraisal/feedback permissions cannot grant organization-wide administrative edits.

**Evidence:** `permission.catalog.ts:135–136`; `performance.routes.ts:20`, `performance.service.ts:102–115`; `training.routes.ts:21–25`, `training.service.ts:79–138`.

**Confirmation:** source only; production permission rows and cross-user writes untested. **Action:** split self-service from staff operations and enforce record ownership at service boundaries. Verify Employee, Manager, HR and Admin against other employees' IDs.

### R04 · High · Uploaded files have a public path that bypasses document authorization

**Observed:** Express serves `/api/uploads` before authentication. Both upload mechanisms store files in that directory; document metadata exposes file paths. The protected download endpoint and its audit do not protect the static path.

**Expected:** HR documents require current authorization on every read, even when a file URL is known.

**Evidence:** `server/src/app.ts:51`; `modules/upload/upload.routes.ts:30–31`; `modules/employees/document.routes.ts:9–15`, `document.service.ts:19,42–45`.

**Confirmation:** source only; no real employee file was downloaded anonymously. **Action:** private storage, authenticated downloads or short-lived authorized URLs; avoid exposing internal storage paths.

### R05 · High · Travel settlement concatenates Decimal values

**Observed:** existing Prisma Decimal values are added using JavaScript `+`. Fixture expenses 100 + 20 + 30 + 40 yielded string `100203040`, and payable `100202990` instead of 140 after a 50 advance. An explicit all-zero adjustment fell back to the old total 190.

**Expected:** total 190, payable 140; zero adjustments remain zero.

**Evidence:** `server/src/modules/travel/travel.service.ts`, `updateSettlement`; retained [probe results](.gstack/qa-reports/readiness-2026-10-09/local-probes-results.json).

**Confirmation:** isolated service probe capturing the Prisma update payload; actual database persistence untested. **Action:** Decimal arithmetic throughout, no truthiness fallback, valid lifecycle transitions and a defined recovery rule for negative payable balances.

### R06 · High · Leave approvals are not atomic

**Observed:** balance debit precedes status update, outside a transaction. Two parallel fixture approvals debited twice; a failed status write retained one debit. Approval does not recheck balance; it debits the current calendar year rather than allocating leave dates across years.

**Expected:** exactly one approval/debit, atomic rollback on failure, valid balance and year allocation.

**Evidence:** `server/src/modules/leave/leave.service.ts`, `updateStatus`; retained probe results.

**Confirmation:** source and isolated failure/concurrency schedule; real PostgreSQL isolation untested. **Action:** transaction plus conditional state change/locking and balance constraint. Test concurrent approval, failure rollback and cross-year leave.

### R07 · High · Startup performs destructive department cleanup

**Observed:** every server start calls cleanup that deletes named departments, including COMMERCIAL and PROCUREMENT, and sets affected employee/training department links to null. It is not transactional and catches errors while startup continues.

**Expected:** routine restart never silently removes business master data.

**Evidence:** `server/src/server.ts:9–10`; `server/src/cleanup.ts:14–48`.

**Confirmation:** source only; cleanup deliberately not executed. Actual affected production names unverified. **Action:** remove from startup; use a reviewed, backed-up, transactional migration with explicit mappings.

### R08 · High · Upload persistence is absent from declared deployments

**Observed:** files are stored on local disk; Render configuration declares no persistent disk, and production Compose declares no uploads volume.

**Expected:** uploaded documents survive deployment/container replacement and can be restored with database metadata.

**Evidence:** `render.yaml`; `docker-compose.prod.yml`; upload/document services.

**Confirmation:** configuration only; actual hosting overrides unverified. **Action:** durable private object storage or persistent disk, backup/restore procedure and replacement-container verification.

### R09 · High · Restricted performance fields leak through alternate responses

**Observed:** employee detail includes complete nested `performanceReviews`. Restricted-field stripping only handles the selected top-level module. `getMyReviews` also selects salary/promotion recommendations without restricted-field filtering.

**Expected:** the same field policy applies to every response path, including nested relations.

**Evidence:** `employee.service.ts:132`; `utils/restrictedFields.ts:31–35`; `performance.service.ts:45–56`; `permission.catalog.ts:98–109`.

**Confirmation:** source only; live non-Admin responses untested. **Action:** response DTOs with explicit authorized fields, and tests for nested/alternate endpoints.

## Other findings requiring remediation

| ID / priority | Observed and expected | Evidence / confirmation | Action |
| --- | --- | --- | --- |
| R10 High, conditional | Missing JWT_SECRET falls back to a public constant instead of refusing startup. Deployed secret unknown. | `config/index.ts:9`; source | Fail startup in production when secret missing/weak; validate configuration. |
| R11 High, live | Supplied credentials authenticated as Admin and were weak. Credentials shared in this conversation should be treated as exposed. | Earlier browser baseline; passwords omitted | Rotate/disable supplied accounts; strong unique Admin credentials and MFA. |
| R12 Medium | Default Employee can request travel but cannot submit expenses: UI and route require edit, default travel edit is false. | `permission.catalog.ts:129`; `TravelListPage.tsx:169`; `travel.routes.ts:17`; source | Owner-only submission permission and complete Employee journey test. |
| R13 Medium | Multipart memory upload has no byte limit and buffers before checking module permission. HTML/SVG extensions are allowed and served as active content on the API origin. | `upload.routes.ts:13–23`; `app.ts:51`; source | Enforce size/type limits before buffering; isolated download origin or attachment delivery. Verify scanner behavior. |
| R14 Medium | Dashboard exports are gated only by dashboard export, while report services read other modules without their view/export/restricted-field checks. | `dashboard.routes.ts:11`; `dashboard.service.ts:528–625`; source | Apply target module and field permissions to each report type. |
| R15 Medium, conditional | Without SMTP, onboarding uses Ethereal and sends identity plus temporary password there. Async initialization can silently skip an early welcome email. | `utils/email.service.ts:13–79`; source; deployed SMTP unknown | Production must fail configuration validation or use an explicit disabled mode; queue delivery with retry and signed invitations. |
| R16 Medium | Employee GET creates a new joining notification each time. | `employee.service.ts:136–141`; source; earlier unread count grew, causal link not runtime-isolated | Move notification to successful creation and make it idempotent. Correct historical notification noise after review. |
| R17 Medium | Generic settlement can settle without validating approval/submission state; submitExpenses lacks a SETTLED guard. Office expenses can change status without transition checks or audit. | travel `updateSettlement/submitExpenses`; `expenses/expense.service.ts:updateStatus`; source | Explicit state machines, conditional writes, audit and authorization for reversals. |
| R18 Medium | Leave dates only require nonempty strings; JS parsing can roll invalid dates into other dates. Missing balances allow paid leave without a defined allowance; partial-day flags lack combined/multiday validation. | `leave.schema.ts`; `leave.service.ts:apply`; source | Validate actual calendar dates and supported combinations; define missing-balance behavior and pending reservations. |
| R19 Medium | Helpdesk IDs use count+1, allowing concurrent collisions. Closure timestamp checks CLOSED although valid status is TICKET_CLOSED. | `requests/request.service.ts:createRequest/updateRequestStatus`; `request.schema.ts`; source | Database sequence/atomic numbering; align enum and timestamp rule. |
| R20 Medium | Travel/expense query errors can render as empty lists; expense mutations lack actionable error feedback. | `TravelListPage.tsx:38,275`; `OfficeExpensesPage.tsx:31–49,207`; source | Distinct error/retry states; preserve input and display rejection reasons. |
| R21 Medium | Shared Select opens with keyboard but its options have only mouse handlers; hidden native select provides no keyboard fallback. | `components/ui/Select.tsx:137–173`; source | Accessible native select or complete combobox/listbox keyboard and focus behavior. |
| R22 Medium | CSV exports interpolate unquoted fields; commas/newlines alter columns and formula-leading text is not protected. | travel page `96–101`; expense page `54–59`; source | CSV serializer, spreadsheet formula neutralization and representative export fixtures. |
| R23 Medium | Denied dashboard access redirects to the same protected dashboard; permission-loading failure lacks recovery destination. | `routes/ProtectedRoute.tsx:36`; `AppRoutes.tsx:51`; source | Access-denied/error page with retry and allowed destination. |
| R24 Medium, live | A future rejected interview appears on dashboard but is excluded from default interview list. | Prior live baseline; `dashboard.service.ts:311`; `InterviewCalendarPage.tsx` | Apply consistent actionable status filter. |
| R25 Low, live | Password eye button has no accessible name; clickable dashboard interview div lacks keyboard semantics. | Fresh mobile DOM inspection plus prior live baseline/source | Labeled visibility button; use link/button for navigation. |

## Build, tests, dependencies and delivery

| Check | Result | Practical meaning |
| --- | --- | --- |
| Client production build | Passed in earlier baseline; chunk >500 kB warning | Compiles; loading speed not established. |
| Server Prisma/TypeScript build | Passed in earlier baseline | Compiles; migration/runtime correctness not established. |
| Existing server tests | 6 passed, one mocked permission suite | No integration coverage for the blockers above. |
| Client tests | No test files; exit 1 | Frontend release gate cannot pass as configured. |
| Client lint, fresh run | Exit 1: two unescaped-apostrophe errors and one hook dependency warning | `EmployeeDashboard.tsx:302`, `LeaveApplicationPage.tsx:274`, `RecruitmentPage.tsx:43`; CI uses zero warnings. |
| Server lint, fresh run | Passed | Static lint only. |
| Isolated service probes | Six adverse outcomes reproduced | Password setup, stale role, Decimal total, zero adjustment, concurrent leave and failed-write debit. |
| Fresh production dependency audit | Client 0 advisories; server 1 critical `proxy-addr` | See retained audit JSON. An advisory is not a proven live exploit. |
| CI source review | Root `npm ci` with no root lockfile; failing client lint/tests; high-level server audit gate | Current clean-checkout CI cannot complete. Repair gates, then demonstrate a green run. |
| Production Compose source review | References absent `client/Dockerfile`; no uploads volume/migration gate | Declared Docker deployment is not reproducible from this checkout. |
| Render source review | Migrate-deploy hook exists; uploads persistence absent | Verify actual environment matches configuration and storage survives replacement. |

The server production advisory is [GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), affecting locked `proxy-addr` below 2.0.8. No Express trust-proxy configuration was found, so the required deployment conditions and live exploitability remain unverified. Update and rerun the audit. Earlier full-development audit counts in the initial report are not production-only counts.

Additional operational gaps:

- `/api/ready` only performs SELECT 1; it does not check schema/migrations despite its comment. No demonstrated graceful shutdown, restore rehearsal, alerting or job retry mechanism was available.
- Fresh anonymous requests to **hr.pafpl.in** `/api/live`, `/api/ready`, `/api/employees` and `/api/users` all returned HTTP 200 **HTML frontend content**. This neither proves API authentication failure nor healthy API readiness. Production may use a separate API base URL; verify monitoring against that actual origin. Retained results: `public-http.json`.
- CORS reflects arbitrary origins with credentials; configured CORS_ORIGIN is unused. Bearer authentication means this alone does not establish a cookie-based CSRF exploit. Apply an origin allowlist and verify edge headers/rate limits.
- No application login/reset throttling was found. Proxy controls, TLS policy, CSP and rate limits at the hosting edge are unverified.
- Several write operations commit business data before audit/notifications, so downstream failure can report failure after a successful write. Use transactional audit and an outbox for external effects.
- Most lists load entire datasets. Permission checks repeatedly call createMany(skipDuplicates) for all default permissions. No representative load/volume test was run; assess query counts, pagination, indexes and connection pooling before scale sign-off.
- Shared numeric inputs strip decimal entry. Whether whole-number money/hours are intended needs a written business rule before declaring precision support.

## Feature and quality coverage

| Area | What was checked | What is still unverified |
| --- | --- | --- |
| Authentication/accounts/settings | Live Admin login, required fields, password toggle; source reset, sessions, role changes | MFA, rate limiting, secure invitation lifecycle, password-change replay |
| Roles/permissions/login history/audit | Admin pages; permission middleware/defaults, ownership and field masking; 6 existing tests | Live Employee/Manager/HR matrix, revoked sessions, report restrictions |
| Employees/departments | Live list/filter/search/profile/form validation; schemas and lifecycle source | Isolated create/edit/offboarding, uniqueness conflicts, department migration |
| Recruitment/interviews | Live requisition form/cancel, calendar/history; stage/service source | Offer/rejection/onboarding transitions, vacancy rules, concurrent updates, emails |
| Dashboard/attrition/reports | Live cards/navigation; aggregation/export source | Financial/report reconciliation, date boundary accuracy, authorized exports |
| Leave/approvals | Live list/form validation; balance and concurrency probes | PostgreSQL transaction behavior, partial days, holidays, cross-year allocation |
| Travel/office expenses | Live sections; owner permissions, Decimal settlement probes, state/UI/export source | Full Employee submission and HR settlement, receipts, reversals and audit |
| Performance/training | Live sections; review stages/weights, ownership/field policy, participant source | Cross-role writes, locking, feedback/assessment and final approval lifecycle |
| Assets | Live section; assignment/return/damage/lost scope and status source | Concurrent assignment; Employee return/damage permissions; retained history |
| Helpdesk/requests | Live section; ID generation, assignment, status/SLA source | Concurrent submissions, closure timestamps, SLA escalation |
| Policies/documents/uploads | Live section; authorization paths, persistence and upload source | Malware scan, authorized downloads, version/acknowledgement lifecycle, restore |
| Notifications/email | Source recipient scoping, read operations, onboarding and dispatcher | Real SMTP delivery, retry/idempotency, notification load and opt-out rules |
| UX/accessibility/responsive | Live initial narrow-screen baseline; fresh mobile login without overflow; shared controls/source | Full mobile/tablet Admin pages, screen reader, zoom, keyboard-only feature journeys |
| Reliability/performance/security/operations | Builds/lint/audits; schema, configuration, startup, CI and health source | Load/soak, production headers/TLS, backups/restore, deployment rollback, hardened CSO, independent penetration test |

Positive observations: feature routes are lazy-loaded; shared modal source includes labeling, focus trapping/restoration and Escape handling; settings validates password input and signs out after success; dedicated self/manager appraisal paths contain ownership checks; several services use transactions and audit logs. These do not cancel the generic-route and integrity findings.

## Release sequence and acceptance criteria

1. **Contain security exposure:** disable insecure password setup, rotate exposed test Admin credentials, correct session demotion, isolate document storage and fix generic edit ownership/field leaks. Confirm against actual deployed revision.
2. **Repair integrity:** Decimal settlement, atomic leave approval, travel/expense lifecycle, startup cleanup, idempotent notifications and helpdesk numbering/closure.
3. **Make delivery repeatable:** root lockfile or correct root install, green lint/tests/audit, complete Docker files or document the supported deployment path, durable private uploads and production config validation.
4. **Verify in a disposable environment:** test accounts for all four roles; fixtures spanning valid/invalid transitions, concurrency, failed writes, dates and exports. Add PostgreSQL integration tests and browser tests that detect these findings.
5. **Run operational gates:** representative load, replacement deployment, backup/restore and rollback rehearsal; monitor real API JSON readiness and error/latency signals. Complete hardened CSO or equivalent security assessment.

A readiness sign-off requires demonstrated fixes and these gates passing. This report is a broad review and targeted verification, not a claim that every production feature or role was fully tested.

## Retained evidence

- Initial live baseline: `PRODUCTION_QA_REPORT_2026-10-09.md`.
- Charters and replay harness: `.gstack/qa-reports/readiness-2026-10-09/charters.md`, `local-probes.cjs`.
- Service observations: `local-probes-results.json`.
- Dependency evidence: `client-audit.json`, `server-audit.json`.
- Public health/routing observations: `public-http.json`.
- gstack anonymous browser evidence: `gstack-login-snapshot.txt`, `gstack-login-console.txt`, and visually verified `gstack-login.png` (command caveat above).

### Login evidence

![Anonymous production login captured with gstack](.gstack/qa-reports/readiness-2026-10-09/gstack-login.png)

### Operational learning retained in this report

On Windows, install gstack source outside its Codex runtime directory before setup; source-directory migration from inside Git Bash failed with a busy-directory error. Bun ARM installation also left the compiled browser screenshot post-processing unable to resolve the x64 Sharp runtime. Preserve the command's exit status even when its PNG is valid. These observations are retained here without enabling external learning synchronization.

No product source, deployment, permissions or database migrations were changed by this review. Installed skills/tools and audit artifacts are the local changes.
