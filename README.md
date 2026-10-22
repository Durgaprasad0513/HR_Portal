# HR Portal

HR Portal is a role-aware web application for employee records and day-to-day HR workflows. It combines a React single-page application, a Node.js/Express API, PostgreSQL, and Prisma. The API is the authority for authentication, permissions, record access, validation, and file operations.

For architecture, flows, build details, scaling trade-offs, and review questions, open the [interactive engineering handbook](docs/project-handbook/index.html). The [written handbook](docs/project-handbook/handbook.md) and [generated API/data reference](docs/project-handbook/code-reference.md) provide the full reading guide. Techsupport Lohitha is the supplied project/deployment context and also appears in Git merge history; the live provider and infrastructure still need confirmation from deployment settings.

## What the portal does

- **Dashboard and analytics:** role-aware summaries, workforce trends, attendance and leave insights, and pending actions.
- **People and access:** employee profiles, departments, employee documents, user accounts, roles, and a configurable module permission matrix.
- **Time away and requests:** leave applications and approvals, attendance, helpdesk requests, and notifications.
- **Hiring:** requisitions, candidate pipeline, interview scheduling, feedback, and resume text autofill from PDF or DOCX. Resume autofill is parsed in the browser; extracted values remain editable.
- **Operations:** assets, travel requests and settlements, office expenses, policies and acknowledgements, training, and performance reviews. Travel requests support selecting multiple modes and entering separate outbound and return amounts; payout summaries show due totals for approved expenses and submitted travel claims.
- **Governance:** audit events, login history, permission-gated exports, and account deactivation/soft deletion.

## Architecture at a glance

```mermaid
flowchart LR
    U[Employee / HR / Manager / Admin] -->|HTTPS| FE[React + TypeScript SPA\nVite · React Router · TanStack Query]
    FE -->|Axios /api requests\nJWT bearer token| API[Express API\nNode.js + TypeScript]
    API --> MW[Middleware\nCORS · correlation ID · JWT auth\nrole/module permissions]
    MW --> MOD[Feature routes → controllers → services\nZod validation · employee data scoping]
    MOD --> ORM[Prisma]
    ORM --> DB[(PostgreSQL)]
    MOD --> UP[Upload / download routes\nMulter memory buffer · access checks]
    UP --> FS[(Storage adapter\nlocal · S3 · R2 · Supabase)]
    DEP[Techsupport Lohitha\nproduction deployment context] -. hosts/deploys .-> FE
    DEP -. hosts/deploys .-> API
```

### Request lifecycle

1. The user opens the browser app and signs in. Login accepts an email address or employee code and a password.
2. The API checks the account and bcrypt password, writes login history, and returns a signed JWT and that role's permissions. The browser stores the token in local storage.
3. The web app calls `/api/...` with the token in the `Authorization: Bearer ...` header. In local development, Vite proxies `/api` to the backend. Production routing is configured by the deployment environment.
4. Express assigns a correlation ID, applies CORS and parsing middleware, then dispatches to the relevant feature route. Protected routes validate the token and re-check that the account is active, not deleted, and has a current token version.
5. Permission middleware checks the role's module/action permissions. Feature services also apply employee-level visibility where required; UI hiding alone is not access control.
6. Prisma reads/writes PostgreSQL. Uploads and downloads go through the storage adapter and module-specific authorization checks.
7. The API returns JSON or an authorized file response. The frontend refreshes relevant data and updates the page.

### Backend feature areas

The API mounts routes under `/api` for authentication, users, employees and employee documents, departments, leave, travel, office expenses, uploads, assets, recruitment, performance, training, helpdesk requests, policies, notifications, audit, permissions, login history, and dashboard data. Health endpoints are `/api/live` (process liveness) and `/api/ready` (database/schema readiness).

### Security model

- Roles are `ADMIN`, `HR`, `MANAGER`, and `EMPLOYEE`; module permissions control view, add, edit, delete, approve, and export actions where applicable.
- The backend checks permissions and scopes data. Employees generally work with their own records; staff visibility depends on role and module rules.
- Passwords are bcrypt-hashed. JWTs are signed with `JWT_SECRET`; account deactivation, soft deletion, or token-version changes can invalidate sessions.
- Protected documents are downloaded through authenticated routes. Profile image URLs have a narrower public-serving route and only return image content associated with an employee profile.
- Production secrets belong in the hosting provider's secret/environment settings. Never commit `.env` files, database credentials, JWT secrets, or object-storage keys.

## Technology

| Layer | Technologies |
|---|---|
| Web | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios, Recharts |
| API | Node.js, Express, TypeScript, Zod, Multer |
| Data | PostgreSQL, Prisma ORM and migrations |
| Authentication | JWT bearer tokens, bcrypt password hashing |
| File adapter | Local disk, AWS S3, Cloudflare R2, or Supabase Storage via S3-compatible API |
| CI | GitHub Actions; builds, migrations, tests, lint, and dependency audit |

## Repository guide

```text
client/
  src/api/                 API wrappers
  src/contexts/             Authentication state
  src/routes/               Route definitions and protected routes
  src/pages/                Screens grouped by feature
  src/components/           Shared layout and UI components
server/
  src/app.ts                Express middleware and API route mounting
  src/server.ts             Database connection and HTTP startup
  src/middleware/           Authentication, validation, error handling
  src/modules/<feature>/    Routes, controllers, services, schemas
  src/config/               Environment, Prisma, and file storage setup
  prisma/schema.prisma      Data models and enums
  prisma/migrations/        Versioned database changes
  prisma/seed.ts            Development/demo data seed
docs/
  production-architecture.html  Interactive architecture map
  production-file-storage-supabase.md  Supabase storage configuration notes
  designs/                  Feature and UX notes
```

## Run locally

### Requirements

- Node.js 22.13 or newer and npm (the locked pdfjs-dist package declares this minimum; CI currently specifies Node 20 and needs alignment)
- PostgreSQL 14 or newer (or Docker Desktop for the included local database compose file)

### 1. Install dependencies

The root package coordinates both applications but does not install their dependencies. Install each package:

```bash
npm ci --prefix server
npm ci --prefix client
npm install
```

### 2. Start a local PostgreSQL database

You can use your own PostgreSQL installation or start the repository's local database container:

```bash
docker compose up -d postgres
```

The compose file creates a development database named `hr_management`, user `postgres`, and password `postgres` on port `5432`. These defaults are only for local development; change them before using any shared environment.

### 3. Configure the API

Copy `server/.env.example` to `server/.env`. The example is preconfigured for the compose database. Check that `DATABASE_URL` and `DIRECT_URL` match your PostgreSQL connection. For a manually installed local database, these may look like:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hr_management?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/hr_management?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET="replace-with-a-long-random-development-secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
STORAGE_PROVIDER=local
UPLOAD_DIR=uploads
```

`DIRECT_URL` is included in the Prisma datasource configuration. Keep both database URLs aligned unless you intentionally use separate pooled and direct connections.

### 4. Apply schema and seed local admin

For a fresh local database, run the checked-in migrations and then seed:

```bash
cd server
npx prisma migrate deploy
npm run prisma:seed
cd ..
```

These commands can also be run from PowerShell by entering `server` with `Set-Location server`, then returning to the repository root with `Set-Location ..`.

The seed creates `admin@hrms.com` with the development password `password123`. Change that password immediately after the first local sign-in. The seed intentionally skips when `NODE_ENV=production` unless the explicit production-seed override is set; do not use the demo credential in production.

For an existing database created with `prisma db push`, do not blindly apply the migration history. Reconcile/baseline it first; see the migration notes in `server/prisma/migrations` and consult the project maintainer. Migrations can transform existing recruitment data.

### Updating an existing installation

Apply committed database migrations from `server` before starting the updated API:

```bash
npx prisma migrate deploy
npm run build
```

The latest update adds multiple travel modes and separate outbound and return amount fields. Existing travel modes are migrated into the new list field. Use migrations for upgrades; `prisma db push` alone does not perform data conversions. Databases originally created with `db push` must have their migration baseline reconciled before deploying migrations.

### 5. Start the app

From the repository root:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`; Vite proxies `/api` to `http://localhost:5000`. You can also start each process separately:

```bash
npm run dev:server
npm run dev:client
```

The API health URLs are `http://localhost:5000/api/live` and `http://localhost:5000/api/ready`.

## Common commands

Run these from the repository root:

| Command | Purpose |
|---|---|
| `npm run dev` | Start frontend and backend development servers |
| `npm run build` | Build the frontend and backend |
| `npm test` | Run backend tests |
| `npm run lint` | Lint frontend and backend |
| `npm run db:push` | Push the Prisma schema directly (local prototyping only) |
| `npm run db:seed` | Seed the configured database |
| `npm run db:studio` | Open Prisma Studio for the configured database |

The client test suite can be run with `npm run test --prefix client`.

## File uploads

`STORAGE_PROVIDER` selects `local` (default), `s3`, `r2`, or `supabase`. Local storage is useful for development; production should use a persistent storage provider because ephemeral app disks may lose files on redeploy/restart. The API applies a 10 MB limit to general uploads. Resume autofill reads PDF/DOCX in the browser and allows up to 20 MB; the resume content is not sent to backend storage by that autofill step.

For Supabase S3-compatible setup and private bucket guidance, see [docs/production-file-storage-supabase.md](docs/production-file-storage-supabase.md). Keep provider keys on the server only. Switching providers does not migrate existing files automatically.

## Production and deployment

The project owner identifies Techsupport Lohitha as the production deployment context. The checked-in `render.yaml`, `client/vercel.json`, and Docker compose files are deployment examples/configuration in the repository; they are not sufficient evidence of the live Techsupport Lohitha topology. Confirm actual hosting, database, storage provider, backups, domains, and deployment procedure with the current deployment configuration before making production changes.

At the application level, production needs:

1. A built frontend and reachable backend API, with browser requests routed to the backend under `/api` (or a configured `VITE_API_URL`).
2. A PostgreSQL database reachable by the backend through `DATABASE_URL` and, where configured, `DIRECT_URL`.
3. A strong private `JWT_SECRET`, correct `NODE_ENV`, backend `PORT`, and a `CORS_ORIGIN` that includes the production portal origin. The API also explicitly allows `https://hr.pafpl.in`.
4. Persistent file storage configured by `STORAGE_PROVIDER` and the appropriate provider settings.
5. Database migrations applied before the new API starts. For migration-based environments, use `npx prisma migrate deploy` from `server`.
6. Readiness verification at `/api/ready` after deployment.

The frontend deployment must preserve SPA history fallback to `index.html` and route `/api/*` to the backend. The interactive architecture map is at [docs/production-architecture.html](docs/production-architecture.html).

## CI and verification

`.github/workflows/ci.yml` runs for pushes and pull requests to `main`, `master`, and `staging`. It provisions a temporary PostgreSQL service, installs packages, applies migrations, seeds, builds/verifies, runs lint and client/server tests, and audits production dependencies. Locally, `npm run verify` builds both applications and runs backend tests; use `npm run lint` separately.

## Troubleshooting

- **API connection errors:** confirm the backend is running on port 5000 and Vite is serving port 5173; check `VITE_API_PROXY_TARGET` if the API runs elsewhere.
- **Database connection errors:** check PostgreSQL is running and both URLs in `server/.env` point to the intended database.
- **Login redirects to `/login`:** the API returns 401 for a missing, expired, revoked, inactive, or deleted account session; sign in again and verify the user is active.
- **Uploads fail:** verify the provider settings and credentials, bucket permissions, network access, and file size. Application upload endpoints cap files at 10 MB.
- **CORS errors:** set `CORS_ORIGIN` to the exact browser origin, including scheme; production currently also allows `https://hr.pafpl.in`.

## Further documentation

- [Handbook reading guide and live Notion tracker links](docs/project-handbook/README.md)
- [Interactive engineering handbook: architecture, flows, build, and review practice](docs/project-handbook/index.html)
- [Written technical handbook](docs/project-handbook/handbook.md)
- [API routes, Prisma data dictionary, validation schemas, and package reference](docs/project-handbook/code-reference.md)
- [Commit-backed tracker CSV for Notion](docs/project-handbook/notion-tracker.csv)
- [Interactive architecture map](docs/production-architecture.html)
