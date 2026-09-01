# How to execute Gate 0A safely

This guide describes the first implementation slice: recover a valid database contract, create a reproducible development database path, make both builds pass, prove login, and prove that one employee cannot read another employee's record.

It is an implementation guide, not a claim that the listed commands pass today. The current Prisma schema is invalid and must be repaired before migration or runtime verification.

## Prerequisites

- Work on the existing `staging` branch unless the user requests a separate worktree or branch.
- Preserve every existing uncommitted file.
- Use Docker PostgreSQL as the canonical local database. pgAdmin is optional.
- Use a new development database or isolated Compose project for migration proof.
- Do not run `git reset --hard`, broad checkout/restore commands, `docker compose down -v`, `prisma migrate reset`, or any destructive database command against an existing volume.
- Read the [implementation plan](README.md) and [full gstack review](../reviews/2026-08-29-staging-project-autoplan.md) before editing.

## Target result

Gate 0A is complete only when all of these are true:

```text
Prisma schema validation        PASS
Prisma client generation        PASS
Fresh database migration        PASS
Development seed                PASS, environment-gated
Server TypeScript build         PASS
Client TypeScript/Vite build    PASS
Database readiness              PASS
Valid role login                PASS
Cross-employee read denial      PASS
Existing user work              PRESERVED
```

## Step 1: protect the current worktree

1. Record the branch and working-tree state.

   ```powershell
   git branch --show-current
   git status --short
   git diff --stat
   ```

2. Save the output with the task notes. Do not stage or alter unrelated paths.
3. Identify every Gate 0A file that already has user changes. The known overlapping area includes `server/prisma/schema.prisma`, server middleware/configuration, client role/routes, and API files.
4. Compare before editing. Preserve intentional removals and UI changes.

Verification: the list of pre-existing modifications is captured and no file has been reset or deleted.

## Step 2: reconstruct the intended Prisma models

1. Inspect the current schema and its recent committed versions.

   ```powershell
   git log --oneline -- server/prisma/schema.prisma
   git show fc14d7d:server/prisma/schema.prisma
   ```

   `git show` is read-only. Do not replace the current file wholesale because it would discard newer intentional fields and relationships.

2. Build a field-and-relation checklist from current services and types:

   - `User`: identity, unique email, password hash, role, active state, token/session revocation state, optional employee link, timestamps, and required audit/login/document/request relationships.
   - `Employee`: code and contact identity, lifecycle state, department, current manager, restricted HR/statutory fields, active/deactivation state, timestamps, and workflow relationships.
   - Role codes: keep the current internal codes `ADMIN`, `HR`, `REMOVED_ROLE`, `MANAGER`, and `EMPLOYEE`; map them to the product labels Super Admin, HR Admin, REMOVED_ROLE, Reporting Manager, and Employee.

3. Repair the schema deliberately:

   - Remove the duplicate `REMOVED_ROLE` value.
   - Restore exactly one valid `model User` and one valid `model Employee` block.
   - Reconnect every relation with an explicit relation name where Prisma requires it.
   - Keep CUID as the existing identifier standard unless a reviewed migration changes all layers together.
   - Keep money as `Decimal` with explicit currency in the target model.
   - Keep normal HR history on `onDelete: Restrict` or equivalent lifecycle-safe behavior.
   - Retain removed attendance/leave tables temporarily if an existing database may contain data. Hide/remove application surfaces now; remove tables only in a later reviewed retention migration.

4. Validate before changing a database.

   ```powershell
   Set-Location server
   npx prisma format
   npx prisma validate
   npx prisma generate
   Set-Location ..
   ```

Verification: all three Prisma commands pass, and `git diff -- server/prisma/schema.prisma` contains only intentional reconciliation.

Troubleshooting:

- Duplicate enum error: search the enum and retain one value.
- Unknown type `User` or `Employee`: confirm the model declaration exists, braces are balanced, and the model is not represented by orphaned fields.
- Ambiguous relation: give both sides the same explicit relation name.
- Missing opposite relation: add the reciprocal array or optional relation required by Prisma.

## Step 3: reconcile the development seed

1. Remove stale attendance/leave imports and deletes if those models are not in the canonical schema.
2. Add an explicit guard that refuses destructive seeding outside a named development/test environment.
3. Prefer idempotent upserts for departments, role fixtures, employees, users, permissions, and settings.
4. Keep sample credentials development-only. Never reuse them for staging UAT or production.
5. Seed all five role templates, including REMOVED_ROLE, with enough relationships to test:

   - one employee acting on self;
   - one manager and direct report;
   - one unrelated employee;
   - REMOVED_ROLE;
   - HR Admin;
   - Super Admin.

Verification: a second seed run produces the same logical fixtures without accidental duplication or broad deletion.

## Step 4: create a safe migration baseline

1. Remove `server/prisma/migrations/` from `.gitignore`.
2. Do not create the baseline against an existing ambiguous database or Docker volume.
3. Create a fresh database named for Gate 0A through pgAdmin or a reviewed PostgreSQL command. Point a temporary local `DATABASE_URL` at that database. Do not commit the local URL.
4. Create and apply the baseline migration from the repaired schema.

   ```powershell
   Set-Location server
   npx prisma migrate dev --name baseline
   npx prisma generate
   npx prisma db seed
   Set-Location ..
   ```

5. Inspect the generated SQL before committing it. Confirm it creates the intended schema and does not contain an unexpected drop of user-owned data.
6. Repeat the migration against a second empty database to prove reproducibility.

Verification: the migration folder is versioned, two fresh databases reach the same schema, and no existing database volume was reset.

Troubleshooting:

- Prisma requests a reset: stop. Confirm the URL points to the new disposable Gate 0A database. Never approve a reset against an existing database without a backup and explicit approval.
- Seed fails on old enum/model names: reconcile the seed to the canonical schema rather than restoring removed application modules.
- Permission defaults fail: repair the five-role catalog and seed together.

## Step 5: establish one local environment contract

1. Make `server/.env.example` the server source of truth.
2. Align it with Docker PostgreSQL defaults and the Express/Vite development contract:

   ```text
   PostgreSQL host: localhost
   PostgreSQL port: 5432
   PostgreSQL database: hr_management
   Express port: 5000
   Vite port: 5173
   Vite API path: /api, proxied to http://localhost:5000
   ```

3. Remove or reduce the root environment example so it cannot disagree with the server template.
4. Require `DATABASE_URL` and a non-placeholder JWT secret. Do not let the server use `default-secret-change-me` outside an explicitly safe test mode.
5. Validate integer ports, allowed CORS origin, token duration, and environment before calling `listen`.
6. Add a PostgreSQL health check to Compose. Pin pgAdmin to a reviewed version rather than `latest`.
7. Keep pgAdmin optional. The API must not depend on it.

Verification:

- Missing database URL produces an actionable startup failure.
- Unsafe secret produces an actionable startup failure.
- Docker PostgreSQL healthy state is visible.
- Server startup prints the resolved API and readiness URLs without printing secrets.

## Step 6: add database-backed readiness

1. Keep a lightweight liveness endpoint that proves the Express process can respond.
2. Add a readiness endpoint that performs a bounded PostgreSQL query and checks whether required migrations are applied.
3. Return a safe status and correlation ID. Do not return connection strings, credentials, SQL, or HR data.
4. Make startup/bootstrap wait for readiness before reporting success.

Verification:

- With PostgreSQL running and migrated, readiness is successful.
- With PostgreSQL stopped, liveness may remain successful but readiness fails.
- Login is not described as available while readiness is failing.

## Step 7: make both builds pass

1. Generate Prisma Client from the repaired schema.
2. Build the server and address errors caused by schema/client mismatch.
3. Add `REMOVED_ROLE` to the client role contract and remove stale attendance/leave types only when no retained code depends on them.
4. Fix client unused imports and route/type errors without reversing approved UI removals.
5. Run the root build.

   ```powershell
   npm run build
   ```

Verification: server TypeScript and client TypeScript/Vite builds both pass from the root.

## Step 8: prove login and record isolation

1. Start PostgreSQL and wait for readiness.
2. Apply migrations and the guarded development seed.
3. Start the application.

   ```powershell
   npm run dev
   ```

4. Add an automated API smoke test that:

   - logs in with one development employee fixture;
   - calls `/api/auth/me` successfully;
   - reads that employee's allowed profile;
   - attempts to read the unrelated employee's ID;
   - expects a safe denial without leaked fields.

5. Repeat the scope smoke for the Reporting Manager/direct-report relationship.
6. Confirm inactive-account login and a token from a deactivated account are denied.

Verification: login succeeds only when database readiness is green; self/direct-report positive cases and unrelated negative cases all pass.

## Step 9: run the Gate 0A verification once

Run the final checks after the implementation scripts exist:

```powershell
Set-Location server
npx prisma validate
npx prisma generate
npm run build
Set-Location ..\client
npm run build
Set-Location ..
# Run the new migration/login/authorization smoke command here.
```

Do not claim Gate 0A complete until the smoke command is added and passes. Avoid repeatedly running already-passing checks unless a later change affects them.

## Step 10: review and checkpoint

1. Inspect `git diff --check` and the exact changed-file list.
2. Confirm no existing user file was accidentally reset, deleted, or broadly staged.
3. Review migration SQL, seed guards, environment examples, and logs for credentials or PII.
4. Stage only Gate 0A paths by name.
5. Commit the verified slice.
6. Stop for review before Gate 0B.

## Gate 0A completion record

Fill this table when implementation finishes:

| Evidence | Result | Command/artifact |
|---|---|---|
| Prisma validate/generate | Pending | |
| Fresh migration #1 | Pending | |
| Fresh migration #2 | Pending | |
| Guarded idempotent seed | Pending | |
| Server build | Pending | |
| Client build | Pending | |
| DB readiness drill | Pending | |
| Valid login | Pending | |
| Cross-employee denial | Pending | |
| Manager/direct-report scope | Pending | |
| Inactive/revoked account denial | Pending | |
| User work preserved | Pending | |

## Next step after Gate 0A

Do not add new screens. Continue with Gate 0B from the [implementation plan](README.md): centralized record scope, restricted projections, sessions, notification ownership, and executable API contracts.
