# HRMS Portal Design System

## Product context

- **Product:** HR Management Portal
- **Audience:** Admin, HR, managers, and employees
- **Product type:** Authenticated business operations workspace
- **Design goal:** Make approvals, records, requests, and next actions easy to scan and safe to complete.

## Aesthetic direction

Use a calm, neutral admin/SaaS interface. The visual language should feel adaptable to business operations rather than narrowly themed around HR. Domain specificity comes from labels, workflow states, and permission-aware actions.

Reference structure:

- [Shadcn Dashboard and Landing](https://21st.dev/@shadcnstore/templates/shadcn-dashboard-landing) for the Vite-compatible shell direction.
- [Next Shadcn Admin Dashboard](https://21st.dev/@arhamkhnz/templates/next-shadcn-admin-dashboard) for selective admin patterns only.

Do not use marketing heroes, shaders, people illustrations, purple gradients, or unrelated component aesthetics inside the authenticated portal.

## Typography

- **Primary:** Plus Jakarta Sans
- **Page title:** 24px mobile, 28-32px desktop, 700 weight
- **Section title:** 18-20px, 650-700 weight
- **Body:** 14-16px, 1.5 line height
- **Metadata:** 12-13px, muted text
- **Metrics:** 28-32px with tabular numbers where possible

## Color

- **Canvas:** cool near-white/slate
- **Surface:** white in light mode, deep slate in dark mode
- **Text:** navy heading, slate body, muted slate metadata
- **Primary action:** orange, used sparingly for the next safe action
- **Success:** green with explicit text
- **Warning:** amber with explicit text
- **Danger:** red with explicit text
- **Info:** blue with explicit text

Color must never be the only status signal.

## Layout and spacing

- Base spacing rhythm: 4px, with 8px as the dominant unit
- Content padding: 16px mobile, 24-32px desktop
- Grid gap: 16-24px
- Surface radius: 8px controls, 12px cards, 16px larger panels
- Dashboard max width: use the available content width without excessive empty margins
- Mobile breakpoint: under 640px
- Tablet breakpoint: 640-1023px
- Desktop breakpoint: 1024px and above

## Component rules

- Every page has a consistent title, description, and primary action area.
- Use one primary action per page header.
- Tables need labels, empty/loading/error states, pagination, and mobile overflow guidance.
- Forms use visible labels, helper text, inline validation, and preserved input after errors.
- Modals are for short focused tasks; long forms remain full-page routes.
- Approval and lifecycle states use badges plus readable text.
- Icon-only controls require accessible names and visible focus.

## UX principles

Every page should answer:

1. What needs my attention?
2. What is the current status?
3. What is the next safe action?

Use role-aware content priorities:

- Admin: organization health, permissions, audit, approvals
- HR: people records, recruitment, performance, training
- Manager: team requests, reviews, attendance, approvals
- Employee: own requests, travel, documents, notifications

## Motion and accessibility

- Motion is functional and brief: 150-250ms for normal transitions.
- Respect `prefers-reduced-motion`.
- Keep keyboard focus visible.
- Support keyboard navigation in drawers, dialogs, tables, and filters.
- Meet WCAG 2.2 AA contrast targets for text and controls.

## Review guardrails

Before adding a new component, confirm it improves task completion or comprehension. Prefer adapting an existing shared primitive over adding a one-off visual pattern. Validate new UI at 375px, 471px, 768px, and 1280px.
