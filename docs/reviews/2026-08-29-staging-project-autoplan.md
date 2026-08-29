<!-- /autoplan restore point: /c/Users/VDurgaprasad/.gstack/projects/techsupportlohitha-hr_management_web_app/staging-autoplan-restore-20260829-141807.md -->
# HR Management Portal - Full Project Review Plan

Status: Review in progress
Branch: `staging`
Requirements baseline: `C:\Users\VDurgaprasad\Downloads\SCOPE (1).pdf`

## Goal

Review the complete HR Management Portal implementation against the supplied 12-page scope and produce an evidence-backed, prioritized plan that makes the system secure, usable, testable, and ready for phased completion.

## Product Objective From Scope

Build a secure, centralized HR portal for Pattabhi Agro Foods Pvt. Ltd. that supports Management Admin, HR Admin, extensible operational roles, and individual employee accounts. Confidential employee information must be protected by both role-level and employee-level authorization.

## Required Product Areas

1. Employee management
2. Travel allowance and settlement
3. Asset management
4. Recruitment tracking
5. Attrition analytics
6. Performance reviews
7. Training management
8. Employee requests and HR helpdesk
9. HR policies and documents
10. Role-specific dashboards, reports, notifications, user management, settings, and audit logs

## Required Security Principle

Employees may access only their own permitted information. HR and Management administrators receive broader access according to explicit permissions. Salary, performance, recruitment, attrition, asset, and internal HR records must never be exposed to unauthorized employees.

## Review Scope

- Product scope, phase boundaries, and completeness against the PDF
- Navigation, screens, responsive behavior, forms, states, and accessibility
- Frontend, backend, API, Prisma schema, PostgreSQL/Docker setup, authentication, authorization, validation, and error handling
- Data privacy, auditability, session control, document access, exports, and operational risks
- Build, type-check, lint, tests, seed data, environment configuration, and developer onboarding
- User-flow and failure-mode test plan for administrators, managers, and employees

## Review Constraints

- Do not modify application code during the review.
- Do not commit, push, deploy, or alter database data as part of the review.
- Preserve all existing uncommitted work.
- Propose fixes as prioritized implementation tasks for approval.

## Confirmed Premises

Confirmed by the user on 2026-08-29.

1. The supplied PDF is the authoritative final product scope.
2. `staging` is an unfinished phased implementation, not a production-ready release.
3. Role-based and employee-level access must be enforced on the server, not only hidden in the interface.
4. The target roles are Super Admin, HR Admin, REMOVED_ROLE, Reporting Manager, and Employee. The two Main Admins are accounts within the administrator role model.
5. Foundation and security must be completed before unfinished modules are treated as ready.
6. PostgreSQL through Docker is the standard local database setup; pgAdmin is optional administration tooling.
7. In-system notifications are required now; email, WhatsApp, and SMS are future work.
8. Attendance, leave, news, and task modules are outside the supplied scope, so their current removal is intentional.
9. `HRMagnet` and `PeopleFlow` are placeholder names. The target is HR Management Portal or Pattabhi Agro Foods branding.
10. Previously approved UI removals remain requirements and will not be reversed by this review.

## Baseline Verification

- Server TypeScript build: passing.
- Prisma schema validation: passing.
- Client TypeScript/Vite build: failing with unused imports and type errors.
- Client and server lint commands: unavailable because ESLint is not installed.
- Automated test files: none found.

## Expected Deliverables

- Requirements-to-implementation coverage matrix
- CEO/product, design, engineering, and developer-experience reviews
- Architecture and data-flow diagram
- Role and permission risk analysis
- Error/rescue and failure-mode registries
- Test strategy and missing-test matrix
- Prioritized P1/P2/P3 implementation backlog
- Explicit deferred scope and final approval gate before fixes
