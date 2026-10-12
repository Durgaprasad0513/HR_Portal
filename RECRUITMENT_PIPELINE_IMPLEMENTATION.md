# Recruitment pipeline implementation

Implemented 12 October 2026, following the Odoo comparison recommendation to deliver accurate stages and the pipeline first.

## Delivered

- Recruitment has Openings, Pipeline, Candidates and History views. The pipeline groups candidates into Screening, Telephonic, HR interview, Technical interview, Management interview, Offer and Joined.
- Candidate stage is stored on the server rather than inferred from the presence of an appointment. Pipeline and register filters read that same value.
- Whole candidate cards open the existing detail route. Search/opening filters survive detail navigation, Back and refresh. Mobile tabs wrap into two rows and cards stack without page overflow.
- Cards show opening, tracked stage age, next interview/interviewer and a next-action cue. Counts cover the filtered dataset; each column loads at most 100 cards and explains truncation.
- Stage changes store previous/new stage, actor ID, time and reason, in the same transaction as the update. Details show stage history separately from general activity.
- Stage moves require the stage the user last saw. Concurrent stale moves return HTTP 409. Shortlisting is required beyond screening; advancing from an interview stage requires completed, submitted feedback. Skips/backward moves require reasons. Offer requires selection; joining uses the accepted-offer workflow.
- Scheduling, rescheduling and legacy round updates follow the same guards. Rejected/on-hold/declined/not-joined candidates must have their outcome restored before proceeding. Declined offers must be released again before acceptance.
- Existing selection-based vacancy reservations, closure/reopening, API permissions and compensation restrictions remain enforced. Read-only managers can browse the pipeline without mutation controls.
- The existing all-date interview list remains the interview view. No removed date/view filters have been restored.

## Verification

- Client and server production builds passed.
- Root lint passed for client and server.
- Client: 11 tests passed, including full counts, filtered detail links, read-only controls, next-action accuracy and interview scheduling.
- Server: 45 tests passed on a disposable local PostgreSQL database, including HR/management API journeys, compensation redaction, denied manager stage edits, concurrent transitions, stage history and capacity rules.
- New migration applied successfully over the previous Prisma schema. A transaction replay over 22 populated synthetic records verified preserved candidate values/counts, known legacy round aliases and no invented history; replay rolled back afterwards.
- HR browser checks passed: search, whole-card navigation, preserved Back filters, blocked advancement without feedback, backward move with reason, forward move and recorded history.
- Responsive checks: 1440px desktop and 390px mobile. Mobile document width equals viewport width. Screenshots are local evidence in `.gstack/qa-reports/pipeline-20261012/`.

## Deployment requirement

Apply `server/prisma/migrations/20261012150000_candidate_pipeline_stage/migration.sql` through the project's migration process before starting this server against an existing database. Existing records start their age at the beginning of tracking; no past entry dates or stage events are fabricated.

A fresh full migration replay currently fails in an older migration, `20261007130000_hide_leave_for_manager`, because the baseline lacks `module_permissions.canExport`. This is a pre-existing migration-chain defect. The new stage migration was verified independently; fresh database deployments need the historical chain repaired before `prisma migrate deploy` can complete.

This implementation is available in the isolated local preview at `http://localhost:5174/recruitment?tab=pipeline`, backed by a disposable database on API port 5002. The normal checkout, existing local database and production database have not received this migration. Source has not been pushed or deployed in this task.

## Later roadmap

Persistent activity assignments/due dates, drag-and-drop stage moves, configurable per-job pipelines, applicant website/email intake, candidate self-scheduling, external calendar invitations and electronic signatures remain later phases. This release supplies derived next actions and overdue appointment cues; it does not claim delivery of those integrations or send candidate emails.
