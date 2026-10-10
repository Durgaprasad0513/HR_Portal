# Recruitment and interview calendar implementation

Verified locally on 10 October 2026 using the gstack QA workflow and Codex Advisor guidance. Production was not modified.

## Delivered core release

- Openings, Candidates and History navigation; candidate search, stage/outcome filters and pagination; filled and remaining vacancy counts.
- Application creation, screening, candidate decisions, offer release/acceptance/decline and joining outcomes in the candidate detail view.
- Separate appointment records for each real interview. Rescheduling retains the previous appointment; cancellation and no-show require reasons. Completion is separate from candidate selection.
- Agenda, responsive Week and Month views; date navigation, appointment markers, search, opening/round/status/interviewer filters and URL state. Times use Asia/Kolkata.
- Appointment duration, mode and venue; overlap checks serialized for the candidate and interviewer.
- Per-round feedback drafts, submission and reasoned revisions with audit history. Feedback writes are serialized.
- Explicit automatic/manual closure source and reason. Selection reserves capacity; declined offers and non-joining outcomes release it. Manual closure remains intact.
- Dashboard remaining vacancies and upcoming appointments use the actual lifecycle records.
- Existing role permissions retained. Restricted compensation is omitted from unauthorized read and mutation responses; unauthorized compensation writes are denied. Filtered CSV export neutralizes spreadsheet formulas.
- Keyboard interaction improvements for the shared select control.

## Evidence

| Check | Result |
| --- | --- |
| Recruitment API regression suite | 23 passed |
| Client scheduling and export regressions | 5 passed |
| Client production build | Passed; existing bundle size warning remains |
| Server TypeScript check | Passed |
| Migration replay from previous schema | Passed; one known legacy round retained, draft fields readable, manual closure preserved |
| HR browser journey | Application → screening → scheduling → completion → feedback → selection → released/accepted offer → joined |
| Manager browser journey | Existing read-only view verified; editing, scheduling, feedback and compensation controls absent |
| Desktop calendar | Agenda, Week and Month inspected; weekly cards widened for readability |
| Mobile calendar at 390 × 844 | Document width 390; main width/content width both 375; no horizontal overflow |
| Browser console at final check | No captured errors |

All writable tests used a guarded disposable local database. Browser journeys used synthetic candidate data. No recruitment notifications were sent.

Screenshot evidence is saved locally under `.gstack/qa-reports/recruitment-20261010/calendar-desktop.png` and `calendar-mobile.png`.

## Deployment prerequisite

Apply `server/prisma/migrations/20261010140000_add_recruitment_interviews/migration.sql` through the project's normal `prisma migrate deploy` process and generate Prisma Client before deploying this code. The migration backfills only the existing known appointment; it does not invent earlier rounds. The migration has not been applied to production.

## Remaining scope from the broader proposal

This is the core release, not the entire expanded proposal. Multiple interviewers per appointment, configurable evaluation criteria, separate candidate-detail tabs, server-side calendar range pagination, one shared summary endpoint, request idempotency, client version/conflict handling, external calendar sync and notification delivery remain future work. The existing configured manager account is read-only; a manager with explicitly granted write permissions was covered through API tests rather than this browser session. Production smoke testing remains necessary after deployment.
