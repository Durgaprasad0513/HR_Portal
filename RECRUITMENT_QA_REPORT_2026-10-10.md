# Recruitment and interview calendar QA

Date: 10 October 2026. Baseline: `413b8aa`. Skills: gstack QA and Codex Advisor (root review).

## Verdict

The implemented recruitment fixes pass local regression checks. This is **not a production readiness certification**. Management write workflows were verified through the real API and PostgreSQL in an isolated database; the supplied management browser account is configured as read-only. Offer and screening endpoints work, but this UI does not expose complete screening and offer-management forms. Those product gaps remain if users must perform every lifecycle action entirely through the portal.

## Environment and evidence

- Updated worktree UI: `http://localhost:5174`; updated API: local port 5001.
- Browser HR and management accounts entered by the user. Production was not modified or deployed.
- Native API tests used a separate local database whose name starts with `hr_recruitment_qa_`; the suite refuses to reset another database.
- Browser fixture: `QA Recruitment 413b8aa` / `QA Candidate 413b8aa`. Retained in the user's local database for inspection, with the candidate restored to In progress at Telephonic. Only synthetic recruitment records were edited.
- Evidence screenshots are under `.gstack/qa-reports/recruitment-20261010/screenshots/`. Private runtime configuration is ignored by Git and is not part of this report.

## Fixed defects

| Issue | Reproduction / correction | Verification |
| --- | --- | --- |
| Filled vacancy stayed active | Selecting the last required candidate now closes the requisition atomically and moves it into existing history filtering. | Real HR/management API journey; dashboard count decreases. |
| Opening closed prematurely | One offer no longer closes a requisition requiring two hires. | Two-vacancy API regression. |
| Concurrent edits lost data | Serialize changes using a requisition row lock and reload the candidate within the transaction. | Simultaneous date and feedback edits retain both values. |
| Concurrent selection overfilled a vacancy | Capacity check and candidate update share one transaction. | Two competing selections: one succeeds, one receives 400; only one selected record persists. |
| Declined offer left vacancy closed | Reopen only requisitions automatically closed by the fill rule; preserve manual closure. | Release → acceptance → decline journey plus manual-close test. |
| Capacity edits broke lifecycle | Increasing capacity reopens automatic closure; shrinking below filled capacity rolls back. | Real API regression. |
| Reschedule venue was discarded | Accept and persist venue; add prefilled reschedule controls without creating another candidate. | HR browser date/venue persistence and API/client regressions. |
| Closed openings remained schedulable | Hide terminal openings from new scheduling and enforce the same check in the API. | Client options test, closed-opening API rejection. |
| Invalid vacancy and round values accepted | Require positive integer capacity, known round enum, and valid datetime strings. | Zero/negative/fractional capacity, invalid round/date rejected without unintended changes. |
| Stale dashboard/candidate caches | Invalidate dashboard, requisitions, candidates and interviews after affected mutations. | Client reschedule regression checks all four query keys. |
| CSV corruption and wrong status | Quote/escape cells, encode full CSV, separate status and feedback, neutralize spreadsheet formula prefixes in both exports. | Commas, quotes, newline, formula prefix and missing-value regressions. |

Candidate update errors now show a useful toast; rejected candidates cannot use Mark Finish. Interview query failures display an error state.

## Coverage

### Browser: HR

Passed requisition creation, candidate scheduling, rescheduling with persisted date and venue, list/calendar views, date selection, rejection to history, and restoration to active interviews. The previous rejection database error did not reproduce in these local checks.

### Browser: management

Passed dashboard link and appointment visibility, scoped interview list, candidate stage tracker, calendar appointment and empty-date state. Confirmed the local MANAGER recruitment configuration is `canView=true`, `canAdd=false`, `canEdit=false`, `canExport=false`; controls correctly restrict mutation and export. Permissions were not expanded.

Responsive inspection used 390px and 1280px viewports. Mobile tables use internal horizontal scrolling; no document-width overflow at 1280px. The narrow layout remains usable but requires scrolling to reach later columns. No captured browser console errors at final inspection.

### Real API / database

Passed HR scheduling; management Telephonic → HR → Technical → Management progression; selection; capacity closure; dashboard update; offer release, salary/date persistence, acceptance and decline; screening rejection/restoration with notes; interview rejection/restoration; venue/date updates; validation; closed-opening restrictions; missing authentication and employee denial; management read-only override; concurrent writes and selections; manual closure preservation.

## Final checks

- Server: `npm test` with the guarded isolated database — **27 passed**, three suites (18 recruitment, six permissions, three travel).
- Client: `npm test` — **5 passed**, two suites.
- Server TypeScript: `node_modules/.bin/tsc --noEmit` — passed.
- Client: `npm run build` — passed; Vite still reports a shared bundle larger than 500 kB. This run did not measure production load performance.
- `git diff --check` — passed.

To replay recruitment tests, create a disposable local PostgreSQL database named `hr_recruitment_qa_*`, apply `server/prisma/schema.prisma` using Prisma db push, set `DATABASE_URL` and a test-only `JWT_SECRET`, then run `npm test` in `server`. The suite resets that guarded database and creates synthetic identities.

## Remaining limits and release follow-up

1. The recruitment UI has no complete offer release/accept/decline or screening-edit forms, despite working API endpoints. Full browser lifecycle coverage ends at interview-stage/status controls.
2. The supplied management account cannot edit recruitment by configuration. If management should make hiring updates, an administrator must approve the appropriate permission configuration; this review did not grant access.
3. Existing incorrectly closed production requisitions were not migrated or reopened. The new reopen rule recognizes its own automatic-closure audit entries; legacy closure needs an explicit data review.
4. Email delivery, external calendar synchronization, production deployment/migrations, load testing and security of the entire portal were outside this scoped run. No email delivery claim is made.
5. The dashboard's existing Open vacancies metric sums configured capacity for nonterminal openings; it does not subtract partial selections until an opening closes. Confirm that business definition before treating it as remaining hire capacity.

The changes are local commits only. Deploy and run a production smoke test before calling the production portal ready.
