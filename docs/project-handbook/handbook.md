# HR Portal: technical handbook and review preparation

This handbook explains the implemented project, the engineering trade-offs, and how to discuss it in a technical review. Read it alongside the interactive architecture and workflow explorer in [index.html](index.html). The [code reference](code-reference.md) lists the declared API routes, every Prisma model and enum, and package commands. The [commit tracker CSV](notion-tracker.csv) and [evidence JSON](evidence.json) preserve the history behind changes.

The repository is the evidence for implementation. A commit is evidence of a recorded code change, not proof of production deployment or a successful test run. Technology rationales below are engineering explanations of why the choices fit this project, unless a commit explicitly records the original reason. They should not be presented as a personal decision you remember making without checking your own recollection.

## 1. The explanation to give first

“I built an HR portal with a React and TypeScript frontend, an Express and TypeScript backend, and PostgreSQL accessed through Prisma. The backend is a modular monolith: HR features have their own route, controller, validation, and service files, but run in one application and share one database. JWT authentication identifies the user; backend permissions and record scoping control what they can do. It covers employees, hiring, leave, travel, expenses, assets, training, performance, policies, and helpdesk workflows. We can scale the deployment in stages, but independent module scaling would require extracting services and addressing shared data and operational limits.”

That is a description of the code. For “where is it deployed?”, the supplied context is Techsupport Lohitha. Git history also includes a merge from `techsupportlohitha:main`, which may identify a repository/account rather than a hosting provider. The Render and Vercel configuration files describe specific deployment paths, but cannot establish which account, provider settings, commit, database, or storage is live. Confirm those details from the production owner's deployment configuration. Do not claim AWS, a load balancer, autoscaling, Kubernetes, replicas, or a backup policy from this repository alone.

## 2. What problem each part solves

HR information is related: an employee belongs to a department, requests leave or travel, receives an asset, attends training, and participates in a performance review. Recruiting has a separate candidate lifecycle that references a requisition and interviewer. A browser UI helps people use those workflows; the backend protects the data and enforces state changes; the relational database preserves links and constraints.

The project keeps these responsibilities in three layers. The client displays information and collects input. The server authenticates requests, applies business rules, and controls persistence. PostgreSQL stores records, with files stored separately through a provider adapter. This separation allows the client to change without moving authorization into the browser and allows the storage provider to change without replacing every feature's storage calls.

### Technology choices and trade-offs

| Choice in the repository | Why it fits this portal (engineering assessment) | Cost or limitation to explain |
|---|---|---|
| React 18 | Reusable forms, tables, modals, layouts, and feature screens | Browser state and server state must remain consistent; complex screens can grow large |
| TypeScript on client and server | Catches many type mistakes during builds and makes interfaces easier to navigate | Types are erased at runtime; several services still accept `any`, so validation is essential |
| Vite | Builds the frontend and provides a development server with an API proxy | It does not host or implement the production API; frontend environment variables are baked into the build |
| React Router | Maps URLs to screens; lazy routes load feature pages on demand | The production host must fall back to index.html for client routes |
| TanStack Query | Caches API data, refetches, and invalidates queries after mutations | Client caching is not a shared backend cache; polling still generates API/database load |
| Axios | Central API base URL, JWT header attachment, and a shared 401 handler | Every request still needs backend authorization; interceptors do not provide security themselves |
| Tailwind CSS and shared UI components | Consistent spacing, colors, layout, controls, and responsive screens | Reuse requires discipline; very large page components can still diverge |
| Express on Node.js | Small HTTP layer suited to database and file I/O; common language across layers | CPU-heavy work blocks the process unless moved to workers; middleware order matters |
| Zod | Validates untrusted request bodies and business inputs at runtime | Validation must actually be mounted on the route; valid input is not the same as authorized input |
| PostgreSQL | Relationships, foreign keys, unique constraints, transactions, and Decimal values suit HR records | Query design, connection limits, indexes, backups, and migrations become operational responsibilities |
| Prisma 6.4.0 | A shared typed data client, schema definitions, and versioned migrations | Complex concurrency still needs transactions/locks; some paths use raw parameterized SQL |
| JWT + bcrypt | Signed session identity and hashed passwords | Local-storage tokens are exposed to successful script injection; revocation requires the database/token-version check used here |
| Multer memory storage | Accepts multipart file uploads before adapter storage | Uploads occupy API memory; a 10 MB file limit does not by itself cap aggregate concurrent memory |
| S3-compatible storage adapter | One save/read interface works with S3, R2, Supabase, or local development files | Storage and database changes are not one atomic transaction; provider changes need file migration |
| Recharts, date-fns, pdfjs-dist, mammoth, qrcode.react | Charts, date helpers, browser resume text extraction, and employee QR passes | Library capability does not prove a complete business feature, OCR, or a particular backend integration |

For exact package versions and build scripts, use the generated reference. Package declarations describe requested versions; lockfiles determine resolved versions. This documentation does not certify compatibility with every newer Node or library release.

## 3. How the repository is organized

The root `package.json` runs the two apps together. It is not an npm workspace that automatically installs client/server dependencies. `client/` and `server/` each have their own package and lockfile.

- `client/src/main.tsx` creates the QueryClient and mounts the app. Default queries retry once, reuse data for 30 seconds, and refetch on window focus.
- `client/src/App.tsx` wraps application context and routing. `routes/AppRoutes.tsx` declares screens, lazy imports, and permission-based route wrappers.
- `client/src/contexts/AuthContext.tsx` owns the token and current-user query. Logging out clears query cache as well as the saved token.
- `client/src/api/` contains API wrappers. `api/client.ts` supplies `/api`, the bearer header, and 401 redirection.
- `client/src/pages/<feature>/` contains feature screens; `components/` provides shared UI and layout; `hooks/usePermissions.ts` controls UI visibility/actions.
- `server/src/server.ts` connects Prisma before starting the HTTP listener. `app.ts` wires cross-cutting middleware, health routes, and feature routes.
- `server/src/modules/<feature>/` normally groups route declarations, controllers, service code, and Zod schemas. This is organization by business feature.
- `server/src/config/database.ts` supplies the shared Prisma client. `config/storage.ts` supplies file save/read operations. `middleware/` supplies authentication, validation, and error handling.
- `server/prisma/schema.prisma` describes the data model. `migrations/` describes schema/data evolution. `seed.ts` bootstraps development data.
- `server/tests/` and colocated client test files record regression expectations. `.github/workflows/ci.yml` defines the automated checks.

### Routes, controllers, services, and data access

A route declares an HTTP method/path and middleware. A controller reads validated input and request identity, calls a service, and formats the response. A service applies workflow rules and reads/writes Prisma. A Zod schema rejects invalid external data. Prisma maps data operations to PostgreSQL.

This is the intended structure, with exceptions: photo uploads and development maintenance operations contain work directly in employee routes; many services use `any`; controllers do not all use identical error formatting. Say “feature-based layered organization,” not “every dependency is perfectly isolated.”

## 4. One request, end to end

Use an employee-list request as an example. The user opens `/employees`; ProtectedRoute checks current-user state and module visibility. The page invokes the employee API wrapper through Query. Axios sends `GET /api/employees` with a bearer token. In development Vite proxies this to port 5000.

Express attaches a correlation ID and handles CORS/parsing. Employee routes require authentication and `employees:view`. Authentication verifies the JWT, reloads the current User, rejects inactive/deleted/revoked sessions, and attaches the current role and linked employee ID. The employee service builds a visibility filter and pagination query. Prisma loads rows and counts. The controller returns data/meta; the page renders the result.

Employee lists exclude reserved `USR-*` account profiles. Default employee pagination is page 1, limit 10. Search splits words and matches name/email/code case-insensitively. Recruitment candidate pagination is implemented separately; not every list endpoint is paginated. See `server/src/modules/employees/employee.service.ts` and `server/src/modules/recruitment/recruitment.service.ts`.

General responses often use `{ success, message, data, meta? }`. Health routes and the global error middleware have their own shapes; do not describe one universal response envelope. Validation errors, controller errors, and storage errors have different handlers. Correlation IDs support troubleshooting, but there is no evidence here of a centralized tracing backend.

## 5. Authentication, authorization, and privacy

Authentication answers “who is making this request?” Authorization answers “is this user allowed to do it?” Data scope answers “which records can this user act on?” Restricted-field projection answers “which fields may this user receive?” These are separate checks.

### Login and session lifecycle

`auth.service.ts` accepts email or linked employee code, excludes soft-deleted users, checks activity and bcrypt password, records login history, and returns a JWT plus role permissions. JWT claims include userId, role, employeeId, and tokenVersion. The default expiration is seven days unless configured. `AuthContext` saves the token in local storage and caches current-user data. The Axios response interceptor clears the token and redirects on 401.

The server does not trust a stale role from the JWT for access decisions: it reloads the User during authentication and uses the current role. Password reset/status changes increment tokenVersion. User removal sets deletedAt/isActive and increments tokenVersion while preserving historical records. Ordinary client logout removes local state; it does not revoke every copy of that token on the server. There is no refresh-token exchange implemented in these auth routes. A twoFactorEnabled database field alone is not evidence of an implemented two-factor sign-in flow.

### Actual role behavior

Roles in the Prisma enum are ADMIN, HR, MANAGER, EMPLOYEE. The permission catalog contains 18 module keys and flags for view/add/edit/delete/approve/export plus restricted-field visibility. ADMIN and HR are locked to full permission access by permission.service.ts. Their matrix rows cannot be freely switched off. MANAGER and EMPLOYEE permissions can be updated through the permission workflow.

The `hasAdminAccess` helper includes ADMIN, HR, and MANAGER. Consequently `getModuleScope` currently returns ORG for all three and SELF otherwise; although TEAM/NONE types and query branches exist, the helper does not assign TEAM to managers. Default MANAGER permissions deny leave and roles while most other modules start full. Do not tell a reviewer “managers only see their direct reports” as a blanket claim. Performance appraisal has stage/actor-specific checks as well; current ORG manager behavior is broader than its “assigned manager” error wording suggests.

Restricted employee fields include pay, bank, tax, and statutory identifiers. Candidate compensation and asset purchase value have corresponding restricted field lists. Check `restrictedFields.ts`, controllers, and services to understand where projection is applied; a catalog entry alone does not prove every nested response is redacted. Employee/performance services also contain dedicated visibility projections for review stages.

## 6. Data model: the important relationships

User represents login/access; Employee represents a person's HR profile. The link lets the API associate actions with an employee without mixing passwords into HR data. Department groups employees; employee manager links describe reporting relationships. Role Management creates lightweight linked Employee records with reserved `USR-*` codes so those users can participate in assignment lookups while being excluded from employee directory/headcount logic.

Employee connects to leave/balances, documents, travel requests, assigned assets, performance reviews, training participation, helpdesk requests, policy acknowledgements, notifications, and attendance records. Requisition connects to candidates; Candidate connects to interviews and stage history. AuditLog and LoginHistory relate actions to a User. ModulePermission identifies a role/module combination.

Database constraints include employee/date uniqueness for attendance, employee/year/type uniqueness for leave balances, training/employee and policy/employee uniqueness for join records, and role/module uniqueness for permissions. Recruitment has explicit stage/time and interview lookup indexes. Read the exact model definitions in [code-reference.md](code-reference.md); they include field types, nullability, defaults, relations, database names, and constraints for every model.

Money uses Prisma Decimal in places such as travel settlement to avoid binary floating-point summation. That does not mean every frontend display and every monetary calculation has been audited for precision. Database constraints prevent certain invalid states but do not replace application permissions or state transitions.

## 7. Business workflows you should be able to explain

### Employee onboarding and user management

Start with departments, then create an employee with the necessary identity, employment, department, and reporting details. The employee service can provision an associated user account. Role Management also creates standalone access users with linked `USR-*` profiles. Account changes, reset/deactivation, and soft deletion should be explained separately from an employee's HR status/history. The development seed creates a foundational admin; production onboarding must follow the actual operational procedure rather than rerunning demo seed.

Documents pass through multipart upload, employee/module permission checks, storage save, and EmployeeDocument metadata. Verification changes document verification state. Public QR employee passes use a purpose-specific signed token; the verification endpoint returns only employee code, name, designation, and department for an active/on-leave employee. The QR token is not a login token. It has no explicit expiry in generatePublicEmployeeCardToken; active employee checks and signing-key changes affect validity.

### Recruitment and interviews

The normal candidate stages are TELEPHONIC → HR_INTERVIEW → TECHNICAL → MANAGEMENT → OFFER → JOINED. Requisition status, candidate stage, selection decision, offer decision, joining outcome, and interview appointment status represent different things. Keeping one field as “the whole recruitment status” would lose that distinction.

Create a requisition with title, department, location, and positive vacancy count. Add a candidate to the opening. Browser resume autofill extracts text from PDF/DOCX up to 20 MB; it is not OCR, AI ranking, or backend resume storage. Review extracted values before saving. Without a scheduled interview a candidate starts in Telephonic; scheduled interview creation currently targets HR, Technical, or Management rounds, not a Telephonic appointment in the new scheduling schema.

The interview calendar tracks startsAt, endsAt, timezone (default Asia/Kolkata), mode, location, interviewer, and status. Completing an appointment and submitting feedback are separate actions. Submitted previous-round feedback is projected into later-round views; drafts are not treated as submitted evidence. Skips or backward stage moves require a reason. Advancement from guarded interview stages requires submitted feedback; a backward move over completed submitted feedback can be locked. JOINED is recorded through the accepted-offer workflow.

Stage transitions check expectedStage to reject stale browser state and lock candidate rows with SELECT FOR UPDATE inside transactions. Requisition capacity-related paths also use row locks. These are concrete protections against conflicting updates, but do not prove every workflow in the project is race-free. CandidateStageHistory plus audit events record movements. The history contains a Screening-to-Telephonic migration; old field/enum names may remain for compatibility.

### Leave

An employee selects date range/type and optionally half-day/hourly details. Calendar dates are normalized to UTC date-only values. Sundays are excluded from day counting; Saturdays count as working days. Half-day/hourly leave is limited to one date; hourly minutes are divided by an eight-hour workday. The service checks overlaps and available balance when applicable.

Approval starts from PENDING. The approval transaction first claims the pending transition with a conditional update, then conditionally deducts balance. Failure rolls back the transaction, helping prevent double deductions on concurrent approvals. Rejection does not deduct balance. Only a pending leave can be cancelled. Some checks differ between application and approval: the apply path looks up the current calendar year, while approval uses the leave start year; cross-year rules need dedicated verification before claiming complete coverage.

### Travel and office expenses

Travel starts APPROVAL_PENDING and UNSETTLED. A request can include one or more travel modes; the primary travelMode remains the first selected mode. The form collects outbound and return amounts and calculates amountRequired as their sum; server validation checks that total when leg amounts are supplied. Existing requests are migrated with their prior travelMode copied into travelModes. Staff approve or reject; employees submit expenses for their own approved request. Submission changes settlement to SUBMITTED. Staff settlement computes total hotel + food + conveyance + other expenses and subtracts approved advance using Decimal. Settled expenses cannot be changed through the normal submission path. Approval and settlement are separate concerns.

Office expenses use their own model and transitions: PENDING → APPROVED or REJECTED; APPROVED → PAID. The status write checks the existing status. Receipts are retrieved through module/record-aware authenticated download endpoints. The schema's currency totals do not imply integration with payroll, banking, or an accounting system.

### Performance reviews

The implemented order is EMPLOYEE_REVIEW → HR_REVIEW → MANAGER_REVIEW → FINAL_APPROVAL → COMPLETED. Each actor submits stage-specific data. Self and manager submissions average seven metrics; HR has its own metric input. Final approval calculates the weighted rating: self 20%, manager 60%, HR 20%, rounded to one decimal. The API computes that result rather than trusting an arbitrary final rating from the browser.

The self-appraisal requires the review owner unless Admin overrides. HR cannot review their own appraisal through the HR-specific path. A manager cannot submit manager appraisal on their own review; the current ORG scope means the direct-manager restriction is not universally enforced for manager accounts. Final results and comments have stage-specific projections. The stage sequence and actor rules are separate from the generic module permission matrix.

### Assets, training, helpdesk, and policies

Asset assignment rejects an already assigned, lost, or retired asset. Employee return requests become RETURN_REQUESTED; a staff return clears assignment and marks RETURNED. Damage/loss paths record audit events. These asset state checks are application rules; concurrent check/write paths should be reviewed before claiming transactional assignment guarantees.

Training has programs and employee participation records. Staff assign participants and record attendance, assessment, and certification data. Trainees submit their own feedback; staff submit trainer feedback. Training/employee uniqueness prevents duplicate enrollment records. Training dashboards aggregate participation, hours, cost, and feedback.

Helpdesk requests use an HR-YYYY-NNNNNN identifier and a three-day SLA due date. Staff can assign a request to an active staff user and update its state. The current identifier is count-based, so simultaneous creations are a potential collision point; a sequence or retry strategy is a scaling improvement, not an implemented feature. Status literals and closure-date handling should be checked carefully before asserting every resolution/closure event is consistent.

Policies store document/version metadata, publish in-app notifications, and record employee acknowledgements with policy/employee uniqueness. NotificationService deduplicates some event-keyed notifications and scopes read/delete operations to the recipient. Notifications are persisted records fetched by the client; outbound email was removed in history. There is no WebSocket/SSE transport in the inspected implementation. Header notifications poll every 60 seconds; dashboard stats poll every 30 seconds. Some dispatch paths catch/log failures rather than providing guaranteed delivery.

### Dashboard and attendance nuance

The headline active headcount uses the hardcoded `Hyderabad Office` location and excludes `USR-*` profiles. Present/absent figures are derived from approved leave, not a verified biometric/check-in stream. Attrition uses recent exits/joins and headcount calculations; reviewers should know the population and date window before treating it as a company-wide reporting standard. An Attendance model and frontend API helper exist, but app.ts does not mount a dedicated attendance router. Model presence is not proof of a fully functioning attendance integration.

## 8. How to run, build, and use the portal

### How to start a fresh local installation

Use the instructions in [the README](../../README.md) for the current quick start. Use Node.js 22.13 or newer for this checkout: the locked pdfjs-dist package declares Node >=22.13.0. The CI workflow currently specifies Node 20, which should be aligned with that dependency requirement. This sequence uses a new development database. Do not point it at production.

```powershell
# From the repository root: install root, API, and client packages
npm install
npm ci --prefix server
npm ci --prefix client

# Optional: run the included PostgreSQL container
docker compose up -d postgres

# Create API environment configuration; edit it for your local database
if (!(Test-Path server/.env)) { Copy-Item server/.env.example server/.env }

Set-Location server
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
Set-Location ..

npm run dev
```

Copy the example only if `server/.env` does not already exist. Required connection settings include DATABASE_URL and DIRECT_URL; Prisma references both. The compose defaults create hr_management on localhost:5432. The client is at localhost:5173 and API at localhost:5000. If the Vite port changes, use that browser origin in CORS_ORIGIN. The development seed's login is admin@hrms.com with password123. It resets that seeded admin password when rerun; it is not a safe general production initialization operation.

First verify `/api/live`, then `/api/ready`, then login. Create/check departments and employees, review role permissions, and exercise a workflow with distinct actor accounts. Use a separate employee account for self-service and staff account for approval so you understand how scope and role affect the same screen. Do not use an Admin-only walkthrough to prove employee access is correct.

### How to understand the build

```text
root npm run build
  ├─ server: prisma generate → tsc → server/dist/server.js and compiled modules
  └─ client: tsc -b → vite build → client/dist static assets
```

The backend's `npm start` runs node dist/server.js after compilation. The client build produces static files; a web/static host must serve them and route API requests. Vite preview is for checking a frontend build locally and does not reproduce the dev server's API proxy. Browser production configuration such as VITE_API_URL is a build-time value; no storage or database secret belongs in a VITE_* variable.

Existing installs need versioned migrations, not just prisma db push: data migrations can convert stages or reconcile roles. A database previously managed by db push may need baseline reconciliation; do not reset or mark arbitrary migrations applied to get deployment past an error. `server/scripts/prebuild.ts` exists, but the current package build script does not invoke it. A file's name is not evidence that it runs.

### How to make a feature change

Trace the page to its client API wrapper and mounted server route. Locate the Zod schema, controller, service, related Prisma model, role permission, and regression test. Change the business rule in the service, validate input at the route, and preserve scope/redaction checks. If the schema changes, add/review a migration. Update the client form/types, invalidate relevant Query keys, and document the behavior. A new module also needs route mounting, UI routing/navigation, permission catalog/defaults, and a permissions check; a folder alone does not register it.

### How to check a change

The root verify command builds both apps and runs backend Jest tests. Client Vitest tests and lint are separate commands. Check scripts in the generated reference before running. Some backend tests use a real configured database; use an isolated fixture database and read the test setup first. This handbook generation inspected source/history and did not run application tests or change any database.

GitHub Actions defines a PostgreSQL 15 service, Node 20, dependency installation, Prisma migration/seed, builds/server tests, lint, client tests, and dependency audit. This describes configured checks, not the outcome of any particular run. The root CI npm ci/cache step also expects a root lockfile; confirm it exists in the checkout when investigating CI failures. CI passing would still not prove production deployment completed.

### Runtime configuration and operations

| Setting | Effect |
|---|---|
| DATABASE_URL / DIRECT_URL | PostgreSQL application/direct connections referenced by Prisma |
| PORT | API listening port; default 5000 |
| NODE_ENV | Environment behavior; production enforces a private JWT secret |
| JWT_SECRET / JWT_EXPIRES_IN | Token signature key and validity period |
| CORS_ORIGIN | Comma-separated browser origin allowlist, plus the explicitly allowed hr.pafpl.in origin |
| STORAGE_PROVIDER / UPLOAD_DIR | local/r2/s3/supabase selection and local directory |
| R2_ACCOUNT_ID / R2_BUCKET / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY | R2 storage adapter settings |
| S3_BUCKET / AWS_REGION / AWS credentials or workload identity | AWS storage adapter settings |
| SUPABASE_STORAGE_ENDPOINT / REGION / BUCKET / ACCESS_KEY_ID / SECRET_ACCESS_KEY (each prefixed SUPABASE_STORAGE_) | Supabase S3-compatible settings; exact names are in server/.env.example |
| VITE_API_URL | Frontend API base; defaults to /api |
| VITE_API_PROXY_TARGET | Vite development proxy destination; defaults to http://localhost:5000 |

`/api/live` checks HTTP process response. `/api/ready` queries selected model fields/statuses to catch database/schema unavailability and returns 503 on failure. It is not a full production synthetic workflow or storage-health probe. Preserve database and file backups together, record the deployed SHA and migration status, and verify both protected API access and file retrieval after release. Actual backup, rollback, alerts, TLS, domains, and production monitoring require deployment-owner evidence.

## 9. Can the modules scale?

Yes, the structure gives useful boundaries for maintaining and evolving the project. It is one Express application using one Prisma client/database, so it scales as a deployment unit today. Business folders do not create independently deployed services. The current architecture is suitable for incremental improvement before choosing service extraction.

### Scale in evidence-driven stages

| Stage | Change to consider | Why / evidence to collect | What is not already implemented |
|---|---|---|---|
| Establish a baseline | Measure concurrent users, request rate, p50/p95 latency, query time, DB connections, API memory, error rate | No load-test or capacity results were established for this handbook | A safe “supports N users” figure |
| Improve queries and payloads | Paginate remaining lists, select needed fields, profile dashboard joins/counts and search, add measured indexes | Employee/candidate pagination exists; travel, expenses, notifications and other paths still return unbounded lists | Universal pagination or query caching |
| Reduce repeated work | Initialize defaults once or cache permissions with correct invalidation; tune polling; consider precomputed dashboard aggregates | Permission checks for configurable roles call ensureDefaults; dashboard recomputes multiple queries | A shared permission/dashboard cache |
| Add API replicas | Keep signing configuration consistent, use shared PostgreSQL and persistent object storage, set connection limits | Local upload disk cannot be assumed shared between replicas; each replica uses database connections | A load balancer, replica configuration, or autoscaling policy |
| Separate background work | Add durable jobs/outbox for notification fan-out, large exports, and batch processing | Notification writes are currently in-process; some dispatches catch failures | A job broker/worker, retry guarantee, exactly-once delivery |
| Harden concurrency | Use conditional state updates/locks where needed; replace count-based ticket IDs; make idempotency deliberate | Recruitment and leave have concrete safeguards; not every module has equivalent protection | Global race freedom or universal idempotency |
| Evolve data architecture | Optimize schemas, connection pooling, backups, retention, and reporting isolation after measurement | Shared relational dependencies currently simplify atomic workflows | Read replicas, partitioning, tenant isolation, warehouse |
| Extract a module only when justified | Define its API/events, ownership, deployment, monitoring, and failure policy | Recruitment/notifications are potential bounded areas, but share User/Employee/DB today | Existing microservice boundaries or independent module scaling |

Multi-company SaaS would require tenant identity, tenant filters/constraints, tenant-aware authorization, and migration/testing of every data path. The current shared data model is not proof of multi-tenancy. “Move to microservices” alone would not solve slow queries or data isolation. No repository evidence here justifies a specific user-count promise, server cost, or availability guarantee.

### Current concerns to discuss candidly

These are source observations/engineering review points, not confirmed production incidents: default role scope is broader than direct-report management; some generic response/error shapes differ; some lists and fan-out are unbounded; file buffers consume process memory; request IDs use count+1; multi-step workflows are not uniformly concurrency guarded; some audit/notification writes occur outside the main data transaction; readiness does not verify storage. Review these with tests and production metrics before prioritizing them as defects. The handbook has not changed application behavior to address them.

## 10. Explaining how the project evolved

Use the live tracker or local CSV to follow work chronologically. It is built from commits reachable from the checked-out HEAD, including duplicate patch aliases from replayed history. Merge commits are retained in evidence.json and excluded from the primary change rows. Exact stable patch IDs group identical diff changes; similar titles alone are not deduplicated. Different titles/reasons for the same patch remain visible in raw commit metadata.

For each change, the tracker records a stable key, commit title/type, affected modules/files, authored timestamp, committed timestamp in India time, primary SHA/link, duplicate aliases, reason evidence, and test files touched. A touched test is evidence of a test change, not proof that it passed. “Fix committed” means the commit is classified as a fix; it does not mean every subsequent version still contains it. Later reverts and follow-up commits must be read together.

Raised, Solved, and Production verified dates remain empty unless there is independently confirmed issue/deployment evidence. Neither commit time nor Notion page creation time is automatically the reported date. Commit time is the date stored in Git, not a measured server receipt time. A commit without a separate rationale is labeled “Summary only”; a terse or generic message cannot establish the full cause. The history also contains ancestry unrelated to HR; those rows describe repository history, not an invented HR incident.

### Concrete examples to prepare

- `e33bb40`: leave approval and balance deduction made atomic. Discuss claiming PENDING once and committing the balance change together.
- `4f03582`: receipt/policy downloads require authorization. Discuss keeping document bytes behind record-aware permission checks.
- `7174df8`: recruitment capacity transitions made atomic. Discuss shared vacancy state and row locks rather than trusting client counts.
- `80c2be2`: deferred dashboard charts and reduced polling. Discuss initial-load work versus freshness and continued polling costs.
- `f06da0f`: outbound email removed. Discuss the current persisted in-app notification channel and why you must not claim email is live.
- `7d6759e`: recruitment/file-storage improvements. Discuss implemented provider options separately from which one is actually configured in production.

Consult each commit diff and its follow-ups before using it as a detailed personal story. The source link and reason field let you substantiate the answer instead of guessing the reported symptom or completion date.

## 11. Questions your senior may ask

### What did you build, and what is your contribution?

Use the opening explanation, then name the modules/flows you personally implemented. Commit author metadata can help trace work but is not proof of exclusive authorship, especially with merges, cherry-picks, or assisted development. The tracker provides evidence you can review with your own work history.

### Why this stack?

It keeps frontend and backend in TypeScript, supports reusable browser interfaces, and uses a relational database for linked HR records and transactional workflows. Name the trade-offs: runtime validation still matters, the database becomes a shared scaling dependency, and the API process must not do unlimited CPU/buffer work.

### Is it MVC, a monolith, or microservices?

It is a feature-organized modular monolith with route/controller/service layers and a separate React UI. The UI is not a server-rendered MVC view. Modules share the API process and database and are not microservices.

### How does authorization work if someone calls the API directly?

Backend middleware authenticates JWTs, reloads the account, checks module/role permissions, and services apply record scope. UI route checks are only navigation support. Show an employee-scoped service query and a permission route rather than only a hidden sidebar item.

### Can an Employee see everyone's salary? Can a Manager see all employees?

Employees receive scoped/projected data in the implemented paths, and restricted-field rules exist. Manager currently has ORG scope from the shared helper, subject to module permissions and additional feature rules. Explain that actual behavior; do not substitute a conventional direct-report policy for the implementation.

### How do you stop an old token after a password reset or deactivation?

The API reloads User and compares tokenVersion with the JWT. Reset/status/removal paths update the account/version; inactivity/deletion also causes rejection. A client logout alone removes local state and does not revoke all tokens.

### Does JWT make the API fully stateless?

There is no server-side in-memory session store, but authenticated requests still depend on PostgreSQL to check account state/version and permissions. Stateless token format does not eliminate database dependence.

### Why Prisma if PostgreSQL is already used?

PostgreSQL is the database; Prisma is the application's data client/schema/migration tooling. It improves navigation/type guidance and common queries. SQL constraints and transaction design remain important; recruitment uses parameterized raw row locks where necessary.

### What stops duplicate approval or competing interview-stage updates?

Leave approval conditionally claims a pending row and deducts balance in one transaction. Recruitment uses row locks and expectedStage checks on stage transitions. Explain those specific paths and acknowledge that a transaction alone does not prevent every check-then-write race in other modules.

### Why is frontend validation insufficient?

Requests can bypass the browser. Zod/body validation and service rules must reject invalid data on the server. Database constraints protect relationships and uniqueness after those checks. TypeScript provides no runtime validation for external input.

### How does recruitment differ from a simple status dropdown?

Candidate stage, decision, appointment, feedback, offer, joining, and opening capacity are separate states. Transitions validate prerequisites, stale state, reasons, submitted feedback, and accepted-offer joining. History preserves movements.

### How does file security work?

The API stores bytes through an adapter and metadata in PostgreSQL. Protected downloads check identity, module permission, and the referenced record. Profile photos and safe QR-card fields are deliberate public surfaces. Server keys do not go to browser environment variables.

### Are notifications real-time? Does it send email?

They are persisted in-app records fetched with polling; the header currently polls each minute. There is no inspected WebSocket transport and outbound email has been removed. Say “in-app notifications refreshed by polling.”

### Is attendance integrated with biometric hardware?

No such integration is established by this code. Dashboard present/absent counts use approved leave. Attendance data structures and a client helper alone do not prove a complete attendance API/hardware pipeline.

### Can it handle ten thousand users?

That needs a workload definition and measurements. Explain the scaling stages: query/profile, bound payloads, tune polling/permissions, shared storage and connection pooling, then API replicas and background jobs. Do not give an invented capacity figure.

### Why not begin with microservices?

Shared identity and HR relationships make one deployment/database simpler to develop and transact across. A service split adds network failures, contracts, deployment operations, and cross-service consistency problems. Extract a bounded capability when independent workload/ownership justifies that cost.

### Can modules be deployed separately today?

No. They share the Express entry point and Prisma database. Folders are maintainability boundaries; extraction requires contracts, data ownership, separate runtime configuration, and handling distributed failures.

### What are your performance improvements?

Point to route lazy loading, deferred dashboard charts, bounded employee/candidate pagination, Query caching, and polling changes in history. These are implemented strategies, not a benchmark result. No measured latency or concurrency target was established by this documentation work.

### How is production deployed and which commit is running?

The project is associated with Techsupport Lohitha in the supplied context/history. Repository files include Render/Vercel and Docker paths. Live provider/account, release SHA, routing, database and file-store selection require actual deployment settings or release metadata. A local HEAD does not prove the production SHA.

### What happens if PostgreSQL or storage fails?

Startup exits if Prisma cannot connect. Readiness returns 503 when its selected database queries fail. Storage read/write errors are mapped to storage errors, commonly 503, and missing objects to 404. There is no demonstrated disaster recovery or backup restore result; production operations need a tested restore procedure.

### Can a database migration be rolled back automatically?

The repository uses forward migration deployment; it does not establish an automatic safe rollback mechanism. Data conversions may not be trivially reversible. Back up, review migrations, use a baseline for legacy databases, and coordinate application/schema compatibility before release.

### How do you know tests passed and a bug was solved?

Use the specific CI/test-run output and production verification evidence. A test file in a commit proves only that it was changed. The tracker deliberately keeps production verification and issue raised/solved dates distinct from commit metadata.

### What would you improve first?

Start with production observability and correctness evidence, then measured query/payload bottlenecks and concurrency paths. Review manager scope against business expectations, bound large lists/fan-out/uploads, remove count-based ticket IDs, make transaction/notification reliability explicit, and verify the deployment/backup procedure. Prioritize with impact and measurements rather than a rewrite for its own sake.

## 12. A practical review rehearsal

Walk through the interactive architecture once, then choose three stories: employee login/access, recruitment feedback/stage progression, and atomic leave approval. For each, name the screen, API route, validation, service, model, state change, failure response, and history/test evidence. Build the app locally with a non-production database and observe one full staff/employee workflow yourself before presenting it as demonstrated behavior.

Use the question cards in the HTML handbook to practice short answers. Expand the module and data/API references when a reviewer asks for detail. If an answer depends on production settings or a missing issue report, say exactly which evidence is missing and how you would confirm it.
