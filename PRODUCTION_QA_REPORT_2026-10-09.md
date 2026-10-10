# HR Portal production QA report

**Site:** https://hr.pafpl.in/  
**Date:** 9 October 2026 (Asia/Kolkata)  
**Account tested:** Supplied test account confirmed as `ADMIN` in the portal  
**Method:** Live browser checks at a narrow viewport, plus build and test checks on the local checkout. No deliberate production record, permission, approval, or password changes were submitted. Subsequent code review found that opening an employee profile creates joining notifications; the earlier browsing may therefore have changed notification data automatically.

**Updated readiness review:** See `HR_PORTAL_READINESS_REPORT_2026-10-09.md` for the broader security, business integrity, frontend and deployment review. Its release recommendation is **NO-GO** for the reviewed checkout. This earlier report covers only the initial live browser baseline.

## Result

The Admin account signed in successfully. All 16 checked Admin sections loaded without a visible page error. Employee filtering, employee search and its empty state, global employee search and profile navigation, interview list/calendar switching, and required-field feedback on the login, employee, and leave forms worked in the observed paths. This is a partial functional audit: a single Admin account and read-only production testing cannot establish that every role and state-changing workflow works.

## Findings

### 1. Future rejected interview appears on the dashboard — Medium

**Steps:** On the dashboard, inspect the Interview Calendar card. It showed an interview scheduled for 10 October 2026. Open **Interview Calendar**: the default list said **No interviews scheduled**. Select **Show History**: that same future entry appeared with status **Rejected**.

**Impact:** An administrator sees a rejected candidate as an upcoming interview, but the calendar hides it from the default actionable list. This can mislead scheduling and follow-up.

**Likely cause in local source:** `server/src/modules/dashboard/dashboard.service.ts` queries upcoming candidates using only `interviewDate >= now`. `client/src/pages/recruitment/InterviewCalendarPage.tsx` excludes `SELECTION_REJECTED` from the default list. Align the dashboard status filter with the calendar's actionable-interview rule. Then add a regression test for a future-dated rejected candidate.

### 2. Production Admin test account uses a weak supplied credential — High security risk

The supplied test credentials successfully authenticated to an account with Admin access to employee records, roles, and audit pages. The account used a numeric-only password, and another Admin credential shared in this conversation was also short and predictable. Treat both as exposed: rotate or disable them after testing and use strong, unique credentials for production Admin accounts. The passwords are intentionally omitted from this report.

### 3. Login password visibility button has no accessible name — Low

The eye button changes the password field between masked and visible modes, but the live accessibility tree exposes it only as an unnamed `button`. A screen-reader user cannot tell what it does or whether the password is currently shown. Add an accessible label such as **Show password** / **Hide password**, and expose the current pressed state if appropriate.

### 4. Dashboard interview item is not keyboard-operable — Low

The dashboard's clickable upcoming-interview row is rendered as a `div` with an `onClick` handler in `client/src/pages/dashboard/DashboardPage.tsx`. In the live accessibility tree it appears as text, not a link or button. Render it as a link to the interview calendar so keyboard and assistive-technology users can open it.

## Coverage

| Area | Result |
| --- | --- |
| Login | Successful Admin sign-in; empty submit showed both required-field errors; password visibility control toggled |
| Dashboard | Metrics and cards rendered; interview inconsistency found |
| Attrition, recruitment, performance, training, assets | Pages opened with expected headings and controls |
| Interview calendar | Default list, history, and calendar view checked; rejected-entry mismatch found |
| Employees | Directory loaded; Commercial department filter returned 4 matching records; unmatched search showed a clear empty state; Add Employee form opened and blocked empty submission |
| Global search | Employee-name search returned a result and opened its profile |
| Leave and approvals | Pages opened; empty leave submission was blocked |
| Travel, expenses, documents, helpdesk | Pages opened with expected action controls |
| Roles, audit, settings | Pages opened; user table and permissions matrix rendered; settings showed password form |
| Browser errors | No captured console errors during the checked session |

## Additional checks with the confirmed Admin account

- Signed in successfully; the account menu explicitly showed `ADMIN`.
- Employee directory, Role Management, recruitment, and leave approvals loaded with Admin controls.
- Opened the New Job Requisition form and verified its fields and Cancel control; closed it without saving.
- Leave approval list showed pending requests and Approve / Reject controls. No approval action was submitted.
- Rechecked the dashboard and confirmed the future rejected interview remains visible there.

## Local checkout checks

- Client production build: **passed**. Vite warned that one generated chunk exceeds 500 kB; review loading performance on slower devices.
- Server TypeScript/Prisma build: **passed**.
- Server tests: **6 passed** in one suite (permission matrix).
- Client test command: **no test files found**; exited with code 1. This is a coverage gap, not a demonstrated production failure.
- `npm ci` reported dependency audit advisories: client **17** (including 2 critical), server **23** (including 2 critical). These are findings for the local lockfiles; the deployed package set and exploitability were not verified. Review `npm audit` and update affected dependencies after triage.

## Remaining verification

State-changing workflows were not submitted against live employee data: record creation/editing, leave approvals, candidate scheduling, training, expense/travel requests, uploads, exports, role changes, password changes, and notifications. Employee, Manager, and HR role boundaries were not exercised because only one Admin credential was available. A complete release sign-off needs disposable test records and test accounts for each role, with expected outcomes for each workflow.
