# HR Portal release QA — 12 October 2026

## Release decision

**In progress; production readiness has not been established.** This report is a live checkpoint, not a deployment approval.

## Test charter

- Source: primary checkout, main at 4eca1a5 plus local repairs.
- Browser target: http://localhost:5175, isolated API at port 5003.
- Data: synthetic records in hr_recruitment_qa_20261012_full; both DATABASE_URL and DIRECT_URL overridden.
- Roles: Admin, HR, Manager, Employee. Test ownership, permissions, valid and invalid transitions, calculations, uploads, forms, navigation, responsive presentation and console errors.
- Modules: dashboard, employees/departments, recruitment/interviews, leave, performance, training, assets, travel, office expenses, documents/policies, helpdesk, notifications, roles, audit and settings.
- External mail and production writes are excluded from the isolated test environment. Deployment checks remain required.

## Verified automated checks

| Check | Result |
| --- | --- |
| Backend regression suite | 72 passed across 6 suites; latest travel reviewer assertions also passed in a targeted run |
| Frontend suite | 16 passed across 7 files |
| Frontend lint and build | Passed; large bundle warning remains |
| Server lint and type check | Passed after latest repairs |
| Empty database migration rehearsal | All 15 migrations applied; 66 tests passed against migrated schema |
| Production dependency audit | No reported vulnerabilities in client or server production dependencies |
| Complete server dependency audit | 20 moderate tooling advisories remain |

## Repairs covered by regression tests

- Travel claims now use employee add permission and retain uploaded receipt URLs.
- Settlement requires approved travel and submitted claims; settled expenses cannot be reopened; monetary totals use Decimal arithmetic.
- Office expenses enforce approval before payment and guard stale transitions.
- Notifications enforce recipient ownership for deletion and allow users to mark their own notifications read.
- Employee performance feedback remains hidden until completion.
- Asset date-only inputs are normalized before Prisma writes.
- Existing authentication tokens use the account's current role; account mutation responses omit password hashes.
- Invalid calendar dates are rejected for leave requests; UTC calendar normalization prevents date-only values shifting to the previous day.
- Identity documents cannot be downloaded through the public upload route, including encoded paths and deleted document metadata.
- Additive migration prerequisites and CI database settings repaired.
- Profile reads no longer create joining notifications; employee profiles reuse the private performance response.
- Shared number inputs preserve fractional values; travel currency inputs accept paise.
- Managers see assigned pending manager reviews and configured final-approval reviews in dashboard attention items.
- Employees can request return of their assigned asset; only staff editors finalize the return.
- Production rejects missing/default signing keys, uses configured CORS origins, disables development maintenance endpoints and no longer runs department cleanup on startup.
- Readiness detects missing workflow columns rather than merely pinging the database.
- Travel approval and settlement retain the responsible reviewer identities.

## Browser checkpoint

Admin sign-in succeeded. Dashboard rendered synthetic metrics without console errors. Mobile navigation opened and navigated to the employee register. Employee search returned exactly one matching fixture; its profile link navigated to the selected record. A position and application were successfully created through browser forms.

All 14 Admin module routes loaded their headings without console warnings/errors. This is a load smoke check, not a complete workflow check.

HR sign-in succeeded. Nine operational screens loaded without console errors. The HR travel journey passed browser creation, approval, receipt upload, claim submission, settlement and details viewing. A second claim confirmed fractional input retention and a persisted total of ₹200.30 (100.10 + 50.20 + 30 + 20). Interview list/week/month switches rendered without errors. Audit records use a responsive narrow-screen presentation.

Evidence: [corrected decimal claim](decimal-claim-after.jpg), [completed HR settlement](hr-travel-settled.jpg).

Manager browser review submission and final approval passed with a weighted final rating of 4/5. Assigned dashboard alerts and configured read-only recruitment controls were checked; temporary test permissions were restored. Employee leave submission exposed a one-day timezone shift, now repaired and rechecked: selecting 16 October stores and displays 16 October. The completed Employee review shows the final score and feedback without manager/HR rating forms. Seven additional Employee module screens loaded without console errors. Remaining forms, exports, accessibility and negative browser paths are incomplete. API role checks do not replace these browser journeys.

Latest targeted backend suite: 25/25 portal regression tests passed. Evidence: [corrected leave dates](leave-date-after.jpg), [completed Manager review](manager-review-completed.jpg).

## Open findings / deployment blockers

| Severity | Finding | Remaining verification or repair |
| --- | --- | --- |
| P1 | Attachment storage durability on Render remains unverified | Authenticated downloads now protect travel/expense receipts and policy files locally; inspect persistent storage and preserve existing files before deployment |
| P1 | Production database compatibility remains unverified | Inspect production schema and legacy data, rehearse its upgrade using a copy and validate backup/recovery |
| P2 | Travel and leave approval writes still require concurrent request testing | Check stale submissions/settlements and atomic balance changes |
| P2 | All-role browser journeys incomplete | Remaining role-specific forms, exports, accessibility and negative paths |
| P2 | Live email delivery unverified | Verify configured production SMTP, delivery and failure handling |
| P2 | Date picker controls have incomplete accessible labels | Labels currently refer to hidden fields; keyboard and assistive-technology checks remain |
| P3 | Production bundle has a 555.65 KB main chunk | Measure real load performance and split if measurements justify it |

## Outstanding release evidence

- Deployment configuration and post-deployment smoke checks.
- Remaining browser forms, exports, responsive checks and accessible interactions across all four roles.
- Production schema compatibility with existing legacy records: migration diff retains legacy enum values, numeric column types and an extra table. No destructive conversion was applied.
- Real mail delivery and concurrent travel approval/settlement behavior. Public attachment access and concurrent leave approval have been repaired and regression tested locally.

## Limits

Passing tests establish the covered behavior only. They do not establish zero defects or production readiness. Changes are committed locally and have not been pushed or deployed in this QA task.

## Local commits and continuation

- `2aedc10`: additive migration prerequisites and CI database setup. Verified by the empty-database migration rehearsal and backend suite against its resulting schema.
- `6fceb3b`: permission, privacy, input, workflow and production-default repairs with permanent regression tests. Automated verification passed. The fractional travel claim was also rechecked in the browser; Employee asset/profile and Manager dashboard browser rechecks remain pending.
- Manager and Employee sign-ins and the workflows described above are complete. No browser health score has been assigned because complete interactive/accessibility coverage has not been performed.

## Further release preparation

Concurrent leave approvals now claim the pending status and deduct the balance in one transaction. A simultaneous HR/Admin approval regression confirms exactly one success and one day deducted from the leave-year balance. Portal regression suite: 26/26 passed; server type check passed. Cross-year leave allocation remains unverified.

Production is hosted on Render from a different repository, per the user. The actual source repository and service identity are requested. No deployment changes have been applied to this repository or production.

## Production repository and attachment repair

Confirmed release target: https://github.com/techsupportlohitha/HR_Portal, main at 1589915. Prepared isolated release checkout C:/Users/VDurgaprasad/HR_Portal_release on codex/render-production-readiness and merged production main without conflicts. Render /api/live and /api/ready both returned 200 on 12 October 2026. This is health evidence only, not all-module readiness. Render dashboard requires user sign-in; requested.

Public upload URLs now serve only referenced profile images; identity documents, receipts and policy attachments require authenticated endpoints. Receipt downloads enforce module view permission and Employee ownership. Client travel, expense and policy attachment controls fetch authenticated blobs without putting tokens in URLs. Uploads are limited to ten files of 10 MiB each. Portal suite 27/27 passed, server type check passed, frontend build, lint and all 16 tests passed. Browser owner receipt download completed without console errors. Evidence: private-attachment-download.jpg. Existing external attachment URLs and orphaned uploads require a compatibility review against production records.

## Render inspection and private R2 preparation

Storage provider adapters were prepared for R2 and Amazon S3, but the user has now
asked to defer external storage. No AWS resources or credentials have been created
and no production HR files have been transferred. Production currently has no
durable upload disk; an attachment migration or service restart remains blocked on
a retention plan. Local storage changes have regression tests, but they are not
deployed.

Authenticated Render logs confirmed PostgreSQL 22P02 because the deployed RequisitionStatus enum lacks CLOSED. An idempotent additive migration is prepared and passed on the isolated local migration database; production schema and migration history still require backup and rehearsal. Readiness now also queries this enum value. Render has free compute, no durable disk, no pre-deploy command or health-check path, auto-deploy off, and no CORS_ORIGIN or mail configuration among its environment keys. Production secrets were not revealed or changed.

User chose external storage with Neon remaining the database. Private Cloudflare R2 support is implemented locally for receipts, policies, identity documents and photos. Stable portal URLs are preserved, download authorization precedes file access, R2 errors never fall back to temporary disk, and provider messages are sanitized. Profile uploads and public profile responses require recognized raster image signatures. SVG/HTML disguised as photos are denied. Missing objects return 404, outages 503, oversized uploads 413. Downloads are bounded to 10 MiB.

Verification: 28 portal regressions plus 7 storage tests passed (35 total); TypeScript and server lint passed; production dependency audit reported zero vulnerabilities. R2 SDK calls were mocked: no real account credential, bucket or network round trip has been tested. Cloudflare account inspection reached the R2 activation screen, showing $0 due now and billable excess usage. Activation requires the account owner to accept subscription terms. No R2 subscription, credential, real HR file transfer, production database mutation, push or deployment was performed. See R2_STORAGE_SETUP.md and RENDER_RELEASE_CHECKLIST.md for remaining release steps.
